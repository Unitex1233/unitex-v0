import React from 'react';
import { NavLink } from 'react-router-dom';
import { Copy, Users, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function UnifiedProfileCard() {
    const profileUrl = "https://unitex.io/profile/alexander";

    const copyProfileUrl = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Profile URL copied!");
    };

    return (
        <div className="bg-white border border-[var(--color-surface)] overflow-hidden flex flex-col shadow-sm">
            {/* Banner/Header Portion */}
            <div className="h-16 bg-[var(--color-surface)] w-full" />

            {/* Photo Underneath Left-Aligned */}
            <NavLink to="/profile" className="px-4 -mt-8 mb-4 block hover:opacity-80 transition-opacity">
                <Avatar className="w-16 h-16 rounded-none border-4 border-white shadow-sm">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </NavLink>

            {/* Info Section */}
            <div className="px-4 pb-4">
                <NavLink to="/profile">
                    <h2 className="text-lg font-bold text-[var(--color-text)] capitalize tracking-tight hover:text-[var(--color-accent)] transition-colors">Alexander</h2>
                </NavLink>
                <p className="text-[10px] text-gray-400 font-mono capitalize mb-4">Product designer @ UniteX</p>

                {/* Consolidated Stats */}
                <div className="border-y border-[var(--color-surface)] py-3 space-y-2 mb-4">
                    <div className="flex justify-between items-center text-[9px] font-bold capitalize tracking-tight text-gray-400">
                        <span>Profile views</span>
                        <span className="text-[var(--color-accent)]">1,248</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold capitalize tracking-tight text-gray-400">
                        <span>Followers</span>
                        <span className="text-[var(--color-text)]">2,482</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold capitalize tracking-tight text-gray-400">
                        <span>Following</span>
                        <span className="text-[var(--color-text)]">842</span>
                    </div>
                </div>

                {/* Action Tray */}
                <div className="flex flex-col gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 text-[9px] font-bold capitalize tracking-tight h-8 border-[var(--color-surface)] hover:border-[var(--color-text)] rounded-none"
                        onClick={copyProfileUrl}
                    >
                        <Copy size={12} />
                        Copy profile URL
                    </Button>
                    <NavLink to="/networking">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 text-[9px] font-bold capitalize tracking-tight h-8 text-gray-400 hover:text-[var(--color-text)] rounded-none"
                        >
                            <Users size={12} />
                            My network
                        </Button>
                    </NavLink>
                </div>
            </div>

        </div>
    );
}
