import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PostCard, { Post } from '@/components/PostCard';
import CreatePost, { CreatePostMedia } from '@/components/CreatePost';
import { UnifiedProfileCard } from '@/components/UnifiedProfileCard';
import { TrendingUp, Users, Zap, ArrowUpRight, Image as ImageIcon, Link, Plus, Rocket, UserPlus, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { subscribeToRealtimePosts, createRealtimePost } from '@/lib/rtdb';
import { calculateRankScore, calculateTrendingVelocity, generateNicheVector } from '@/lib/intelligence';
import { getUser, updateUser, createNotification } from '@/lib/firestore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';



function Home() {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [activeSort, setActiveSort] = useState('new');
    const [feedType, setFeedType] = useState('for-you');
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            getUser(currentUser.uid).then((data: any) => {
                if (data) {
                    setUserData(data);
                    if (data.onboardingCompleted === false || data.hasSeenCredentials === false) {
                        navigate('/onboarding');
                    }
                }
            });
        }
    }, [currentUser, navigate]);

    // Subscribe to live Realtime Database posts
    useEffect(() => {
        const unsub = subscribeToRealtimePosts((livePosts) => {
            if (livePosts.length > 0) {
                setPosts(livePosts as Post[]);
            }
        });
        return () => unsub();
    }, []);

    // Simulated User Niche Vector for the Relevance Engine
    const userVector = React.useMemo(() => generateNicheVector(['Frontend', 'React', 'AI/ML']), []);

    // Apply 12-Layer Algorithmic Sorting 
    const sortedPosts = React.useMemo(() => {
        const now = Date.now();
        let postsToSort = [...posts];

        if (activeSort === 'hot') {
            // Apply Trending Velocity Algorithm
            postsToSort.sort((a, b) => {
                const velA = calculateTrendingVelocity(
                    { postNicheVector: a.ai?.tags ? generateNicheVector(a.ai.tags) : [], qScore: a.ai?.qualityScore || 50, interactions: a.stats, authorVp: 100, createdAtMillis: a.createdAtMillis || now },
                    { likes: Math.floor(a.stats.likes / 2), comments: Math.floor(a.stats.comments / 2), shares: 0 },
                    now
                );
                const velB = calculateTrendingVelocity(
                    { postNicheVector: b.ai?.tags ? generateNicheVector(b.ai.tags) : [], qScore: b.ai?.qualityScore || 50, interactions: b.stats, authorVp: 100, createdAtMillis: b.createdAtMillis || now },
                    { likes: Math.floor(b.stats.likes / 2), comments: Math.floor(b.stats.comments / 2), shares: 0 },
                    now
                );
                return velB - velA;
            });
        } else if (activeSort === 'top') {
            // Apply 'For You' Relevance Algorithm
            postsToSort.sort((a, b) => {
                const rankA = calculateRankScore(
                    userVector,
                    { postNicheVector: a.ai?.tags ? generateNicheVector(a.ai.tags) : [], qScore: a.ai?.qualityScore || 50, interactions: a.stats, authorVp: 500, createdAtMillis: a.createdAtMillis || now },
                    now
                );
                const rankB = calculateRankScore(
                    userVector,
                    { postNicheVector: b.ai?.tags ? generateNicheVector(b.ai.tags) : [], qScore: b.ai?.qualityScore || 50, interactions: b.stats, authorVp: 500, createdAtMillis: b.createdAtMillis || now },
                    now
                );
                return rankB - rankA;
            });
        }
        // 'new' relies on the default order returned by subscribeToRealtimePosts
        
        return postsToSort;
    }, [posts, activeSort, userVector]);

    const handleCreatePost = async (content: string, label: string | null, media?: CreatePostMedia) => {
        setIsPostDialogOpen(false);
        try {
            await createRealtimePost({
                uid: currentUser?.uid || 'anonymous',
                displayName: userData?.displayName || currentUser?.displayName || 'Anonymous',
                photoURL: userData?.photoURL || currentUser?.photoURL || '',
                role: 'Member',
                content,
                mediaURL: media ? media.url : undefined,
            });
            await createNotification({
                recipientUid: currentUser?.uid || 'anonymous',
                senderUid: 'system',
                senderName: 'UniteX Intelligence',
                type: 'system',
                content: `Your post has been analyzed and routed to the network.`,
                actionUrl: '/'
            });
            toast.success("Post published successfully");
        } catch (err) {
            console.error('Failed to create post:', err);
            // Optimistic fallback
            const newPost: Post = {
                id: Date.now().toString(),
                author: {
                    id: currentUser?.uid || 'anon',
                    name: userData?.displayName || currentUser?.displayName || 'Anonymous',
                    role: 'Member',
                    avatar: userData?.photoURL || currentUser?.photoURL || ''
                },
                timestamp: 'Just now',
                content,
                label: label ? (label as Post['label']) : undefined,
                media: media ? { type: media.type, url: media.url } : undefined,
                stats: { likes: 0, support: 0, comments: 0, shares: 0 }
            };
            setPosts(prev => [newPost, ...prev]);
        }
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
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_8.5fr_2.5fr] gap-6 w-full max-w-full px-0.5 lg:px-0.5 pt-1 pb-8 mx-auto">
            {/* Right Sidebar - Profile & Stats + Connections (2.5/12 approx) */}
            <aside className="hidden lg:flex flex-col gap-6 sticky top-2 h-[calc(100vh-2rem)] overflow-y-auto pr-2 no-scrollbar pb-10">
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
                            { id: 'liam-oconnor', name: "Liam O'Connor", role: "Game DevOps", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" }
                        ].map((person, i) => (
                            <NavLink key={i} to={`/profile/${person.id}`} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="h-8 w-8 rounded-none border border-gray-100 shrink-0">
                                        <AvatarImage src={person.avatar} />
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
            <main className="flex flex-col gap-6">
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
                            <AvatarImage src={userData?.photoURL || currentUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} />
                            <AvatarFallback>{(userData?.displayName || currentUser?.displayName || 'U').charAt(0).toUpperCase()}</AvatarFallback>
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
                        {(feedType === 'for-you' ? sortedPosts : []).map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}

                    </div>
                </div>
            </main>

            {/* Left Sidebar - Recommendations & Trending (2.5/12 approx) */}
            <aside className="hidden lg:flex flex-col gap-6 sticky top-2 h-[calc(100vh-2rem)] overflow-y-auto pr-2 no-scrollbar pb-10">
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
                            { id: 'dr-connor', title: "Mesh Protocols", creator: "Dr. Connor", type: "Core Architecture" }
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
                        {TRENDING_TOPICS.slice(0, 3).map((topic) => (
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
                                        <AvatarImage src={community.logo} />
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

            </aside>

        </div>
    );
}

export default Home;
