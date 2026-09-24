'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, AlertCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-amber-500/30">
      <div className="w-full max-w-md space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <a href="/" className="inline-flex items-center gap-2 font-bold text-lg text-white mb-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              CV
            </span>
            CVtoWeb
          </a>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Create Your Account' : 'Candidate Portal'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? 'Register to manage and personalize your executive CV website.'
              : 'Sign in to edit your portfolio content, custom domain, and view visitor analytics.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`w-1/2 py-2 rounded-lg transition-all ${
              !isRegister ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`w-1/2 py-2 rounded-lg transition-all ${
              isRegister ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus-within:border-amber-400 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Mazen Mohamed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent w-full text-white placeholder-slate-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus-within:border-amber-400 text-sm">
              <Mail className="w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full text-white placeholder-slate-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus-within:border-amber-400 text-sm">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-white placeholder-slate-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Register & Continue' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">Demo Candidate Account:</div>
          <div>Email: <code className="text-amber-400">mazeneltelbany78@gmail.com</code></div>
          <div>Password: <code className="text-amber-400">mazen123</code></div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <a href="/" className="hover:text-slate-300 transition-colors">
            ← Home
          </a>
          <a href="/admin/login" className="hover:text-amber-400 transition-colors">
            Admin Access →
          </a>
        </div>
      </div>
    </div>
  );
}
