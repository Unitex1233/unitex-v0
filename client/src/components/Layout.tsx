import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sidebar, MobileNav } from './Sidebar';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NotificationsList } from '@/pages/Notifications';

function Layout() {
    // Mock State: In a real app, this comes from a context or API
    const [hasUnread, setHasUnread] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    // Effect 2: Auto-collapse and mark as read when user navigates to Notifications
    // Since we are using Sheet now, we might want to clear unread when Sheet opens.
    // For now, let's keep it simple.

    return (
        <div className="SwissGrid min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans transition-colors duration-300">
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex flex-col min-w-0 relative">
                <main className="px-4 md:px-6 py-6 w-full max-w-none mx-auto">
                    <Outlet />
                </main>
            </div>

            <MobileNav />
        </div>
    );
}

export default Layout;
