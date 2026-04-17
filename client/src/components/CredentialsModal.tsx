import React from 'react';
import { Shield, Copy, Check, Zap, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface CredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    usercode: string;
    photoURL?: string;
    onComplete: () => void;
}

export function CredentialsModal({ isOpen, onClose, username, usercode, photoURL, onComplete }: CredentialsModalProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        const text = `UniteX Profile\nUsername: ${username}\nAccess Code: ${usercode}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Credentials copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-md bg-white border border-[var(--color-text)] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[var(--color-text)] text-white">
                                    <Shield size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic">Establish Identity</h2>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
                            Your node has been authenticated. Below are your unique network identifiers. Keep these secure.
                        </p>

                        {/* ID Card */}
                        <div className="bg-gray-50 border border-[var(--color-surface)] p-6 space-y-4 relative group">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 border border-[var(--color-text)] bg-white p-1">
                                    <img 
                                        src={photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Username</span>
                                    <p className="text-lg font-black tracking-tight text-[var(--color-text)] leading-none">{username}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-surface)]">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Access Code</span>
                                    <p className="text-xl font-black font-mono tracking-widest text-[var(--color-accent)]">{usercode}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</span>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                        <Zap size={10} className="fill-emerald-600" /> Verified
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={handleCopy}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[var(--color-text)] transition-colors"
                                title="Copy Credentials"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>

                        <div className="space-y-3 pt-4">
                            <button
                                onClick={onComplete}
                                className="w-full py-4 bg-[var(--color-text)] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--color-accent)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                                Confirm & Enter Mesh
                            </button>
                            <p className="text-[9px] text-center text-gray-400 font-mono uppercase tracking-widest">
                                Verification complete • Node ID: {usercode}
                            </p>
                        </div>
                    </div>

                    {/* Industrial Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
