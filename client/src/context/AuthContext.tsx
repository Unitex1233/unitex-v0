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
    ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithPhone: (phoneNumber: string, recaptchaContainerId: string) => Promise<void>;
    verifyOtp: (otp: string) => Promise<void>;
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
        await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || 'UniteX User',
            email: user.email,
            photoURL: user.photoURL || '',
            role: 'Member',
            bio: '',
            followers: 0,
            following: 0,
            profileViews: 0,
            xp: 0,
            badges: [],
            createdAt: serverTimestamp(),
        });
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
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

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            loading, 
            signInWithGoogle, 
            signInWithEmail, 
            signUpWithEmail, 
            signInWithPhone,
            verifyOtp,
            signOut 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
