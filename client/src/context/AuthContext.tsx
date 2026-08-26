import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth as localAuth, db as localDb } from '@/lib/firebase';
import { syncUserToRTDB } from '@/lib/rtdb';
import { generateUsercode, generateSafeHandle } from '@/lib/intelligence/identity';

interface AuthContextType {
    currentUser: any | null;
    userData: any | null;
    loading: boolean;
    signInWithPhone: (phoneNumber: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    verifyOtp: (otp: string) => Promise<void>;
    signInAsGuest: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

async function createUserDocument(user: any) {
    // Create or update via server API
    const payload = {
        uid: user.uid,
        displayName: user.displayName || 'UniteX User',
        email: user.email || null,
        phone: user.phone || null,
        photoURL: user.photoURL || '',
        role: 'Member',
        userId: generateUsercode(),
        usercode: generateUsercode(),
        createdAt: new Date().toISOString()
    };
    try {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { /* ignore */ }

    // Local sync placeholder
    try { await syncUserToRTDB(user); } catch (e) { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingPhone, setPendingPhone] = useState<string | null>(null);

    useEffect(() => {
        const u = localAuth.getCurrentUser();
        setCurrentUser(u);
        if (u) {
            // fetch user profile
            fetch(`/api/users/${u.uid}`).then((r) => r.ok ? r.json() : null).then((d) => setUserData(d)).catch(() => setUserData(null));
        }
        setLoading(false);
    }, []);

    const signInWithPhone = async (phoneNumber: string) => {
        const res = await localAuth.signInWithPhoneNumber(phoneNumber);
        setCurrentUser(res.user);
        await createUserDocument(res.user);
    };

    const signInWithEmail = async (email: string, password: string) => {
        const res = await localAuth.signInWithEmail(email, password);
        setCurrentUser(res.user);
        await createUserDocument(res.user);
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        const res = await localAuth.signUp({ email, displayName, password });
        setCurrentUser(res.user);
        await createUserDocument(res.user);
    };

    const signInWithGoogle = async () => {
        // Local fallback: create a guest-like user with Google metadata
        const user = { 
            uid: 'google-' + Date.now(), 
            displayName: 'Google User ' + Math.random().toString(36).substring(7),
            email: `google-${Date.now()}@local.unitex`,
            photoURL: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=256&h=256&auto=format&fit=crop',
            createdAt: new Date().toISOString()
        };
        localAuth.currentUser = user;
        setCurrentUser(user);
        await createUserDocument(user);
    };

    const verifyOtp = async (otp: string) => {
        // For local mock, OTP step is a no-op
        return;
    };

    const signInAsGuest = async () => {
        const user = { 
            uid: 'guest-' + Date.now(), 
            displayName: 'Guest User',
            email: `guest-${Date.now()}@local.unitex`,
            createdAt: new Date().toISOString()
        };
        localAuth.currentUser = user;
        setCurrentUser(user);
        await createUserDocument(user);
    };

    const signOut = async () => {
        await localAuth.signOut();
        setCurrentUser(null);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            userData,
            loading, 
            signInWithPhone,
            signInWithEmail,
            signUpWithEmail,
            signInWithGoogle,
            verifyOtp,
            signInAsGuest,
            signOut 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
