import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Phone, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Login() {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithPhone, verifyOtp, signInAsGuest } = useAuth();
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
            toast.success('Authenticated with Google');
            navigate('/');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthFallback = async (provider: string) => {
        setLoading(true);
        try {
            await signInWithGoogle(); 
            toast.success(`Authenticated with ${provider}`);
            navigate('/');
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        setLoading(true);
        try {
            await signInAsGuest();
            toast.success('Signed in as Guest');
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
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-[#F4511C]/30 text-[var(--color-text)]">
            {/* Left Column: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10">
                <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-accent)] flex items-center justify-center rounded-none rotate-3">
                            <Zap size={20} className="text-white fill-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic text-[var(--color-text)]">UniteX</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
                            {mode === 'login' ? 'Welcome back!' : 'Create an account'}
                        </h1>
                        <p className="text-[var(--color-text)] opacity-60 text-sm leading-relaxed">
                            We empower developers and technical teams to create, simulate, and manage AI-driven workflows visually.
                        </p>
                    </div>

                    {/* Method Toggle */}
                    <div className="flex p-1 bg-white rounded-none border border-[var(--color-surface)] w-fit">
                        <button 
                                    onClick={() => { setMethod('email'); setStep('input'); }}
                                    className={cn(
                                        "px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                                        method === 'email' ? "bg-[var(--color-accent)] text-white shadow-lg" : "text-[var(--color-text)] opacity-40 hover:opacity-100"
                                    )}
                                >
                                    Email
                                </button>
                                <button 
                                    onClick={() => { setMethod('phone'); setStep('input'); }}
                                    className={cn(
                                        "px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                                        method === 'phone' ? "bg-[var(--color-accent)] text-white shadow-lg" : "text-[var(--color-text)] opacity-40 hover:opacity-100"
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
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                value={displayName}
                                                onChange={e => setDisplayName(e.target.value)}
                                                required
                                                className="w-full bg-white border border-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-gray-400 font-medium"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="youremail@yourdomain.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white border border-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Min 8 characters"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-white border border-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[var(--color-accent)] text-white text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Establish Account'}
                                    <ChevronRight size={14} strokeWidth={3} />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={step === 'input' ? handlePhoneSubmit : handleVerifyOtp} className="space-y-4">
                                {step === 'input' ? (
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            required
                                            className="w-full bg-white border border-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-gray-400 font-medium"
                                        />
                                        <p className="text-[10px] text-gray-400 font-mono mt-1">Includes country code (e.g., +1 for USA)</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Verification Code</label>
                                        <input
                                            type="text"
                                            placeholder="6-digit code"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            required
                                            maxLength={6}
                                            className="w-full bg-white border border-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-gray-400 font-mono tracking-[1em] text-center"
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[var(--color-accent)] text-white text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
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
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-surface)]" /></div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-[var(--color-bg)] text-[10px] text-gray-500 font-bold uppercase tracking-widest">or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={handleGoogle}
                            className="bg-white border border-[var(--color-surface)] py-4 flex items-center justify-center hover:bg-gray-50 transition-all group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#ea4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.092 1.092-2.82 2.256-6.024 2.256-4.812 0-8.68-3.92-8.68-8.736a8.6 8.6 0 0 1 8.68-8.736c2.592 0 4.548 1.02 5.94 2.304l2.304-2.304C18.42 1.092 15.6 0 12.12 0 5.484 0 0 5.484 0 12.12c0 6.636 5.484 12.12 12.12 12.12 3.588 0 6.3-1.188 8.424-3.42 2.184-2.184 2.868-5.268 2.868-7.74 0-.744-.06-1.464-.18-2.16H12.48z"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => handleOAuthFallback('GitHub')}
                            className="bg-white border border-[var(--color-surface)] py-4 flex items-center justify-center hover:bg-gray-50 transition-all group"
                            title="Sign in with GitHub"
                        >
                             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => handleOAuthFallback('Apple')}
                            className="bg-white border border-[var(--color-surface)] py-4 flex items-center justify-center hover:bg-gray-50 transition-all group"
                            title="Sign in with Apple"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                            </svg>
                        </button>
                    </div>

                    {/* Guest Button */}
                    <button
                        onClick={handleGuest}
                        disabled={loading}
                        className="w-full bg-white border border-[var(--color-surface)] py-4 mt-4 flex items-center justify-center hover:bg-gray-50 transition-all text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--color-text)]"
                    >
                        Continue as Guest
                    </button>

                    <p className="text-xs text-center text-gray-500 font-medium mt-8">
                        {mode === 'login' ? "Access denied? " : 'Already recognized? '}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-[var(--color-accent)] font-black uppercase tracking-tighter hover:underline"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Column: Visual Section */}
            <div className="hidden lg:flex flex-1 bg-[var(--color-bg)] relative items-center justify-center p-12 overflow-hidden border-l border-[var(--color-surface)]">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full -mr-64 -mt-64 animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-surface)]/20 blur-[100px] rounded-full -ml-32 -mb-32" />

                <div className="relative z-20 w-full max-w-lg aspect-[4/5] bg-white border border-[var(--color-surface)] p-12 flex flex-col justify-between shadow-sm group overflow-hidden">
                    {/* Interior Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                    
                    <div className="space-y-6">
                        <div className="flex gap-2">
                             <span className="px-3 py-1 bg-white border border-[var(--color-surface)] text-[9px] font-bold uppercase tracking-widest text-gray-400">Node Alliance</span>
                             <span className="px-3 py-1 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/10 text-[9px] font-bold uppercase tracking-widest text-[var(--color-accent)]">Network Core</span>
                        </div>
                        <blockquote className="text-3xl font-medium leading-tight tracking-tight text-[var(--color-text)]">
                            "UniteX Pro Components have completely changed how we work. What used to take hours every week is now fully automated."
                        </blockquote>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--color-surface)] rounded-none overflow-hidden border border-[var(--color-surface)]">
                                <img 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
                                    className="w-full h-full object-cover grayscale"
                                    alt="Testimonial Author"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight text-[var(--color-text)]">Gina Clinton</h4>
                                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Head of Product, Acme Inc.</p>
                            </div>
                        </div>
                        <div className="h-px bg-[var(--color-surface)] w-full" />
                        <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.2em] text-gray-400 uppercase">
                            <span>Established 2024</span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-none opacity-50" />
                                <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-none opacity-30" />
                                <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-none opacity-10" />
                            </div>
                        </div>
                    </div>

                    {/* Subtle hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
            </div>
            
            {/* Global background noise texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50 mix-blend-overlay" />
        </div>
    );
}
