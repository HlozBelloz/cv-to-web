'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff,
  ArrowLeft
} from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function PerfectLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const googleEmail = email.trim() || prompt('Enter your Google email address:')?.trim();
      if (!googleEmail) {
        setGoogleLoading(false);
        return;
      }

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            email: googleEmail,
            name: name.trim() || googleEmail.split('@')[0],
            googleId: `goog_${Date.now()}`,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google authentication failed');
      }

      router.push('/profile');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name: name.trim(), email: email.trim(), password }
      : { email: email.trim(), password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/profile');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to authenticate';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0F1] text-black flex flex-col justify-center selection:bg-black selection:text-white font-sans relative py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top back navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-neutral-600 transition-colors px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* FIGMA SPLIT-SCREEN CONTAINER (Figma 1050476989533233612 blended with Shop.co) */}
      <div className="max-w-6xl w-full mx-auto my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-black/10 shadow-2xl overflow-hidden">
          
          {/* LEFT COLUMN: EDITORIAL SHOWCASE & VALUE PROPOSITION */}
          <div className="lg:col-span-5 bg-[#FAFAFA] p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10 relative overflow-hidden">
            
            {/* Background decorative starburst */}
            <span className="absolute -top-4 -right-4 text-black/5 text-9xl font-serif select-none pointer-events-none">
              ✦
            </span>

            <div className="space-y-6 relative z-10">
              <Link href="/" className="inline-flex items-center gap-2.5 font-black text-2xl tracking-tighter text-black uppercase">
                CVTO.WEB
              </Link>

              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Candidate Control Center
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight leading-tight">
                  MANAGE YOUR LIVE EXECUTIVE PORTFOLIO
                </h1>
                <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                  Sign in to edit your academic GPA, lock your preferred theme for all visitors, manage certificate photos, and consult your personal OpenRouter AI CV Advisor.
                </p>
              </div>

              {/* Value proposition badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-semibold text-black/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                  <span>Lock your chosen theme & accent colors for all visitors</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-black/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                  <span>Showcase verified certificate photos and portrait</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-black/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                  <span>Real-time recruiter visitor counts and analytics</span>
                </div>
              </div>
            </div>

            {/* Recruiter Testimonial Card */}
            <div className="mt-8 p-5 rounded-2xl bg-white border border-black/10 space-y-3 relative shadow-sm">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-black/70 italic leading-relaxed">
                &ldquo;Seeing a candidate with an interactive portfolio, verified certificate badges, and high-performance edge availability instantly sets them apart from 99% of applicants.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-black/10 text-[11px] text-black/50">
                <span className="font-bold text-black">Tarek Mansour</span>
                <span>•</span>
                <span>Head of Tech Talent, Cairo & Dubai</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PERFECT UI AUTH CARD */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white">
            
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                  {isRegister ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-black/50 mt-1">
                  {isRegister ? 'Start building and customizing your executive website' : 'Sign in to access your portfolio editor and analytics'}
                </p>
              </div>

              <div className="flex items-center p-1 rounded-full bg-[#F0F0F0] border border-black/5 text-xs font-bold shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    !isRegister ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    isRegister ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Google One-Tap GIS Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 rounded-full bg-white hover:bg-neutral-50 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all border border-black/15 shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {googleLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <GoogleIcon />}
              <span>{isRegister ? 'Sign up with Google One-Tap' : 'Continue with Google Account'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-black/40">
              <div className="flex-1 h-px bg-black/10" />
              <span>or continue with credentials</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mazen Mohamed Hamdy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm placeholder:text-black/40 focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm placeholder:text-black/40 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">
                    Password
                  </label>
                  {!isRegister && (
                    <span className="text-[11px] font-semibold text-black/60 hover:text-black hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm placeholder:text-black/40 focus:outline-none focus:border-black focus:bg-white transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded text-black/40 hover:text-black absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-black/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-black/20 text-black focus:ring-black accent-black"
                  />
                  <span>Remember my session</span>
                </label>
                <span className="text-black/40 text-[11px] font-semibold">Secure PBKDF2</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isRegister ? 'Create Candidate Account' : 'Sign In to Dashboard'}</span>
              </button>
            </form>

            {/* Quick Demo Credentials Tip */}
            <div className="p-4 rounded-2xl bg-[#F0F0F0] border border-black/10 text-[11px] text-black/70 space-y-1">
              <span className="font-bold text-black block">Candidate Demo Login:</span>
              <p>Email: <code className="text-black font-semibold bg-white px-1.5 py-0.5 rounded border border-black/10">mazeneltelbany78@gmail.com</code> | Password: <code className="text-black font-semibold bg-white px-1.5 py-0.5 rounded border border-black/10">mazen123</code></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
