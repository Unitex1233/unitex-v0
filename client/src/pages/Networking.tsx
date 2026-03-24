import { useState, useEffect } from 'react';
import {
    Shield, Zap, Star, Activity,
    Check, X, MessageSquare, User,
    Hexagon, Target, Sparkles, UserPlus, Eye,
    MoreHorizontal, Users
} from 'lucide-react';
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../components/ui/empty'
import { Field } from '../components/ui/field'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils';
import { NavLink } from 'react-router-dom';

// Shared "Character" Data Structure
interface CharacterProfile {
    id: string;
    name: string;
    role: string;
    difficulty: 'Novice' | 'Intermediate' | 'Expert'; // Difficulty Level
    image: string;
    stats: {
        winRate: string; // Metaphor for Success Rate / Engagement
        matches: string; // Metaphor for Projects / Posts
        reputation: string; // Metaphor for Followers
    };
    abilities: { icon: any; label: string }[]; // Skills
    bio: string; // Playstyle
    story: string; // Background
    initials: string;
}

const INITIAL_DISCOVERY: CharacterProfile[] = [
    {
        id: "alex-thorne",
        name: "Alex Thorne",
        initials: "AT",
        role: "Startup Founder",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "95%", matches: "4.5k", reputation: "Titan" },
        abilities: [
            { icon: Target, label: "Growth" },
            { icon: Zap, label: "Scale" },
            { icon: Shield, label: "Strategy" }
        ],
        bio: "High-velocity founder seeking technical co-founders. Specializes in rapid market penetration.",
        story: "Alex exited his last SaaS company for $50M. He is now building a decentralized identity platform."
    },
    {
        id: "priya-patel",
        name: "Priya Patel",
        initials: "PP",
        role: "Full Stack Dev",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "90%", matches: "560", reputation: "Diamond" },
        abilities: [
            { icon: Hexagon, label: "Node" },
            { icon: Activity, label: "APIs" },
            { icon: Eye, label: "React" }
        ],
        bio: "Versatile engineer who bridges the gap between complex backends and smooth frontends.",
        story: "Priya contributes heavily to open source. She is looking for a team that values code quality and mentorship."
    },
    {
        id: "liam-oconnor",
        name: "Liam O'Connor",
        initials: "LO",
        role: "Game DevOps",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "99%", matches: "3.2k", reputation: "Legend" },
        abilities: [
            { icon: Target, label: "CI/CD" },
            { icon: Shield, label: "Infra" },
            { icon: Zap, label: "C++" }
        ],
        bio: "Infrastructure wizard ensuring zero downtime for massive multiplayer environments.",
        story: "Liam managed the servers for a top 10 MMO. He's now consulting for indie studios scaling up."
    },
    {
        id: "sasha-ivanov",
        name: "Sasha Ivanov",
        initials: "SI",
        role: "Security Researcher",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "97%", matches: "1.2k", reputation: "Guardian" },
        abilities: [
            { icon: Shield, label: "PenTesting" },
            { icon: Zap, label: "Exploits" },
            { icon: Hexagon, label: "Rust" }
        ],
        bio: "Ex-whitehat hacker now building bulletproof authentication protocols for the Alliance.",
        story: "Sasha discovered a zero-day in a major cloud provider. He now leads some of the most secure projects on the platform."
    },
    {
        id: "maya-lin",
        name: "Maya Lin",
        initials: "ML",
        role: "UX Architect",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "92%", matches: "430", reputation: "Artisan" },
        abilities: [
            { icon: Eye, label: "Flows" },
            { icon: Target, label: "Metrics" },
            { icon: Sparkles, label: "Framer" }
        ],
        bio: "Designing interfaces that aren't just usable, but addictive. Specializes in hyper-fast interactions.",
        story: "Maya previously worked at a top gaming studio. She's now applying game-design principles to productivity software."
    }
];

const INITIAL_REQUESTS: CharacterProfile[] = [
    {
        id: "elena-fisher",
        name: "Elena Fisher",
        initials: "EF",
        role: "Product Designer",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "98%", matches: "1.2k", reputation: "Diamond" },
        abilities: [
            { icon: Hexagon, label: "Systems" },
            { icon: Zap, label: "Prototyping" },
            { icon: Eye, label: "Visuals" }
        ],
        bio: "A high-precision designer who excels at complex system architecture. Balances speed with pixel-perfect execution.",
        story: "Formerly lead design at TechGiant, Elena moved to freelance to pursue experimental UI patterns. She is looking for collaborators on a new fintech engine."
    },
    {
        id: "david-chen",
        name: "David Chen",
        initials: "DC",
        role: "Solutions Architect",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "92%", matches: "850", reputation: "Platinum" },
        abilities: [
            { icon: Shield, label: "Security" },
            { icon: Target, label: "Scalability" },
            { icon: Activity, label: "Perf" }
        ],
        bio: "Strategic builder focusing on robust backend infrastructures. great at tanking heavy traffic loads.",
        story: "David spent 5 years optimizing cloud clusters. He now mentors junior devs and builds open-source tools for load balancing."
    },
    {
        id: "zoe-wang",
        name: "Zoe Wang",
        initials: "ZW",
        role: "Contract Engineer",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "91%", matches: "210", reputation: "Gold" },
        abilities: [
            { icon: Zap, label: "Solidity" },
            { icon: Shield, label: "Audit" },
            { icon: Activity, label: "Web3" }
        ],
        bio: "Specialist in smart contract security and DeFi protocol architecture.",
        story: "Zoe has audited some of the largest liquidity pools in the space. She's looking to join a DAO-governed project."
    }
];

const INITIAL_NETWORK: CharacterProfile[] = [
    {
        id: "sarah-jenkins",
        name: "Sarah Jenkins",
        initials: "SJ",
        role: "Creative Director",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "99%", matches: "2.1k", reputation: "Legend" },
        abilities: [
            { icon: Star, label: "Brand" },
            { icon: Sparkles, label: "Motion" },
            { icon: User, label: "Leadership" }
        ],
        bio: "Visionary leader who transforms abstract concepts into compelling visual narratives. strong team buffer.",
        story: "Sarah has led campaigns for global brands. She is currently exploring the intersection of AR and traditional advertising."
    },
    {
        id: "marcus-reed",
        name: "Marcus Reed",
        initials: "MR",
        role: "Frontend Specialist",
        difficulty: "Novice",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "88%", matches: "320", reputation: "Gold" },
        abilities: [
            { icon: Zap, label: "React" },
            { icon: Activity, label: "Perf" },
            { icon: Hexagon, label: "CSS" }
        ],
        bio: "Agile developer with a focus on micro-interactions and smooth state management.",
        story: "Marcus is a self-taught prodigy who won three hackathons last year. He's looking to join a high-velocity startup."
    },
    {
        id: "jordan-smith",
        name: "Jordan Smith",
        initials: "JS",
        role: "AI Scientist",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "96%", matches: "120", reputation: "Titan" },
        abilities: [
            { icon: Sparkles, label: "LLMs" },
            { icon: Target, label: "Training" },
            { icon: Shield, label: "Safety" }
        ],
        bio: "Specializing in alignment and prompt architecture. Turning black boxes into reliable tools.",
        story: "Jordan lead the research for a top open source model. Now he is building an AI-first coding assistant."
    },
    {
        id: "nina-vo",
        name: "Nina Vo",
        initials: "NV",
        role: "UI Engineer",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "94%", matches: "890", reputation: "Diamond" },
        abilities: [
            { icon: Eye, label: "Design" },
            { icon: Zap, label: "Three.js" },
            { icon: Activity, label: "Physics" }
        ],
        bio: "Crafting tactile digital experiences that feel physical. Expert in bespoke animations.",
        story: "Nina worked on high-end luxury brand websites. She's now open to innovative fintech projects."
    },
    {
        id: "kenji-tanaka",
        name: "Kenji Tanaka",
        initials: "KT",
        role: "Product Lead",
        difficulty: "Expert",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "96%", matches: "1.5k", reputation: "Elite" },
        abilities: [
            { icon: Target, label: "Roadmaps" },
            { icon: Users, label: "Mentoring" },
            { icon: Star, label: "Strategy" }
        ],
        bio: "Leading cross-functional teams to build products that define markets. Obsessed with velocity.",
        story: "Kenji scaled his previous startup from 0 to 1M users in 12 months. He's looking for the next big challenge."
    },
    {
        id: "elena-vasquez",
        name: "Elena Vasquez",
        initials: "EV",
        role: "Growth Marketer",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
        stats: { winRate: "93%", matches: "620", reputation: "Catalyst" },
        abilities: [
            { icon: Zap, label: "Virality" },
            { icon: Target, label: "Funnels" },
            { icon: Activity, label: "Analysis" }
        ],
        bio: "Turning early-stage projects into global names through data-driven growth loops.",
        story: "Elena leads growth for some of the most prominent projects in the Alliance. She's an expert at finding the 'magic' in a product."
    }
];

function Networking() {
    const [activeTab, setActiveTab] = useState<'discovery' | 'requests' | 'network'>('discovery');
    const [discoveryList, setDiscoveryList] = useState<CharacterProfile[]>([]);
    const [requestsList, setRequestsList] = useState<CharacterProfile[]>([]);
    const [networkList, setNetworkList] = useState<CharacterProfile[]>([]);

    useEffect(() => {
        setDiscoveryList(INITIAL_DISCOVERY);
        setRequestsList(INITIAL_REQUESTS);
        setNetworkList(INITIAL_NETWORK);
    }, []);

    const handleConnect = (profile: CharacterProfile) => {
        setDiscoveryList(prev => prev.filter(p => p.id !== profile.id));
        setRequestsList(prev => [profile, ...prev]);
        // Note: In a real app, this would be a "sent" request, but we'll mock it for now
    };

    const handleAccept = (profile: CharacterProfile) => {
        setRequestsList(prev => prev.filter(p => p.id !== profile.id));
        setNetworkList(prev => [profile, ...prev]);
    };

    const handleReject = (id: string) => {
        setRequestsList(prev => prev.filter(p => p.id !== id));
    };

    // Helper to get ability icon
    const AbilityIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
        <div className="flex flex-col items-center gap-1 group/icon cursor-default relative">
            <div className="w-8 h-8 rounded-none bg-[var(--color-surface)] flex items-center justify-center border border-transparent group-hover/icon:border-[var(--color-accent)] group-hover/icon:bg-[var(--color-accent)]/10 transition-all duration-300">
                <Icon size={14} className="text-[var(--color-text)] group-hover/icon:text-[var(--color-accent)]" />
            </div>
            {/* Tooltip-like label on hover for cleaner look */}
            <span className="hidden group-hover/icon:block absolute bottom-full mb-2 text-[9px] font-bold uppercase bg-black text-white px-2 py-1 rounded-none tracking-widest whitespace-nowrap z-10 animate-in fade-in slide-in-from-bottom-1 pointer-events-none">
                {label}
            </span>
        </div>
    );


    let activeList = discoveryList;
    if (activeTab === 'requests') activeList = requestsList;
    if (activeTab === 'network') activeList = networkList;

    return (
        <div className="pt-6 pb-20 max-w-7xl mx-auto px-4 md:px-8">
            <header className="mb-6 border-b border-[var(--color-surface)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-text)] uppercase leading-none mb-2">
                        Roster
                    </h1>
                    <p className="text-xs md:text-sm text-[var(--color-text)] opacity-60 font-mono uppercase tracking-widest">
                        Manage your Alliance
                    </p>
                </div>

                {/* Tab Switcher - Now styled as a segmented control for a tighter feel */}
                <div className="flex bg-[var(--color-surface)]/30 p-1 rounded-none">
                    {['discovery', 'requests', 'network'].map((tab) => (
                        <button
                            key={tab}
                            className={cn(
                                "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-none transition-all duration-300",
                                activeTab === tab
                                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                                    : "text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-white/50"
                            )}
                            onClick={() => setActiveTab(tab as any)}
                        >
                            {tab === 'network' ? 'My Network' : tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* View Content */}
            {activeTab === 'discovery' ? (
                // Compact Card Grid for Discovery
                activeList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeList.map(char => (
                            <div key={char.id} className="flex flex-col h-[480px] border border-[var(--color-surface)] bg-white group hover:border-[var(--color-text)] transition-all duration-300 rounded-none overflow-hidden relative shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">


                                <NavLink to={`/profile/${char.id}`} className="h-[48%] relative overflow-hidden bg-[var(--color-text)] block">
                                    <img src={char.image} alt={char.name} className="w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text)] via-transparent to-transparent" />

                                    <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-2 duration-500">
                                        <h2 className="text-xl font-bold text-white uppercase tracking-tight leading-none mb-1 drop-shadow-md">
                                            {char.name}
                                        </h2>
                                        <p className="text-white/80 font-mono text-[10px] uppercase tracking-wider bg-[var(--color-text)] inline-block px-2 py-1">
                                            {char.role}
                                        </p>
                                    </div>
                                </NavLink>

                                {/* 2. Character Information Zone (Bottom) */}
                                <div className="h-[52%] flex flex-col p-5 relative bg-white">
                                    <div className="flex-grow">
                                        {/* Stats Mini-Bar */}
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--color-surface)]">
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1 text-[var(--color-accent)]" title="Win Rate">
                                                    <Target size={12} />
                                                    <span className="text-xs font-bold font-mono">{char.stats.winRate}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[var(--color-text)] opacity-60" title="Matches">
                                                    <Activity size={12} />
                                                    <span className="text-xs font-bold font-mono">{char.stats.matches}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-[var(--color-surface)] px-2 py-1 border border-transparent">
                                                <Hexagon size={10} className="text-[var(--color-text)]" />
                                                <span className="text-[9px] font-bold text-[var(--color-text)] uppercase tracking-wider">{char.difficulty}</span>
                                            </div>
                                        </div>

                                        <p className="text-[11px] leading-relaxed text-[var(--color-text)] mb-6 line-clamp-3 font-medium opacity-80">
                                            {char.bio}
                                        </p>

                                        <div className="flex gap-2 mt-auto">
                                            {char.abilities.map((ability, i) => (
                                                <AbilityIcon key={i} icon={ability.icon} label={ability.label} />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleConnect(char)}
                                        className="w-full h-10 mt-6 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-none border border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                    >
                                        <UserPlus size={14} /> Connect
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Search />
                            </EmptyMedia>
                            <EmptyTitle>No Profiles Found</EmptyTitle>
                            <EmptyDescription>
                                There are no profiles matching your current criteria in Discovery.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )
            ) : (
                // LIST View for Requests and Network utilizing Avatars
                activeList.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {activeList.map(char => (
                            <div key={char.id} className="flex items-center p-4 bg-white border border-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all duration-300 rounded-none group hover:shadow-sm">
                                <NavLink to={`/profile/${char.id}`} className="mr-4 shrink-0">
                                    <Avatar className="h-14 w-14 border border-[var(--color-surface)] shadow-sm rounded-none">
                                        <AvatarImage src={char.image} alt={char.name} className="rounded-none" />
                                        <AvatarFallback className="rounded-none">{char.initials}</AvatarFallback>
                                    </Avatar>
                                </NavLink>

                                {/* Info */}
                                <div className="flex-grow min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <NavLink to={`/profile/${char.id}`}>
                                            <h3 className="text-base font-bold text-[var(--color-text)] uppercase tracking-tight truncate group-hover:text-[var(--color-accent)] transition-colors">
                                                {char.name}
                                            </h3>
                                        </NavLink>
                                        {activeTab === 'network' && (
                                            <div className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-100 rounded-none">
                                                <span className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                                                Online
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text)] opacity-60 font-mono uppercase tracking-wide truncate mb-2">
                                        {char.role}
                                    </p>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <Target size={10} className="text-[var(--color-accent)]" />
                                            {char.stats.winRate} WR
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <Activity size={10} className="text-blue-500" />
                                            {char.stats.matches} Matches
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    {activeTab === 'requests' ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReject(char.id)}
                                                className="h-8 w-8 flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-none transition-colors text-gray-400" title="Reject"
                                            >
                                                <X size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleAccept(char)}
                                                className="h-8 w-8 flex items-center justify-center bg-[var(--color-text)] hover:bg-[var(--color-accent)] text-white rounded-none transition-colors shadow-sm" title="Accept"
                                            >
                                                <Check size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button className="px-3 h-8 border border-gray-200 hover:border-[var(--color-text)] hover:bg-gray-50 text-[9px] font-bold uppercase tracking-wider rounded-none transition-colors flex items-center gap-2">
                                                <MessageSquare size={12} />
                                                <span className="hidden sm:inline">Message</span>
                                            </button>
                                            <button className="h-8 w-8 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-none transition-colors text-gray-400 hover:text-[var(--color-text)]">
                                                <MoreHorizontal size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div >
                        ))
                        }
                    </div >
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                {activeTab === 'requests' ? <UserPlus /> : <Users />}
                            </EmptyMedia>
                            <EmptyTitle>
                                {activeTab === 'requests' ? 'No Pending Requests' : 'Your Network is Empty'}
                            </EmptyTitle>
                            <EmptyDescription>
                                {activeTab === 'requests'
                                    ? "You're all caught up! Check back later for new connection requests."
                                    : "You haven't connected with anyone yet. Go to Discovery to find people."}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )
            )}
        </div >
    );
}

export default Networking;
