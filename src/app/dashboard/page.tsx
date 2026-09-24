'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  ExternalLink, 
  Eye, 
  Save, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Briefcase, 
  FileText,
  Share2,
  Lock
} from 'lucide-react';
import { CVProfile, UserSession } from '@/types';

export default function CandidateDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<CVProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    summary: '',
    customDomain: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setSession(data.user);

        if (data.profile) {
          setProfile(data.profile);
          setFormData({
            title: data.profile.title || '',
            tagline: data.profile.tagline || '',
            phone: data.profile.phone || '',
            location: data.profile.location || '',
            linkedinUrl: data.profile.linkedinUrl || '',
            githubUrl: data.profile.githubUrl || '',
            summary: data.profile.summary || '',
            customDomain: data.profile.customDomain || '',
          });
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSaveSuccess(null);
    setError(null);

    const updatedProfile: CVProfile = {
      ...profile,
      title: formData.title,
      tagline: formData.tagline,
      phone: formData.phone,
      location: formData.location,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      summary: formData.summary,
      customDomain: formData.customDomain.trim() ? formData.customDomain.trim().toLowerCase() : undefined,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });

      if (!res.ok) {
        throw new Error('Failed to update website settings');
      }

      setProfile(updatedProfile);
      setSaveSuccess('Your website settings have been saved successfully!');
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const copyLiveLink = () => {
    if (typeof window !== 'undefined' && profile) {
      const liveUrl = `${window.location.origin}/cv/${profile.slug}`;
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 font-bold text-white">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              CV
            </span>
            CVtoWeb
          </a>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-slate-400">My Website Settings</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-white">{session?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Banner with Live Site Link and Analytics */}
        {profile && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live & Published
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                {profile.fullName}
              </h1>
              <p className="text-xs font-mono text-amber-300">
                /cv/{profile.slug}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-500 font-semibold uppercase">Total Views</div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {profile.viewCount || 0}
                </div>
              </div>

              <a
                href={`/cv/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/10 transition-all"
              >
                <Eye className="w-4 h-4" />
                View Website
              </a>

              <button
                onClick={copyLiveLink}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Website Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Professional Details */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-5 h-5 text-amber-400" />
              Headline & Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Professional Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Information Engineering & Technology Specialist"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Nasr City, Cairo, Egypt"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Executive Tagline (Hero Subtitle)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="A compelling 1-line summary of what makes you exceptional"
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(+20) 102 199 2115"
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">GitHub Profile URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Executive Summary & Bio</label>
              <textarea
                rows={5}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Your detailed career narrative, leadership capabilities, and technical depth..."
                className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section 2: Custom Domain Mapping */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-5 h-5 text-amber-400" />
              Personal Custom Domain (Optional)
            </h2>
            <p className="text-xs text-slate-400">
              Want your CV portfolio to live on your personal domain (e.g. <code>mazen.com</code> or <code>cv.yourdomain.com</code>)? Enter it here:
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus-within:border-amber-400">
                <Globe className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. mazen.com"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  className="bg-transparent w-full text-white text-sm focus:outline-none placeholder-slate-500"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
                💡 DNS Setup: Add a CNAME record at your DNS provider pointing to <code>cname.yourplatform.com</code>.
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
