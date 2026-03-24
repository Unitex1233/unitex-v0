import { useState } from 'react';
import { MessageSquare, Share2, Heart, HeartHandshake, ExternalLink, AlertTriangle, ArrowRight, MoreHorizontal, RefreshCw, Check, Copy } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


export interface Post {
    id: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
        role?: string;
    };
    content: string;
    timestamp: string;
    label?: string;
    media?: {
        type: 'image' | 'video';
        url: string;
    };
    source?: {
        platform: 'twitter' | 'reddit' | 'instagram' | 'youtube' | 'medium';
        url: string;
        author?: string;
        preview?: {
            title: string;
            description?: string;
            image?: string;
        };
    };
    stats: {
        likes: number;
        support: number;
        comments: number;
    };
    comments?: {
        id: number | string;
        author: string;
        authorId: string;
        avatar?: string;
        text: string;
        time: string;
    }[];
}

interface PostCardProps {
    post: Post;
}

const LABEL_CONFIG = {
    progress: { text: "Progress Update", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    failure: { text: "Failure / Lesson", bg: "bg-rose-50 text-rose-700 border-rose-200" },
    question: { text: "Question", bg: "bg-amber-50 text-amber-700 border-amber-200" },
    resource: { text: "Resource", bg: "bg-sky-50 text-sky-700 border-sky-200" },
    discussion: { text: "Discussion", bg: "bg-violet-50 text-violet-700 border-violet-200" },
    reflection: { text: "Reflection", bg: "bg-slate-50 text-slate-700 border-slate-200" },
    success: { text: "Success Story", bg: "bg-blue-50 text-blue-700 border-blue-200" },
};

const PLATFORM_CONFIG = {
    twitter: { name: "X (Twitter)", color: "bg-black text-white" },
    reddit: { name: "Reddit", color: "bg-orange-500 text-white" },
    instagram: { name: "Instagram", color: "bg-pink-600 text-white" },
    youtube: { name: "YouTube", color: "bg-red-600 text-white" },
    medium: { name: "Medium", color: "bg-black text-white" },
};

function PostCard({ post }: PostCardProps) {
    const labelStyle = post.label && post.label in LABEL_CONFIG
        ? LABEL_CONFIG[post.label as keyof typeof LABEL_CONFIG]
        : post.label
            ? { text: post.label.charAt(0).toUpperCase() + post.label.slice(1), bg: "bg-gray-100 text-gray-700 border-gray-200" }
            : null;
    const sourceStyle = post.source ? PLATFORM_CONFIG[post.source.platform] : null;

    // Interactive state
    const [liked, setLiked] = useState(false);
    const [supported, setSupported] = useState(false);
    const [likeCount, setLikeCount] = useState(post.stats.likes);
    const [supportCount, setSupportCount] = useState(post.stats.support);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState(post.comments || []);
    const [commentCount, setCommentCount] = useState(post.stats.comments);
    const [shared, setShared] = useState(false);

    const handleLike = () => {
        setLiked(prev => {
            const newState = !prev;
            setLikeCount(c => newState ? c + 1 : c - 1);
            return newState;
        });
    };

    const handleSupport = () => {
        setSupported(prev => {
            const newState = !prev;
            setSupportCount(c => newState ? c + 1 : c - 1);
            return newState;
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: `Post by ${post.author.name}`,
            text: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
            url: `${window.location.origin}/post/${post.id}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                setShared(true);
                toast.success("Shared successfully!");
                setTimeout(() => setShared(false), 2000);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            setShared(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setShared(false), 2000);
        } catch {
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            author: 'Alexander',
            authorId: 'alexander-me',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
            text: commentText,
            time: 'Just now',
        };
        setLocalComments(prev => [...prev, newComment]);
        setCommentCount(prev => prev + 1);
        setCommentText('');
    };

    return (
        <div className={`bg-white p-4 md:p-5 border border-[var(--color-surface)] transition-all group relative rounded-none shadow-sm hover:border-[var(--color-accent)]`}>

            {/* Header: Author + Meta */}
            <div className="flex justify-between items-start mb-4">
                <NavLink to={`/profile/${post.author.id}`} className="flex items-center gap-3 group/author">
                    <div className="w-10 h-10 bg-[var(--color-surface)] rounded-none overflow-hidden relative border border-transparent group-hover/author:border-[var(--color-accent)] transition-all">
                        {post.author.avatar && <img src={post.author.avatar} alt={post.author.name} loading="lazy" className="w-full h-full object-cover grayscale group-hover/author:grayscale-0 transition-all duration-500" />}
                        <div className="absolute inset-0 border border-black/5"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[var(--color-text)] capitalize tracking-tight leading-none text-base border-b-2 border-transparent group-hover/author:border-[var(--color-accent)] transition-all">{post.author.name}</h3>
                            {post.author.role && <span className="text-xs capitalize font-mono text-[var(--color-accent)] tracking-wider">{post.author.role}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-[var(--color-text)] opacity-40 font-mono capitalize">{post.timestamp}</p>
                            <span className="w-1 h-px bg-[var(--color-accent)]/30"></span>
                        </div>
                    </div>
                </NavLink>

                <div className="flex items-center gap-2">
                    {/* Top Label (if present) */}
                    {labelStyle && (
                        <span className={`px-2 py-1 text-xs font-bold capitalize tracking-wider border rounded-none ${labelStyle.bg}`}>
                            {labelStyle.text}
                        </span>
                    )}
                    {/* More Menu */}
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface)] text-[var(--color-text)] opacity-40 hover:opacity-100 transition-all rounded-none">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="mb-4 pl-0">
                <p className="text-sm md:text-base leading-relaxed text-[var(--color-text)] font-normal mb-4">
                    {post.content}
                </p>

                {/* Media Attachment */}
                {post.media && (
                    <div className="mb-4 aspect-video w-full bg-[var(--color-surface)] overflow-hidden border border-[var(--color-surface)] rounded-none relative">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all z-10 pointer-events-none"></div>
                        {post.media.type === 'image' ? (
                            <img src={post.media.url} alt="Post attachment" loading="lazy" className="w-full h-full object-contain bg-gray-50 transform group-hover:scale-[1.02] transition-transform duration-700 ease-out" />
                        ) : (
                            <video src={post.media.url} controls className="w-full h-full object-contain bg-black" />
                        )}
                    </div>
                )}

                {/* Rich Link Preview Card */}
                {post.source && sourceStyle && (
                    <a href={post.source.url} target="_blank" rel="noreferrer" className="block group/link rounded-none overflow-hidden border border-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all">
                        <div className="flex flex-col md:flex-row h-auto md:h-32">
                            {/* Preview Image */}
                            {post.source.preview?.image && (
                                <div className="h-48 md:h-full w-full md:w-48 shrink-0 bg-[var(--color-surface)] overflow-hidden relative">
                                    <img src={post.source.preview.image} alt="Link preview" loading="lazy" className="w-full h-full object-cover group-hover/link:scale-110 transition-transform duration-500 grayscale group-hover/link:grayscale-0" />
                                </div>
                            )}

                            {/* Preview Metadata */}
                            <div className="p-4 bg-gray-50 flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-4 h-4 flex items-center justify-center shrink-0 rounded-none text-[10px] ${sourceStyle.color}`}>
                                        <ExternalLink size={8} />
                                    </div>
                                    <span className="text-xs font-bold capitalize tracking-tight text-[var(--color-text)] opacity-60">
                                        {sourceStyle.name}
                                    </span>
                                </div>

                                <h4 className="text-sm font-bold text-[var(--color-text)] group-hover/link:text-[var(--color-accent)] transition-colors line-clamp-1 leading-tight mb-1">
                                    {post.source.preview?.title || post.source.url}
                                </h4>

                                {post.source.preview?.description && (
                                    <p className="text-sm text-[var(--color-text)] opacity-60 line-clamp-1 font-sans">
                                        {post.source.preview.description}
                                    </p>
                                )}
                            </div>
                            <div className="w-8 bg-[var(--color-surface)] group-hover/link:bg-[var(--color-accent)] transition-colors flex items-center justify-center">
                                <ArrowRight size={14} className="text-[var(--color-text)] group-hover/link:text-white -rotate-45 group-hover/link:rotate-0 transition-all duration-300" />
                            </div>
                        </div>
                    </a>
                )}
            </div>

            {/* Interactive Action Bar */}
            <div className="flex items-center justify-start pl-0 pt-3 border-t border-[var(--color-surface)] gap-1">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={cn(
                        "flex flex-col items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors group/btn border border-transparent rounded-none",
                        showComments && "bg-gray-50"
                    )}
                    title="Comments"
                >
                    <MessageSquare size={14} className={cn(
                        "transition-all",
                        showComments ? "text-[var(--color-accent)]" : "text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-[var(--color-accent)]"
                    )} />
                    <span className={cn(
                        "text-[10px] font-mono font-bold capitalize mt-1 transition-all",
                        showComments ? "text-[var(--color-accent)]" : "text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-[var(--color-accent)]"
                    )}>
                        {commentCount} comments
                    </span>
                </button>

                <button
                    onClick={handleLike}
                    className="flex flex-col items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors group/btn border border-transparent rounded-none"
                    title="Like"
                >
                    <Heart size={14} className={cn(
                        "transition-all",
                        liked ? "text-rose-500 fill-rose-500 scale-110" : "text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-rose-500"
                    )} />
                    <span className={cn(
                        "text-[10px] font-mono font-bold capitalize mt-1 transition-all",
                        liked ? "text-rose-500" : "text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-rose-500"
                    )}>
                        {likeCount} likes
                    </span>
                </button>

                <button
                    onClick={handleSupport}
                    className="flex flex-col items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors group/btn border border-transparent rounded-none"
                    title="Support"
                >
                    <HeartHandshake size={14} className={cn(
                        "transition-all",
                        supported ? "text-amber-500 fill-amber-500 scale-110" : "text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-amber-500"
                    )} />
                    <span className={cn(
                        "text-[10px] font-mono font-bold capitalize mt-1 transition-all",
                        supported ? "text-amber-500" : "text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-amber-500"
                    )}>
                        {supportCount} support
                    </span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex flex-col items-center justify-center w-24 h-10 hover:bg-gray-50 transition-colors group/btn border border-transparent rounded-none"
                    title="Share"
                >
                    {shared ? (
                        <>
                            <Check size={14} className="text-emerald-500 transition-all" />
                            <span className="text-[10px] font-mono font-bold capitalize text-emerald-500 mt-1">
                                Link copied!
                            </span>
                        </>
                    ) : (
                        <>
                            <Share2 size={14} className="text-[var(--color-text)] opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-[var(--color-accent)] transition-all" />
                            <span className="text-[10px] font-mono font-bold capitalize text-[var(--color-text)] mt-1 opacity-40 group-hover/btn:opacity-100 group-hover/btn:text-[var(--color-accent)]">
                                Share
                            </span>
                        </>
                    )}
                </button>
            </div>

            {/* Comments Section */}
            <div className={cn("mt-4 pl-0 space-y-4 relative", !showComments && localComments.length === 0 && "hidden")}>
                {showComments && localComments.length > 0 && (
                    <div className="space-y-4">
                        {/* The Connecting Line */}
                        <div className="absolute left-[16px] top-0 bottom-16 w-px bg-gray-200 -z-10" />

                        {localComments.map((c) => (
                            <div key={c.id} className="flex gap-3 relative">
                                <div className="absolute left-[16px] top-[16px] w-3 h-px bg-gray-200" />
                                <div className="w-8 h-8 bg-[var(--color-surface)] shrink-0 overflow-hidden border border-[var(--color-surface)] relative">
                                    {c.avatar && <img src={c.avatar} loading="lazy" className="w-full h-full object-cover grayscale" />}
                                </div>
                                <div className="flex-1 bg-gray-50 p-3 border border-[var(--color-surface)] hover:border-gray-200 transition-colors rounded-none">
                                    <div className="flex justify-between items-center mb-1">
                                        <NavLink to={`/profile/${c.authorId}`} className="text-xs font-bold capitalize tracking-wider border-b border-transparent hover:border-[var(--color-text)] transition-all cursor-pointer">{c.author}</NavLink>
                                        <span className="text-[10px] font-mono text-gray-400">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                                        {c.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Reply Box */}
                {showComments && (
                    <div className="flex gap-3 mt-2 px-1">
                        <div className="w-8 h-8 bg-gray-50 flex items-center justify-center shrink-0 border border-transparent">
                            <MessageSquare size={14} className="text-gray-300" />
                        </div>
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            placeholder="Add a quick reply... (press Enter)"
                            className="flex-1 bg-white border border-gray-100 focus:border-[var(--color-accent)] focus:bg-gray-50 px-4 py-2 text-[10px] font-medium outline-none transition-all placeholder:capitalize placeholder:tracking-tight rounded-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostCard;
