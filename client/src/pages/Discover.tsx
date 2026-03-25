import React from 'react';
import { Search, TrendingUp, Users, Radio, Zap, ArrowUpRight, Clock, Star, MessageSquare, Heart, Share2, MoreHorizontal, Settings, Flame, Globe, Sparkles, Plus, Shield, Cpu, ChevronUp, ChevronDown, CheckCircle2, Navigation, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Carousel } from '@/components/ui/carousel';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// --------------------------------------------------------------------------
// COMPONENT: News Post (Main Feed)
// --------------------------------------------------------------------------
const NewsPost = ({ category, source, time, title, content, image, tags, readTime }: { category: string, source: string, time: string, title: string, content: string, image?: string, tags: string[], readTime: string }) => (
    <div className="bg-white border border-[var(--color-surface)] p-4 md:p-6 shadow-sm rounded-none text-[var(--color-text)] flex flex-col md:flex-row gap-4 group hover:border-gray-300 transition-colors">
        <div className="flex-1 w-full min-w-0 flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                    <Globe className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        <span className="font-bold text-[var(--color-text)] tracking-tight">{category}</span>
                        <span className="w-1 h-px bg-gray-200"></span>
                        <span>{source}</span>
                        <span className="w-1 h-px bg-gray-200"></span>
                        <span>{time}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <h3 className="text-base md:text-lg font-bold text-[var(--color-text)] capitalize tracking-tight leading-snug group-hover:text-[var(--color-accent)] transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal capitalize tracking-tight line-clamp-3">{content}</p>
            </div>

            {image && (
                <div className="mb-4 border border-[var(--color-surface)] rounded-none w-full relative overflow-hidden group/media">
                    <img src={image} alt="Media" className="w-full h-auto max-h-[300px] object-cover mix-blend-multiply group-hover/media:opacity-90 transition-opacity duration-300" />
                </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-surface)]/50">
                <div className="flex gap-2">
                    {tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-500 text-[9px] font-bold uppercase tracking-wider border border-gray-100 rounded-none">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                    <span className="text-xs font-bold capitalize tracking-tight flex items-center gap-1.5"><Clock size={14} />{readTime}</span>
                    <button className="flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors text-xs font-bold capitalize tracking-tight">
                        <Share2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// --------------------------------------------------------------------------
// COMPONENT: Trending Carousel Slide
// --------------------------------------------------------------------------
const TrendingSlide = ({ title, desc, image, tag, linkTo }: { title: string, desc: string, image: string, tag: string, linkTo: string }) => (
    <div 
        className="w-full h-[280px] md:h-[340px] rounded-none relative overflow-hidden group border border-[var(--color-surface)] bg-white hover:border-[var(--color-accent)] transition-all cursor-pointer"
        onClick={() => { window.location.href = linkTo; }}
    >
        <img src={image} alt={title} className="absolute right-0 top-0 w-2/3 md:w-1/2 h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out mix-blend-multiply [mask-image:linear-gradient(to_left,black_50%,transparent_100%)]" />
        
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center bg-gradient-to-r from-white via-white/90 to-transparent w-full md:w-2/3 pointer-events-none">
            <span className="inline-block px-2.5 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-bold capitalize tracking-wider mb-4 w-max border border-[var(--color-accent)]/20 shadow-sm">
                {tag}
            </span>
            <h2 className="text-[var(--color-text)] text-2xl md:text-4xl font-bold leading-tight mb-3 capitalize tracking-tight max-w-lg">
                {title}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-normal max-w-md capitalize tracking-tight mb-6">
                {desc}
            </p>
            <div className="pointer-events-auto">
                <button 
                    onClick={(e) => { e.stopPropagation(); window.location.href = linkTo + "/posts"; }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[var(--color-text)] text-xs font-bold capitalize tracking-wider hover:bg-gray-100 transition-colors rounded-none w-max group/btn border border-[var(--color-surface)] shadow-sm"
                >
                    View Posts
                    <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

// --------------------------------------------------------------------------
// COMPONENT: Right Sidebar Mini-Widget (For You, Popular, etc.)
// --------------------------------------------------------------------------
interface MiniWidgetProps {
    title: string;
    icon: React.ReactNode;
    items: { label: string; sub: string; stat?: string }[];
    linkTo: string;
    className?: string;
}

const MiniWidget = ({ title, icon, items, linkTo, className }: MiniWidgetProps) => (
    <div className={cn("bg-white border border-[var(--color-surface)] p-5 shadow-sm rounded-none text-[var(--color-text)] relative overflow-hidden group/mirror cursor-default shrink-0 flex flex-col justify-between", className)}>
        {/* Windows Widget Mirror Reflection Effect */}
        <div className="absolute top-0 bottom-0 left-[-100%] w-[100%] bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 group-hover/mirror:animate-[shine_1.5s_ease-in-out_infinite] pointer-events-none z-0 mix-blend-overlay group-active/mirror:-translate-x-full transition-all duration-700" style={{ backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(200,200,220,0.4) 40%, rgba(255,255,255,0.6) 50%, rgba(200,200,220,0.4) 60%, transparent 80%)', transform: 'translateX(-150%)' }} />
        
        <style>{`
            @keyframes shine { 0% { transform: translateX(-150%); } 50% { transform: translateX(250%); } 100% { transform: translateX(-150%); } }
        `}</style>

        <div className="relative z-10 transition-transform duration-200 group-active/mirror:scale-[0.98] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-surface)] shrink-0">
                <h3 className="text-xs font-bold capitalize tracking-wider text-[var(--color-text)] flex items-center gap-2">
                    <span className="text-[var(--color-accent)]">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                {items.map((item, i) => (
                    <div key={i} className="group/item cursor-pointer">
                        <div className="text-[10px] font-mono text-gray-400 capitalize tracking-wider mb-1 group-hover/item:text-[var(--color-accent)] transition-colors">{item.sub}</div>
                        <div className="text-xs font-bold text-[var(--color-text)] leading-tight mb-1 group-hover/item:text-[var(--color-accent)] transition-colors line-clamp-2">{item.label}</div>
                        {item.stat && <div className="text-[10px] text-gray-400 font-medium capitalize tracking-normal">{item.stat}</div>}
                    </div>
                ))}
            </div>
            <NavLink to={linkTo} className="block w-full shrink-0 text-center mt-5 py-2 text-xs font-bold capitalize tracking-wider text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors border border-[var(--color-accent)]/20 rounded-none hover:shadow-inner active:scale-95 active:bg-[var(--color-accent)]/10 flex items-center justify-center gap-1">
                View More {title.split(' ')[0]} <span className="opacity-70"><ArrowUpRight size={12}/></span>
            </NavLink>
        </div>
    </div>
);


// --------------------------------------------------------------------------
// MAIN DISCOVER PAGE
// --------------------------------------------------------------------------
export default function Discover() {
    return (
        <div className="max-w-[1536px] mx-auto px-6 pt-2 pb-8">
            {/* Header Area: Improved Hierarchy (Title → Search) */}
            <header className="mb-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-[var(--color-accent)]" size={28} />
                    <h1 className="text-3xl font-bold capitalize tracking-tighter text-[var(--color-text)] leading-none">
                        Discovery Grid
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
                {/* LEFT-MIDDLE MAIN AREA (75% approx) */}
                <div className="lg:col-span-3 flex flex-col gap-6 min-w-0">
                    
                    <div className="space-y-4">
                        {/* Search Bar: Aligned with Carousel Width */}
                        <div className="w-full relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors">
                                <Search size={18} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search the network..." 
                                className="w-full bg-white border border-[var(--color-surface)] rounded-none py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-gray-400 text-[var(--color-text)] shadow-sm"
                            />
                        </div>

                        {/* News Feed Heading (Primary Category Label) */}
                        <div className="flex items-center gap-2 px-1 pb-1">
                            <Globe size={18} className="text-[var(--color-accent)]" />
                            <h2 className="text-xl font-bold capitalize tracking-tight text-[var(--color-text)]">News Feed</h2>
                        </div>
                    </div>
                    
                    {/* HERO CAROUSEL: TRENDING NOW */}
                    <section className="space-y-4">
                        <Carousel.Root autoScroll={true} interval={6000} className="w-full relative group -ml-2">
                            <Carousel.Content className="no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {/* Slide 1 */}
                                <Carousel.Item>
                                    <TrendingSlide 
                                        tag="Global Network" 
                                        title="Silicon Valley nodes break sync barriers" 
                                        desc="Regional operators report 0 latency across coastal sectors." 
                                        image="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200" 
                                        linkTo="/discover/news/silicon-valley"
                                    />
                                </Carousel.Item>
                                {/* Slide 2 */}
                                <Carousel.Item>
                                    <TrendingSlide 
                                        tag="Protocol Security" 
                                        title="Aggressive Bot Mitigation is Live" 
                                        desc="UniteX has escalated its defense protocols against unauthorized crawlers." 
                                        image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200" 
                                        linkTo="/discover/news/bot-mitigation"
                                    />
                                </Carousel.Item>
                                {/* Slide 3 */}
                                <Carousel.Item>
                                    <TrendingSlide 
                                        tag="Architecture" 
                                        title="Next-Gen UI Frameworks" 
                                        desc="The community discusses the transition to new visceral feedback layouts." 
                                        image="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200" 
                                        linkTo="/discover/news/ui-frameworks"
                                    />
                                </Carousel.Item>
                                {/* Slide 4 */}
                                <Carousel.Item>
                                    <TrendingSlide 
                                        tag="Live Event" 
                                        title="Global Mesh Hackathon announced for Q4" 
                                        desc="Compete for a pool of 1 Million Alliance Tokens in building wait-free modules." 
                                        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200" 
                                        linkTo="/discover/events/hackathon"
                                    />
                                </Carousel.Item>
                                {/* Slide 5 */}
                                <Carousel.Item>
                                    <TrendingSlide 
                                        tag="Hardware Update" 
                                        title="Quantum-Resistant Keys pushed to Core" 
                                        desc="Node Operators must update to firmware v3.4 to secure their consensus votes." 
                                        image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" 
                                        linkTo="/discover/news/quantum-keys"
                                    />
                                </Carousel.Item>
                                {/* Slide 6 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Protocol" title="Sub-Wait-Free Logic" desc="A new breakthrough in non-blocking synchronization." image="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200" linkTo="/discover/news/6" />
                                </Carousel.Item>
                                {/* Slide 7 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Hardware" title="Neural Mesh 4.0 Architectures revealed" desc="First decentralized AI-compute layer capable of training billion-parameter models." image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200" linkTo="/discover/news/7" />
                                </Carousel.Item>
                                {/* Slide 8 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Security" title="Zero-Knowledge Proofs hit mainnet" desc="Complete financial privacy is now possible on the Global Mesh." image="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200" linkTo="/discover/news/8" />
                                </Carousel.Item>
                                {/* Slide 9 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Governance" title="Decentralized Autonomous Regions" desc="A new model for physical infrastructure management." image="https://images.unsplash.com/photo-145118753022ef-4127c168cb9a?q=80&w=1200" linkTo="/discover/news/9" />
                                </Carousel.Item>
                                {/* Slide 10 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Tech" title="The end of Centralized Search" desc="Decentralized indexing is making Discovery a communal effort." image="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200" linkTo="/discover/news/10" />
                                </Carousel.Item>
                                {/* Slide 11 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Data" title="1 Exabyte reached on the storage layer" desc="Unprecedented scale for decentralized data storage." image="https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=1200" linkTo="/discover/news/11" />
                                </Carousel.Item>
                                {/* Slide 12 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Culture" title="The Digital Nomad Consensus" desc="Enabling a new generation of borderless contributors." image="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200" linkTo="/discover/news/12" />
                                </Carousel.Item>
                                {/* Slide 13 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="AI" title="Autonomous Agent Economies" desc="Self-sovereign AI agents participating in market consensus protocols." image="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200" linkTo="/discover/news/13" />
                                </Carousel.Item>
                                {/* Slide 14 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Design" title="Minimalist Mesh Interfaces" desc="Reducing cognitive load through intent-based discovery." image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200" linkTo="/discover/news/14" />
                                </Carousel.Item>
                                {/* Slide 15 */}
                                <Carousel.Item>
                                    <TrendingSlide tag="Privacy" title="The Global Privacy Layer (GPL)" desc="New standards for anonymous data sharing." image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200" linkTo="/discover/news/15" />
                                </Carousel.Item>
                            </Carousel.Content>

                            {/* Dots navigation */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-max px-4 py-2 bg-white/50 backdrop-blur-md rounded-none border border-white">
                                <Carousel.Dots count={15} />
                            </div>

                            {/* Arrow Navigation (Always visible for click-based moments, with active scale) */}
                            <Carousel.PrevTrigger className="hidden md:flex border-[var(--color-surface)] bg-white/90 shadow-sm transition-all hover:bg-gray-100 hover:scale-105 active:scale-90 active:bg-gray-200" />
                            <Carousel.NextTrigger className="hidden md:flex border-[var(--color-surface)] bg-white/90 shadow-sm transition-all hover:bg-gray-100 hover:scale-105 active:scale-90 active:bg-gray-200" />
                        </Carousel.Root>
                    </section>

                    {/* TWO COLUMN FEED LAYOUT */}
                    <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-8 items-start">
                        {/* MAIN NEWS FEED (TRANSITIONED FROM DISCOVERY STREAM) */}
                        <section className="space-y-4 pt-2">
                            <div className="flex flex-col gap-4">
                                <NewsPost 
                                    category="Cybersecurity" 
                                    source="Reuters Tech" 
                                    time="2h ago" 
                                    title="Quantum processing breaks current encryption tests" 
                                    content="A major breakthrough in quantum computing has successfully compromised a standard 2048-bit RSA key in under 4 minutes. Node operators are advised to switch to quantum-resistant keys immediately."
                                    readTime="4 min read"
                                    tags={["Breaking", "Security"]}
                                />
                                <NewsPost 
                                    category="Infrastructure" 
                                    source="Net Monitor" 
                                    time="5h ago" 
                                    title="Decentralized storage layer hits 1EB capacity" 
                                    content="The Global Mesh Network has reached a significant milestone. Total storage capacity now exceeds 1 Exabyte (EB), marking the largest decentralized storage system in human history."
                                    readTime="2 min read"
                                    tags={["Milestone", "Mesh"]}
                                />
                                <NewsPost 
                                    category="Alliance Updates" 
                                    source="Gov Council" 
                                    time="12h ago" 
                                    title="New governance voting starts tomorrow" 
                                    content="The proposal for the upcoming network hard-fork (v4.0.1) has been finalized. Voting will begin at 00:00 UTC and will remain open for 72 hours. Your consensus counts."
                                    readTime="1 min read"
                                    tags={["Official", "Vote"]}
                                />
                                <NewsPost 
                                    category="AI Technology" 
                                    source="OpenAI Blog" 
                                    time="18h ago" 
                                    title="OpenAI announces new decentralized model" 
                                    content="We are excited to share 'Nexus-7', our first model trained entirely on decentralized mesh nodes. This marks the beginning of the end for centralized AI compute farms."
                                    readTime="6 min read"
                                    tags={["Tech", "AI"]}
                                />
                                
                                <button className="w-full mt-4 py-3 border border-[var(--color-surface)] text-xs font-bold capitalize tracking-wider text-gray-500 hover:text-[var(--color-text)] hover:bg-gray-50 transition-all rounded-none flex items-center justify-center gap-2 group">
                                    View More News
                                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </section>

                        {/* INLINE SIDE PANEL (TRENDING / EVENTS) */}
                        <aside className="hidden xl:flex flex-col gap-6">
                            <MiniWidget 
                                title="Top Nodes"
                                icon={<Cpu size={14} />}
                                linkTo="/discover/nodes"
                                items={[
                                    { sub: "North America", label: "Alpha-Prime Node", stat: "99.999%" },
                                    { sub: "Asia-Pacific", label: "Tokyo-Mesh Hub", stat: "99.994%" },
                                    { sub: "Europe", label: "Central-Euro Relay", stat: "99.992%" },
                                    { sub: "South America", label: "Sao-Paulo Net", stat: "99.989%" },
                                ]}
                            />

                            <MiniWidget 
                                title="Events"
                                icon={<Clock size={14} />}
                                linkTo="/discover/events"
                                items={[
                                    { sub: "Oct 14 • Hosted by Core", label: "Global Mesh Sync Conference", stat: "Virtual" },
                                    { sub: "Oct 22 • Network-Wide", label: "Decentralized Governance Vote", stat: "Open" },
                                    { sub: "Nov 05 • Hub Strategy", label: "Yield Farming Strategies Q4", stat: "Live" },
                                    { sub: "Nov 12 • Workshop", label: "Wait-Free Optimization", stat: "Invite-only" },
                                ]}
                            />
                        </aside>
                    </div>



                    {/* DISCOVERY HIGHLIGHTS: PEOPLE, COMMUNITIES & ACTIVITY */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        
                        {/* TOP PEOPLE MODULE */}
                        <MiniWidget 
                            title="Top People"
                            icon={<Users size={14} />}
                            linkTo="/discover/people"
                            items={[
                                { sub: "Field: Core Logic", label: "Dr. Sarah Connor", stat: "12k signals" },
                                { sub: "Field: Distributed Systems", label: "Marcus Reed", stat: "8.5k signals" },
                                { sub: "Field: VFX Design", label: "Elena Fisher", stat: "6.2k signals" },
                                { sub: "Field: Frontend Perf", label: "Alex Chen", stat: "5.4k signals" },
                            ]}
                        />

                        {/* TOP COMMUNITIES MODULE */}
                        <MiniWidget 
                            title="Top Communities"
                            icon={<Sparkles size={14} />}
                            linkTo="/discover/communities"
                            items={[
                                { sub: "3.4k online", label: "c/DesignSystems", stat: "Join Alliance" },
                                { sub: "2.1k online", label: "c/WaitFreeArch", stat: "Join Alliance" },
                                { sub: "1.2k online", label: "c/FrontendElites", stat: "Join Alliance" },
                                { sub: "850 online", label: "c/NodeOperators", stat: "Join Alliance" },
                            ]}
                        />

                        {/* NETWORK ACTIVITY MODULE */}
                        <MiniWidget 
                            title="Network Activity"
                            icon={<Activity size={14} />}
                            linkTo="/discover/activity"
                            items={[
                                { sub: "Node 4.2.1", label: "Patching consensus relay", stat: "Succeeded" },
                                { sub: "Protocol V3", label: "Deployment sequence started", stat: "85% complete" },
                                { sub: "Governance", label: "Proposal #451 voting active", stat: "High volume" },
                                { sub: "Mesh Health", label: "Packet drop reduced by 12%", stat: "Stable" },
                            ]}
                        />
                    </section>
                </div>

                {/* RIGHT COLUMN: SECONDARY PANELS (~25% width, non-sticky) */}
                <aside className="hidden lg:block space-y-6">
                    
                    {/* WIDGET: FOR YOU */}
                    <MiniWidget 
                        title="For You"
                        icon={<Star size={14} />}
                        linkTo="/discover/foryou"
                        items={[
                            { sub: "Recommended Signal", label: "Optimizing State Management in React", stat: "1.2k signals" },
                            { sub: "Suggested Community", label: "c/FrontendElites", stat: "Active now" },
                            { sub: "Network Update", label: "Your routing paths have improved latency.", stat: "Auto-tuned" },
                            { sub: "New Contributor", label: "You unlocked 'Early Adopter' badge", stat: "Just now" },
                        ]}
                    />

                    {/* WIDGET: TRENDING */}
                    <MiniWidget 
                        title="Trending"
                        icon={<TrendingUp size={14} />}
                        linkTo="/discover/trending"
                        items={[
                            { sub: "Hardware #1", label: "GPU Clusters", stat: "14.2k posts" },
                            { sub: "Culture #2", label: "Cyber_Goth Fashion", stat: "9.1k posts" },
                            { sub: "Gaming #3", label: "Mesh League Final", stat: "6.5k posts" },
                            { sub: "Development #4", label: "Wait-Free Architecture", stat: "5.8k posts" },
                        ]}
                    />

                </aside>
            </div>
        </div>
    );
}

// Activity Icon
const ActivityIcon = () => (
    <div className="flex items-end gap-[2px] h-3">
        <div className="w-1 h-2 bg-[var(--color-accent)] animate-pulse" />
        <div className="w-1 h-2.5 bg-[var(--color-accent)] animate-pulse delay-75" />
        <div className="w-1 h-3 bg-[var(--color-accent)] animate-pulse delay-150" />
    </div>
);
