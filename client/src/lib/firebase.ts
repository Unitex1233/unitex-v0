// Lightweight local replacement for Firebase used for MVP/local development.
// Exports simple auth and data helpers that persist to the server's local endpoints or to localStorage.

export const auth = {
  currentUser: null as any,
  
  async signInWithPhoneNumber(phone: string) {
    const user = { 
      uid: 'local-' + Date.now(), 
      phone,
      displayName: 'User ' + Math.random().toString(36).substring(7),
      email: `user-${Date.now()}@local.unitex`,
      photoURL: '',
      createdAt: new Date().toISOString()
    };
    try { 
      localStorage.setItem('unitex_user', JSON.stringify(user)); 
      localStorage.setItem('unitex_auth_data', JSON.stringify({
        method: 'phone',
        phone,
        signInAt: new Date().toISOString()
      }));
    } catch(e) {}
    this.currentUser = user;
    return { user };
  },

  async signInWithEmail(email: string, password: string) {
    const user = { 
      uid: 'local-' + Date.now(), 
      email,
      displayName: 'User ' + Math.random().toString(36).substring(7),
      phone: '',
      photoURL: '',
      createdAt: new Date().toISOString()
    };
    try { 
      localStorage.setItem('unitex_user', JSON.stringify(user)); 
      localStorage.setItem('unitex_auth_data', JSON.stringify({
        method: 'email',
        email,
        signInAt: new Date().toISOString()
      }));
      localStorage.setItem('unitex_pwd_hash', btoa(password)); // basic local persistence (not for prod)
    } catch(e) {}
    this.currentUser = user;
    return { user };
  },

  async signUp(data: { email?: string; phone?: string; displayName: string; password?: string }) {
    const user = { 
      uid: 'local-' + Date.now(), 
      email: data.email || '',
      phone: data.phone || '',
      displayName: data.displayName,
      photoURL: '',
      createdAt: new Date().toISOString()
    };
    try { 
      localStorage.setItem('unitex_user', JSON.stringify(user)); 
      localStorage.setItem('unitex_auth_data', JSON.stringify({
        method: data.email ? 'email' : 'phone',
        email: data.email || null,
        phone: data.phone || null,
        signUpAt: new Date().toISOString()
      }));
      if (data.password) localStorage.setItem('unitex_pwd_hash', btoa(data.password));
    } catch(e) {}
    this.currentUser = user;
    return { user };
  },

  async signOut() {
    try { 
      localStorage.removeItem('unitex_user'); 
      localStorage.removeItem('unitex_auth_data');
      localStorage.removeItem('unitex_pwd_hash');
    } catch(e) {}
    this.currentUser = null;
  },

  getCurrentUser() {
    if (!this.currentUser) {
      try {
        const raw = localStorage.getItem('unitex_user');
        if (raw) this.currentUser = JSON.parse(raw);
      } catch(e) { this.currentUser = null; }
    }
    return this.currentUser;
  },

  getAuthData() {
    try {
      const raw = localStorage.getItem('unitex_auth_data');
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }
};

export const db = {
  async getDiscoverFeed() {
    const res = await fetch('/api/discover');
    if (!res.ok) throw new Error('Failed to load discover feed');
    return res.json();
  },
  async saveMediaMetadata(data: any) {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save media metadata');
    return res.json();
  }
};

export const rtdb = null; // not used in MVP
export const googleProvider = null;

export default { auth, db, rtdb };
