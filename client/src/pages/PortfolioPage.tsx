import { Play, Search, Bell, ShoppingCart, Cpu, MoreHorizontal, MessageSquare, Plus, Heart, Code, Layers, GitBranch, Terminal, FileText, Download, Briefcase, ExternalLink, BarChart3, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// --- DATA: DEVELOPER PORTFOLIO ---
const PROJECTS = [
    {
        id: 1,
        title: "E-Commerce Analytics",
        subtitle: "Real-time dashboard for online retailers.",
        img: "1551288049-bebda4e38f71",
        tags: ["React", "D3.js"],
        color: "bg-blue-500"
    },
    {
        id: 2,
        title: "Social Graph API",
        subtitle: "Scalable backend handling 1M+ req/s.",
        img: "1555066931-4365d14bab8c",
        tags: ["Node", "Redis"],
        color: "bg-purple-500"
    },
    {
        id: 3,
        title: "Design System",
        subtitle: "Unified component library for enterprise.",
        img: "1561070791-2526d30994b5",
        tags: ["Figma", "Storybook"],
        color: "bg-pink-500"
    },
];

const TECH_STACK = [
    { name: "React", sub: "Frontend", icon: Code },
    { name: "TypeScript", sub: "Language", icon: FileText },
    { name: "Node.js", sub: "Runtime", icon: Terminal },
    { name: "Figma", sub: "Design", icon: Layers }
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

// --- MAIN COMPONENT ---
function PortfolioPage() {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="flex h-full w-full bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden font-sans p-4 md:p-6 gap-6"
        >

            {/* LEFT / CENTER COLUMN */}
            <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto scrollbar-none pr-2 pb-20 md:pb-0">

                {/* Header */}
                <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
                            Featured Work <span className="opacity-40 font-normal">/ 2026</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Search Pill */}
                        <div className="relative flex-1 md:w-64 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text)] opacity-40 group-focus-within:text-[var(--color-accent)] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="w-full bg-[var(--color-surface)] pl-10 pr-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-text)]/30 border border-transparent focus:border-[var(--color-accent)] transition-all rounded-none"
                            />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-3">
                            <NavIcon icon={Briefcase} />
                            <NavIcon icon={Bell} badge />
                            <div className="w-10 h-10 border border-[var(--color-surface)] overflow-hidden cursor-pointer hover:border-[var(--color-accent)] transition-colors relative group rounded-none">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Hero Banner - Featured Project */}
                <motion.div variants={itemVariants} className="relative w-full h-[320px] md:h-[350px] overflow-hidden group shrink-0 bg-black border border-[var(--color-text)]/5 rounded-none">
                    <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                        alt="Featured Project"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute top-6 left-6 flex gap-3">
                        <Tag label="Featured" />
                        <Tag label="Full Stack" icon={<Layers size={14} />} />
                    </div>

                    <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 max-w-2xl px-2">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight uppercase leading-none"
                        >
                            FinTech App
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-300 text-[10px] md:text-xs mb-6 leading-relaxed line-clamp-2 font-mono uppercase tracking-wide max-w-lg"
                        >
                            A next-generation mobile banking solution focusing on accessibility and real-time fraud detection.
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 border border-black overflow-hidden bg-[var(--color-surface)] rounded-none">
                                        <img src={`https://images.unsplash.com/photo-${1500 + i}?w=100&h=100`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest hidden md:inline">+12 Contributors</span>
                            <div className="h-8 w-[1px] bg-white/20 mx-2 hidden md:block"></div>
                            <button className="bg-[var(--color-accent)] text-white hover:bg-white hover:text-black transition-all px-6 py-3 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group/btn rounded-none">
                                View Case Study <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Row */}
                <div className="flex flex-col xl:flex-row gap-6 min-h-[300px]">

                    {/* Recent Projects (Carousel) */}
                    <motion.div variants={itemVariants} className="flex-1 min-w-0">
                        <SectionHeader title="Recent Deployments" />
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x h-full">
                            {PROJECTS.map((project, i) => (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={project.id}
                                    className="relative w-64 h-64 shrink-0 group cursor-pointer snap-center bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-text)] transition-colors rounded-none"
                                >
                                    <img src={`https://images.unsplash.com/photo-${project.img}?w=500&q=80`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--color-bg)]/90 backdrop-blur-sm border-t border-[var(--color-surface)]">
                                        <h4 className="font-bold text-lg text-[var(--color-text)] mb-1 leading-tight uppercase">{project.title}</h4>
                                        <div className="flex gap-2 mt-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[9px] font-mono bg-[var(--color-text)] text-[var(--color-bg)] px-1.5 py-0.5 uppercase rounded-none">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 bg-[var(--color-accent)] flex items-center justify-center text-white shadow-sm rounded-none">
                                            <GitBranch size={16} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div whileHover={{ scale: 0.98 }} className="w-16 h-64 bg-[var(--color-surface)] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition-colors border border-dashed border-[var(--color-text)]/20 hover:border-transparent group rounded-none">
                                <span className="rotate-90 text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">View All</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Resume Download Card */}
                    <motion.div variants={itemVariants} className="flex-1 min-w-0 xl:max-w-md">
                        <SectionHeader title="Resources" />
                        <div className="bg-[var(--color-surface)] p-6 border border-transparent hover:border-[var(--color-text)] transition-all h-64 flex flex-col justify-between group relative overflow-hidden rounded-none">

                            <div className="flex justify-between items-start z-10">
                                <motion.div
                                    whileHover={{ rotate: -2, scale: 1.05 }}
                                    className="w-20 h-24 bg-white shadow-md border border-gray-200 p-2 flex flex-col gap-1.5 cursor-pointer rounded-none"
                                >
                                    <div className="w-full h-1.5 bg-gray-200"></div>
                                    <div className="w-full h-1.5 bg-gray-200"></div>
                                    <div className="w-3/4 h-1.5 bg-gray-200 mr-auto"></div>
                                    <div className="w-full h-1.5 bg-gray-200 mt-2"></div>
                                    <div className="w-full h-1.5 bg-gray-200"></div>
                                </motion.div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 border border-[var(--color-text)] flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-colors active:scale-95 rounded-none">
                                        <Download size={16} />
                                    </button>
                                    <button className="w-10 h-10 border border-[var(--color-text)]/20 flex items-center justify-center hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors active:scale-95 rounded-none">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="z-10">
                                <h3 className="text-2xl font-bold text-[var(--color-text)] uppercase tracking-tight leading-none mb-2">Resume.pdf</h3>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-mono bg-[var(--color-bg)] px-1 py-0.5 uppercase border border-[var(--color-text)]/10 rounded-none">Updated Feb 2026</span>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-[var(--color-accent)]">2.4 MB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Minimal Progress/Status Bar */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--color-bg)]">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full bg-[var(--color-accent)]"
                                ></motion.div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <motion.div variants={itemVariants} className="w-80 shrink-0 hidden lg:flex flex-col gap-8 overflow-y-auto scrollbar-none pb-2">

                {/* Tech Stack */}
                <div className="flex flex-col gap-2">
                    <SectionHeader title="Tech Stack" />
                    {TECH_STACK.map((tech, i) => (
                        <motion.div
                            whileHover={{ x: 5 }}
                            key={i}
                            className="group flex items-center gap-4 p-3 bg-[var(--color-surface)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors cursor-pointer border-l-2 border-transparent hover:border-[var(--color-accent)] rounded-none"
                        >
                            <div className="w-10 h-10 bg-[var(--color-bg)] flex items-center justify-center shrink-0 text-[var(--color-text)] border border-[var(--color-text)]/10 rounded-none">
                                <tech.icon size={20} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate uppercase">{tech.name}</h4>
                                <p className="text-[10px] font-mono truncate opacity-60 uppercase">{tech.sub}</p>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contribution/Activity Stats */}
                <div className="flex-1 min-h-[400px] flex flex-col">
                    <SectionHeader title="Weekly Activity" arrow />
                    <div className="flex-1 bg-[var(--color-surface)] relative overflow-hidden flex flex-col p-6 border border-transparent hover:border-[var(--color-accent)] transition-colors group rounded-none">

                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="text-3xl font-bold text-[var(--color-text)] leading-none">428</div>
                                <div className="text-[10px] font-mono text-[var(--color-text)]/40 uppercase mt-1">Commits this week</div>
                            </div>
                            <div className="text-[var(--color-accent)] bg-[var(--color-bg)] px-2 py-1 text-[10px] font-bold uppercase">+12%</div>
                        </div>

                        {/* Bar Chart Visualization */}
                        <div className="flex items-end justify-between h-40 gap-1 mb-auto">
                            {[40, 65, 30, 85, 50, 90, 45].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                                        className={cn(
                                            "w-full bg-[var(--color-text)]/10 hover:bg-[var(--color-accent)] transition-colors relative min-h-[4px] rounded-none",
                                            i === 5 ? "bg-[var(--color-accent)]" : ""
                                        )}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-[var(--color-text)] text-[var(--color-bg)] text-[9px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded-none">
                                            {h} commits
                                        </div>
                                    </motion.div>
                                    <span className="text-[9px] font-mono text-[var(--color-text)]/40 uppercase">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="w-full grid grid-cols-2 gap-2 mt-6">
                            <ActivityMetric label="Code Review" value="12h" />
                            <ActivityMetric label="Debugging" value="8h" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- SUB-COMPONENTS & HELPERS ---

const NavIcon = ({ icon: Icon, badge }: { icon: any, badge?: boolean }) => (
    <button className="w-10 h-10 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg)] transition-colors relative active:scale-95 group rounded-none">
        <Icon size={18} className="group-hover:scale-110 transition-transform" />
        {badge && <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-[var(--color-accent)] border border-[var(--color-surface)] rounded-none"></span>}
    </button>
);

const Tag = ({ label, icon }: { label: string, icon?: any }) => (
    <div className="flex items-center gap-2 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm rounded-none">
        {icon || null}
        <span>{label}</span>
    </div>
);

const SectionHeader = ({ title, arrow }: { title: string, arrow?: boolean }) => (
    <div className="flex justify-between items-end mb-4 pl-1 border-b border-[var(--color-surface)] pb-2">
        <h3 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-widest">{title}</h3>
        {arrow ? (
            <button className="text-[var(--color-text)]/40 hover:text-[var(--color-accent)] transition-colors">&rarr;</button>
        ) : (
            <button className="text-[9px] font-bold text-[var(--color-text)]/40 hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.2em]">View All</button>
        )}
    </div>
);

const ActivityMetric = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center p-2 border border-[var(--color-text)]/10 bg-[var(--color-bg)] rounded-none">
        <span className="text-[9px] font-bold uppercase text-[var(--color-text)]/60">{label}</span>
        <span className="text-[10px] font-mono font-bold">{value}</span>
    </div>
);

export default PortfolioPage;
