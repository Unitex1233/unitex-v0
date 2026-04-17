import { ref, push, set, get, update, remove, onValue, query, orderByChild, limitToLast, serverTimestamp, DataSnapshot, Unsubscribe } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { 
    detectNicheTags, 
    classifyIntent, 
    calculateQualityScore, 
    generateUsercode, 
    generateSafeHandle,
    calculateVpAward,
    calculateRoutingTargets 
} from '@/lib/intelligence';

// ─── UNIQUE IDENTITY ENGINE ──────────────────────────────────────────────────

export async function generateUniqueUsername(baseName: string): Promise<string> {
    const username = generateSafeHandle(baseName, 0);
    
    // Check for collision in the dedicated /usernames node (O(1) lookup)
    const usernameRef = ref(rtdb, `usernames/${username}`);
    const snapshot = await get(usernameRef);
    
    if (snapshot.exists()) {
        return generateSafeHandle(baseName, Math.floor(Math.random() * 9999));
    }
    
    return username;
}

// ─── POSTS ────────────────────────────────────────────────────────────────────

export async function createRealtimePost(data: {
    uid: string;
    displayName: string;
    photoURL: string;
    role: string;
    content: string;
    mediaURL?: string;
}) {
    const postsRef = ref(rtdb, 'posts');
    const newPostRef = push(postsRef);
    
    // Fetch user's unique identity & VP from RTDB
    const userRef = ref(rtdb, `users/${data.uid}`);
    const userSnap = await get(userRef);
    const userData = userSnap.exists() ? userSnap.val() : null;
    const authorUsername = userData?.username || '';
    const authorUsercode = userData?.usercode || '';
    const authorVp = userData?.vp || 0;

    // AI Engine Processing
    const qualityAnalysis = calculateQualityScore(data.content, authorVp);
    const tags = detectNicheTags(data.content);
    const intentAnalysis = classifyIntent(data.content);
    
    // VP Engine execution
    const vpAward = calculateVpAward(
        { type: 'post_created', qualityScore: qualityAnalysis.qScore }, 
        authorVp
    );
    if (vpAward !== 0) {
        await awardVPPoints(data.uid, vpAward);
    }
    
    // If Anti-Spam flags it, log but do not broadly distribute
    if (qualityAnalysis.isSpam) {
        console.warn(`Post marked as low-quality. Score: ${qualityAnalysis.qScore}`);
    }

    await set(newPostRef, {
        id: newPostRef.key,
        uid: data.uid,
        author: {
            id: data.uid,
            name: data.displayName,
            username: authorUsername,
            usercode: authorUsercode,
            avatar: data.photoURL,
            role: data.role,
        },
        content: data.content,
        label: intentAnalysis.intent,
        level: intentAnalysis.level,
        media: data.mediaURL ? { type: 'image', url: data.mediaURL } : null,
        stats: { likes: 0, support: 0, comments: 0 },
        ai: {
            qualityScore: qualityAnalysis.qScore,
            isSpam: qualityAnalysis.isSpam,
            tags,
        },
        timestamp: serverTimestamp(),
        createdAtMillis: Date.now() // For easier sorting
    });
    
    // In a real Backend Env, here we would trigger `calculateRoutingTargets()` and 
    // fan out the post to the recommended user's individual feed arrays.
    
    return newPostRef.key;
}

export function subscribeToRealtimePosts(callback: (posts: any[]) => void): Unsubscribe {
    const postsRef = query(ref(rtdb, 'posts'), orderByChild('createdAtMillis'), limitToLast(50));
    
    const listener = onValue(postsRef, (snapshot) => {
        const posts: any[] = [];
        snapshot.forEach((childSnapshot) => {
            posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        // Reverse to show newest first
        callback(posts.reverse());
    });
    
    return () => listener(); // Return unsubscribe function
}

export function subscribeToTrendingPosts(callback: (posts: any[]) => void): Unsubscribe {
    const postsRef = query(ref(rtdb, 'posts'), orderByChild('ai/qualityScore'), limitToLast(5));
    
    const listener = onValue(postsRef, (snapshot) => {
        const posts: any[] = [];
        snapshot.forEach((childSnapshot) => {
            posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        // Reverse to show highest score first
        callback(posts.reverse());
    });
    
    return () => listener(); 
}

export async function likeRealtimePost(postId: string, currentLikes: number) {
    const postRef = ref(rtdb, `posts/${postId}/stats`);
    await update(postRef, { likes: currentLikes + 1 });
}

// ─── USERS & VP (Value Points) ───────────────────────────────────────────────

export async function awardVPPoints(uid: string, points: number) {
    const userRef = ref(rtdb, `users/${uid}/vp`);
    const snapshot = await get(userRef);
    const currentVP = snapshot.exists() ? snapshot.val() : 0;
    await set(userRef, currentVP + points);
}

export async function syncUserToRTDB(user: any, profileData?: any) {
    const userRef = ref(rtdb, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    const baseName = profileData?.displayName || user.displayName || (user.isAnonymous ? 'Guest' : 'UniteX User');
    const username = profileData?.username || (snapshot.exists() ? snapshot.val().username : await generateUniqueUsername(baseName));
    const usercode = profileData?.userId || profileData?.usercode || (snapshot.exists() ? snapshot.val().usercode : generateUsercode());

    const updateData: any = {
        uid: user.uid,
        displayName: baseName,
        username: username.replace(/^@/, ''),
        usercode: usercode,
        email: user.email || (snapshot.exists() ? snapshot.val().email : null),
        photoURL: profileData?.photoURL || user.photoURL || (snapshot.exists() ? snapshot.val().photoURL : ''),
        role: profileData?.role || (snapshot.exists() ? snapshot.val().role : 'Member'),
        updatedAt: serverTimestamp()
    };

    if (!snapshot.exists()) {
        updateData.vp = 0;
        updateData.createdAt = serverTimestamp();
        await set(userRef, updateData);
        // Claim the username in the global index
        await set(ref(rtdb, `usernames/${username.replace(/^@/, '')}`), user.uid);
    } else {
        await update(userRef, updateData);
    }
}
