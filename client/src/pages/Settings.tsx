import { useState, useEffect } from 'react';
import { 
    Bell, 
    Shield, 
    User as UserIcon, 
    CreditCard, 
    Eye, 
    Settings as SettingsIcon, 
    Download, 
    Smartphone, 
    Laptop, 
    Monitor,
    LogOut,
    Plus,
    Trash2,
    Check,
    MessageSquare,
    Users,
    AppWindow,
    MapPin,
    Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Field, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateUser, uploadAvatar } from '@/lib/firestore';
import { toast } from 'sonner';

function Settings() {
    const { currentUser, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Edit profile');
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [updating, setUpdating] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            toast.error("Failed to sign out");
        }
    };

    const handleSaveProfile = async () => {
        if (!currentUser) return;
        setUpdating(true);
        try {
            await updateUser(currentUser.uid, { displayName });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;
        
        setUpdating(true);
        try {
            await uploadAvatar(currentUser.uid, file);
            toast.success("Avatar updated!");
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUpdating(false);
        }
    };

    const sections = [
        { id: 'Edit profile', icon: UserIcon, label: 'Edit profile' },
        { id: 'Password', icon: Shield, label: 'Password' },
        { id: 'Notifications', icon: Bell, label: 'Notifications' },
        { id: 'Chat export', icon: MessageSquare, label: 'Chat export' },
        { id: 'Sessions', icon: Monitor, label: 'Sessions' },
        { id: 'Applications', icon: AppWindow, label: 'Applications' },
        { id: 'Team', icon: Users, label: 'Team' },
        { id: 'Appearance', icon: Eye, label: 'Appearance' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'Edit profile':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-[var(--color-text)]">
                        <section>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">Profile Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold mb-4 uppercase tracking-widest opacity-40">Profile Avatar</label>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                        <div className="w-24 h-24 rounded-none bg-cover bg-center border border-[var(--color-surface)] shadow-sm relative group" 
                                             style={{ backgroundImage: `url(${currentUser?.photoURL || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop'})` }}>
                                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                 <Camera size={20} className="text-white" />
                                                 <input type="file" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                             </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Button disabled={updating} onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} className="bg-[var(--color-text)] text-white hover:bg-[var(--color-accent)] py-2.5 px-6 h-auto text-[10px] font-bold uppercase tracking-widest rounded-none transition-all shadow-sm">
                                                Update Photo
                                            </Button>
                                            <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">JPG or PNG • Max 2MB</p>
                                        </div>
                                    </div>
                                </div>

                                <Field>
                                    <FieldLabel className="uppercase tracking-widest opacity-40 text-[10px] font-bold mb-3">Display Name</FieldLabel>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 text-[var(--color-text)] group-focus-within:text-[#6366f1] group-focus-within:opacity-100 transition-all" size={16} />
                                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-12 h-14 bg-white border border-[var(--color-surface)] rounded-none font-medium text-sm transition-all focus:ring-0 focus:border-[#6366f1] shadow-sm" />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel className="uppercase tracking-widest opacity-40 text-[10px] font-bold mb-3">Location</FieldLabel>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 text-[var(--color-text)] group-focus-within:text-[#6366f1] group-focus-within:opacity-100 transition-all" size={16} />
                                        <Input defaultValue="Sai Gon, Vietnam" className="pl-12 h-14 bg-white border border-[var(--color-surface)] rounded-none font-medium text-sm transition-all focus:ring-0 focus:border-[#6366f1] shadow-sm" />
                                    </div>
                                </Field>

                                <Field>
                                    <div className="flex justify-between mb-3">
                                        <FieldLabel className="uppercase tracking-widest opacity-40 text-[10px] font-bold mb-0">Professional Bio</FieldLabel>
                                        <span className="text-[10px] font-mono opacity-30">880</span>
                                    </div>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-5 opacity-20 text-[var(--color-text)] group-focus-within:text-[#6366f1] group-focus-within:opacity-100 transition-all" size={16} />
                                        <Textarea placeholder="Short bio" className="pl-12 pt-4 min-h-[140px] bg-white border border-[var(--color-surface)] rounded-none font-medium text-sm resize-none transition-all focus:ring-0 focus:border-[#6366f1] shadow-sm" />
                                    </div>
                                </Field>

                                <Button onClick={handleSaveProfile} disabled={updating} className="w-full h-16 bg-[#6366f1] text-white hover:bg-[#4f46e5] font-bold uppercase tracking-widest rounded-none shadow-sm transition-all active:scale-[0.98] text-xs">
                                    {updating ? 'Processing...' : 'Save Protocol Changes'}
                                </Button>
                            </div>
                        </section>
                    </div>
                );
            case 'Password':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-[var(--color-text)]">
                        <section>
                            <h2 className="text-3xl font-bold mb-8 tracking-tight">Security Protocol</h2>
                            <div className="space-y-6">
                                <Field>
                                    <FieldLabel className="uppercase tracking-widest opacity-40 text-[10px] font-bold mb-3">Current password</FieldLabel>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 text-[var(--color-text)] group-focus-within:text-[#6366f1] transition-all" size={18} />
                                        <Input type="password" placeholder="••••••••" className="pl-12 h-14 bg-white border border-[var(--color-surface)] rounded-none font-medium text-sm tracking-widest transition-all focus:ring-0 focus:border-[#6366f1] shadow-sm" />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel className="uppercase tracking-widest opacity-40 text-[10px] font-bold mb-3">New password</FieldLabel>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 text-[var(--color-text)] group-focus-within:text-[#6366f1] transition-all" size={18} />
                                        <Input type="password" placeholder="Enter new secret" className="pl-12 h-14 bg-white border border-[var(--color-surface)] rounded-none font-medium text-sm tracking-widest transition-all focus:ring-0 focus:border-[#6366f1] shadow-sm" />
                                    </div>
                                    <p className="mt-2 text-[10px] font-bold uppercase opacity-20 tracking-widest">Minimum 12 characters recommended</p>
                                </Field>

                                <Field>
                                    <FieldLabel className="uppercase tracking-widest opacity-40 text-[10px] font-bold mb-3">Verify new password</FieldLabel>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 text-[var(--color-text)] group-focus-within:text-[#6366f1] transition-all" size={18} />
                                        <Input type="password" placeholder="Confirm new secret" className="pl-12 h-14 bg-white border border-[var(--color-surface)] rounded-none font-medium text-sm tracking-widest transition-all focus:ring-0 focus:border-[#6366f1] shadow-sm" />
                                    </div>
                                </Field>

                                <Button className="w-full h-16 bg-[var(--color-text)] text-white hover:bg-[#6366f1] font-bold uppercase tracking-widest rounded-none shadow-md transition-all active:scale-[0.98] text-xs">
                                    Update Security Protocol
                                </Button>
                            </div>
                        </section>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-[var(--color-text)]">
                        <section>
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--color-surface)] pb-6">
                                <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
                                <Button variant="ghost" className="h-10 px-6 rounded-none border border-[var(--color-surface)] text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                                    Mute All
                                </Button>
                            </div>

                            <div className="space-y-12">
                                <section className="space-y-6">
                                    <h3 className="uppercase tracking-widest font-bold text-[10px] opacity-40">Platform Activity</h3>
                                    <div className="space-y-4">
                                        {[
                                            'New notifications',
                                            'Group chat invitations',
                                            'User mentions'
                                        ].map((item, i) => (
                                            <div key={item} className="flex justify-between items-center p-6 bg-white border border-[var(--color-surface)] transition-all shadow-sm hover:border-[#6366f1]/50 group">
                                                <span className="text-xs font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{item}</span>
                                                <div className={cn(
                                                    "w-6 h-6 border flex items-center justify-center transition-all",
                                                    i < 3 ? "bg-[#6366f1] border-[#6366f1]" : "border-gray-200"
                                                )}>
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="uppercase tracking-widest font-bold text-[10px] opacity-40">Team Updates</h3>
                                    <div className="space-y-4">
                                        {[
                                            'New project updates',
                                            'Collaborator requests',
                                            'Task assignments'
                                        ].map((item, i) => (
                                            <div key={item} className="flex justify-between items-center p-6 border border-gray-100 hover:border-[#6366f1]/30 transition-all shadow-none hover:shadow-sm group">
                                                <span className="text-xs font-bold opacity-50 uppercase tracking-widest group-hover:opacity-100 transition-opacity">{item}</span>
                                                <div className={cn(
                                                    "w-6 h-6 border flex items-center justify-center transition-all",
                                                    i === 2 ? "bg-[#6366f1] border-[#6366f1]" : "border-gray-200"
                                                )}>
                                                    {i === 2 && <Check size={14} className="text-white" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </section>
                    </div>
                );
            case 'Chat export':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-[var(--color-text)]">
                        <section>
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--color-surface)] pb-6">
                                <h2 className="text-3xl font-bold tracking-tight">Chat Archive</h2>
                                <span className="px-3 py-1 bg-gray-100 text-[9px] font-bold uppercase tracking-widest">v2.4.0</span>
                            </div>
                            
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-8">Select datasets for export protocol</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: 'Production Logs', color: 'bg-[#6366f1]' },
                                    { label: 'Priority Chats', color: 'bg-indigo-400' },
                                    { label: 'Archive Vault', color: 'bg-gray-400' },
                                    { label: 'Purged Records', color: 'bg-red-400' }
                                ].map((chat, i) => (
                                    <div key={chat.label} className={cn(
                                        "flex justify-between items-center p-6 border transition-all",
                                        i < 2 ? "bg-white border-[var(--color-surface)] shadow-sm" : "bg-gray-50/50 border-gray-100 opacity-40"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-3 h-3", chat.color)}></div>
                                            <span className="font-bold text-[10px] uppercase tracking-widest">{chat.label}</span>
                                        </div>
                                        {i < 2 && <Check size={16} className="text-[#6366f1]" />}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row shadow-sm">
                                <Button className="flex-1 h-16 bg-[#6366f1] text-white hover:bg-[#4f46e5] font-bold uppercase tracking-widest rounded-none transition-all text-xs">
                                    Initialize Export Protocol
                                </Button>
                                <Button className="px-10 h-16 bg-white text-[var(--color-text)] hover:bg-gray-50 font-bold uppercase tracking-widest rounded-none border-l border-[var(--color-surface)] transition-all flex items-center justify-center gap-3 text-xs">
                                    <span>DATA.PDF</span>
                                    <Download size={18} />
                                </Button>
                            </div>
                        </section>
                    </div>
                );
            case 'Sessions':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-[var(--color-text)]">
                        <section>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">Active Sessions</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6 max-w-sm leading-loose">Status report of all authorized terminals currently accessing the platform.</p>
                            
                            <div className="space-y-4">
                                {[
                                    { device: 'Terminus-OS (iPhone)', ip: '222.225.225.222', date: 'Auth Code 17-Nov', icon: Smartphone },
                                    { device: 'Workstation (MacBook)', ip: '222.225.225.222', date: 'Auth Code 17-Nov', icon: Laptop },
                                    { device: 'Mainframe (Desktop)', ip: '222.225.225.222', date: 'Auth Code 17-Nov', icon: Monitor }
                                ].map((session) => (
                                    <div key={session.device} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-[var(--color-surface)] shadow-sm bg-white transition-all group gap-4">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#6366f1]/10 group-hover:text-[#6366f1] transition-all">
                                                <session.icon size={22} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-widest">{session.device}</h4>
                                                <div className="flex items-center gap-3 text-[9px] font-mono opacity-40 uppercase font-bold">
                                                    <span>{session.ip}</span>
                                                    <span className="w-1 h-1 bg-gray-300"></span>
                                                    <span>{session.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full sm:w-auto h-10 px-8 text-[9px] font-bold uppercase tracking-widest border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all rounded-none">
                                            Revoke
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full mt-12 h-16 bg-white text-red-600 border border-red-100 hover:bg-red-600 hover:text-white font-bold uppercase tracking-widest rounded-none transition-all shadow-sm text-xs">
                                Terminate All Session Protocols
                            </Button>
                        </section>
                    </div>
                );
            case 'Applications':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-[var(--color-text)]">
                        <section>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">App Matrix</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-3">Connected third-party integrations</p>
                                </div>
                                <Button className="h-10 px-8 bg-[#6366f1] text-white hover:bg-[#4f46e5] font-bold uppercase tracking-widest text-[10px] rounded-none transition-all shadow-sm">
                                    Link App
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'UIB-Terminal', date: 'Authorized 03-23', active: false },
                                    { name: 'Midjourney-AI', date: 'Authorized 03-23', active: true },
                                    { name: 'Open-GPT', date: 'Authorized 03-22', active: false },
                                    { name: 'Discord-Grid', date: 'Authorized 03-23', active: false },
                                    { name: 'Slack-Connect', date: 'Authorized 03-22', active: false },
                                    { name: 'Duolingo-Bot', date: 'Authorized 03-23', active: false },
                                ].map((app) => (
                                    <div key={app.name} className="flex flex-col p-6 border border-[var(--color-surface)] bg-white transition-all shadow-sm hover:shadow-md group">
                                        <div className="flex items-center gap-4 mb-8 uppercase">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-400 flex items-center justify-center font-bold text-lg group-hover:bg-[#6366f1]/10 group-hover:text-[#6366f1] transition-all">
                                                {app.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xs uppercase tracking-widest">{app.name}</h4>
                                                <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">{app.date}</span>
                                            </div>
                                        </div>
                                        {app.active ? (
                                            <Button className="w-full h-10 text-[9px] font-bold uppercase tracking-widest bg-[var(--color-text)] text-white hover:bg-red-600 rounded-none transition-all shadow-sm">
                                                Deauthorize Node
                                            </Button>
                                        ) : (
                                            <div className="h-10 border border-gray-50 flex items-center justify-center opacity-30 italic text-[9px] uppercase font-bold tracking-widest bg-gray-50">
                                                Active Link
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                );
            case 'Team':
            case 'Appearance':
                return (
                    <div className="flex flex-col items-center justify-center h-[400px] text-[var(--color-text)]">
                        <div className="border border-[var(--color-surface)] p-12 text-center shadow-sm max-w-md">
                            <h2 className="text-2xl font-bold tracking-tight mb-4">{activeSection} Module</h2>
                            <p className="text-[10px] uppercase tracking-widest bg-gray-50 inline-block px-4 py-1 font-bold text-[#6366f1]">Initialization in Progress</p>
                            <p className="mt-8 opacity-40 text-[10px] font-bold uppercase tracking-widest italic">Check back later for system updates.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-4 pb-10 text-[var(--color-text)]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 group border border-transparent rounded-none",
                                        activeSection === section.id
                                            ? "bg-white text-[var(--color-text)] border-[var(--color-surface)] shadow-sm"
                                            : "text-gray-400 hover:text-[var(--color-text)] hover:bg-white/50"
                                    )}
                                >
                                    <section.icon 
                                        size={18} 
                                        className={cn(
                                            "transition-colors",
                                            activeSection === section.id ? "text-[#6366f1]" : "group-hover:text-[#6366f1]"
                                        )} 
                                    />
                                    <span className="text-xs font-bold uppercase tracking-widest">{section.label}</span>
                                    {activeSection === section.id && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-[#6366f1]" />
                                    )}
                                </button>
                            ))}
                        </nav>
                        
                        <div className="mt-12 pt-12 border-t border-[var(--color-surface)]">
                            <button onClick={handleSignOut} className="flex items-center gap-4 px-6 py-4 text-red-500 hover:text-red-600 transition-all group w-full text-left rounded-none hover:bg-red-50/50">
                                <LogOut size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">Sign Out Terminal</span>
                            </button>
                            <button className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-red-600 transition-all group w-full text-left rounded-none hover:bg-red-50/50 mt-2">
                                <Trash2 size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">Delete account</span>
                            </button>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 max-w-2xl bg-white border border-[var(--color-surface)] p-6 lg:p-8 shadow-sm rounded-none min-h-[600px]">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Settings;
