import {
    collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
    query, orderBy, limit, where, serverTimestamp, onSnapshot,
    Unsubscribe, DocumentData, setDoc, increment, writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ─── UTILITIES ────────────────────────────────────────────────────────────────

async function compressImageToBase64(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

// ─── POSTS ────────────────────────────────────────────────────────────────────

export async function createPost(data: {
    uid: string;
    displayName: string;
    photoURL: string;
    role: string;
    content: string;
    label?: string;
    mediaFile?: File;
}) {
    let mediaURL = '';
    if (data.mediaFile) {
        mediaURL = await compressImageToBase64(data.mediaFile, 1200, 1200, 0.6);
    }

    return addDoc(collection(db, 'posts'), {
        uid: data.uid,
        author: {
            id: data.uid,
            name: data.displayName,
            avatar: data.photoURL,
            role: data.role,
        },
        content: data.content,
        label: data.label || null,
        media: mediaURL ? { type: 'image', url: mediaURL } : null,
        stats: { likes: 0, support: 0, comments: 0 },
        createdAt: serverTimestamp(),
    });
}

export function subscribeToPosts(callback: (posts: DocumentData[]) => void): Unsubscribe {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(30));
    return onSnapshot(q, (snap) => {
        const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(posts);
    });
}

export async function likePost(postId: string) {
    await updateDoc(doc(db, 'posts', postId), { 'stats.likes': increment(1) });
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUser(uid: string, data: Partial<DocumentData>) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
    const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
    const snap = await getDocs(q);
    return snap.empty;
}


export async function uploadAvatar(uid: string, file: File): Promise<string> {
    const url = await compressImageToBase64(file, 400, 400, 0.7);
    await updateDoc(doc(db, 'users', uid), { photoURL: url });
    return url;
}

export async function searchUsers(searchTerm: string) {
    if (!searchTerm || searchTerm.length < 1) return [];

    const lowerTerm = searchTerm.toLowerCase();
    const upperTerm = searchTerm.toUpperCase();
    const cleanUsername = searchTerm.startsWith('@') ? lowerTerm : `@${lowerTerm}`;

    // 1. Exact Match on userId (the new 6-char ID)
    const qUserId = query(collection(db, 'users'), where('userId', '==', upperTerm), limit(5));
    
    // 2. Exact Match on older usercode
    const qCode = query(collection(db, 'users'), where('usercode', '==', upperTerm), limit(5));
    
    // 3. Prefix Match on @username
    const qUsername = query(
        collection(db, 'users'), 
        where('username', '>=', cleanUsername), 
        where('username', '<=', cleanUsername + '\uf8ff'),
        limit(10)
    );

    // 4. Exact Match on UID
    const qUid = query(collection(db, 'users'), where('uid', '==', searchTerm), limit(5));

    // 5. Prefix Match on Display Name
    const qName = query(
        collection(db, 'users'), 
        where('displayName', '>=', searchTerm), 
        where('displayName', '<=', searchTerm + '\uf8ff'),
        limit(10)
    );

    // 6. Case-Insensitive Prefix Match for Name (Common for user searches)
    const capitalizedTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase();
    const qNameCap = query(
        collection(db, 'users'), 
        where('displayName', '>=', capitalizedTerm), 
        where('displayName', '<=', capitalizedTerm + '\uf8ff'),
        limit(10)
    );

    const [snapUserId, snapCode, snapUsername, snapUid, snapName, snapNameCap] = await Promise.all([
        getDocs(qUserId),
        getDocs(qCode),
        getDocs(qUsername),
        getDocs(qUid),
        getDocs(qName),
        getDocs(qNameCap)
    ]);

    const resultsMap = new Map<string, any>();

    // Prioritize results: userId > usercode > username > uid > displayName
    const allSnaps = [
        { docs: snapUserId.docs, score: 1.0 },
        { docs: snapCode.docs, score: 0.95 },
        { docs: snapUsername.docs, score: 0.9 },
        { docs: snapUid.docs, score: 0.85 },
        { docs: snapName.docs, score: 0.8 },
        { docs: snapNameCap.docs, score: 0.75 }
    ];

    allSnaps.forEach(({ docs, score }) => {
        docs.forEach(d => {
            if (!resultsMap.has(d.id)) {
                resultsMap.set(d.id, { id: d.id, ...d.data(), score });
            }
        });
    });

    return Array.from(resultsMap.values()).sort((a, b) => b.score - a.score);
}

// ─── REFERRAL SYSTEM ──────────────────────────────────────────────────────────

export function generateReferralCode(uid: string): string {
    // Generates a deterministic but unique referral code from the user's UID
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'UX-';
    // Use uid chars as a seed
    for (let i = 0; i < 6; i++) {
        const charCode = uid.charCodeAt(i % uid.length) + i * 7;
        code += chars[charCode % chars.length];
    }
    return code;
}

export async function saveReferralCode(uid: string): Promise<string> {
    const code = generateReferralCode(uid);
    await setDoc(doc(db, 'users', uid), { referralCode: code }, { merge: true });
    return code;
}

export async function getReferralStats(uid: string): Promise<{ code: string; referrals: any[] }> {
    const userSnap = await getDoc(doc(db, 'users', uid));
    const code = userSnap.exists() ? userSnap.data().referralCode || generateReferralCode(uid) : generateReferralCode(uid);
    
    const q = query(collection(db, 'referrals'), where('referrerUid', '==', uid), orderBy('createdAt', 'desc'), limit(20));
    const snap = await getDocs(q);
    const referrals = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    return { code, referrals };
}

export async function applyReferralCode(newUid: string, code: string): Promise<boolean> {
    try {
        const q = query(collection(db, 'users'), where('referralCode', '==', code.toUpperCase()), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return false;
        
        const referrerDoc = snap.docs[0];
        const referrerUid = referrerDoc.id;
        if (referrerUid === newUid) return false; // Can't refer yourself
        
        // Record the referral
        await addDoc(collection(db, 'referrals'), {
            referrerUid,
            referredUid: newUid,
            code,
            createdAt: serverTimestamp()
        });
        
        // Award VP to referrer
        await updateDoc(doc(db, 'users', referrerUid), { vp: increment(100), exp: increment(500) });
        return true;
    } catch {
        return false;
    }
}

// ─── VP / EXP ─────────────────────────────────────────────────────────────────

export async function getUserRewards(uid: string): Promise<{ exp: number; vp: number; level: number; title: string }> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return { exp: 0, vp: 0, level: 1, title: 'Newcomer' };
    const data = snap.data();
    const exp = data.exp || 0;
    const vp = data.vp || 0;
    
    // Level ladder
    const levels = [
        { threshold: 0, title: 'Newcomer' },
        { threshold: 500, title: 'Contributor' },
        { threshold: 2000, title: 'Builder' },
        { threshold: 5000, title: 'Catalyst' },
        { threshold: 10000, title: 'Architect' },
        { threshold: 25000, title: 'Guardian' },
        { threshold: 50000, title: 'Legend' },
    ];
    
    let level = 1;
    let title = 'Newcomer';
    for (const l of levels) {
        if (exp >= l.threshold) { level = levels.indexOf(l) + 1; title = l.title; }
    }
    
    return { exp, vp, level, title };
}

export async function awardExp(uid: string, amount: number, reason: string = '') {
    await updateDoc(doc(db, 'users', uid), { exp: increment(amount) });
    await addDoc(collection(db, 'activity_log'), {
        uid, action: reason, exp: amount, createdAt: serverTimestamp()
    });
}

// ─── COMMUNITIES ──────────────────────────────────────────────────────────────

export async function getCommunities() {
    const snap = await getDocs(query(collection(db, 'communities'), orderBy('members', 'desc'), limit(20)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function joinCommunity(communityId: string, uid: string) {
    await setDoc(doc(db, 'communities', communityId, 'members', uid), { joinedAt: serverTimestamp() });
    await updateDoc(doc(db, 'communities', communityId), { members: increment(1) });
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

export function subscribeToConversations(uid: string, callback: (convs: DocumentData[]) => void): Unsubscribe {
    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', uid),
        orderBy('lastMessageAt', 'desc')
    );
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function createConversation(participants: string[], participantDetails: any) {
    return addDoc(collection(db, 'conversations'), {
        participants,
        details: participantDetails,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp()
    });
}

export function subscribeToMessages(
    conversationId: string,
    callback: (msgs: DocumentData[]) => void
): Unsubscribe {
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
}

export async function sendMessage(conversationId: string, uid: string, displayName: string, text: string) {
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        uid,
        senderName: displayName,
        text,
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
    });
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export function subscribeToNotifications(uid: string, callback: (notifs: DocumentData[]) => void): Unsubscribe {
    const q = query(
        collection(db, 'notifications'),
        where('recipientUid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(20)
    );
    return onSnapshot(q, snap => {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
}

export async function markNotificationAsRead(notifId: string) {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
}

export async function markAllNotificationsAsRead(uid: string) {
    const q = query(collection(db, 'notifications'), where('recipientUid', '==', uid), where('read', '==', false));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.update(d.ref, { read: true }));
    await batch.commit();
}

export async function createNotification(data: {
    recipientUid: string;
    senderUid: string;
    senderName: string;
    type: 'like' | 'follow' | 'comment' | 'support' | 'system' | 'connection_accepted';
    content: string;
    actionUrl?: string;
}) {
    await addDoc(collection(db, 'notifications'), {
        ...data,
        read: false,
        createdAt: serverTimestamp()
    });
}

// ─── VAULT ────────────────────────────────────────────────────────────────────

export async function getVaultItems(uid: string) {
    const snap = await getDocs(
        query(collection(db, 'vault'), where('uid', '==', uid), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addVaultItem(uid: string, data: DocumentData) {
    return addDoc(collection(db, 'vault'), { uid, ...data, createdAt: serverTimestamp() });
}

export async function deleteVaultItem(itemId: string) {
    await deleteDoc(doc(db, 'vault', itemId));
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export async function getEvents() {
    const snap = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc'), limit(20)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function rsvpEvent(eventId: string, uid: string) {
    await setDoc(doc(db, 'events', eventId, 'rsvps', uid), { rsvpAt: serverTimestamp() });
    await updateDoc(doc(db, 'events', eventId), { attendees: increment(1) });
}

export async function createEvent(data: any) {
    return addDoc(collection(db, 'events'), { ...data, createdAt: serverTimestamp(), attendees: 0 });
}

export function subscribeToEvents(callback: (events: DocumentData[]) => void): Unsubscribe {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ─── RESOURCES & COURSES ──────────────────────────────────────────────────────

export function subscribeToCourses(callback: (courses: DocumentData[]) => void): Unsubscribe {
    const q = query(collection(db, 'courses'), orderBy('title', 'asc'));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeToResources(callback: (resources: DocumentData[]) => void): Unsubscribe {
    const q = query(collection(db, 'resources'), orderBy('title', 'asc'));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function enrollCourse(courseId: string, uid: string) {
    await setDoc(doc(db, 'users', uid, 'enrolled_courses', courseId), { enrolledAt: serverTimestamp(), progress: 0 });
    await updateDoc(doc(db, 'courses', courseId), { students: increment(1) });
}

export function subscribeToEnrolledCourses(uid: string, callback: (courses: DocumentData[]) => void): Unsubscribe {
    const q = query(collection(db, 'users', uid, 'enrolled_courses'), orderBy('enrolledAt', 'desc'));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function toggleResourceSave(resourceId: string, uid: string, isSaved: boolean) {
    const ref = doc(db, 'users', uid, 'saved_resources', resourceId);
    if (isSaved) {
        await deleteDoc(ref);
    } else {
        await setDoc(ref, { savedAt: serverTimestamp() });
    }
}

export function subscribeToSavedResources(uid: string, callback: (savedIds: Set<string>) => void): Unsubscribe {
    const q = query(collection(db, 'users', uid, 'saved_resources'));
    return onSnapshot(q, snap => {
        const savedIds = new Set(snap.docs.map(d => d.id));
        callback(savedIds);
    });
}

// ─── NETWORK & CONNECTIONS ────────────────────────────────────────────────────

export async function getTrendingUsers(limitCount: number = 20) {
    const snap = await getDocs(query(collection(db, 'users'), orderBy('connectionsCount', 'desc'), limit(limitCount)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getUsers(uids: string[]) {
    if (!uids || uids.length === 0) return [];
    // Firestore 'in' query supports up to 10 at a time, but for simplicity we can Promise.all
    const promises = uids.map(uid => getDoc(doc(db, 'users', uid)));
    const snaps = await Promise.all(promises);
    return snaps.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() }));
}

export async function sendConnectionRequest(fromUid: string, fromName: string, toUid: string) {
    const reqRef = await addDoc(collection(db, 'network_requests'), {
        fromUid,
        fromName,
        toUid,
        status: 'pending',
        createdAt: serverTimestamp()
    });

    await addDoc(collection(db, 'notifications'), {
        recipientUid: toUid,
        senderUid: fromUid,
        type: 'connection_request',
        content: `${fromName} wants to connect with you.`,
        actionUrl: '/networking',
        requestId: reqRef.id,
        read: false,
        createdAt: serverTimestamp()
    });
}

export async function acceptConnectionRequest(requestId: string, fromUid: string, toUid: string, toName: string) {
    await updateDoc(doc(db, 'network_requests', requestId), { status: 'accepted', updatedAt: serverTimestamp() });
    
    await setDoc(doc(db, 'users', fromUid, 'connections', toUid), { connectedAt: serverTimestamp() });
    await setDoc(doc(db, 'users', toUid, 'connections', fromUid), { connectedAt: serverTimestamp() });
    
    await updateDoc(doc(db, 'users', fromUid), { connectionsCount: increment(1) });
    await updateDoc(doc(db, 'users', toUid), { connectionsCount: increment(1) });

    // Try creating a direct message thread for the two users
    try {
        const fromUser = await getDoc(doc(db, 'users', fromUid));
        const toUser = await getDoc(doc(db, 'users', toUid));
        if (fromUser.exists() && toUser.exists()) {
            await createConversation([fromUid, toUid], {
                [fromUid]: { name: fromUser.data().displayName || 'User', initials: (fromUser.data().displayName || 'U').substring(0, 2).toUpperCase() },
                [toUid]: { name: toUser.data().displayName || toName || 'User', initials: (toUser.data().displayName || toName || 'U').substring(0, 2).toUpperCase() }
            });
        }
    } catch(err) { console.error('Failed creating chat automatically', err); }

    await addDoc(collection(db, 'notifications'), {
        recipientUid: fromUid,
        senderUid: toUid,
        type: 'connection_accepted',
        content: `${toName} accepted your connection request.`,
        actionUrl: `/profile/${toUid}`,
        read: false,
        createdAt: serverTimestamp()
    });
}

export async function rejectConnectionRequest(requestId: string) {
    await updateDoc(doc(db, 'network_requests', requestId), { status: 'rejected', updatedAt: serverTimestamp() });
}

export function subscribeToPendingRequests(uid: string, callback: (reqs: any[]) => void): Unsubscribe {
    const q = query(
        collection(db, 'network_requests'),
        where('toUid', '==', uid),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeToConnections(uid: string, callback: (connections: any[]) => void): Unsubscribe {
    const q = query(collection(db, 'users', uid, 'connections'), orderBy('connectedAt', 'desc'));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeToDiscoverFeed(callback: (feed: any[]) => void): Unsubscribe {
    const q = query(collection(db, 'discover_feed'), orderBy('createdAt', 'desc'), limit(20));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeToTrendingTopics(callback: (topics: any[]) => void): Unsubscribe {
    const q = query(collection(db, 'trending_topics'), orderBy('score', 'desc'), limit(15));
    return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
