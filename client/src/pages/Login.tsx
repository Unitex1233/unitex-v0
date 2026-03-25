import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Phone, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Login() {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithPhone, verifyOtp } = useAuth();
    const navigate = useNavigate();
    
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [method, setMethod] = useState<'email' | 'phone'>('email');
    const [step, setStep] = useState<'input' | 'verify'>('input');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // We'll need a container for the invisible recaptcha
        if (method === 'phone' && !document.getElementById('recaptcha-container')) {
            const container = document.createElement('div');
            container.id = 'recaptcha-container';
            document.body.appendChild(container);
        }
    }, [method]);

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success('Signed in with Google');
            navigate('/');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await signInWithEmail(email, password);
                toast.success('Welcome back!');
            } else {
                await signUpWithEmail(email, password, displayName);
                toast.success('Account created successfully');
            }
            navigate('/');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithPhone(phoneNumber, 'recaptcha-container');
            setStep('verify');
            toast.info('Verification code sent to your phone');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOtp(otp);
            toast.success('Phone verified!');
            navigate('/');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-[#F4511C]/30 text-white">
            {/* Left Column: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10">
                <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4511C] flex items-center justify-center rounded-none rotate-3">
                            <Zap size={20} className="text-white fill-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">UniteX</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            {mode === 'login' ? 'Welcome back!' : 'Create an account'}
                        </h1>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We empower developers and technical teams to create, simulate, and manage AI-driven workflows visually.
                        </p>
                    </div>

                    {/* Method Toggle */}
                    <div className="flex p-1 bg-[#1c1c1f] rounded-none border border-white/5 w-fit">
                        <button 
                            onClick={() => { setMethod('email'); setStep('input'); }}
                            className={cn(
                                "px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                                method === 'email' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                            )}
                        >
                            Email
                        </button>
                        <button 
                            onClick={() => { setMethod('phone'); setStep('input'); }}
                            className={cn(
                                "px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                                method === 'phone' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                            )}
                        >
                            Phone
                        </button>
                    </div>

                    {/* Auth Forms */}
                    <div className="space-y-4">
                        {method === 'email' ? (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                value={displayName}
                                                onChange={e => setDisplayName(e.target.value)}
                                                required
                                                className="w-full bg-[#1c1c1f] border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#F4511C] transition-all placeholder:text-gray-600 font-medium"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="youremail@yourdomain.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-[#1c1c1f] border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#F4511C] transition-all placeholder:text-gray-600 font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Min 8 characters"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-[#1c1c1f] border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#F4511C] transition-all placeholder:text-gray-600 font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#F4511C] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ff6a3d] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Establish Account'}
                                    <ChevronRight size={14} strokeWidth={3} />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={step === 'input' ? handlePhoneSubmit : handleVerifyOtp} className="space-y-4">
                                {step === 'input' ? (
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            required
                                            className="w-full bg-[#1c1c1f] border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#F4511C] transition-all placeholder:text-gray-600 font-medium"
                                        />
                                        <p className="text-[10px] text-gray-400 font-mono mt-1">Includes country code (e.g., +1 for USA)</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Verification Code</label>
                                        <input
                                            type="text"
                                            placeholder="6-digit code"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            required
                                            maxLength={6}
                                            className="w-full bg-[#1c1c1f] border border-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#F4511C] transition-all placeholder:text-gray-600 font-mono tracking-[1em] text-center"
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#F4511C] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ff6a3d] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Validating...' : step === 'input' ? 'Send Access Code' : 'Verify & Continue'}
                                    <ChevronRight size={14} strokeWidth={3} />
                                </button>
                                {step === 'verify' && (
                                    <button 
                                        type="button" 
                                        onClick={() => setStep('input')}
                                        className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-accent)] hover:underline block mx-auto py-2"
                                    >
                                        Edit Number
                                    </button>
                                )}
                            </form>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-[#09090b] text-[10px] text-gray-500 font-bold uppercase tracking-widest">or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={handleGoogle}
                            className="bg-[#1c1c1f] border border-white/5 py-4 flex items-center justify-center hover:bg-white/5 transition-all group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#ea4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.092 1.092-2.82 2.256-6.024 2.256-4.812 0-8.68-3.92-8.68-8.736a8.6 8.6 0 0 1 8.68-8.736c2.592 0 4.548 1.02 5.94 2.304l2.304-2.304C18.42 1.092 15.6 0 12.12 0 5.484 0 0 5.484 0 12.12c0 6.636 5.484 12.12 12.12 12.12 3.588 0 6.3-1.188 8.424-3.42 2.184-2.184 2.868-5.268 2.868-7.74 0-.744-.06-1.464-.18-2.16H12.48z"/>
                            </svg>
                        </button>
                        <button
                            className="bg-[#1c1c1f] border border-white/5 py-4 flex items-center justify-center hover:bg-white/5 transition-all group grayscale hover:grayscale-0"
                            title="Facebook integration coming soon"
                        >
                             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </button>
                        <button
                            className="bg-[#1c1c1f] border border-white/5 py-4 flex items-center justify-center hover:bg-white/5 transition-all group grayscale hover:grayscale-0"
                            title="Apple integration coming soon"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                            </svg>
                        </button>
                    </div>

                    <p className="text-xs text-center text-gray-500 font-medium">
                        {mode === 'login' ? "Access denied? " : 'Already recognized? '}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-[#F4511C] font-black uppercase tracking-tighter hover:underline"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Column: Visual Section */}
            <div className="hidden lg:flex flex-1 bg-[#09090b] relative items-center justify-center p-12 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F4511C]/10 blur-[120px] rounded-full -mr-64 -mt-64 animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full -ml-32 -mb-32" />

                <div className="relative z-20 w-full max-w-lg aspect-[4/5] bg-gradient-to-br from-[#1c1c1f] to-[#09090b] border border-white/10 p-12 flex flex-col justify-between shadow-2xl group overflow-hidden">
                    {/* Interior Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4511C]/50 to-transparent" />
                    
                    <div className="space-y-6">
                        <div className="flex gap-2">
                             <span className="px-3 py-1 bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-gray-400">Node Alliance</span>
                             <span className="px-3 py-1 bg-[#F4511C]/10 border border-[#F4511C]/10 text-[9px] font-bold uppercase tracking-widest text-[#F4511C]">Network Core</span>
                        </div>
                        <blockquote className="text-3xl font-medium leading-tight tracking-tight text-white/90">
                            "UniteX Pro Components have completely changed how we work. What used to take hours every week is now fully automated."
                        </blockquote>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-none overflow-hidden border border-white/10">
                                <img 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
                                    className="w-full h-full object-cover"
                                    alt="Testimonial Author"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight">Gina Clinton</h4>
                                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Head of Product, Acme Inc.</p>
                            </div>
                        </div>
                        <div className="h-px bg-white/5 w-full" />
                        <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.2em] text-gray-600 uppercase">
                            <span>Established 2024</span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-[#F4511C] rounded-none opacity-50" />
                                <span className="w-1.5 h-1.5 bg-[#F4511C] rounded-none opacity-30" />
                                <span className="w-1.5 h-1.5 bg-[#F4511C] rounded-none opacity-10" />
                            </div>
                        </div>
                    </div>

                    {/* Subtle hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F4511C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
            </div>
            
            {/* Global background noise texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50 mix-blend-overlay" />
        </div>
    );
}
