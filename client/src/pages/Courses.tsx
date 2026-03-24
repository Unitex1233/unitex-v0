import { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Star, Play, Filter, Search, Globe, Layout, Cpu, Code, Zap, Users, CheckCircle, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Course {
    id: number;
    title: string;
    instructor: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    rating: number;
    progress: number;
    image: string;
    category: string;
    tags: string[];
    modules: number;
    enrolled: string;
}

const LEVEL_CONFIG = {
    Beginner: { label: 'Beginner', color: 'bg-emerald-500 text-white' },
    Intermediate: { label: 'Intermediate', color: 'bg-amber-500 text-white' },
    Advanced: { label: 'Advanced', color: 'bg-red-500 text-white' },
};

const ALL_COURSES: Course[] = [
    {
        id: 1,
        title: 'Mastering mesh architecture',
        instructor: 'Dr. Sarah Connor',
        level: 'Advanced',
        duration: '12h 45m',
        rating: 4.9,
        progress: 35,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800',
        category: 'Core Architecture',
        tags: ['Rust', 'Distributed Systems'],
        modules: 8,
        enrolled: '4.2k',
    },
    {
        id: 2,
        title: 'High-density UI strategy',
        instructor: 'Elena Fisher',
        level: 'Intermediate',
        duration: '8h 20m',
        rating: 4.8,
        progress: 0,
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800',
        category: 'Design',
        tags: ['Framer Motion', 'React'],
        modules: 6,
        enrolled: '6.7k',
    },
    {
        id: 3,
        title: 'AI node integration',
        instructor: 'Marcus Reed',
        level: 'Advanced',
        duration: '15h 10m',
        rating: 5.0,
        progress: 15,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
        category: 'AI & ML',
        tags: ['PyTorch', 'System Design'],
        modules: 11,
        enrolled: '2.1k',
    },
    {
        id: 4,
        title: 'TypeScript for systems engineers',
        instructor: 'Alex Chen',
        level: 'Intermediate',
        duration: '6h 00m',
        rating: 4.7,
        progress: 72,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
        category: 'Engineering',
        tags: ['TypeScript', 'Node.js'],
        modules: 5,
        enrolled: '9.3k',
    },
    {
        id: 5,
        title: 'Infrastructure at scale: DevOps fundamentals',
        instructor: 'Jordan Smith',
        level: 'Beginner',
        duration: '10h 30m',
        rating: 4.6,
        progress: 0,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
        category: 'Infrastructure',
        tags: ['Docker', 'K8s', 'CI/CD'],
        modules: 9,
        enrolled: '11.5k',
    },
    {
        id: 6,
        title: 'Generative design with AI',
        instructor: 'Priya Patel',
        level: 'Beginner',
        duration: '5h 15m',
        rating: 4.8,
        progress: 0,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
        category: 'Design',
        tags: ['Stable Diffusion', 'Figma AI'],
        modules: 4,
        enrolled: '7.8k',
    },
];

const CATEGORIES = ['All', 'Core Architecture', 'Design', 'AI & ML', 'Infrastructure', 'Engineering'];

const FEATURED_PATH = ALL_COURSES[0];

function Courses() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = ALL_COURSES.filter(c => {
        const matchCat = activeCategory === 'All' || c.category === activeCategory;
        const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    const inProgress = ALL_COURSES.filter(c => c.progress > 0 && c.progress < 100);

    return (
        <div className="pt-4 pb-20 max-w-[1500px] mx-auto px-6">

            {/* ─── Hero Banner: Featured Path ─── */}
            <div className="relative overflow-hidden bg-[var(--color-text)] mb-12 min-h-[240px] flex items-end">
                <img
                    src={FEATURED_PATH.image}
                    alt={FEATURED_PATH.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 w-full">
                    <div>
                        <div className="flex items-center gap-2 text-[var(--color-accent)] mb-4">
                            <Zap size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Featured path</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-none mb-3 capitalize">
                            {FEATURED_PATH.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/50 text-[10px] font-mono">
                            <span className="flex items-center gap-1.5"><Users size={11} /> {FEATURED_PATH.enrolled} enrolled</span>
                            <span className="flex items-center gap-1.5"><Clock size={11} /> {FEATURED_PATH.duration}</span>
                            <span className="flex items-center gap-1.5"><Star size={11} className="text-[var(--color-accent)]" /> {FEATURED_PATH.rating}</span>
                            <span className="flex items-center gap-1.5"><BookOpen size={11} /> {FEATURED_PATH.modules} modules</span>
                        </div>
                    </div>
                    <div className="shrink-0">
                        {FEATURED_PATH.progress > 0 ? (
                            <div className="flex flex-col items-end gap-3">
                                <div className="text-white/50 text-[10px] font-mono">{FEATURED_PATH.progress}% complete</div>
                                <div className="w-48 h-1 bg-white/10">
                                    <div className="h-full bg-[var(--color-accent)]" style={{ width: `${FEATURED_PATH.progress}%` }} />
                                </div>
                                <button className="px-8 py-3.5 bg-[var(--color-accent)] text-white text-xs font-bold capitalize tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2">
                                    <Play size={14} /> Continue learning
                                </button>
                            </div>
                        ) : (
                            <button className="px-8 py-3.5 bg-white text-[var(--color-text)] text-xs font-bold capitalize tracking-wider hover:bg-[var(--color-accent)] hover:text-white transition-all flex items-center gap-2">
                                <Play size={14} /> Start path
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Page Sub-header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[var(--color-surface)] pb-8 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[var(--color-accent)] mb-2">
                        <BookOpen size={16} />
                        <span className="text-[10px] font-bold capitalize tracking-widest">Knowledge acquisition</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter text-[var(--color-text)] leading-none">
                        All courses
                    </h2>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                            type="text"
                            placeholder="Find a course..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-surface)] text-xs font-medium focus:border-[var(--color-accent)] outline-none transition-all rounded-none"
                        />
                    </div>
                    <button className="p-3 bg-white border border-[var(--color-surface)] hover:bg-gray-50 transition-all text-gray-400">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: Category Sidebar */}
                <aside className="hidden lg:flex flex-col gap-6 lg:col-span-3">
                    <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400 mb-6 border-b border-[var(--color-surface)] pb-4">
                            Browse by category
                        </h3>
                        <div className="space-y-1">
                            {CATEGORIES.map(cat => {
                                const count = cat === 'All' ? ALL_COURSES.length : ALL_COURSES.filter(c => c.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 text-left transition-all",
                                            activeCategory === cat
                                                ? "bg-[var(--color-text)] text-white"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-[var(--color-text)]"
                                        )}
                                    >
                                        <span className="text-[11px] font-bold capitalize tracking-wide">{cat}</span>
                                        <span className={cn(
                                            "text-[9px] font-mono font-bold px-1.5 py-0.5",
                                            activeCategory === cat ? "bg-white/20" : "bg-gray-100"
                                        )}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Continue Studying */}
                    {inProgress.length > 0 && (
                        <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm">
                            <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400 mb-6 border-b border-[var(--color-surface)] pb-4 flex items-center justify-between">
                                Continue studying <Clock size={14} />
                            </h3>
                            <div className="space-y-5">
                                {inProgress.map(c => (
                                    <div key={c.id} className="group cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-[11px] font-bold text-[var(--color-text)] capitalize tracking-tight group-hover:text-[var(--color-accent)] transition-all leading-tight">
                                                {c.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-gray-300 ml-2 shrink-0">{c.progress}%</span>
                                        </div>
                                        <div className="h-1 bg-gray-50 w-full overflow-hidden">
                                            <div className="h-full bg-[var(--color-text)] transition-all" style={{ width: `${c.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    <div className="bg-gray-50 p-6 border border-[var(--color-surface)]">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <Globe size={14} /> Global certifications
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Architecture master', icon: Cpu, cost: '5k VP' },
                                { name: 'Design strategist', icon: Layout, cost: '3k VP' },
                                { name: 'Node specialist', icon: Code, cost: '2k VP' },
                            ].map((cert, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 hover:border-[var(--color-accent)] transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <cert.icon size={14} className="text-gray-300" />
                                        <span className="text-[10px] font-bold text-[var(--color-text)] capitalize">{cert.name}</span>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold text-[var(--color-accent)]">{cert.cost}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-[9px] text-gray-400 font-medium leading-relaxed italic">
                            Certifications are recorded on-chain and grant permanent access to restricted clusters.
                        </p>
                    </div>
                </aside>

                {/* CENTER: Course Grid */}
                <div className="lg:col-span-6 space-y-8">
                    <div className="text-[10px] font-mono text-gray-400 mb-2">
                        {filtered.length} course{filtered.length !== 1 ? 's' : ''}
                        {searchQuery && ` for "${searchQuery}"`}
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="ml-3 text-[var(--color-accent)] font-bold hover:underline">Clear</button>
                        )}
                    </div>

                    {/* Mobile Category Scroll */}
                    <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={cn("shrink-0 px-4 py-2 text-[10px] font-bold capitalize tracking-wider transition-all",
                                    activeCategory === cat ? "bg-[var(--color-text)] text-white" : "bg-white border border-[var(--color-surface)] text-gray-400"
                                )}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="py-20 text-center text-gray-300">
                            <BookOpen size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm font-bold">No courses found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filtered.map(course => {
                                const levelCfg = LEVEL_CONFIG[course.level];
                                return (
                                    <div key={course.id} className="group flex flex-col bg-white border border-[var(--color-surface)] shadow-sm hover:border-[var(--color-accent)] transition-all overflow-hidden">
                                        {/* Course Image */}
                                        <div className="aspect-[16/9] relative overflow-hidden bg-gray-100">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute top-3 left-3">
                                                <span className={cn("px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest", levelCfg.color)}>
                                                    {levelCfg.label}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-3 left-3 flex gap-1.5">
                                                {course.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-[8px] font-bold text-white tracking-widest uppercase border border-white/20">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            {course.progress > 0 && (
                                                <div className="absolute bottom-0 left-0 h-1 bg-[var(--color-accent)] transition-all duration-500" style={{ width: `${course.progress}%` }} />
                                            )}
                                        </div>

                                        {/* Course Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[9px] font-bold text-[var(--color-accent)] capitalize tracking-widest">{course.category}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={10} className="fill-[var(--color-accent)] text-[var(--color-accent)]" />
                                                    <span className="text-[10px] font-bold text-[var(--color-text)]">{course.rating}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-base font-bold tracking-tight text-[var(--color-text)] mb-3 group-hover:text-[var(--color-accent)] transition-colors leading-tight capitalize">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-5 h-5 bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={`https://i.pravatar.cc/150?u=${course.id}`} alt={course.instructor} className="w-full h-full object-cover grayscale" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 capitalize">By {course.instructor}</span>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-[var(--color-surface)] flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-[9px] font-mono text-gray-300 uppercase tracking-widest">
                                                    <div className="flex items-center gap-1"><Clock size={11} /><span>{course.duration}</span></div>
                                                    <span className="opacity-30">|</span>
                                                    <div className="flex items-center gap-1"><BookOpen size={11} /><span>{course.modules} modules</span></div>
                                                </div>
                                                <button className="text-[10px] font-bold text-[var(--color-text)] capitalize tracking-wider flex items-center gap-1.5 group/btn hover:text-[var(--color-accent)] transition-colors">
                                                    <span>{course.progress > 0 ? 'Continue' : 'Start'}</span>
                                                    <ArrowRight size={12} className="text-[var(--color-accent)]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* RIGHT: My Activity + Stats */}
                <aside className="lg:col-span-3 space-y-6">
                    {/* My Activity Card */}
                    <div className="bg-[var(--color-text)] text-white p-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 text-white/5">
                            <Play size={120} />
                        </div>
                        <h3 className="text-xs font-bold capitalize tracking-widest text-white/40 mb-8 flex items-center gap-3">
                            <Play size={14} className="text-[var(--color-accent)]" /> My activity
                        </h3>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div>
                                <div className="text-4xl font-bold tracking-tighter mb-1">{ALL_COURSES.length}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">Courses available</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold tracking-tighter mb-1 text-[var(--color-accent)]">{inProgress.length}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">In progress</div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[10px] font-bold capitalize tracking-wider">Weekly target</span>
                                <span className="text-xl font-bold font-mono">12 <span className="text-[9px] opacity-30 font-sans">HRS</span></span>
                            </div>
                            <div className="h-1.5 bg-white/5 w-full overflow-hidden">
                                <div className="h-full bg-[var(--color-accent)] w-[65%]" />
                            </div>
                            <p className="mt-2 text-[9px] font-mono text-white/30">7.8 / 12 hrs this week</p>
                        </div>
                    </div>

                    {/* Learning Streak */}
                    <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <Zap size={14} className="text-[var(--color-accent)]" /> Learning streak
                        </h3>
                        <div className="flex items-end gap-1.5 h-16 mb-3">
                            {[4, 6, 3, 8, 5, 7, 9].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end">
                                    <div
                                        className={cn("w-full transition-all", i === 6 ? "bg-[var(--color-accent)]" : "bg-gray-100")}
                                        style={{ height: `${(h / 10) * 100}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-gray-300">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <span key={i} className="flex-1 text-center">{d}</span>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--color-surface)] flex items-center gap-2">
                            <CheckCircle size={14} className="text-[var(--color-accent)]" />
                            <span className="text-[10px] font-bold text-[var(--color-text)]">7-day streak active</span>
                        </div>
                    </div>

                    {/* Top Instructors */}
                    <div className="bg-white border border-[var(--color-surface)] p-6 shadow-sm">
                        <h3 className="text-xs font-bold capitalize tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <Users size={14} /> Top instructors
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Dr. Sarah Connor', role: 'Core Architecture', id: 1 },
                                { name: 'Elena Fisher', role: 'Design', id: 2 },
                                { name: 'Marcus Reed', role: 'AI & ML', id: 3 },
                            ].map(inst => (
                                <div key={inst.id} className="group flex items-center gap-3 cursor-pointer">
                                    <div className="w-8 h-8 bg-gray-100 overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                        <img src={`https://i.pravatar.cc/150?u=${inst.id}`} alt={inst.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">{inst.name}</p>
                                        <p className="text-[9px] text-gray-300 font-mono capitalize truncate">{inst.role}</p>
                                    </div>
                                    <ArrowUpRight size={12} className="shrink-0 text-gray-200 group-hover:text-[var(--color-accent)] transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Courses;
