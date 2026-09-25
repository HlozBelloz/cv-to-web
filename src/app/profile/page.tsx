'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CVProfile, 
  CertificateItem 
} from '@/types';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink, 
  Share2, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Palette, 
  GraduationCap, 
  Camera, 
  Save, 
  Plus, 
  Trash2, 
  Send, 
  Loader2, 
  ArrowLeft,
  Eye,
  ShieldCheck,
  Layout,
  Briefcase
} from 'lucide-react';
import { AtsAnalysisCard } from '@/components/profile/AtsAnalysisCard';

const ACCENT_COLORS = [
  { name: 'amber', label: 'Gold Amber', bg: 'bg-amber-500', border: 'border-amber-500' },
  { name: 'emerald', label: 'Emerald Mint', bg: 'bg-emerald-500', border: 'border-emerald-500' },
  { name: 'blue', label: 'Cyber Blue', bg: 'bg-blue-500', border: 'border-blue-500' },
  { name: 'indigo', label: 'Royal Indigo', bg: 'bg-indigo-500', border: 'border-indigo-500' },
  { name: 'violet', label: 'Electric Violet', bg: 'bg-purple-500', border: 'border-purple-500' },
  { name: 'rose', label: 'Crimson Rose', bg: 'bg-rose-500', border: 'border-rose-500' },
  { name: 'cyan', label: 'Neon Cyan', bg: 'bg-cyan-500', border: 'border-cyan-500' },
  { name: 'slate', label: 'Titanium Slate', bg: 'bg-slate-400', border: 'border-slate-400' },
];

const THEMES = [
  { id: 'executive', name: 'Executive Suite', desc: 'Dark slate, warm amber/gold, high-trust leadership design', preview: 'bg-gradient-to-r from-slate-900 to-amber-950/40' },
  { id: 'tech', name: 'Modern Tech', desc: 'Cyber dark terminal, glowing emerald, metrics cards', preview: 'bg-gradient-to-r from-[#070b14] to-emerald-950/40' },
  { id: 'minimal', name: 'Minimalist Swiss', desc: 'Warm ivory editorial, clean serif typography', preview: 'bg-gradient-to-r from-stone-100 to-stone-200 text-stone-900' },
  { id: 'creative', name: 'Creative Bento', desc: 'Vibrant violet-rose gradients with interactive bento modules', preview: 'bg-gradient-to-r from-purple-950 to-rose-950/50' },
];

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CVProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'customize' | 'media' | 'ai' | 'ats'>('overview');

  // Form states for CV customizer
  const [selectedTheme, setSelectedTheme] = useState('executive');
  const [selectedAccent, setSelectedAccent] = useState('amber');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');
  const [gpa, setGpa] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  // New certificate modal/form
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    imageUrl: '',
    credentialUrl: '',
    badge: ''
  });
  const [showAddCert, setShowAddCert] = useState(false);

  // AI Chat state
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI CV Advisor. Ask me to update your GPA, switch your theme, polish your summary, or optimize your highlights for executive recruiters.'
    }
  ]);

  useEffect(() => {
    async function loadProfile() {
      try {
        // Try getting authenticated user
        const authRes = await fetch('/api/auth/me');
        let targetSlug = 'mazen';
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.profile && authData.profile.slug) {
            targetSlug = authData.profile.slug;
          }
        }

        // Fetch profile
        const profRes = await fetch(`/api/profiles?slug=${targetSlug}`);
        let data: CVProfile | null = null;
        if (profRes.ok) {
          data = await profRes.json();
        }

        // If not found from slug, try general list
        if (!data || !data.fullName) {
          const listRes = await fetch('/api/profiles');
          if (listRes.ok) {
            const list: CVProfile[] = await listRes.json();
            if (Array.isArray(list) && list.length > 0) {
              data = list.find(p => p.slug === targetSlug) || list[0];
            }
          }
        }

        // Fallback local storage
        if (!data && typeof window !== 'undefined') {
          const cached = localStorage.getItem('current_profile');
          if (cached) {
            data = JSON.parse(cached);
          }
        }

        if (data) {
          setProfile(data);
          setFullName(data.fullName || '');
          setTitle(data.title || '');
          setTagline(data.tagline || '');
          setSummary(data.summary || '');
          setSelectedTheme(data.theme || 'executive');
          setSelectedAccent(data.accentColor || 'amber');
          setAvatarUrl(data.avatarUrl || '');
          setCoverUrl(data.coverUrl || '');
          setCertificates(data.certificates || []);

          // Extract GPA if available
          const gpaMetric = (data.metrics || []).find(m => m.label.toLowerCase().includes('gpa') || m.label.toLowerCase().includes('standing'));
          if (gpaMetric) {
            setGpa(gpaMetric.value.replace(/[^0-9.]/g, '') || '3.8');
          } else if (data.education && data.education[0]?.honors) {
            const match = data.education[0].honors.match(/GPA:\s*([0-9.]+)/i);
            if (match) setGpa(match[1]);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleCopyLink = () => {
    if (profile && typeof window !== 'undefined') {
      const url = `${window.location.origin}/cv/${profile.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Update GPA in metrics and education
      const updatedMetrics = [...(profile.metrics || [])];
      const gpaIdx = updatedMetrics.findIndex(m => m.label.toLowerCase().includes('gpa') || m.label.toLowerCase().includes('standing'));
      if (gpaIdx >= 0) {
        updatedMetrics[gpaIdx] = {
          ...updatedMetrics[gpaIdx],
          value: gpa ? `${gpa} / 4.0` : updatedMetrics[gpaIdx].value
        };
      } else if (gpa) {
        updatedMetrics.unshift({
          label: 'Academic GPA',
          value: `${gpa} / 4.0`,
          description: 'Verified Academic Standing'
        });
      }

      const updatedEducation = (profile.education || []).map((edu, idx) => {
        if (idx === 0 && gpa) {
          return {
            ...edu,
            honors: `GPA: ${gpa} / 4.0 | Academic Distinction`
          };
        }
        return edu;
      });

      const updated: CVProfile = {
        ...profile,
        fullName: fullName.trim() || profile.fullName,
        title: title.trim() || profile.title,
        tagline: tagline.trim() || profile.tagline,
        summary: summary.trim() || profile.summary,
        theme: selectedTheme as any,
        accentColor: selectedAccent as any,
        avatarUrl: avatarUrl.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        certificates: certificates,
        metrics: updatedMetrics,
        education: updatedEducation,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (!res.ok) {
        throw new Error('Failed to save profile changes');
      }

      setProfile(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_profile', JSON.stringify(updated));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCertificate = () => {
    if (!newCert.title || !newCert.issuer) {
      alert('Please provide at least certificate title and issuer organization');
      return;
    }

    const item: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: newCert.title.trim(),
      issuer: newCert.issuer.trim(),
      issueDate: newCert.issueDate.trim() || `${new Date().getFullYear()}`,
      imageUrl: newCert.imageUrl.trim() || undefined,
      credentialUrl: newCert.credentialUrl.trim() || undefined,
      badge: newCert.badge.trim() || undefined
    };

    setCertificates([item, ...certificates]);
    setNewCert({ title: '', issuer: '', issueDate: '', imageUrl: '', credentialUrl: '', badge: '' });
    setShowAddCert(false);
  };

  const handleRemoveCertificate = (id: string) => {
    setCertificates(certificates.filter(c => c.id !== id));
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading || !profile) return;

    const userText = aiInput.trim();
    setAiInput('');
    const newHistory = [...aiMessages, { role: 'user' as const, content: userText }];
    setAiMessages(newHistory);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          profile: {
            ...profile,
            theme: selectedTheme,
            accentColor: selectedAccent,
            fullName,
            title,
            summary
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Changes prepared!' }]);

        if (data.updates) {
          if (data.updates.theme) setSelectedTheme(data.updates.theme);
          if (data.updates.accentColor) setSelectedAccent(data.updates.accentColor);
          if (data.updates.summary) setSummary(data.updates.summary);
          if (data.updates.title) setTitle(data.updates.title);
          if (data.updates.fullName) setFullName(data.updates.fullName);

          // Extract GPA if returned in updates
          if (data.updates.education && data.updates.education[0]?.gpa) {
            setGpa(data.updates.education[0].gpa);
          }
        }
      } else {
        setAiMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Could not process request.' }]);
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Try again.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading Candidate Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 font-sans pb-20">
      
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Platform Home</span>
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <a
                href={`/cv/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-400 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live CV</span>
              </a>
            )}

            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE-FIRST PROFILE CONTAINER (Figma 1044938598351718939 Reference) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* HERO / COVER & AVATAR CARD */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Cover Banner */}
          <div className="h-44 sm:h-52 w-full relative bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 overflow-hidden">
            {coverUrl ? (
              <img src={coverUrl} alt="Profile Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900 to-slate-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              {/* Avatar */}
              <div className="relative inline-block">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-800">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <span className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-md border-2 border-slate-900" title="Verified Candidate">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied!' : 'Share Public CV'}</span>
                </button>

                {profile && (
                  <a
                    href={`/cv/${profile.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-transform hover:scale-[1.02]"
                  >
                    <span>Visit Public Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Candidate Title & Location */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {fullName || 'Candidate Name'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                  {selectedTheme.toUpperCase()} THEME
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-amber-400">
                {title || 'Professional Title'}
              </p>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {profile.location}
                  </span>
                )}
                {profile?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {profile.email}
                  </span>
                )}
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Figma Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Total Views</span>
                <span className="text-lg font-bold text-white">{profile?.viewCount || 142}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Academic GPA</span>
                <span className="text-lg font-bold text-amber-400">{gpa ? `${gpa} / 4.0` : '1.65 (A-)'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Verified Status</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Certifications</span>
                <span className="text-lg font-bold text-purple-400">{certificates.length} Records</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            Overview & Bio
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'customize' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            CV Theme & Colors
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'media' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            Certificates & Media ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:text-amber-300 hover:bg-slate-900'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Customizer
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 ${activeTab === 'ats' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ATS Readiness
          </button>
        </div>

        {/* TAB 1: OVERVIEW & BIO */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                Executive Summary
              </h2>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write your professional summary..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <p className="text-xs text-slate-500">
                This summary appears at the very top of your public CV website for all recruiters and hiring managers.
              </p>
            </div>

            {/* Experience and Education Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Positions & Experience ({profile?.experiences?.length || 0})
                </h3>
                <div className="space-y-3">
                  {(profile?.experiences || []).map((exp) => (
                    <div key={exp.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="font-bold text-xs text-white">{exp.role}</div>
                      <div className="text-[11px] text-amber-400">{exp.company} • {exp.startDate}-{exp.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  Academic History
                </h3>
                <div className="space-y-3">
                  {(profile?.education || []).map((edu) => (
                    <div key={edu.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="font-bold text-xs text-white">{edu.degree}</div>
                      <div className="text-[11px] text-amber-400">{edu.institution} • {edu.endDate}</div>
                      {edu.honors && <div className="text-[11px] text-emerald-400 mt-1">{edu.honors}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CV CUSTOMIZER & THEME LOCK */}
        {activeTab === 'customize' && (
          <div className="space-y-6">
            {/* Note banner: User chooses one theme, it locks for all visitors! */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-amber-400" />
              <span>
                <strong>Candidate Exclusive Control:</strong> When you select your chosen theme and accent color, it becomes the <strong>locked permanent look</strong> for all visitors who view your link. Visitors cannot alter your theme.
              </span>
            </div>

            {/* Theme Selector */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-400" />
                Select & Lock Your Public Theme
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all relative ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10' 
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">{theme.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                            LOCKED FOR VISITORS
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{theme.desc}</p>
                      <div className={`mt-3 h-3 w-full rounded-full ${theme.preview}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                Accent Color Palette
              </h2>
              <p className="text-xs text-slate-400">
                Customize your highlight badges, link glows, and interactive callouts.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {ACCENT_COLORS.map((c) => {
                  const isChosen = selectedAccent === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedAccent(c.name)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        isChosen 
                          ? 'border-amber-400 bg-slate-800 text-white shadow-md' 
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Fields (GPA, Title, Tagline) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                Academic Standing & Title
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Academic GPA (out of 4.0 or German scale)</label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="e.g. 1.65 (A-) or 3.9"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Hero Tagline / Executive Value Proposition</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : saveSuccess ? 'Saved & Locked!' : 'Save & Lock for Visitors'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES & MEDIA */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Photos Management */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Profile Avatar & Cover Photos
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Candidate Portrait Avatar URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                  {avatarUrl && (
                    <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                      <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Profile Header Cover URL</label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                  {coverUrl && (
                    <div className="mt-2 h-16 w-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                      <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Certificates Management */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Verified Certificates & Diplomas
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Showcase authenticated certificate photos with issuer credentials and verification links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCert(!showAddCert)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certificate</span>
                </button>
              </div>

              {/* Add Certificate Form */}
              {showAddCert && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
                  <h3 className="text-sm font-bold text-amber-400">Add New Verified Certificate</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Certificate Title *</label>
                      <input
                        type="text"
                        required
                        value={newCert.title}
                        onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Issuing Body / University *</label>
                      <input
                        type="text"
                        required
                        value={newCert.issuer}
                        onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                        placeholder="e.g. Cisco Networking Academy"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Issue Year</label>
                      <input
                        type="text"
                        value={newCert.issueDate}
                        onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                        placeholder="2025"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Badge Text (Optional)</label>
                      <input
                        type="text"
                        value={newCert.badge}
                        onChange={(e) => setNewCert({ ...newCert, badge: e.target.value })}
                        placeholder="e.g. Professional Level"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-slate-400 block mb-1">Certificate Image URL</label>
                      <input
                        type="url"
                        value={newCert.imageUrl}
                        onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-slate-400 block mb-1">Official Verification URL</label>
                      <input
                        type="url"
                        value={newCert.credentialUrl}
                        onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                        placeholder="https://aws.amazon.com/verification"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCert(false)}
                      className="px-4 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCertificate}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Add & Showcase
                    </button>
                  </div>
                </div>
              )}

              {/* Certificate Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                    {cert.imageUrl && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-amber-400">
                        <span>{cert.issuer}</span>
                        <span>{cert.issueDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{cert.title}</h4>
                      {cert.badge && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {cert.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      {cert.credentialUrl ? (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-amber-400 inline-flex items-center gap-1">
                          <span>Verification Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span />}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(cert.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI ASSISTANT CHAT */}
        {activeTab === 'ai' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">AI Portfolio Assistant</h2>
                <p className="text-xs text-slate-400">
                  Chat naturally with OpenRouter AI to tweak your bio, adjust your GPA, switch themes, or optimize phrasing.
                </p>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAiInput('Set my GPA to 3.9 across my portfolio and highlight metrics')}
                className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400 transition-colors"
              >
                🎓 Set GPA to 3.9
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Switch my theme to Modern Tech with emerald cyber colors')}
                className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400 transition-colors"
              >
                💻 Switch to Modern Tech
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Rewrite my executive summary to sound punchier for high-tier tech recruiters')}
                className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400 transition-colors"
              >
                ✨ Polish Executive Summary
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Change accent color to Royal Indigo')}
                className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400 transition-colors"
              >
                🎨 Change Accent to Indigo
              </button>
            </div>

            {/* Messages Container */}
            <div className="min-h-[260px] max-h-[400px] overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>AI is updating your portfolio...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAiMessage} className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask AI to change anything on your CV website..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: ATS READINESS & COMPATIBILITY AUDIT */}
        {activeTab === 'ats' && profile && (
          <AtsAnalysisCard
            profile={{
              ...profile,
              fullName,
              title,
              tagline,
              summary,
              theme: selectedTheme as CVProfile['theme'],
              accentColor: selectedAccent as CVProfile['accentColor'],
              certificates
            }}
            onOptimizeWithAi={(prompt) => {
              setActiveTab('ai');
              setAiInput(prompt);
            }}
          />
        )}

      </main>
    </div>
  );
}
