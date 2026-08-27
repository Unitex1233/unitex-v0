// Lightweight local replacement for Realtime DB for MVP (file-backed in server or localStorage in browser)

function safeJsonParse(s) {
  try { return JSON.parse(s); } catch(e) { return null; }
}

export async function generateUniqueUsername(baseName: string): Promise<string> {
  const base = baseName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 10) || 'user';
  const candidate = base + Math.floor(Math.random() * 9000 + 1000);
  return candidate;
}

export async function createRealtimePost(data) {
  // store posts in localStorage (MVP)
  const raw = localStorage.getItem('unitex_posts');
  const posts = raw ? JSON.parse(raw) : [];
  const id = 'p-' + Date.now();
  const post = {
    id,
    uid: data.uid,
    author: data.displayName ? { id: data.uid, name: data.displayName, avatar: data.photoURL, role: data.role } : {},
    content: data.content,
    media: data.mediaURL ? { type: 'image', url: data.mediaURL } : null,
    stats: { likes: 0, support: 0, comments: 0 },
    ai: { qualityScore: 50, isSpam: false, tags: [] },
    timestamp: Date.now(),
    createdAtMillis: Date.now()
  };
  posts.unshift(post);
  localStorage.setItem('unitex_posts', JSON.stringify(posts.slice(0, 500)));
  return id;
}

export function subscribeToRealtimePosts(callback) {
  let last = null;
  const tick = () => {
    const raw = localStorage.getItem('unitex_posts');
    const posts = raw ? JSON.parse(raw) : [];
    const sliced = posts.slice(0, 50);
    callback(sliced);
  };
  tick();
  const id = setInterval(tick, 800);
  return () => clearInterval(id);
}

export function subscribeToTrendingPosts(callback) {
  const tick = () => {
    const raw = localStorage.getItem('unitex_posts');
    const posts = raw ? JSON.parse(raw) : [];
    const top = posts.slice(0,5);
    callback(top);
  };
  tick();
  const id = setInterval(tick, 1500);
  return () => clearInterval(id);
}

export async function likeRealtimePost(postId, currentLikes) {
  const raw = localStorage.getItem('unitex_posts');
  const posts = raw ? JSON.parse(raw) : [];
  const idx = posts.findIndex(p => p.id === postId);
  if (idx !== -1) { posts[idx].stats = posts[idx].stats || {likes:0}; posts[idx].stats.likes = currentLikes + 1; localStorage.setItem('unitex_posts', JSON.stringify(posts)); }
}

export async function awardVPPoints(uid, points) {
  const usersRaw = localStorage.getItem('unitex_users');
  const users = usersRaw ? JSON.parse(usersRaw) : {};
  users[uid] = users[uid] || { vp: 0 };
  users[uid].vp = (users[uid].vp || 0) + points;
  localStorage.setItem('unitex_users', JSON.stringify(users));
}

export async function syncUserToRTDB(user, profileData) {
  // Mirror user to local storage
  const usersRaw = localStorage.getItem('unitex_users');
  const users = usersRaw ? JSON.parse(usersRaw) : {};
  const uid = user.uid || ('u-' + Date.now());
  users[uid] = { ...(users[uid]||{}), uid, displayName: profileData?.displayName || user.displayName || 'UniteX User', username: profileData?.username || users[uid]?.username || '', usercode: users[uid]?.usercode || '', vp: users[uid]?.vp || 0 };
  localStorage.setItem('unitex_users', JSON.stringify(users));
}

export default {
  generateUniqueUsername,
  createRealtimePost,
  subscribeToRealtimePosts,
  subscribeToTrendingPosts,
  likeRealtimePost,
  awardVPPoints,
  syncUserToRTDB
};
