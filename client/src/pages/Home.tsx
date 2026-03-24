import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PostCard, { Post } from '@/components/PostCard';
import CreatePost, { CreatePostMedia } from '@/components/CreatePost';
import { UnifiedProfileCard } from '@/components/UnifiedProfileCard';
import { TrendingUp, Users, Zap, ArrowRight, ArrowUpRight, BookOpen, Search, Flame, Clock, Star, Image as ImageIcon, Link, LayoutGrid, Rss, Plus, Rocket, UserPlus, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNotifications } from '@/context/NotificationContext';

// Mock Data representing the "Progress First" Logic
const SAMPLE_POSTS: Post[] = [
    {
        id: '1',
        author: {
            id: 'sarah-connor',
            name: 'Dr. Sarah Connor',
            role: 'Core Architect',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '2h ago',
        content: "Just finalized the neural transition layer for the UniteX project. We're seeing a 40% reduction in latency across all edge nodes. The architectural shift from centralized to mesh-based state is truly paying off. #Engineering #Progress",
        label: 'progress',
        media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop'
        },
        stats: { likes: 124, support: 45, comments: 12 }
    },
    {
        id: 'r1',
        author: {
            id: 'tech-news-bot',
            name: 'Tech News Bot',
            role: 'Aggregator',
            avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '3h ago',
        content: "Latest research on decentralized consensus suggests a move towards 'Wait-Free' data structures for even lower latency. Check out the full breakdown on X.",
        label: 'resource',
        source: {
            platform: 'twitter',
            url: 'https://twitter.com/unitex_dev/status/123456',
            author: '@UniteX_Dev',
            preview: {
                title: 'Wait-Free Consensus in Meshed Networks',
                description: 'How to achieve linearizability without locking in high-density transaction environments.',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop'
            }
        },
        stats: { likes: 89, support: 34, comments: 15 }
    },
    {
        id: '2',
        author: {
            id: 'marcus-reed',
            name: 'Marcus Reed',
            role: 'Infrastructure Lead',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '5h ago',
        content: "Total failure in the Shard-B simulation today. The consensus algorithm collapsed under high-density transactions. It's a setback, but we found a critical race condition. Back to the whiteboard tomorrow. #FailureStory #Learning",
        label: 'failure',
        stats: { likes: 89, support: 156, comments: 34 }
    },
    {
        id: 'd1',
        author: {
            id: 'comm-mod',
            name: 'Community Moderator',
            role: 'Human-Node',
            avatar: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png'
        },
        timestamp: '6h ago',
        content: "Discussion: Are we moving too fast with the mesh-sync implementation? Some nodes are reporting minor drift during peak hours. r/UniteX_Engine",
        label: 'discussion',
        source: {
            platform: 'reddit',
            url: 'https://reddit.com/r/UniteX_Engine/comments/drift',
            author: 'r/UniteX_Engine',
            preview: {
                title: 'Mesh-Sync Drift Issues',
                description: 'Reporting minor state drift in high-latency clusters. Seeking verification.',
            }
        },
        stats: { likes: 234, support: 67, comments: 142 }
    },
    {
        id: '3',
        author: {
            id: 'elena-fisher',
            name: 'Elena Fisher',
            role: 'UI Strategist',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '8h ago',
        content: "Implemented the new high-density notification cards. Focus was on scanability and visceral feedback. The goal is to make the system feel 'alive' without being overwhelming. Check out the latest commit in the Vault. #Design #Success",
        label: 'success',
        media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop'
        },
        stats: { likes: 210, support: 67, comments: 28 }
    },
    {
        id: 'q1',
        author: {
            id: 'alex-chen',
            name: 'Alex Chen',
            role: 'Frontend Dev',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '10h ago',
        content: "Question for the UI experts: How are you handling staggered animations on high-density grids without impacting the frame rate? Seeing some jank on lower-tier nodes.",
        label: 'question',
        stats: { likes: 45, support: 12, comments: 38 }
    },
    {
        id: 'rf1',
        author: {
            id: 'jordan-smith',
            name: 'Jordan Smith',
            role: 'AI Scientist',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '12h ago',
        content: "Reflection: The deeper we go into decentralized state sync, the more I realize that the bottleneck isn't the bandwidth, it's the consensus overhead. We need to rethink how we batch transactions at the edge.",
        label: 'reflection',
        stats: { likes: 156, support: 42, comments: 18 }
    },
    {
        id: 's2',
        author: {
            id: 'kenji-tanaka',
            name: 'Kenji Tanaka',
            role: 'Product Lead',
            avatar: 'https://images.unsplash.com/photo-1542909192-2f2241a99c9d?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '14h ago',
        content: "We just hit 1M nodes on the beta-mesh! This is a massive milestone for the Alliance. Huge thanks to everyone who contributed to the stability over the last month. #Success #Growth",
        label: 'success',
        media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000&auto=format&fit=crop'
        },
        stats: { likes: 1240, support: 842, comments: 234 }
    },
    {
        id: 'r2',
        author: {
            id: 'os-nexus',
            name: 'Open Source Nexus',
            role: 'Bot',
            avatar: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png'
        },
        timestamp: '16h ago',
        content: "The latest 'State of Mesh' report is out on Reddit. A deep dive into regional performance and node health across the globe.",
        label: 'resource',
        source: {
            platform: 'reddit',
            url: 'https://reddit.com/r/UniteX_Engine/comments/state_report',
            author: 'r/UniteX_Engine',
            preview: {
                title: 'State of the Mesh: Q4 Analysis',
                description: 'Detailed metrics on node stability, latencies, and transaction throughput...',
            }
        },
        stats: { likes: 342, support: 12, comments: 45 }
    },
    {
        id: 'd2',
        author: {
            id: 'sasha-ivanov',
            name: 'Sasha Ivanov',
            role: 'Security Researcher',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '18h ago',
        content: "Discussion: What's the best way to handle 'Eclipse Attacks' in a mesh network without forcing centralization?",
        label: 'discussion',
        source: {
            platform: 'twitter',
            url: 'https://twitter.com/sasha_sec/status/789',
            author: '@SashaSec',
            preview: {
                title: 'Eclipse Attack Mitigation Strategies',
                description: 'A thread on decentralized reputation systems and peer-selection logic.',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
            }
        },
        stats: { likes: 567, support: 89, comments: 124 }
    }
];

const FOLLOWING_POSTS: Post[] = [
    {
        id: 'f3',
        author: {
            id: 'reddit-nexus',
            name: 'Reddit Nexus',
            role: 'Forum Aggregator',
            avatar: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png'
        },
        timestamp: '1h ago',
        content: "Discussion: What is the best way to handle global state in a decentralized mesh network? [r/UniteX_Engine]",
        label: 'discussion',
        source: {
            platform: 'reddit',
            url: 'https://reddit.com/r/UniteX_Engine/comments/abc',
            author: 'r/UniteX_Engine',
            preview: {
                title: 'Global State Management Patterns',
                description: 'We are seeing some drift in edge node synchronization during high load...',
            }
        },
        stats: { likes: 456, support: 23, comments: 89 }
    },
    {
        id: 'f1',
        author: {
            id: 'alex-chen',
            name: 'Alex Chen',
            role: 'Frontend Dev',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
        },
        timestamp: '3h ago',
        content: "Testing the new Framer Motion layout transitions. The stack is feeling incredibly fluid. #Development #UI",
        label: 'progress',
        stats: { likes: 45, support: 12, comments: 3 }
    }
];

function Home() {
    const { addNotification } = useNotifications();
    const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
    const [activeSort, setActiveSort] = useState('new');
    const [feedType, setFeedType] = useState('for-you');
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

    const handleCreatePost = (content: string, label: string | null, media?: CreatePostMedia) => {
        const newPost: Post = {
            id: Date.now().toString(),
            author: {
                id: 'alexander-me',
                name: 'Alexander',
                role: 'Product Designer',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
            },
            timestamp: 'Just now',
            content,
            label: label ? (label as Post['label']) : undefined,
            media: media ? { type: media.type, url: media.url } : undefined,
            stats: { likes: 0, support: 0, comments: 0 }
        };
        setPosts(prev => [newPost, ...prev]);
        setIsPostDialogOpen(false);
        addNotification({
            type: 'system',
            content: `Your post has been synchronized to the network.`,
        });
    };

    const TRENDING_TOPICS = [
        { name: "Design Systems", count: "2.4k posts" },
        { name: "UniteX V3", count: "1.8k posts" },
        { name: "Mesh States", count: "956 posts" },
        { name: "Latency Optimization", count: "432 posts" }
    ];

    const COMMUNITIES = [
        { name: "Core Architecture", members: "12.4k", logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=100&auto=format&fit=crop" },
        { name: "Frontend Elites", members: "8.2k", logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=100&auto=format&fit=crop" },
        { name: "UI/UX Strategists", members: "15.7k", logo: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=100&auto=format&fit=crop" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] lg:grid-cols-[2.75fr_8fr_2.75fr] gap-6 w-full max-w-full px-4 lg:px-8 pt-4 pb-8 mx-auto smooth-scroll">
            {/* Mobile-Only Header Section (Search & Carousel) */}
            <div className="flex flex-col gap-6 lg:hidden order-1">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search the network..." 
                        className="w-full bg-white border border-[var(--color-surface)] py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--color-accent)] transition-colors rounded-none"
                    />
                </div>
                
                {/* News & Updates Carousel (Mobile Only) */}
                <div className="bg-white border border-[var(--color-surface)] p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Latest Syncs</h3>
                        <Zap size={14} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                        {[
                            { title: "Silicon Valley Nodes", tag: "Sync" },
                            { title: "Bot Mitigation Live", tag: "Security" },
                            { title: "Quantum Keys Sync", tag: "Protocol" },
                            { title: "Mesh Hackathon Q4", tag: "Event" }
                        ].map((item, i) => (
                            <div key={i} className="min-w-[240px] bg-gray-50 p-4 border border-gray-100 snap-start">
                                <span className="text-[9px] font-bold text-[var(--color-accent)] uppercase tracking-widest">{item.tag}</span>
                                <h4 className="text-sm font-bold mt-1 uppercase tracking-tight">{item.title}</h4>
                                <button className="mt-3 text-[10px] font-bold text-gray-400 hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
                                    VIEW LOGS <ArrowRight size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Profile & Stats + Connections (Desktop/Tablet) */}
            <aside className="hidden md:flex flex-col gap-6 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto pr-2 no-scrollbar pb-10 order-2 lg:order-1">
                <UnifiedProfileCard />

                {/* Recommended Connections */}
                <div className="bg-white border border-[var(--color-surface)] p-4 shadow-sm rounded-none text-[var(--color-text)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400">Recommended connections</h3>
                        <UserPlus size={14} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            { id: 'alex-thorne', name: "Alex Thorne", role: "Startup Founder", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
                            { id: 'priya-patel', name: "Priya Patel", role: "Full Stack Dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
                            { id: 'liam-oconnor', name: "Liam O'Connor", role: "Game DevOps", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
                            { id: 'sarah-jenkins', name: "Sarah Jenkins", role: "Cloud Arc", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop" }
                        ].map((person, i) => (
                            <NavLink key={i} to={`/profile/${person.id}`} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="h-8 w-8 rounded-none border border-gray-100 shrink-0">
                                        <AvatarImage src={person.avatar} loading="lazy" />
                                        <AvatarFallback className="text-[10px] font-bold bg-black text-white rounded-none">{person.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-xs font-bold capitalize tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{person.name}</div>
                                        <div className="text-[10px] text-gray-400 font-mono capitalize tracking-wider">{person.role}</div>
                                    </div>
                                </div>
                                <Plus size={13} className="text-gray-300 group-hover:text-[var(--color-accent)] transition-colors" />
                            </NavLink>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-1.5 text-[10px] font-bold capitalize tracking-wider text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors border border-[var(--color-accent)]/20 rounded-none">Find more people</button>
                </div>
            </aside>

            {/* Main Feed - Center Column (8/13 approx) */}
            <main className="flex flex-col gap-6 order-3 lg:order-2">
                {/* Feed Controls - Non-sticky */}
                <div className="bg-white border border-[var(--color-surface)] flex px-0 shadow-sm rounded-none">
                    <div className="flex w-full">
                        <button
                            onClick={() => setFeedType('for-you')}
                            className={cn(
                                "flex-1 py-3 text-sm font-bold capitalize tracking-tight transition-all relative border-r border-[var(--color-surface)]",
                                feedType === 'for-you' ? "bg-gray-50 text-[var(--color-text)]" : "bg-white text-gray-400 hover:text-[var(--color-text)] hover:bg-gray-50"
                            )}>
                            For you
                        </button>
                        <button
                            onClick={() => setFeedType('following')}
                            className={cn(
                                "flex-1 py-3 text-sm font-bold capitalize tracking-tight transition-all relative",
                                feedType === 'following' ? "bg-gray-50 text-[var(--color-text)]" : "bg-white text-gray-400 hover:text-[var(--color-text)] hover:bg-gray-50"
                            )}>
                            Following
                        </button>
                    </div>
                </div>

                {/* Create Post Interface */}
                <div className="bg-white border border-[var(--color-surface)] p-4 flex flex-col gap-4 shadow-sm rounded-none">
                    <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border border-gray-100 rounded-none shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" loading="lazy" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                            <DialogTrigger asChild>
                                <input
                                    type="text"
                                    placeholder="Start a post..."
                                    className="flex-1 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white px-3 py-1.5 text-xs text-[var(--color-text)] transition-all cursor-pointer outline-none font-medium rounded-none"
                                    readOnly
                                />
                            </DialogTrigger>
                            <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-2xl">
                                <DialogTitle className="sr-only">Create New Post</DialogTitle>
                                <DialogDescription className="sr-only">Share your progress with the community.</DialogDescription>
                                <CreatePost initialExpanded={true} onPost={handleCreatePost} />
                            </DialogContent>
                        </Dialog>
                        <div className="flex gap-1">
                            <button onClick={() => setIsPostDialogOpen(true)} className="p-2 text-gray-400 hover:text-[var(--color-accent)] hover:bg-gray-50 transition-all group rounded-none" title="Upload Media">
                                <ImageIcon size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-[var(--color-accent)] hover:bg-gray-50 transition-all group rounded-none" title="Add Link">
                                <Link size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Post Feed */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row items-end justify-between px-1 mb-2 gap-4 border-b border-[var(--color-surface)] pb-2">
                        <div className="flex items-center gap-3 text-[var(--color-text)]">
                            <Activity size={24} className="text-[var(--color-accent)]" />
                            <h2 className="text-xl font-bold capitalize tracking-wider leading-none">Activity log</h2>
                        </div>
                        <div className="flex items-center p-0.5 bg-white border border-[var(--color-surface)] shadow-sm rounded-none">
                            {['new', 'hot', 'top'].map((sort) => (
                                <button
                                    key={sort}
                                    onClick={() => setActiveSort(sort)}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-bold capitalize tracking-wider transition-all rounded-none",
                                        activeSort === sort
                                            ? "bg-[var(--color-text)] text-white"
                                            : "text-gray-400 hover:text-[var(--color-text)] hover:bg-gray-100"
                                    )}>
                                    {sort === 'new' ? 'Recent' : sort}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feed Content */}
                    <div className="flex flex-col gap-2">
                        {(feedType === 'for-you' ? posts : FOLLOWING_POSTS).map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                        {/* End of Feed Sentinel */}
                        <div className="py-8 flex flex-col items-center justify-center border-t border-[var(--color-surface)] mt-4">
                            <Zap size={32} className="text-gray-100 mb-4" />
                            <p className="text-xs font-mono text-gray-400 capitalize tracking-wider">End of transmission.</p>
                            <button className="mt-4 text-xs font-bold text-[var(--color-accent)] capitalize tracking-tight hover:underline">Return to top</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Left Sidebar - Recommendations & Trending (Desktop only or Mobile Stack) */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-y-auto pr-2 no-scrollbar pb-10 order-4 lg:order-3">
                {/* Recommended Projects (4 items) */}
                {/* Recommended Projects */}
                <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm rounded-none">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400">Recommended projects</h3>
                        <Rocket size={16} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 'sarah-jenkins', title: "Quantum State Sync", creator: "Sarah Jenkins", type: "Infrastructure" },
                            { id: 'nina-vo', title: "Bespoke Animations", creator: "Nina Vo", type: "UI/UX" },
                            { id: 'dr-connor', title: "Mesh Protocols", creator: "Dr. Connor", type: "Core Architecture" },
                            { id: 'marcus-r', title: "Shard Simulations", creator: "Marcus Reed", type: "Infra" }
                        ].map((project, i) => (
                            <NavLink key={i} to={`/profile/${project.id}`} className="group cursor-pointer block">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-bold capitalize tracking-tight group-hover:text-[var(--color-accent)] transition-colors">{project.title}</h4>
                                    <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[var(--color-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 capitalize tracking-wider">
                                    <span>{project.creator}</span>
                                    <span className="w-1 h-px bg-gray-200"></span>
                                    <span>{project.type}</span>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-xs font-bold capitalize tracking-wider text-gray-400 hover:text-[var(--color-text)] hover:bg-gray-50 transition-colors border border-gray-100 rounded-none">Browse all projects</button>
                </div>

                {/* Trending */}
                <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm rounded-none text-[var(--color-text)]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400">Trending now</h3>
                        <TrendingUp size={16} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="flex flex-col gap-5">
                        {TRENDING_TOPICS.map((topic) => (
                            <div key={topic.name} className="group cursor-pointer">
                                <div className="text-[10px] font-mono text-gray-400 capitalize tracking-wider mb-1 group-hover:text-[var(--color-accent)] transition-colors">Trending in Architecture</div>
                                <div className="text-sm font-bold capitalize tracking-tight text-[var(--color-text)] mb-1">#{topic.name.replace(/\s+/g, '')}</div>
                                <div className="text-xs text-gray-400 font-medium capitalize tracking-normal">{topic.count} posts</div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-xs font-bold capitalize tracking-wider text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors border border-[var(--color-accent)]/20 rounded-none">Show more</button>
                </div>

                {/* Recommended Communities */}
                <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm rounded-none text-[var(--color-text)]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400">Recommended communities</h3>
                        <Users size={16} className="text-[var(--color-accent)]" />
                    </div>
                    <div className="flex flex-col gap-5">
                        {COMMUNITIES.map((community) => (
                            <div key={community.name} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 rounded-none border border-gray-100 shrink-0">
                                        <AvatarImage src={community.logo} loading="lazy" />
                                        <AvatarFallback className="text-[10px] font-bold bg-black text-white rounded-none">{community.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-sm font-bold capitalize tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">c/{community.name.toLowerCase().replace(/\s+/g, '')}</div>
                                        <div className="text-xs text-gray-400 font-mono capitalize tracking-wider">{community.members} nodes</div>
                                    </div>
                                </div>
                                <Plus size={14} className="text-gray-300 group-hover:text-[var(--color-accent)] transition-colors" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-xs font-bold capitalize tracking-wider text-gray-400 hover:text-[var(--color-text)] hover:bg-gray-50 transition-colors border border-gray-100 rounded-none">Browse all alliances</button>
                </div>

                <div className="mt-auto pt-6 border-t border-[var(--color-surface)] opacity-70">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                        {['About', 'Help', 'Terms', 'Privacy', 'Nodes'].map((link) => (
                            <a key={link} href="#" className="text-[11px] font-bold text-gray-400 capitalize tracking-tight hover:text-[var(--color-accent)] transition-colors">{link}</a>
                        ))}
                    </div>
                    <div className="text-[10px] font-mono text-gray-300 capitalize tracking-wider">© 2024 UniteX network</div>
                </div>
            </aside>
        </div>
    );
}

export default Home;
