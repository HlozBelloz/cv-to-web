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
  { name: 'slate', label: 'Titanium Slate', bg: 'bg-neutral-800', border: 'border-neutral-800' },
];

const THEMES = [
  { 
    id: 'portfolio-wp-pro', 
    name: 'Portfolio WP Pro (Editorial Light)', 
    desc: 'Stone off-white canvas (#fcfbf9), Playfair Display serif headers, 3-column project archive & prominent GPA card', 
    preview: 'bg-gradient-to-r from-stone-100 to-stone-200 text-stone-900 border border-stone-300' 
  },
  { 
    id: 'cyber-dark-glass', 
    name: 'Cyber Dark Glass (Cyber Neon)', 
    desc: 'Slate-black canvas (#07090e), vibrant cyan/blue neon glowing accents, glassmorphic panels & floating GPA badge', 
    preview: 'bg-gradient-to-r from-[#07090e] to-cyan-950 border border-cyan-500/40 text-cyan-300' 
  },
  { 
    id: 'mechatronics-cobalt-emerald', 
    name: 'Cobalt & Emerald (Mechatronics)', 
    desc: 'Deep mechatronics dark cyan (#05131a), emerald green & cobalt accents with hardware competency grid', 
    preview: 'bg-gradient-to-r from-[#05131a] to-emerald-950 border border-emerald-500/40 text-emerald-300' 
  },
  { 
    id: 'editorial-luxury-warm', 
    name: 'Editorial Luxury Warm (Slate & Gold)', 
    desc: 'Warm ivory canvas (#faf8f5), warm stone panels, rose-gold accents, and refined serif typography', 
    preview: 'bg-gradient-to-r from-stone-50 to-rose-50 border border-rose-200 text-rose-950' 
  },
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
            setGpa(gpaMetric.value);
          } else if (data.education && data.education[0]?.honors) {
            setGpa(data.education[0].honors);
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
    if (!profile) return;
    const url = `${window.location.origin}/cv/${profile.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Update metrics if GPA changed
      let updatedMetrics = [...(profile.metrics || [])];
      if (gpa) {
        const existingIdx = updatedMetrics.findIndex(m => m.label.toLowerCase().includes('gpa') || m.label.toLowerCase().includes('standing'));
        if (existingIdx >= 0) {
          updatedMetrics[existingIdx] = { ...updatedMetrics[existingIdx], value: gpa };
        } else {
          updatedMetrics.push({ value: gpa, label: 'Academic Standing / GPA' });
        }
      }

      // Update education if GPA changed
      let updatedEducation = [...(profile.education || [])];
      if (gpa && updatedEducation.length > 0) {
        updatedEducation[0] = {
          ...updatedEducation[0],
          honors: gpa.toLowerCase().includes('gpa') ? gpa : `GPA: ${gpa}`
        };
      }

      const updatedProfile: CVProfile = {
        ...profile,
        fullName: fullName.trim() || profile.fullName,
        title: title.trim() || profile.title,
        tagline: tagline.trim() || profile.tagline,
        summary: summary.trim() || profile.summary,
        theme: selectedTheme as CVProfile['theme'],
        accentColor: selectedAccent as CVProfile['accentColor'],
        avatarUrl: avatarUrl.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        certificates,
        metrics: updatedMetrics,
        education: updatedEducation,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile(updatedProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_profile', JSON.stringify(updatedProfile));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error updating candidate profile');
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
      console.error(err);
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Connection failed to OpenRouter AI service.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F0F1] flex items-center justify-center text-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="text-xs font-bold uppercase tracking-wider">Loading Candidate Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F0F1] text-black font-sans selection:bg-black selection:text-white pb-16">
      
      {/* STICKY CONTROL BAR (Shop.co Clean White Header) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-neutral-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Platform Home</span>
          </Link>

          <div className="flex items-center gap-3">
            {profile && (
              <a
                href={`/cv/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/20 text-xs font-bold text-black hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live CV</span>
              </a>
            )}

            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE-FIRST PROFILE CONTAINER (Figma 1044938598351718939 blended with Shop.co) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* HERO / COVER & AVATAR CARD */}
        <div className="relative bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm">
          {/* Cover Banner */}
          <div className="h-44 sm:h-56 w-full relative bg-neutral-900 overflow-hidden">
            {coverUrl ? (
              <img src={coverUrl} alt="Profile Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-black to-neutral-800 relative">
                <span className="absolute top-6 right-8 text-white/10 text-7xl font-serif select-none pointer-events-none">
                  ✦
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Profile Header Info */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              {/* Avatar */}
              <div className="relative inline-block">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#F0EEED]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/40">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <span className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md border-2 border-white" title="Verified Candidate">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-black/15 bg-white hover:bg-neutral-50 text-xs font-bold text-black transition-all shadow-sm"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-black" />}
                  <span>{copied ? 'Link Copied!' : 'Share Public CV'}</span>
                </button>

                {profile && (
                  <a
                    href={`/cv/${profile.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-transform hover:scale-[1.02]"
                  >
                    <span>Visit Public Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Candidate Title & Location */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                  {fullName || 'Candidate Name'}
                </h1>
                <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
                  {selectedTheme.toUpperCase()} THEME
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-black/70">
                {title || 'Professional Title'}
              </p>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-black/50 pt-1 font-medium">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-black/40" />
                    {profile.location}
                  </span>
                )}
                {profile?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-black/40" />
                    {profile.email}
                  </span>
                )}
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-black/40" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Figma Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-black/10">
              <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
                <span className="text-xs text-black/50 block font-medium">Total Views</span>
                <span className="text-xl font-black text-black">{profile?.viewCount || 142}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
                <span className="text-xs text-black/50 block font-medium">Academic GPA</span>
                <span className="text-xl font-black text-black">{gpa ? `${gpa} / 4.0` : '1.65 (A-)'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
                <span className="text-xs text-black/50 block font-medium">Verified Status</span>
                <span className="text-xl font-black text-emerald-700 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
                <span className="text-xs text-black/50 block font-medium">Certifications</span>
                <span className="text-xl font-black text-black">{certificates.length} Records</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION (Shop.co Rounded Pill Bar) */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${activeTab === 'overview' ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black hover:bg-white bg-white/60 border border-black/5'}`}
          >
            Overview & Bio
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${activeTab === 'customize' ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black hover:bg-white bg-white/60 border border-black/5'}`}
          >
            CV Theme & Colors
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 ${activeTab === 'media' ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black hover:bg-white bg-white/60 border border-black/5'}`}
          >
            Certificates & Media ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 inline-flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-black text-white shadow-sm' : 'text-black hover:bg-white bg-white/60 border border-black/5'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Customizer
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-5 py-2.5 rounded-full transition-all shrink-0 inline-flex items-center gap-1.5 ${activeTab === 'ats' ? 'bg-black text-white shadow-sm' : 'text-black/60 hover:text-black hover:bg-white bg-white/60 border border-black/5'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ATS Readiness
          </button>
        </div>

        {/* TAB 1: OVERVIEW & BIO */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-black uppercase flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-black" />
                Executive Summary
              </h2>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write your professional summary..."
                className="w-full px-5 py-4 rounded-3xl bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
              <p className="text-xs text-black/50 font-medium">
                This summary appears at the very top of your public CV website for all recruiters and hiring managers.
              </p>
            </div>

            {/* Experience and Education Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div className="bg-white border border-black/10 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-black text-black uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-black" />
                  Positions & Experience ({profile?.experiences?.length || 0})
                </h3>
                <div className="space-y-3">
                  {(profile?.experiences || []).map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5">
                      <div className="font-bold text-xs text-black">{exp.role}</div>
                      <div className="text-[11px] text-black/60 font-medium">{exp.company} • {exp.startDate}-{exp.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white border border-black/10 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-black text-black uppercase flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-black" />
                  Academic History
                </h3>
                <div className="space-y-3">
                  {(profile?.education || []).map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5">
                      <div className="font-bold text-xs text-black">{edu.degree}</div>
                      <div className="text-[11px] text-black/60 font-medium">{edu.institution} • {edu.endDate}</div>
                      {edu.honors && <div className="text-[11px] text-emerald-700 font-bold mt-1">{edu.honors}</div>}
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
            <div className="p-4 rounded-2xl bg-white border border-black/10 text-black text-xs flex items-center gap-3 shadow-sm">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>
                <strong>Candidate Exclusive Control:</strong> When you select your chosen theme and accent color, it becomes the <strong>locked permanent look</strong> for all visitors who view your link. Visitors cannot alter your theme.
              </span>
            </div>

            {/* Theme Selector */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-black uppercase flex items-center gap-2">
                <Layout className="w-5 h-5 text-black" />
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
                          ? 'border-black bg-[#F9F9F9] shadow-md' 
                          : 'border-black/10 hover:border-black/30 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-black">{theme.name}</span>
                        {isSelected && (
                          <span className="px-2.5 py-0.5 rounded-full bg-black text-white font-black text-[10px] uppercase">
                            LOCKED FOR VISITORS
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black/60 font-medium">{theme.desc}</p>
                      <div className={`mt-3 h-3 w-full rounded-full ${theme.preview}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-black uppercase flex items-center gap-2">
                <Palette className="w-5 h-5 text-black" />
                Accent Color Palette
              </h2>
              <p className="text-xs text-black/50">
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
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all ${
                        isChosen 
                          ? 'border-black bg-black text-white shadow-sm' 
                          : 'border-black/15 hover:border-black/30 bg-white text-black'
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
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-black uppercase flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-black" />
                Academic Standing & Title
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Academic GPA (out of 4.0 or German scale)
                  </label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="e.g. 1.65 (A-) or 3.9"
                    className="w-full px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Hero Tagline / Executive Value Proposition
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
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
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-black uppercase flex items-center gap-2">
                <Camera className="w-5 h-5 text-black" />
                Profile Avatar & Cover Photos
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Candidate Portrait Avatar URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                  {avatarUrl && (
                    <div className="mt-2 w-16 h-16 rounded-2xl overflow-hidden border border-black/10 bg-[#F0EEED]">
                      <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1.5">
                    Profile Header Cover URL
                  </label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                  {coverUrl && (
                    <div className="mt-2 h-16 w-32 rounded-2xl overflow-hidden border border-black/10 bg-[#F0EEED]">
                      <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Certificates Management */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-black uppercase flex items-center gap-2">
                    <Award className="w-5 h-5 text-black" />
                    Verified Certificates & Diplomas
                  </h2>
                  <p className="text-xs text-black/50 mt-1 font-medium">
                    Showcase authenticated certificate photos with issuer credentials and verification links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCert(!showAddCert)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certificate</span>
                </button>
              </div>

              {/* Add Certificate Form */}
              {showAddCert && (
                <div className="p-6 rounded-3xl bg-[#F9F9F9] border border-black/10 space-y-4">
                  <h3 className="text-sm font-black text-black uppercase">Add New Verified Certificate</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-black font-bold uppercase block mb-1">Certificate Title *</label>
                      <input
                        type="text"
                        required
                        value={newCert.title}
                        onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="w-full px-4 py-2.5 rounded-full bg-white border border-black/15 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-black font-bold uppercase block mb-1">Issuing Body / University *</label>
                      <input
                        type="text"
                        required
                        value={newCert.issuer}
                        onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                        placeholder="e.g. Cisco Networking Academy"
                        className="w-full px-4 py-2.5 rounded-full bg-white border border-black/15 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-black font-bold uppercase block mb-1">Issue Year</label>
                      <input
                        type="text"
                        value={newCert.issueDate}
                        onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                        placeholder="2025"
                        className="w-full px-4 py-2.5 rounded-full bg-white border border-black/15 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-black font-bold uppercase block mb-1">Badge Text (Optional)</label>
                      <input
                        type="text"
                        value={newCert.badge}
                        onChange={(e) => setNewCert({ ...newCert, badge: e.target.value })}
                        placeholder="e.g. Professional Level"
                        className="w-full px-4 py-2.5 rounded-full bg-white border border-black/15 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-black font-bold uppercase block mb-1">Certificate Image URL</label>
                      <input
                        type="url"
                        value={newCert.imageUrl}
                        onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 rounded-full bg-white border border-black/15 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-black font-bold uppercase block mb-1">Official Verification URL</label>
                      <input
                        type="url"
                        value={newCert.credentialUrl}
                        onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                        placeholder="https://aws.amazon.com/verification"
                        className="w-full px-4 py-2.5 rounded-full bg-white border border-black/15 text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCert(false)}
                      className="px-4 py-2 rounded-full border border-black/15 text-black font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCertificate}
                      className="px-5 py-2 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-colors"
                    >
                      Add & Showcase
                    </button>
                  </div>
                </div>
              )}

              {/* Certificate Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-5 rounded-3xl bg-[#F9F9F9] border border-black/10 flex flex-col justify-between space-y-4">
                    {cert.imageUrl && (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white border border-black/10">
                        <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-black/60 font-medium">
                        <span>{cert.issuer}</span>
                        <span>{cert.issueDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-black mt-1">{cert.title}</h4>
                      {cert.badge && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 text-black border border-black/10">
                          {cert.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-black/10">
                      {cert.credentialUrl ? (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-black/70 hover:text-black inline-flex items-center gap-1 font-semibold">
                          <span>Verification Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span />}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(cert.id)}
                        className="p-1.5 rounded-full text-black/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-full bg-black text-white">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <h2 className="text-lg font-black text-black uppercase">AI Portfolio Assistant</h2>
                <p className="text-xs text-black/50 font-medium">
                  Chat naturally with OpenRouter AI to tweak your bio, adjust your GPA, switch themes, or optimize phrasing.
                </p>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAiInput('Set my GPA to 3.9 across my portfolio and highlight metrics')}
                className="px-3.5 py-1.5 rounded-full bg-[#F9F9F9] border border-black/10 text-xs font-semibold text-black hover:border-black transition-colors"
              >
                🎓 Set GPA to 3.9
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Switch my theme to Modern Tech with emerald cyber colors')}
                className="px-3.5 py-1.5 rounded-full bg-[#F9F9F9] border border-black/10 text-xs font-semibold text-black hover:border-black transition-colors"
              >
                💻 Switch to Modern Tech
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Rewrite my executive summary to sound punchier for high-tier tech recruiters')}
                className="px-3.5 py-1.5 rounded-full bg-[#F9F9F9] border border-black/10 text-xs font-semibold text-black hover:border-black transition-colors"
              >
                ✨ Polish Executive Summary
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Change accent color to Royal Indigo')}
                className="px-3.5 py-1.5 rounded-full bg-[#F9F9F9] border border-black/10 text-xs font-semibold text-black hover:border-black transition-colors"
              >
                🎨 Change Accent to Indigo
              </button>
            </div>

            {/* Messages Container */}
            <div className="min-h-[260px] max-h-[400px] overflow-y-auto space-y-3 p-4 rounded-3xl bg-[#FAFAFA] border border-black/10">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-black text-white font-medium rounded-tr-none'
                        : 'bg-white border border-black/10 text-black rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/10 rounded-3xl p-3.5 text-xs text-black/60 flex items-center gap-2 shadow-sm rounded-tl-none">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
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
                className="flex-1 px-5 py-3 rounded-full bg-[#F9F9F9] border border-black/15 text-black text-xs sm:text-sm focus:outline-none focus:border-black focus:bg-white"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="px-6 py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-all disabled:opacity-50"
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
