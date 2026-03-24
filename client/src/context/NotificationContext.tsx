import React, { createContext, useContext, useState, useEffect } from 'react';

interface Notification {
    id: number;
    type: 'like' | 'follow' | 'comment' | 'support' | 'system';
    user?: string;
    content: string;
    time: string;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
    markAllAsRead: () => void;
    markAsRead: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initial state: try to load from localStorage first
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem('unitex_notifications');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
        return [
            { id: 1, type: 'like', user: 'Sarah Jenkins', content: 'liked your progress update', time: '2m ago', read: false },
            { id: 2, type: 'follow', user: 'Alex Chen', content: 'started following you', time: '1h ago', read: true },
        ];
    });

    // Save to localStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem('unitex_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notif: Omit<Notification, 'id' | 'time' | 'read'>) => {
        const newNotif: Notification = {
            ...notif,
            id: Date.now(),
            time: 'Just now',
            read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    // Simulation removed as per user request to avoid unnecessary notifications.
    useEffect(() => {
        // Simulation: Add a random notification every 45-60 seconds to simulate "real-time"
        // This was previously adding Jordan Smith, Elena Fisher, Marcus Reed, Priya Patel notifications.
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, markAsRead }}>
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
