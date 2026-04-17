import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { onSnapshot } from 'firebase/firestore';
import { syncUserToRTDB } from '@/lib/rtdb';
import { generateUsercode, generateSafeHandle } from '@/lib/intelligence/identity';

interface AuthContextType {
    currentUser: User | null;
    userData: any | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithPhone: (phoneNumber: string, recaptchaContainerId: string) => Promise<void>;
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

async function createUserDocument(user: User) {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        const userId = generateUsercode(); // New 6-char alphanumeric ID
        const username = generateSafeHandle(user.displayName || (user.isAnonymous ? 'guest' : 'unitex'));
        
        await setDoc(userRef, {
            uid: user.uid,
            userId, // 6-char alphanumeric ID for blockchain/reference
            usercode: userId, // Backward compatibility with previous 'usercode' field
            displayName: user.displayName || (user.isAnonymous ? 'Guest User' : 'UniteX User'),
            username,
            email: user.email || null,
            photoURL: user.photoURL || '',
            role: 'Member',
            bio: '',
            followers: 0,
            following: 0,
            profileViews: 0,
            xp: 100,
            vp: 100,
            badges: [],
            hasSeenCredentials: false,
            onboardingCompleted: false,
            createdAt: serverTimestamp(),
        });
    }
    // Always sync with RTDB for Intelligence Engine
    await syncUserToRTDB(user);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            
            if (user) {
                // Subscribe to real-time updates for THIS user's document
                const userDocRef = doc(db, 'users', user.uid);
                const unsubscribeData = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setUserData(doc.data());
                    }
                });
                
                // Note: We don't return unsubscribeData here directly to avoid closing it prematurely
                // if auth hasn't changed. We handle it in the cleanup if needed or via a local variable.
            } else {
                setUserData(null);
            }
            
            setLoading(false);
        });
        
        return () => {
            unsubscribeAuth();
        };
    }, []);

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        await createUserDocument(result.user);
    };

    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        await createUserDocument(result.user);
    };

    const signInWithPhone = async (phoneNumber: string, recaptchaContainerId: string) => {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
            size: 'invisible'
        });
        const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        setConfirmationResult(result);
    };

    const verifyOtp = async (otp: string) => {
        if (!confirmationResult) throw new Error('No pending phone verification');
        const result = await confirmationResult.confirm(otp);
        await createUserDocument(result.user);
    };

    const signInAsGuest = async () => {
        const result = await signInAnonymously(auth);
        await createUserDocument(result.user);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            userData,
            loading, 
            signInWithGoogle, 
            signInWithEmail, 
            signUpWithEmail, 
            signInWithPhone,
            verifyOtp,
            signInAsGuest,
            signOut 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
