import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/firestore';

interface Notification {
    id: string; // Changed from number to string to match Firestore IDs
    type: 'like' | 'follow' | 'comment' | 'support' | 'system' | 'connection_accepted';
    user?: string;
    content: string;
    time: string;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAllAsRead: () => void;
    markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!currentUser) {
            setNotifications([]);
            return;
        }

        const unsubscribe = subscribeToNotifications(currentUser.uid, (notifs) => {
            // Map Firestore data to our Notification interface
            const formatted = notifs.map(n => ({
                id: n.id,
                type: n.type || 'system',
                user: n.senderName || 'System',
                content: n.text || n.content,
                time: n.createdAt ? new Date(n.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
                read: n.read || false
            })) as Notification[];
            setNotifications(formatted);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const unreadCount = notifications.filter(n => !n.read).length;



    const markAllAsRead = async () => {
        if (!currentUser) return;
        await markAllNotificationsAsRead(currentUser.uid);
    };

    const markAsRead = async (id: string) => {
        await markNotificationAsRead(id);
    };

    // Simulation removed as per user request to avoid unnecessary notifications.
    useEffect(() => {
        // Simulation: Add a random notification every 45-60 seconds to simulate "real-time"
        // This was previously adding Jordan Smith, Elena Fisher, Marcus Reed, Priya Patel notifications.
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
