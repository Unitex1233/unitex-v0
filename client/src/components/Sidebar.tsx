import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, Calendar, Share2, Map, MessageSquare, Lock, Settings, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { NotificationsList } from '@/pages/Notifications';
import { useNotifications } from '@/context/NotificationContext';
import CreatePost from '@/components/CreatePost';
import { PenSquare } from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar() {
    const { unreadCount } = useNotifications();
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const navItems = [
        { icon: Home, path: '/', label: 'Home' },
        { icon: Compass, path: '/discover', label: 'Discover' },
        { icon: Users, path: '/communities', label: 'Connect' },
        { icon: Calendar, path: '/events', label: 'Events' },
        { icon: Share2, path: '/networking', label: 'Networking' },
        { icon: Map, path: '/roadmaps', label: 'Roadmaps' },
        { icon: MessageSquare, path: '/messages', label: 'Inbox / Messages' },
        { icon: Bell, path: '/notifications', label: 'Notifications' },
    ];

    return (
        <aside className="sticky top-0 h-screen w-20 bg-[var(--color-bg)] border-r border-[var(--color-surface)] flex flex-col items-center py-6 z-50 hidden md:flex shrink-0 max-md:hidden">

            {/* Top: Create Post Button (Global Dialog) */}
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                <DialogTrigger asChild>
                    <button
                        className="w-10 h-10 rounded-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-text)] transition-all mb-8 mt-2 flex items-center justify-center shadow-sm"
                        title="Create Post"
                    >
                        <PenSquare size={20} strokeWidth={2} />
                    </button>
                </DialogTrigger>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-2xl">
                    <DialogTitle className="sr-only">Create New Post</DialogTitle>
                    <DialogDescription className="sr-only">Share your progress, questions, or resources with the network.</DialogDescription>
                    <CreatePost
                        initialExpanded={true}
                        onPost={(content, label) => {
                            const labelText = label ? label.toUpperCase() : 'POST';
                            toast.success(`Post synchronized: ${labelText}`);
                            setIsPostDialogOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2 w-full px-2 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center justify-center w-full max-w-[48px] h-12 mx-auto transition-all relative",
                                isActive
                                    ? "text-[var(--color-accent)] bg-[var(--color-accent)]/5 border-l-4 border-[var(--color-accent)]"
                                    : "text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)] opacity-60 hover:opacity-100"
                            )}
                            title={item.label}
                        >
                            <item.icon size={20} strokeWidth={1.5} />
                            {item.label === 'Notifications' && unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-[var(--color-accent)] text-white text-[8px] font-black flex items-center justify-center -translate-y-1 translate-x-1">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer / Utilities */}
            <div className="mt-auto pt-6 border-t border-[var(--color-surface)] w-full flex flex-col items-center gap-2 px-2">
                {[
                    { icon: Lock, path: '/vault', label: 'Vault' }
                ].map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center justify-center w-full max-w-[48px] h-12 mx-auto transition-all relative",
                            isActive
                                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/5 border-l-4 border-[var(--color-accent)]"
                                : "text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)] opacity-60 hover:opacity-100"
                        )}
                        title={item.label}
                    >
                        <item.icon size={20} strokeWidth={1.5} />
                    </NavLink>
                ))}

                {/* Profile at the Bottom */}
                <NavLink
                    to="/profile"
                    className="w-10 h-10 rounded-none bg-[var(--color-surface)] overflow-hidden border border-[var(--color-text)] hover:ring-2 hover:ring-[var(--color-accent)] transition-all mt-2"
                    title="Profile"
                >
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </NavLink>
            </div>
        </aside>
    );
}

// Mobile Bottom Bar
export function MobileNav() {
    const navItems = [
        { icon: Home, path: '/', label: 'Home' },
        { icon: Compass, path: '/discover', label: 'Discover' },
        { icon: MessageSquare, path: '/messages', label: 'Messages' },
        { icon: User, path: '/profile', label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-[var(--color-bg)] border-t border-[var(--color-surface)] flex justify-around p-4 z-50 md:hidden">
            {navItems.map((item) => {

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center gap-1",
                            isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text)] opacity-60"
                        )}
                    >
                        <item.icon size={24} strokeWidth={1.5} />
                    </NavLink>
                );
            })}
        </nav>
    );
}
