import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Shield, Zap, ArrowRight, Github, Twitter, Linkedin, Globe, Settings, ChevronDown, CreditCard, Bell, LogOut, Heart, MessageSquare, Pin, Star, BookOpen, ExternalLink, Copy, Users, LayoutGrid, Flame, Smartphone, Laptop, Monitor, Fingerprint } from 'lucide-react';
import PostCard, { Post } from '@/components/PostCard';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

import { getUser } from '@/lib/firestore';
import { calculateUserLevel } from '@/lib/intelligence';

function Profile() {
    const { currentUser, signOut } = useAuth();
    const [activeSection, setActiveSection] = useState('Posts');
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;
            const data = await getUser(currentUser.uid);
            setUserData(data);
        };
        fetchUserData();
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'posts'),
            where('uid', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            setUserPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[]);
        });
        return () => unsub();
    }, [currentUser]);

    const profileUrl = `https://unitex.io/profile/${currentUser?.uid || 'user'}`;
    const copyProfileUrl = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Profile URL copied!");
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    const TABS = ['Posts', 'About', 'Activity', 'Education', 'Experience'];

    return (
        <div className="max-w-6xl mx-auto px-6 pb-10">
            {/* Consistent Profile Header */}
            <div className="bg-white border border-[var(--color-surface)] overflow-hidden flex flex-col shadow-sm mb-4 rounded-none">
                {/* Banner */}
                <div className="h-48 bg-gray-50 w-full relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white/80 border border-[var(--color-surface)] backdrop-blur-sm hover:bg-white text-[var(--color-text)] transition-all rounded-none" onClick={() => navigate('/settings')}>
                            <Settings size={14} className="mr-2" /> Settings
                        </Button>
                    </div>
                </div>

                {/* Photo Underneath Left-Aligned */}
                <div className="px-8 -mt-12 mb-2 flex flex-col md:flex-row justify-between items-end gap-4 text-[var(--color-text)]">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="w-32 h-32 border-4 border-white shadow-lg bg-white overflow-hidden relative rounded-none">
                            <img src={userData?.photoURL || currentUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                        <div className="pb-2">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] leading-tight truncate max-w-[200px] md:max-w-xs" title={userData?.displayName || currentUser?.displayName || 'User'}>{userData?.displayName || currentUser?.displayName || 'User'}</h1>
                                {userData?.xp !== undefined && (
                                    <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-widest border border-indigo-100 rounded-none shrink-0 flex items-center gap-1">
                                        <Zap size={10} /> LEVEL {calculateUserLevel(userData.xp).level}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <p className="text-xs text-gray-400 font-medium">{userData?.bio || "Node initialized."}</p>
                                <span className="w-1 h-1 bg-gray-300 rounded-none" />
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-[#6366f1]">
                                    {userData?.xp !== undefined ? `${userData.xp} EXP • ${userData.vp} VP` : "Architect"}
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <a href="#" className="text-gray-400 hover:text-[var(--color-text)] transition-colors"><Github size={16} /></a>
                                    <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors"><Linkedin size={16} /></a>
                                    <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors"><Globe size={16} /></a>
                                </div>
                                <div className="h-4 w-px bg-gray-100" />
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[var(--color-text)]">{userData?.connectionsCount || userData?.followers || 0}</span>
                                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Connections</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[var(--color-text)]">{userData?.following || 0}</span>
                                        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Following</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-100" />
                                    <div className="flex items-center gap-2">
                                        <Flame size={14} className="text-orange-500" />
                                        <span className="text-[10px] font-bold text-gray-400">152 DAY STREAK</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pb-2">
                        <NavLink to="/dashboard">
                            <Button
                                variant="outline"
                                className="bg-white border border-[var(--color-surface)] text-[var(--color-text)] font-semibold text-xs py-5 px-6 shadow-sm hover:bg-gray-50 transition-all rounded-none"
                            >
                                <LayoutGrid size={14} className="mr-2" /> Dashboard
                            </Button>
                        </NavLink>
                        <Button
                            variant="outline"
                            className="bg-white border border-[var(--color-surface)] text-[var(--color-text)] font-semibold text-xs py-5 px-6 shadow-sm hover:bg-gray-50 transition-all font-sans rounded-none"
                            onClick={copyProfileUrl}
                        >
                            <Copy size={14} className="mr-2" /> Copy Link
                        </Button>
                        <NavLink to="/networking">
                            <Button
                                className="bg-[var(--color-text)] hover:bg-[var(--color-accent)] text-white hover:text-white border-0 font-semibold text-xs py-5 px-6 transition-all shadow-sm rounded-none relative"
                            >
                                <Users size={14} className="mr-2" /> My Network
                                {userData?.pendingRequests > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                        {userData.pendingRequests}
                                    </span>
                                )}
                            </Button>
                        </NavLink>
                    </div>
                </div>

                {/* Horizontal Navigation Tabs */}
                <div className="px-8 border-t border-[var(--color-surface)] flex gap-4 bg-gray-50/30">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveSection(tab)}
                            className={cn(
                                "py-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all rounded-none",
                                activeSection === tab
                                    ? "border-[var(--color-accent)] text-[var(--color-text)]"
                                    : "border-transparent text-gray-400 hover:text-[var(--color-text)]"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* Main Content (Left/Middle) */}
                <div className="lg:col-span-8 space-y-4 rounded-none">

                    {/* Dynamic Section based on Tabs */}
                    <div className="bg-white border border-[var(--color-surface)] p-4 min-h-[500px] shadow-sm text-[var(--color-text)] rounded-none">
                        <div className="flex justify-between items-center mb-4 border-b border-[var(--color-surface)] pb-4">
                            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">{activeSection}</h2>
                            {activeSection === 'Posts' && (
                                <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-text)] transition-colors">Filter</button>
                            )}
                        </div>

                        {/* Featured (only on Posts/About) */}
                        {(activeSection === 'Posts' || activeSection === 'About') && (
                            <div className="mb-4">
                                <h3 className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 text-gray-400">
                                    <Star size={10} className="text-[#6366f1]" /> Featured Content
                                </h3>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { title: "UnitEx Design System", type: "Docs", icon: BookOpen },
                                        { title: "2026 Strategy", type: "PDF", icon: Pin },
                                        { title: "UX Flow Case Study", type: "Web", icon: ExternalLink }
                                    ].map((item, i) => (
                                        <div key={i} className="group border border-[var(--color-surface)] p-6 bg-white hover:border-[var(--color-accent)] transition-all cursor-pointer shadow-sm rounded-none">
                                            <item.icon size={20} className="mb-4 text-gray-400 group-hover:text-[var(--color-accent)]" />
                                            <h4 className="text-xs font-bold text-[var(--color-text)] mb-2 uppercase leading-tight tracking-tight">{item.title}</h4>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.type}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-px bg-gray-50 w-full mt-4" />
                            </div>
                        )}

                        {activeSection === 'Experience' && (
                            <div className="space-y-12">
                                {/* Core Competencies */}
                                <div>
                                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-6">Core Competencies</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { skill: "System Design", level: 95 },
                                            { skill: "UI Engineering", level: 90 },
                                            { skill: "Product Strategy", level: 85 },
                                            { skill: "Brand Architecture", level: 80 }
                                        ].map((s, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                                                    <span>{s.skill}</span>
                                                    <span className="font-mono text-[#6366f1]">{s.level}%</span>
                                                </div>
                                                <div className="h-1 bg-gray-50 w-full rounded-none">
                                                    <div className="h-full bg-[var(--color-text)] rounded-none" style={{ width: `${s.level}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mission History */}
                                <div className="pt-8 border-t border-[var(--color-surface)]">
                                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-6">Mission History</h3>
                                    <div className="space-y-6">
                                        {[
                                            { title: "Project: Alliance Core", role: "Lead Architect", status: "Success", date: "Jan 2026" },
                                            { title: "Mission: Genesis Hack", role: "Security Lead", status: "Success", date: "Dec 2025" },
                                            { title: "Protocol: Zenith UI", role: "Interface Eng", status: "In Progress", date: "Present" }
                                        ].map((mission, i) => (
                                            <div key={i} className="flex gap-6 items-start group">
                                                <div className="w-12 h-12 bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-transparent group-hover:border-[var(--color-surface)] transition-all rounded-none">
                                                    <span className="text-[8px] font-bold text-gray-400">{mission.date.split(' ')[0]}</span>
                                                    <span className="text-[10px] font-bold">{mission.date.split(' ')[1]}</span>
                                                </div>
                                                <div className="flex-grow pt-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-tight">{mission.title}</h4>
                                                            <p className="text-[10px] text-gray-400 font-medium mt-1">{mission.role}</p>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-none",
                                                            mission.status === 'Success' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                                        )}>
                                                            {mission.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'Posts' && (
                            <div className="space-y-6">
                                {userPosts.length > 0 ? (
                                    userPosts.map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-gray-400 italic text-sm">No posts yet.</div>
                                )}
                            </div>
                        )}

                        {activeSection === 'Activity' && (
                            <div className="space-y-8">
                                <div className="p-6 bg-gray-50 border border-[var(--color-surface)] rounded-none text-[var(--color-text)]">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Builder Contributions</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map(i => <div key={i} className={cn("w-2 h-2 rounded-none", i === 4 ? "bg-[var(--color-accent)]" : "bg-gray-200")} />)}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[repeat(52,1fr)] gap-0.5 h-20">
                                        {Array.from({ length: 260 }).map((_, i) => {
                                            const rand = Math.random();
                                            let opacity = 0.05;
                                            if (rand > 0.95) opacity = 1;
                                            else if (rand > 0.85) opacity = 0.6;
                                            else if (rand > 0.70) opacity = 0.3;
                                            else if (rand > 0.50) opacity = 0.15;

                                            return (
                                                <div
                                                    key={i}
                                                    className="w-full h-full transition-all hover:ring-1 hover:ring-black/5 rounded-none"
                                                    style={{
                                                        backgroundColor: `var(--color-accent)`,
                                                        opacity: opacity
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'About' && (
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#6366f1] mb-4">The Architect's Manifesto</h3>
                                    <p className="text-sm text-[var(--color-text)] leading-relaxed italic border-l-2 border-[#6366f1] pl-6 font-medium">
                                        "Code is the medium, but experience is the legacy. I build systems that don't just function, they resonate."
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Philosophy</h4>
                                        <p className="text-xs text-[var(--color-text)] opacity-70 leading-relaxed font-medium">
                                            Specializing in high-performance decentralized architectures and surgical UI precision. Alexander approaches every project with the mindset of an urban planner: building for scale, resilience, and human interaction.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Focus</h4>
                                        <ul className="space-y-2">
                                            {['Protocol Design', 'Interface Engineering', 'Growth Analytics', 'Security Auditing'].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-tight">
                                                    <span className="w-1 h-1 bg-[#6366f1] rounded-none" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-[var(--color-surface)]">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 font-medium">Mission Status</h4>
                                    <div className="bg-gray-50 p-6 border border-[var(--color-surface)] rounded-none">
                                        <div className="flex justify-between items-center mb-4 text-[var(--color-text)]">
                                            <span className="text-[9px] font-bold uppercase">Active: Project Alliance Core</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">82% Complete</span>
                                        </div>
                                        <div className="w-full h-1 bg-white rounded-none overflow-hidden">
                                            <div className="h-full bg-[var(--color-text)] w-[82%] rounded-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'Education' && (
                            <div className="space-y-12">
                                {[
                                    { degree: "MSc in Systems Architecture", school: "The Obsidian Institute", date: "2020 - 2022", details: "Specialization in Decentralized Compute & High-Density UI Structures." },
                                    { degree: "BFA in Industrial Design", school: "Rhode Island School of Design", date: "2016 - 2020", details: "Focus on Minimalist Aesthetics and User Psychology." }
                                ].map((edu, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center shrink-0 border border-transparent group-hover:border-[var(--color-surface)] transition-all rounded-none">
                                            <BookOpen size={20} className="text-gray-300 group-hover:text-[var(--color-accent)] transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-sm font-bold uppercase tracking-tight">{edu.degree}</h4>
                                                    <p className="text-[10px] text-[#6366f1] font-bold uppercase tracking-widest mt-1">{edu.school}</p>
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-400">{edu.date}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed max-w-xl font-medium">{edu.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection !== 'Activity' && activeSection !== 'Experience' && activeSection !== 'About' && activeSection !== 'Education' && activeSection !== 'Posts' && (
                            <div className="py-12 text-center flex flex-col items-center justify-center text-gray-300">
                                <div className="w-12 h-12 border border-gray-100 flex items-center justify-center mb-4 rotate-45">
                                    <Zap size={20} className="-rotate-45" />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Details for {activeSection} would appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <aside className="lg:col-span-4 space-y-6">
                    {/* Consolidated Profile Utilities Card */}
                    <div className="bg-white border border-[var(--color-surface)] shadow-sm text-[var(--color-text)]">
                        <div className="p-8 border-b border-[var(--color-surface)]">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 border-l-2 border-[var(--color-accent)] pl-4">Network Intelligence</h2>
                            <div className="space-y-6">
                                {[
                                    { label: "Role", value: "Product Designer" },
                                    { label: "Location", value: "San Francisco, CA" },
                                    { label: "Joined", value: "Sept 2024" },
                                    { label: "Trust Score", value: "98.4%" }
                                ].map((detail, i) => (
                                    <div key={i} className="flex justify-between items-baseline group">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-[var(--color-text)] transition-colors">{detail.label}</span>
                                        <span className="text-xs font-bold text-[var(--color-text)]">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 border-b border-[var(--color-surface)] bg-white">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <Users size={14} /> Active Alliances
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { name: "UnitEx Core", count: 12 },
                                    { name: "Design Standards", count: 4 }
                                ].map((team, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-tight group-hover:text-[var(--color-accent)] transition-colors">{team.name}</h3>
                                            <span className="text-xs font-bold opacity-50">{team.count} / 15</span>
                                        </div>
                                        <div className="h-1 bg-gray-50 w-full relative">
                                            <div className="absolute top-0 left-0 h-full bg-[var(--color-text)] group-hover:bg-[var(--color-accent)] transition-all" style={{ width: `${(team.count / 15) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">Top Collaborators</h3>
                            <div className="flex -space-x-2 mb-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <Avatar key={i} className="w-10 h-10 border-2 border-white hover:z-10 transition-all cursor-pointer relative overflow-hidden rounded-none shadow-sm">
                                        <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 14}`} className="rounded-none object-cover" />
                                        <AvatarFallback className="rounded-none">C{i}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <Button className="w-full py-6 bg-[var(--color-text)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-sm rounded-none">
                                Connect
                            </Button>
                        </div>
                    </div>

                    {/* Sticky Professional Networking Content */}
                    <div className="sticky top-6 bg-white border border-[var(--color-surface)] p-6 shadow-sm text-[var(--color-text)]">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1] mb-4">Recommended for You</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Senior Design Architect", company: "Meta", location: "Menlo Park" },
                                { title: "Principal Product Lead", company: "UniteX", location: "Remote" }
                            ].map((job, i) => (
                                <div key={i} className="group cursor-pointer pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <h4 className="text-[11px] font-bold uppercase group-hover:text-[#6366f1] transition-colors">{job.title}</h4>
                                    <p className="text-[9px] text-gray-400 font-medium mt-1">{job.company} • {job.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Profile;
