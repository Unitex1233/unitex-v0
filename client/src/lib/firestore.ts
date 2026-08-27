// LocalStorage / server-based minimal replacements for Firestore functions (MVP)
// Expose the same function names but backed by localStorage or server endpoints.

export type Unsubscribe = () => void;
export type DocumentData = any;

function getLocal(key: string) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
}
function setLocal(key: string, value: any) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

function nowISO() { return new Date().toISOString(); }

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
    const posts = getLocal('unitex_posts') || [];
    const post = {
        id: 'post-' + Date.now(),
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
        createdAt: nowISO(),
    };
    posts.unshift(post);
    setLocal('unitex_posts', posts.slice(0, 500));
    return post;
}

export function subscribeToPosts(callback: (posts: DocumentData[]) => void): Unsubscribe {
    const tick = () => {
        const posts = getLocal('unitex_posts') || [];
        callback(posts.slice(0, 50));
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export async function likePost(postId: string) {
    const posts = getLocal('unitex_posts') || [];
    const idx = posts.findIndex((p:any) => p.id === postId);
    if (idx !== -1) {
        posts[idx].stats = posts[idx].stats || { likes: 0, support: 0, comments: 0 };
        posts[idx].stats.likes = (posts[idx].stats.likes || 0) + 1;
        setLocal('unitex_posts', posts);
    }
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function getUser(uid: string) {
    try {
        const res = await fetch(`/api/users/${uid}`);
        if (res.ok) return res.json();
    } catch(e) {}
    const users = getLocal('unitex_users') || {};
    return users[uid] || null;
}

export async function updateUser(uid: string, data: Partial<DocumentData>) {
    try {
        await fetch(`/api/users/${uid}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
    } catch(e) {}
    const users = getLocal('unitex_users') || {};
    users[uid] = { ...(users[uid] || {}), ...data };
    setLocal('unitex_users', users);
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
    // Check local users for now
    const users = getLocal('unitex_users') || {};
    for (const k of Object.keys(users)) {
        if (users[k]?.username === username) return false;
    }
    return true;
}


export async function uploadAvatar(uid: string, file: File): Promise<string> {
    const url = await compressImageToBase64(file, 400, 400, 0.7);
    await updateUser(uid, { photoURL: url });
    return url;
}

export async function searchUsers(searchTerm: string) {
    if (!searchTerm || searchTerm.length < 1) return [];
    const users = getLocal('unitex_users') || {};
    const results: any[] = [];
    const lower = searchTerm.toLowerCase();
    for (const uid of Object.keys(users)) {
        const u = users[uid];
        if (!u) continue;
        const name = (u.displayName || '').toLowerCase();
        const username = (u.username || '').toLowerCase();
        const userId = (u.userId || '').toLowerCase();
        if (name.includes(lower) || username.includes(lower) || userId.includes(lower) || uid === searchTerm) {
            results.push({ id: uid, ...u });
        }
    }
    return results.slice(0, 50);
}

// ─── REFERRAL SYSTEM ──────────────────────────────────────────────────────────

export function generateReferralCode(uid: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'UX-';
    for (let i = 0; i < 6; i++) {
        const charCode = uid.charCodeAt(i % uid.length) + i * 7;
        code += chars[charCode % chars.length];
    }
    return code;
}

export async function saveReferralCode(uid: string): Promise<string> {
    const code = generateReferralCode(uid);
    await updateUser(uid, { referralCode: code });
    return code;
}

export async function getReferralStats(uid: string): Promise<{ code: string; referrals: any[] }> {
    const user = await getUser(uid);
    const code = (user && (user.referralCode || generateReferralCode(uid))) || generateReferralCode(uid);
    const referrals = [];
    return { code, referrals };
}

export async function applyReferralCode(newUid: string, code: string): Promise<boolean> {
    // Simple local implementation: find user with code and award them
    const users = getLocal('unitex_users') || {};
    const referrerUid = Object.keys(users).find(k => users[k]?.referralCode === code.toUpperCase());
    if (!referrerUid || referrerUid === newUid) return false;
    const referrer = users[referrerUid];
    referrer.vp = (referrer.vp || 0) + 100;
    referrer.exp = (referrer.exp || 0) + 500;
    setLocal('unitex_users', users);
    return true;
}

// ─── VP / EXP ─────────────────────────────────────────────────────────────────

export async function getUserRewards(uid: string): Promise<{ exp: number; vp: number; level: number; title: string }> {
    const user = await getUser(uid);
    const exp = (user && user.exp) || 0;
    const vp = (user && user.vp) || 0;
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
    const users = getLocal('unitex_users') || {};
    users[uid] = users[uid] || {};
    users[uid].exp = (users[uid].exp || 0) + amount;
    setLocal('unitex_users', users);
}

// ─── COMMUNITIES ──────────────────────────────────────────────────────────────

export async function getCommunities() {
    return getLocal('unitex_communities') || [];
}

export async function joinCommunity(communityId: string, uid: string) {
    const communities = getLocal('unitex_communities') || {};
    communities[communityId] = communities[communityId] || { members: 0, membersList: {} };
    communities[communityId].members += 1;
    communities[communityId].membersList[uid] = { joinedAt: nowISO() };
    setLocal('unitex_communities', communities);
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

export function subscribeToConversations(uid: string, callback: (convs: DocumentData[]) => void): Unsubscribe {
    const tick = () => {
        const convs = getLocal('unitex_conversations') || [];
        const filtered = convs.filter((c:any) => c.participants && c.participants.includes(uid));
        callback(filtered);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export async function createConversation(participants: string[], participantDetails: any) {
    const convs = getLocal('unitex_conversations') || [];
    const conv = { id: 'conv-' + Date.now(), participants, details: participantDetails, createdAt: nowISO(), lastMessageAt: nowISO() };
    convs.unshift(conv);
    setLocal('unitex_conversations', convs);
    return conv;
}

export function subscribeToMessages(
    conversationId: string,
    callback: (msgs: DocumentData[]) => void
): Unsubscribe {
    const tick = () => {
        const msgs = getLocal(`unitex_conv_${conversationId}_msgs`) || [];
        callback(msgs);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export async function sendMessage(conversationId: string, uid: string, displayName: string, text: string) {
    const msgs = getLocal(`unitex_conv_${conversationId}_msgs`) || [];
    const m = { id: 'm-' + Date.now(), uid, senderName: displayName, text, createdAt: nowISO() };
    msgs.push(m);
    setLocal(`unitex_conv_${conversationId}_msgs`, msgs);
    const convs = getLocal('unitex_conversations') || [];
    const conv = convs.find((c:any) => c.id === conversationId);
    if (conv) { conv.lastMessage = text; conv.lastMessageAt = nowISO(); setLocal('unitex_conversations', convs); }
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export function subscribeToNotifications(uid: string, callback: (notifs: DocumentData[]) => void): Unsubscribe {
    const tick = () => {
        const notifs = (getLocal('unitex_notifications') || []).filter((n:any) => n.recipientUid === uid);
        callback(notifs);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export async function markNotificationAsRead(notifId: string) {
    const notifs = getLocal('unitex_notifications') || [];
    const n = notifs.find((x:any) => x.id === notifId);
    if (n) n.read = true;
    setLocal('unitex_notifications', notifs);
}

export async function markAllNotificationsAsRead(uid: string) {
    const notifs = getLocal('unitex_notifications') || [];
    notifs.forEach((n:any) => { if (n.recipientUid === uid) n.read = true; });
    setLocal('unitex_notifications', notifs);
}

export async function createNotification(data: {
    recipientUid: string;
    senderUid: string;
    senderName: string;
    type: 'like' | 'follow' | 'comment' | 'support' | 'system' | 'connection_accepted';
    content: string;
    actionUrl?: string;
}) {
    const notifs = getLocal('unitex_notifications') || [];
    notifs.unshift({ id: 'n-' + Date.now(), ...data, read: false, createdAt: nowISO() });
    setLocal('unitex_notifications', notifs);
}

// ─── VAULT ────────────────────────────────────────────────────────────────────

export async function getVaultItems(uid: string) {
    const items = getLocal('unitex_vault') || [];
    return items.filter((i:any) => i.uid === uid);
}

export async function addVaultItem(uid: string, data: DocumentData) {
    const items = getLocal('unitex_vault') || [];
    const it = { id: 'v-' + Date.now(), uid, ...data, createdAt: nowISO() };
    items.unshift(it);
    setLocal('unitex_vault', items);
    return it;
}

export async function deleteVaultItem(itemId: string) {
    let items = getLocal('unitex_vault') || [];
    items = items.filter((i:any) => i.id !== itemId);
    setLocal('unitex_vault', items);
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export async function getEvents() {
    return getLocal('unitex_events') || [];
}

export async function rsvpEvent(eventId: string, uid: string) {
    const events = getLocal('unitex_events') || [];
    const ev = events.find((e:any) => e.id === eventId);
    if (!ev) return;
    ev.attendees = (ev.attendees || 0) + 1;
    setLocal('unitex_events', events);
}

export async function createEvent(data: any) {
    const events = getLocal('unitex_events') || [];
    const ev = { id: 'evt-' + Date.now(), ...data, createdAt: nowISO(), attendees: 0 };
    events.push(ev);
    setLocal('unitex_events', events);
    return ev;
}

export function subscribeToEvents(callback: (events: DocumentData[]) => void): Unsubscribe {
    const tick = async () => {
        try {
            const res = await fetch('/api/events');
            if (res.ok) { const data = await res.json(); callback(data); return; }
        } catch(e) {}
        const events = (getLocal('unitex_events') || []).sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        callback(events);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
}

// ─── RESOURCES & COURSES ──────────────────────────────────────────────────────

export function subscribeToCourses(callback: (courses: DocumentData[]) => void): Unsubscribe {
    const tick = () => {
        const courses = getLocal('unitex_courses') || [];
        callback(courses);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export function subscribeToResources(callback: (resources: DocumentData[]) => void): Unsubscribe {
    const tick = () => {
        const resources = getLocal('unitex_resources') || [];
        callback(resources);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export async function enrollCourse(courseId: string, uid: string) {
    const users = getLocal('unitex_users') || {};
    users[uid] = users[uid] || {};
    users[uid].enrolled_courses = users[uid].enrolled_courses || {};
    users[uid].enrolled_courses[courseId] = { enrolledAt: nowISO(), progress: 0 };
    setLocal('unitex_users', users);
}

export function subscribeToEnrolledCourses(uid: string, callback: (courses: DocumentData[]) => void): Unsubscribe {
    const tick = () => {
        const users = getLocal('unitex_users') || {};
        const enrolled = users[uid]?.enrolled_courses ? Object.keys(users[uid].enrolled_courses).map(id => ({ id, ...users[uid].enrolled_courses[id] })) : [];
        callback(enrolled);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export async function toggleResourceSave(resourceId: string, uid: string, isSaved: boolean) {
    const users = getLocal('unitex_users') || {};
    users[uid] = users[uid] || {};
    users[uid].saved_resources = users[uid].saved_resources || {};
    if (isSaved) delete users[uid].saved_resources[resourceId]; else users[uid].saved_resources[resourceId] = { savedAt: nowISO() };
    setLocal('unitex_users', users);
}

export function subscribeToSavedResources(uid: string, callback: (savedIds: Set<string>) => void): Unsubscribe {
    const tick = () => {
        const users = getLocal('unitex_users') || {};
        const saved = new Set(Object.keys(users[uid]?.saved_resources || {}));
        callback(saved);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

// ─── NETWORK & CONNECTIONS ────────────────────────────────────────────────────

export async function getTrendingUsers(limitCount: number = 20) {
    const users = getLocal('unitex_users') || {};
    const arr = Object.keys(users).map(k => ({ id: k, ...users[k] }));
    arr.sort((a:any,b:any) => (b.connectionsCount || 0) - (a.connectionsCount || 0));
    return arr.slice(0, limitCount);
}

export async function getUsers(uids: string[]) {
    if (!uids || uids.length === 0) return [];
    const users = getLocal('unitex_users') || {};
    return uids.map(uid => users[uid]).filter(Boolean);
}

export async function sendConnectionRequest(fromUid: string, fromName: string, toUid: string) {
    const reqs = getLocal('unitex_network_requests') || [];
    const id = 'nr-' + Date.now();
    const req = { id, fromUid, fromName, toUid, status: 'pending', createdAt: nowISO() };
    reqs.unshift(req);
    setLocal('unitex_network_requests', reqs);
    // create notification
    const notifs = getLocal('unitex_notifications') || [];
    notifs.unshift({ id: 'n-' + Date.now(), recipientUid: toUid, senderUid: fromUid, type: 'connection_request', content: `${fromName} wants to connect with you.`, actionUrl: '/networking', requestId: id, read: false, createdAt: nowISO() });
    setLocal('unitex_notifications', notifs);
}

export async function acceptConnectionRequest(requestId: string, fromUid: string, toUid: string, toName: string) {
    const reqs = getLocal('unitex_network_requests') || [];
    const req = reqs.find((r:any) => r.id === requestId);
    if (req) req.status = 'accepted';
    setLocal('unitex_network_requests', reqs);
    const users = getLocal('unitex_users') || {};
    users[fromUid] = users[fromUid] || {};
    users[toUid] = users[toUid] || {};
    users[fromUid].connections = users[fromUid].connections || {};
    users[toUid].connections = users[toUid].connections || {};
    users[fromUid].connections[toUid] = { connectedAt: nowISO() };
    users[toUid].connections[fromUid] = { connectedAt: nowISO() };
    users[fromUid].connectionsCount = (users[fromUid].connectionsCount || 0) + 1;
    users[toUid].connectionsCount = (users[toUid].connectionsCount || 0) + 1;
    setLocal('unitex_users', users);

    const notifs = getLocal('unitex_notifications') || [];
    notifs.unshift({ id: 'n-' + Date.now(), recipientUid: fromUid, senderUid: toUid, type: 'connection_accepted', content: `${toName} accepted your connection request.`, actionUrl: `/profile/${toUid}`, read: false, createdAt: nowISO() });
    setLocal('unitex_notifications', notifs);
}

export async function rejectConnectionRequest(requestId: string) {
    const reqs = getLocal('unitex_network_requests') || [];
    const req = reqs.find((r:any) => r.id === requestId);
    if (req) req.status = 'rejected';
    setLocal('unitex_network_requests', reqs);
}

export function subscribeToPendingRequests(uid: string, callback: (reqs: any[]) => void): Unsubscribe {
    const tick = () => {
        const reqs = (getLocal('unitex_network_requests') || []).filter((r:any) => r.toUid === uid && r.status === 'pending');
        callback(reqs);
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
}

export function subscribeToConnections(uid: string, callback: (connections: any[]) => void): Unsubscribe {
    const tick = () => {
        const users = getLocal('unitex_users') || {};
        const conns = users[uid]?.connections ? Object.keys(users[uid].connections).map(k => ({ id: k, ...users[uid].connections[k] })) : [];
        callback(conns);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export function subscribeToDiscoverFeed(callback: (feed: any[]) => void): Unsubscribe {
    const tick = async () => {
        try {
            const res = await fetch('/api/discover');
            if (res.ok) { const data = await res.json(); callback(data); return; }
        } catch(e) {}
        const feed = getLocal('unitex_discover') || [];
        callback(feed);
    };
    tick();
    const id = setInterval(tick, 800);
    return () => clearInterval(id);
}

export function subscribeToTrendingTopics(callback: (topics: any[]) => void): Unsubscribe {
    const tick = async () => {
        try {
            const res = await fetch('/api/trending');
            if (res.ok) { const data = await res.json(); callback(data); return; }
        } catch(e) {}
        const topics = getLocal('unitex_trending') || [];
        callback(topics);
    };
    tick();
    const id = setInterval(tick, 1500);
    return () => clearInterval(id);
}
