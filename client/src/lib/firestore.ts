import {
    collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
    query, orderBy, limit, where, serverTimestamp, onSnapshot,
    Unsubscribe, DocumentData, setDoc, increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

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
        const storageRef = ref(storage, `posts/${data.uid}/${Date.now()}_${data.mediaFile.name}`);
        const snap = await uploadBytes(storageRef, data.mediaFile);
        mediaURL = await getDownloadURL(snap.ref);
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
    await updateDoc(doc(db, 'users', uid), data);
}

export async function uploadAvatar(uid: string, file: File): Promise<string> {
    const storageRef = ref(storage, `avatars/${uid}/avatar`);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    await updateDoc(doc(db, 'users', uid), { photoURL: url });
    return url;
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
