'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Globe, 
  Eye, 
  Save, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Share2,
  Sparkles,
  Palette,
  GraduationCap,
  Briefcase,
  Send,
  Bot,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { CVProfile, UserSession, Education } from '@/types';

type SupportedTheme = 'executive' | 'modern' | 'minimal' | 'tech' | 'creative';
type AccentColor = 'amber' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'cyan' | 'slate';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  patches?: Record<string, unknown>;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<CVProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Active theme & accent color
  const [selectedTheme, setSelectedTheme] = useState<SupportedTheme>('executive');
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>('amber');

  // Education / GPA state
  const [gpa, setGpa] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [honors, setHonors] = useState('');

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

  // AI Assistant Drawer state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hello! I'm your AI CV & Website Assistant. Ask me to change your GPA, rewrite your executive summary, switch your theme, or adjust any detail of your portfolio website!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
          const p: CVProfile = data.profile;
          setProfile(p);
          setSelectedTheme((p.theme || 'executive') as SupportedTheme);
          setSelectedAccent((p.accentColor || 'amber') as AccentColor);

          // Extract education info
          const firstEdu = p.education?.[0];
          if (firstEdu) {
            setDegree(firstEdu.degree || '');
            setInstitution(firstEdu.institution || '');
            setFieldOfStudy(firstEdu.fieldOfStudy || '');
            setGradYear(firstEdu.endDate || '');
            setHonors(firstEdu.honors || '');
            setGpa(firstEdu.gpa || (p.metrics?.find(m => m.label.toLowerCase().includes('gpa'))?.value.split('/')[0].trim() || ''));
          }

          setFormData({
            title: p.title || '',
            tagline: p.tagline || '',
            phone: p.phone || '',
            location: p.location || '',
            linkedinUrl: p.linkedinUrl || '',
            githubUrl: p.githubUrl || '',
            summary: p.summary || '',
            customDomain: p.customDomain || '',
          });
        }
      } catch (err: unknown) {
        console.error(err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  useEffect(() => {
    if (isAiOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiOpen]);

  const handleSave = async (e?: React.FormEvent, directProfile?: CVProfile) => {
    if (e) e.preventDefault();
    const baseProfile = directProfile || profile;
    if (!baseProfile) return;

    setSaving(true);
    setSaveSuccess(null);
    setError(null);

    // Build updated education
    const updatedEdu: Education[] = baseProfile.education && baseProfile.education.length > 0 
      ? baseProfile.education.map((edu, idx) => idx === 0 ? {
          ...edu,
          degree: degree || edu.degree,
          institution: institution || edu.institution,
          fieldOfStudy: fieldOfStudy || edu.fieldOfStudy,
          endDate: gradYear || edu.endDate,
          gpa: gpa || edu.gpa,
          honors: honors || (gpa ? `GPA: ${gpa} / 4.0` : edu.honors),
        } : edu)
      : [{
          id: 'edu-primary',
          degree: degree || 'Bachelor of Science',
          institution: institution || 'University',
          fieldOfStudy: fieldOfStudy || 'Engineering',
          endDate: gradYear || '2026',
          gpa: gpa || '3.8',
          honors: honors || (gpa ? `GPA: ${gpa} / 4.0` : 'Honors'),
        }];

    // Update highlight metrics with GPA
    const updatedMetrics = [...(baseProfile.metrics || [])];
    if (gpa) {
      const gpaMetricIdx = updatedMetrics.findIndex(m => m.label.toLowerCase().includes('gpa'));
      if (gpaMetricIdx >= 0) {
        updatedMetrics[gpaMetricIdx] = { ...updatedMetrics[gpaMetricIdx], value: `${gpa} / 4.0` };
      } else {
        updatedMetrics.unshift({ label: 'Academic GPA', value: `${gpa} / 4.0`, description: 'Verified Grade Point Average' });
      }
    }

    const updatedProfile: CVProfile = {
      ...baseProfile,
      theme: selectedTheme,
      accentColor: selectedAccent,
      title: formData.title,
      tagline: formData.tagline,
      phone: formData.phone,
      location: formData.location,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      summary: formData.summary,
      education: updatedEdu,
      metrics: updatedMetrics,
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cv_profile_${updatedProfile.slug}`, JSON.stringify(updatedProfile));
        localStorage.setItem(`cv_theme_${updatedProfile.slug}`, selectedTheme);
      }
      setSaveSuccess('Your website settings and theme have been locked and saved successfully!');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error saving changes';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAiSendMessage = async (customText?: string) => {
    const textToSend = customText || aiInput.trim();
    if (!textToSend || !profile || aiLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setAiInput('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...chatMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: textToSend },
          ],
          profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process AI request');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patches: data.updates,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // Apply modifications immediately to state
      if (data.updatedProfile) {
        const up: CVProfile = data.updatedProfile;
        setProfile(up);

        if (up.theme) setSelectedTheme(up.theme as SupportedTheme);
        if (up.accentColor) setSelectedAccent(up.accentColor as AccentColor);
        if (up.title) setFormData(prev => ({ ...prev, title: up.title }));
        if (up.summary) setFormData(prev => ({ ...prev, summary: up.summary }));
        if (up.tagline) setFormData(prev => ({ ...prev, tagline: up.tagline }));
        if (up.location) setFormData(prev => ({ ...prev, location: up.location || '' }));

        const edu0 = up.education?.[0];
        if (edu0) {
          if (edu0.gpa) setGpa(edu0.gpa);
          if (edu0.degree) setDegree(edu0.degree);
          if (edu0.institution) setInstitution(edu0.institution);
          if (edu0.honors) setHonors(edu0.honors);
        }

        // Persist to database automatically
        await handleSave(undefined, up);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'AI error occurred';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: `⚠️ Note: ${errorMsg}. Your settings remain safe.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
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

  const themesList: Array<{ id: SupportedTheme; name: string; desc: string; previewBadge: string }> = [
    {
      id: 'executive',
      name: 'Executive Leadership',
      desc: 'Slate & Amber boardroom aesthetic. High authority, executive metrics, and corporate hierarchy.',
      previewBadge: 'Slate / Amber',
    },
    {
      id: 'tech',
      name: 'Modern Tech & Terminal',
      desc: 'Cyber-dark monospace layout with terminal output, GitHub commit styling, and technical depth.',
      previewBadge: 'Dark / Cyan',
    },
    {
      id: 'minimal',
      name: 'Minimalist Swiss',
      desc: 'Swiss editorial ivory typography, high-density layout, classical serif elegance, and clean grid.',
      previewBadge: 'Ivory / Charcoal',
    },
    {
      id: 'creative',
      name: 'Creative Bento Grid',
      desc: 'Vibrant modern bento layout, interactive cards, violet/rose subtle gradients, and dynamic visual flow.',
      previewBadge: 'Violet / Rose',
    },
  ];

  const accentColors: Array<{ id: AccentColor; label: string; bgClass: string }> = [
    { id: 'amber', label: 'Executive Amber', bgClass: 'bg-amber-500' },
    { id: 'emerald', label: 'Emerald Mint', bgClass: 'bg-emerald-500' },
    { id: 'cyan', label: 'Electric Cyan', bgClass: 'bg-cyan-500' },
    { id: 'indigo', label: 'Deep Indigo', bgClass: 'bg-indigo-500' },
    { id: 'violet', label: 'Royal Violet', bgClass: 'bg-violet-500' },
    { id: 'rose', label: 'Crimson Rose', bgClass: 'bg-rose-500' },
    { id: 'blue', label: 'Cobalt Blue', bgClass: 'bg-blue-500' },
    { id: 'slate', label: 'Titanium Slate', bgClass: 'bg-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 relative">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              CV
            </span>
            CVtoWeb
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-slate-400">Candidate Control Center</span>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>AI CV Assistant</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px] uppercase tracking-wider font-extrabold">
              OpenRouter
            </span>
          </button>

          <span className="text-xs text-slate-400 hidden sm:inline border-l border-slate-800 pl-3">
            Logged in as <strong className="text-white">{session?.name}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
        
        {/* Banner with Live Site Link and Analytics */}
        {profile && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Website
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                  Theme: {selectedTheme.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {profile.fullName}
              </h1>
              <p className="text-xs font-mono text-amber-300 flex items-center gap-1">
                <span>https://cv-to-web.pages.dev/cv/{profile.slug}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Views</div>
                <div className="text-xl font-black text-amber-400 font-mono">
                  {profile.viewCount || 0}
                </div>
              </div>

              <a
                href={`/cv/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                View Public Site
              </a>

              <button
                onClick={copyLiveLink}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? 'Copied Link!' : 'Share Link'}
              </button>
            </div>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2.5 shadow-lg">
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
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Section 1: Choose 1 Fixed Theme (Locked for Public Visitors) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  Locked Website Theme
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose the single theme for your website. <strong>This theme is locked for all public visitors</strong> who access your link (visitors cannot change your theme).
                </p>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300 self-start sm:self-auto">
                Selected: {selectedTheme.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themesList.map((t) => {
                const isSelected = selectedTheme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all text-left relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-2">
                        {t.name}
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {t.previewBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Accent Color Selection */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>Color Palette & Accents:</span>
                <span className="text-amber-400 font-mono text-[11px] uppercase">{selectedAccent}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {accentColors.map((color) => {
                  const isActive = selectedAccent === color.id;
                  return (
                    <button
                      type="button"
                      key={color.id}
                      onClick={() => setSelectedAccent(color.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        isActive
                          ? 'border-white bg-slate-800 text-white font-bold ring-2 ring-amber-400/50'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bgClass}`} />
                      <span>{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Academic Record & GPA */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              Academic Credentials & GPA
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-300">
                  Grade Point Average (GPA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="e.g. 3.85"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                    / 4.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Displayed prominently in highlights and education.</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Degree & Specialization</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Sc. in Information Engineering and Technology"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">University / Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. German University in Cairo (GUC)"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-semibold text-slate-300">Graduation Year</label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Academic Honors & Distinctions</label>
              <input
                type="text"
                value={honors}
                onChange={(e) => setHonors(e.target.value)}
                placeholder="e.g. Excellent with High Honors, Top 5% Cohort"
                className="w-full bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Section 3: Professional Details & Identity */}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          {/* Section 4: Custom Domain Mapping */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-5 h-5 text-amber-400" />
              Personal Custom Domain (Optional)
            </h2>
            <p className="text-xs text-slate-400">
              Want your CV portfolio to live on your personal domain (e.g. <code>mazen.com</code> or <code>cv.yourdomain.com</code>)?
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
                💡 DNS Setup: Add a CNAME record at your DNS provider pointing to <code>cv-to-web.pages.dev</code>.
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
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

      </main>

      {/* Floating AI Assistant Trigger Pill */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-5 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Chat with AI to Edit CV</span>
        </button>
      )}

      {/* AI Assistant Sliding Drawer */}
      {isAiOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  AI CV Customizer
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400">Powered by OpenRouter</p>
              </div>
            </div>

            <button
              onClick={() => setIsAiOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300">
            <span className="text-[10px] text-slate-500 font-semibold uppercase shrink-0">Try:</span>
            <button
              onClick={() => handleAiSendMessage('Change my GPA to 3.9')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 shrink-0 transition-colors"
            >
              🎓 Set GPA 3.9
            </button>
            <button
              onClick={() => handleAiSendMessage('Switch theme to Modern Tech')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 shrink-0 transition-colors"
            >
              💻 Tech Theme
            </button>
            <button
              onClick={() => handleAiSendMessage('Switch theme to Executive')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 shrink-0 transition-colors"
            >
              🏛️ Executive
            </button>
            <button
              onClick={() => handleAiSendMessage('Change accent color to Emerald')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 shrink-0 transition-colors"
            >
              🌿 Emerald
            </button>
            <button
              onClick={() => handleAiSendMessage('Make my summary punchier and executive-level')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 shrink-0 transition-colors"
            >
              ✨ Polish Bio
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-800 border border-slate-700 text-slate-200'
                        : 'bg-amber-500 text-slate-950 font-medium'
                    }`}
                  >
                    {msg.content}
                    {msg.patches && Object.keys(msg.patches).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <Check className="w-3 h-3" />
                        <span>Applied updates: {Object.keys(msg.patches).join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            {aiLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>AI is customizing your CV portfolio...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Drawer Footer Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAiSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g. Set my GPA to 3.9 or switch theme to Minimalist..."
                disabled={aiLoading}
                className="flex-1 bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
