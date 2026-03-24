import { MessageSquare, Lightbulb, Star, Zap, Megaphone } from 'lucide-react';

export const MOCK_USERS: Record<string, any> = {
    "alex-chen": {
        id: "alex-chen",
        name: "Alex Chen",
        role: "Frontend Dev & UX Enthusiast",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Building fluid interfaces with React and Framer Motion. Always curious about the next step in UI evolution.",
        location: "San Francisco, CA",
        expertise: ["React", "TypeScript", "Framer Motion", "UI Design"],
        stats: { score: 88, response: "94%", rank: "Top Contributor" },
        posts: [
            { type: 'Insight', id: 2, time: '8h ago', title: 'Why we abandoned Server Components (temporarily)', highlight: 'Efficiency is measurable', preview: 'We saw a 32% reduction in iteration cycles.', signals: { insight: 89, depth: 84, relevance: 91 } }
        ]
    },
    "daniel-kim": {
        id: "daniel-kim",
        name: "Daniel Kim",
        role: "Product Designer & Systems Thinker",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
        bio: "Designing scalable systems that improve product clarity and team velocity.",
        location: "San Francisco, CA",
        expertise: ["UX Design", "Design Systems", "SaaS", "Product Thinking"],
        stats: { score: 82.5, response: "96%", rank: "Design Systems Lead" },
        posts: [
            { type: 'Breakdown', id: 10, time: '6 days ago', title: 'The ROI of design systems in 2024', highlight: 'Efficiency is measurable', preview: 'We saw a 32% reduction in iteration cycles.', signals: { insight: 89, depth: 84, relevance: 91 } }
        ]
    },
    "elena-fisher": {
        id: "elena-fisher",
        name: "Elena Fisher",
        role: "AI Product Strategist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Exploring the intersection of human-centered design and generative AI.",
        location: "London, UK",
        expertise: ["AI Strategy", "Generative UX", "Product Growth"],
        stats: { score: 95, response: "98%", rank: "AI Pioneer" },
        posts: [
            { type: 'Case Study', id: 5, time: '18h ago', title: 'Stop building chat interfaces for everything', highlight: 'Chat is often the laziest UX', preview: 'Structural UI for AI increases task completion by 65%.', signals: { insight: 95, depth: 92, relevance: 98 } }
        ]
    },
    "sarah-connor": {
        id: "sarah-connor",
        name: "Dr. Sarah Connor",
        role: "Core Architect",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Specializing in decentralized state machines and neural transition layers.",
        location: "Austin, TX",
        expertise: ["Architecture", "Neural Networks", "Go"],
        stats: { score: 99, response: "100%", rank: "Architect Prime" },
        posts: [
            { type: 'Progress', id: 11, time: '2h ago', title: 'Neural Transition Layers', highlight: '40% latency reduction', preview: 'Achieved mesh-based state sync globally.', signals: { insight: 98, depth: 95, relevance: 99 } }
        ]
    },
    "tech-news-bot": {
        id: "tech-news-bot",
        name: "Tech News Bot",
        role: "Aggregator",
        avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Automated stream of the latest breakthroughs in decentralized tech.",
        location: "Global Edge Nodes",
        expertise: ["Aggregation", "Real-time feeds"],
        stats: { score: 75, response: "N/A", rank: "Oracle" },
        posts: []
    },
    "marcus-reed": {
        id: "marcus-reed",
        name: "Marcus Reed",
        role: "Infrastructure Lead",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Breaking things so you don't have to. Specialized in simulation stress-tests.",
        location: "Toronto, Canada",
        expertise: ["Reliability", "Chaos Engineering", "Rust"],
        stats: { score: 91, response: "88%", rank: "Guardian" },
        posts: [
            { type: 'Failure', id: 12, time: '5h ago', title: 'Shard-B Simulation Failure', highlight: 'Critical race condition found', preview: 'Whiteboard session needed for consensus algorithm fix.', signals: { insight: 94, depth: 90, relevance: 85 } }
        ]
    },
    "jane-doe": {
        id: "jane-doe",
        name: "Jane Doe",
        role: "Senior Engineering Manager",
        avatar: "https://i.pravatar.cc/256?img=1",
        bio: "Leading frontend teams at scale. Focused on developer velocity and runtime performance.",
        location: "Seattle, WA",
        expertise: ["Management", "Scalability", "Zustand"],
        stats: { score: 92, response: "95%", rank: "Visionary" },
        posts: [
            { type: 'Case Study', id: 1, time: '4h ago', title: 'Scaling React state beyond 3 complex provider trees', highlight: '40% reduction in TTI', preview: 'Migrating to atomic state management avoided cascading updates.', signals: { insight: 98, depth: 14, relevance: 98 } }
        ]
    },
    "sarah-jenkins": {
        id: "sarah-jenkins",
        name: "Sarah Jenkins",
        role: "Full Stack Engineer",
        avatar: "https://i.pravatar.cc/256?img=5",
        bio: "Building the next generation of real-time web experiences.",
        location: "Chicago, IL",
        expertise: ["Real-time", "Node.js", "WebSockets"],
        stats: { score: 85, response: "92%", rank: "Pioneer" },
        posts: [
            { type: 'Ask', id: 3, time: '1 day ago', title: 'React Query vs SWR for strict real-time', highlight: 'Sub-10ms UI updates', preview: 'Seeking empirical data on main thread blocking.', signals: { insight: 82, depth: 8, relevance: 90 } }
        ]
    },
    "dr-connor": {
        id: "dr-connor",
        name: "Dr. Connor",
        role: "ML Researcher",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Ph.D in Computational Intelligence. Pushing the boundaries of browser-based inference.",
        location: "Berlin, Germany",
        expertise: ["Machine Learning", "WebGPU", "Llama 3"],
        stats: { score: 97, response: "85%", rank: "The Professor" },
        posts: [
            { type: 'Experiment', id: 4, time: '12h ago', title: 'Local LLM reasoning via WebGPU', highlight: '15 tokens/sec generation', preview: 'Client-side inference without API calls.', signals: { insight: 142, depth: 42, relevance: 95 } }
        ]
    },
    "kenji-tanaka": {
        id: "kenji-tanaka",
        name: "Kenji Tanaka",
        role: "Product Lead",
        avatar: "https://images.unsplash.com/photo-1542909192-2f2241a99c9d?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Scaling products from zero to a million nodes. Focused on ecosystem growth.",
        location: "Tokyo, Japan",
        expertise: ["Product Strategy", "Growth", "Community"],
        stats: { score: 94, response: "90%", rank: "Legend" },
        posts: [
            { type: 'Success', id: 8, time: '14h ago', title: '1M Nodes on Beta-Mesh!', highlight: 'Massive milestone', preview: 'Huge thanks to the Alliance community.', signals: { insight: 1240, depth: 842, relevance: 99 } }
        ]
    },
    "sysadmin-bot": {
        id: "sysadmin-bot",
        name: "SysAdmin Bot",
        role: "System Node",
        avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=256&h=256&auto=format&fit=crop",
        bio: "Maintaining the integrity of the mesh. Automated protocol enforcement.",
        location: "Root Cluster",
        expertise: ["Integrity", "Automation"],
        stats: { score: 100, response: "Instantly", rank: "The Warden" },
        posts: [
            { type: 'Insight', id: 7, time: '1 week ago', title: 'Welcome to the Hub', highlight: 'Structured collaboration', preview: 'Generic space for builders to collaborate.', signals: { insight: 24, depth: 2, relevance: 100 } }
        ]
    },
    "alex-thorne": { id: "alex-thorne", name: "Alex Thorne", role: "Startup Founder", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop", bio: "Building the future of decentralized finance.", location: "San Francisco, CA", expertise: ["DeFi", "Venture", "Strategy"], stats: { score: 89, response: "80%", rank: "Investor" }, posts: [] },
    "priya-patel": { id: "priya-patel", name: "Priya Patel", role: "Full Stack Dev", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop", bio: "Loves React, Node, and everything in between.", location: "New York, NY", expertise: ["React", "Node.js", "MongoDB"], stats: { score: 93, response: "97%", rank: "Elite" }, posts: [] },
    "liam-oconnor": { id: "liam-oconnor", name: "Liam O'Connor", role: "Game DevOps", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop", bio: "Optimizing pipelines for high-performance games.", location: "Dublin, Ireland", expertise: ["DevOps", "Gaming", "Infrastructure"], stats: { score: 86, response: "85%", rank: "Guardian" }, posts: [] },
    "sasha-ivanov": { id: "sasha-ivanov", name: "Sasha Ivanov", role: "Security Researcher", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop", bio: "Ex-whitehat hacker building secure protocols.", location: "Moscow, Russia", expertise: ["Cybersecurity", "Protocol Design", "Rust"], stats: { score: 97, response: "88%", rank: "Security Lead" }, posts: [] },
    "maya-lin": { id: "maya-lin", name: "Maya Lin", role: "UX Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop", bio: "Designing addictive and fast interfaces.", location: "Singapore", expertise: ["UX Design", "Framer", "Product Strategy"], stats: { score: 92, response: "95%", rank: "Artisan" }, posts: [] },
    "david-chen": { id: "david-chen", name: "David Chen", role: "Solutions Architect", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop", bio: "Strategic builder for robust backend infrastructures.", location: "Vancouver, Canada", expertise: ["Scalability", "Backend", "Cloud"], stats: { score: 92, response: "90%", rank: "Platinum" }, posts: [] },
    "zoe-wang": { id: "zoe-wang", name: "Zoe Wang", role: "Contract Engineer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop", bio: "Specialist in smart contract security.", location: "Hong Kong", expertise: ["Solidity", "Web3", "Blockchain"], stats: { score: 91, response: "93%", rank: "Gold" }, posts: [] },
    "jordan-smith": { id: "jordan-smith", name: "Jordan Smith", role: "AI Scientist", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop", bio: "Focusing on AI alignment and prompt architecture.", location: "Boston, MA", expertise: ["AI Safety", "LLMs", "Research"], stats: { score: 96, response: "85%", rank: "Titan" }, posts: [] },
    "nina-vo": { id: "nina-vo", name: "Nina Vo", role: "UI Engineer", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop", bio: "Crafting tactile digital experiences with animations.", location: "Paris, France", expertise: ["UI Animation", "Three.js", "Creative Coding"], stats: { score: 94, response: "96%", rank: "Diamond" }, posts: [] },
    "elena-vasquez": { id: "elena-vasquez", name: "Elena Vasquez", role: "Growth Marketer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop", bio: "Turning early-stage projects into global names.", location: "Madrid, Spain", expertise: ["Growth Hacking", "Marketing", "Data Analysis"], stats: { score: 93, response: "91%", rank: "Catalyst" }, posts: [] },
    "diana-kumar": { id: "diana-kumar", name: "Diana Kumar", role: "Senior Product Designer", avatar: "https://i.pravatar.cc/100?img=32", bio: "Expert in user-centered design and SaaS products.", location: "Chicago, IL", expertise: ["Product Design", "User Research", "Systems Thinking"], stats: { score: 95, response: "96%", rank: "Elite" }, posts: [] },
    "jared-watts": { id: "jared-watts", name: "Jared Watts", role: "Growth PM – Acme Inc.", avatar: "https://i.pravatar.cc/100?img=12", bio: "Passionate about scaling products and growth loops.", location: "Austin, TX", expertise: ["Growth", "Product Management", "Data Science"], stats: { score: 90, response: "88%", rank: "Pioneer" }, posts: [] }
};

export const MOCK_COMMUNITIES: Record<string, any> = {
    "1": {
        id: "1", name: "React Flow", tagline: "The largest community of React developers building modern UIs.",
        members: "14.2k", active: "Very High", category: "Tech", rank: 1,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
        logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200&auto=format&fit=crop",
        intents: [
            { id: "ask", label: "Ask", icon: MessageSquare, description: "Get help with a problem" },
            { id: "insight", label: "Insight", icon: Lightbulb, description: "Share a discovery or learning" },
            { id: "case_study", label: "Case Study", icon: Star, description: "Break down a complex implementation" }
        ],
    },
    "4": {
        id: "4", name: "AI Builders", tagline: "Exploring LLMs, agents, and the future of generative AI.",
        members: "9.3k", active: "Extreme", category: "AI", rank: 4,
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
        logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200&auto=format&fit=crop",
        intents: [
            { id: "idea", label: "Idea", icon: Lightbulb, description: "Propose a new concept or architecture" },
            { id: "research", label: "Research", icon: Star, description: "Share academic or empirical findings" },
            { id: "experiment", label: "Experiment", icon: Zap, description: "Showcase a prototype or test" },
            { id: "announcement", label: "Announcement", icon: Megaphone, description: "Launch or major update" },
            { id: "product_insight", label: "Product Insight", icon: Star, description: "UX/Product patterns in AI apps" }
        ]
    }
};

export const MOCK_EVENTS = [
    {
        id: 1,
        title: "Building Scalable Systems with Node.js",
        community: "Builders Club",
        date: "Oct 24, 2024",
        time: "6:00 PM EST",
        mode: "Online",
        attendees: 142,
        description: "A deep dive into event loops, clustering, and how to handle 10k concurrent connections.",
        longDescription: "Node.js is often praised for its non-blocking I/O, but scaling it specifically for high-concurrency environments requires a deep understanding of its internals. In this session, we will cover:\n\n- The Event Loop in depth: Libuv and the thread pool.\n- Horizontal scaling with the Cluster module and PM2.\n- Leveraging Worker Threads for CPU-intensive tasks.\n- Practical strategies for managing 10k+ concurrent WebSocket connections.",
        host: { id: "sarah-jenkins", name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/256?img=5" }
    },
    {
        id: 2,
        title: "Design Systems Workshop",
        community: "UI/UX & Design",
        date: "Oct 28, 2024",
        time: "2:00 PM EST",
        mode: "Online",
        attendees: 89,
        description: "Live coding session: Building a token-based design system from scratch using CSS variables.",
        longDescription: "Design systems are the backbone of consistent, high-velocity product development. This workshop is hands-on. We'll start with a clean Slate and build a robust token system that handles color scales, spacing, and typography across themes.",
        host: { id: "daniel-kim", name: "Daniel Kim", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop" }
    }
];

export const MOCK_POSTS = [
    // --- REACT FLOW (Community 1) ---
    {
        id: 1, author: "Jane Doe", authorAvatar: "https://i.pravatar.cc/100?img=1",
        authorId: "jane-doe",
        intent: "Case Study", communityId: "1", score: 98, depth: 14,
        title: "Scaling React state beyond 3 complex provider trees — where does it fail?",
        content: "When building our latest dashboard, we identified major re-render bottlenecks in nested providers during idle state. By migrating our core view-models to atomic state management (Zustand/Jotai), we avoided these cascading updates entirely. This resulted in a 40% reduction in TTI (Time to Interactive) for our heaviest views.",
        takeaway: "Atomic state models scale significantly better than deep React Context structures for high-frequency updates.",
        time: "4h ago",
        comments: [
            { id: 101, author: "David K.", authorId: "david-k", avatar: "https://i.pravatar.cc/100?img=11", text: "Did you notice any overhead when dealing with extremely high-frequency streams (like cursor tracking) with Zustand?", time: "3h ago" },
            { id: 102, author: "Jane Doe", authorId: "jane-doe", avatar: "https://i.pravatar.cc/100?img=1", text: "Good question! We used transient updates (subscribe directly without triggering React re-renders) for cursor coords.", time: "2h ago" }
        ]
    },
    {
         id: 2, author: "Alex Chen", authorAvatar: "https://i.pravatar.cc/100?img=12",
         authorId: "alex-chen",
         intent: "Insight", communityId: "1", score: 85, depth: 3,
         title: "Why we abandoned Server Components (temporarily)",
         content: "After three months of experimentation, we've decided to step back from RSCs for our main application. The ecosystem maturity for vital third-party UI libraries remains a major blocker. Furthermore, the cognitive load on our junior developers increased significantly due to strict environment boundaries, slowing down our velocity.",
         takeaway: "RSC is the future, but the bridge from standard SPAs still requires significant custom tooling today.",
         time: "8h ago",
         image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
         comments: []
    },
    {
         id: 3, author: "Sarah Jenkins", authorAvatar: "https://i.pravatar.cc/100?img=5",
         authorId: "sarah-jenkins",
         intent: "Ask", communityId: "1", score: 42, depth: 8,
         title: "React Query vs SWR for strict real-time websockets?",
         content: "We're building a trading dashboard that requires sub-10ms UI updates upon receiving a websocket blast. React Query's invalidation cycle feels slightly too heavy for this specific use case, whereas SWR's mutation API seems cleaner. Does anyone have empirical data comparing the main thread blocking time of both under extreme load?",
         time: "1 day ago",
         comments: [
             { id: 104, author: "Marcus Reed", authorId: "marcus-reed", avatar: "https://i.pravatar.cc/100?img=8", text: "Don't use either for the raw websocket stream. Stream to a ref/store, and only trigger React state/query on a throttled 16ms window.", time: "12h ago" }
         ]
    },
    
    // --- AI BUILDERS (Community 4) ---
    {
        id: 4, author: "Dr. Connor", authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
        authorId: "dr-connor",
        intent: "Experiment", communityId: "4", score: 142, depth: 42,
        title: "Local LLM reasoning: Llama 3 running fully in the browser via WebGPU",
        content: "We successfully compiled Llama 3 models to WebNN / WebAssembly formats. By leveraging WebGPU, we achieved ~15 tokens/sec generation entirely client-side without API calls. Due to strict memory constraints in browser tabs, this required aggressive 4-bit quantization, but the results are highly usable for offline tasks.",
        time: "12h ago",
        comments: [
            { id: 103, author: "Alex Chen", authorId: "alex-chen", avatar: "https://i.pravatar.cc/100?img=12", text: "Insane! How much VRAM is effectively required for the 4-bit quant to run stably?", time: "10h ago" },
            { id: 104, author: "Dr. Connor", authorId: "dr-connor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop", text: "Around 4.5GB VRAM. It fits snugly inside the WebGPU limits on modern Macs.", time: "9h ago"}
        ]
    },
    {
        id: 5, author: "Elena Fisher", authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
        authorId: "elena-fisher",
        intent: "Product Insight", communityId: "4", score: 215, depth: 56,
        title: "Stop building chat interfaces for everything",
        content: "LLMs are powerful reasoning engines, but a chat box is often the laziest UX. We tested a structured 'generative canvas' vs a traditional chatbot for our financial analyst tool. Task completion rate jumped by 65% when users could highlight data and trigger specific, constrained generation actions rather than typing prompts from scratch.",
        takeaway: "Embed AI into the existing user workflow rather than forcing users to pivot to a chat interface.",
        time: "18h ago",
        image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1200&auto=format&fit=crop",
        comments: []
    },
    {
        id: 6, author: "Kenji Tanaka", authorAvatar: "https://images.unsplash.com/photo-1542909192-2f2241a99c9d?q=80&w=100&auto=format&fit=crop",
        authorId: "kenji-tanaka",
        intent: "Announcement", communityId: "4", score: 450, depth: 89,
        title: "Releasing Open-Agency: A framework for multi-agent swarm collaboration",
        content: "After 6 months of stealth development, we are open-sourcing our agent orchestration library. It maps out deterministic pathways for non-deterministic agents, allowing a swarm of specialized models to collaborate on a single task with predictable exit constraints.",
        time: "2 days ago",
        comments: []
    },

    // --- GENERAL HUB (Default fallback) ---
    {
        id: 7, author: "SysAdmin Bot", authorAvatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=100&auto=format&fit=crop",
        authorId: "sysadmin-bot",
        intent: "Insight", communityId: "default", score: 24, depth: 2,
        title: "Welcome to the Hub Platform",
        content: "This is a generic space for builders to collaborate. Make sure to keep conversations structured and actionable. The default fallback rules apply here.",
        time: "1 week ago",
        comments: []
    }
];
