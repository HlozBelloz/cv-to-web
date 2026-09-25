import React from 'react';
import Link from 'next/link';
import { dataStore } from '@/lib/store';
import { DEMO_PROFILES, DEFAULT_PLANS } from '@/lib/default-data';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Star, 
  Globe, 
  ShieldCheck, 
  Award, 
  Eye, 
  Download, 
  Layout, 
  TrendingUp, 
  Laptop, 
  Terminal, 
  FileText, 
  Check, 
  ShoppingBag,
  Search,
  User,
  ExternalLink
} from 'lucide-react';

export const revalidate = 60;

const TEMPLATES = [
  {
    id: 'executive',
    name: 'Executive Suite',
    category: 'Leadership & Corporate',
    rating: 4.98,
    reviewsCount: 382,
    badge: 'BESTSELLER',
    price: 'Free with Standard Launch',
    demoSlug: 'mazen',
    accentColor: 'from-amber-500/20 via-slate-900 to-slate-950',
    borderColor: 'border-amber-500/40',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Dark slate with warm amber/gold accents, designed for C-suite leaders, solutions architects, and engineering directors.',
    features: [
      'Verified Candidate Portrait Avatar',
      'Verified Certificate Photo Gallery',
      'Executive Leadership Scope & Summary',
      'Interactive Metric Cards (GPA, Projects)',
      '1-Click Recruiter Inquiry Dispatch'
    ]
  },
  {
    id: 'tech',
    name: 'Modern Tech Cyber',
    category: 'Engineering & DevOps',
    rating: 4.95,
    reviewsCount: 294,
    badge: 'TRENDING',
    price: 'Free with Standard Launch',
    demoSlug: 'mohamedcv',
    accentColor: 'from-emerald-500/20 via-[#070b14] to-slate-950',
    borderColor: 'border-emerald-500/40',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Cyber terminal dark aesthetic with glowing emerald highlights, live status pulses, and monospace code blocks.',
    features: [
      'Interactive Terminal Hero Header',
      'System Architecture & Skill Matrix',
      'Cryptographic Certificate Verification',
      'Docker & Cloudflare Metrics Breakdown',
      'Instant Terminal Dispatch Form'
    ]
  },
  {
    id: 'creative',
    name: 'Creative Bento',
    category: 'Product & Design',
    rating: 4.92,
    reviewsCount: 215,
    badge: 'FEATURED',
    price: 'Free with Standard Launch',
    demoSlug: 'mazen',
    accentColor: 'from-purple-500/20 via-[#100722] to-slate-950',
    borderColor: 'border-purple-500/40',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description: 'Vibrant violet-rose gradients with interactive bento grid modules, ideal for visionary designers, specialists, and founders.',
    features: [
      'Multi-column Bento Grid Layout',
      'Diploma & Visual Achievement Cards',
      'Dynamic Accent Color Customizer',
      'Mobile-Optimized Touch Carousel',
      'Recruiter Collaboration Form'
    ]
  },
  {
    id: 'minimal',
    name: 'Minimalist Swiss',
    category: 'Editorial & Academic',
    rating: 4.89,
    reviewsCount: 168,
    badge: 'ELEGANT',
    price: 'Free with Standard Launch',
    demoSlug: 'mohamedcv',
    accentColor: 'from-stone-500/10 via-slate-900 to-slate-950',
    borderColor: 'border-stone-500/40',
    tagColor: 'bg-stone-500/10 text-stone-300 border-stone-500/30',
    description: 'Swiss editorial layout with warm ivory tones, serif headings, and structured typographic hierarchy.',
    features: [
      'Editorial Serif Typography',
      'Clean Chronological Career Tree',
      'Academic Distinction & GPA Highlighting',
      'Distraction-Free Recruiter Reading',
      'Verified Credential Badges'
    ]
  }
];

export default async function HomePage() {
  let plans = await dataStore.getPlans();
  let profiles = await dataStore.getProfiles();

  if (!plans || plans.length === 0) plans = [...DEFAULT_PLANS];
  if (!profiles || profiles.length === 0) profiles = [...DEMO_PROFILES];

  const mazenProfile = profiles.find(p => p.slug === 'mazen') || profiles[0];
  const mohamedProfile = profiles.find(p => p.slug === 'mohamedcv') || profiles[1] || profiles[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      
      {/* 1. TOP ANNOUNCEMENT BANNER (E-Commerce Style) */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs font-bold py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] uppercase tracking-wider">
            NEW RELEASE
          </span>
          <span>
            ⚡ Free Cloudflare Edge Hosting, AI CV Customizer & Verified Certificate Photo Gallery Included!
          </span>
          <a href="#templates" className="underline underline-offset-2 hover:text-white transition-colors">
            Browse Templates →
          </a>
        </div>
      </div>

      {/* 2. E-COMMERCE MARKETPLACE NAVIGATION BAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white">
            <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20">
              CV
            </span>
            <span className="tracking-tight">CVtoWeb</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#templates" className="hover:text-amber-400 transition-colors">
              Templates Marketplace
            </a>
            <a href="#showcase" className="hover:text-amber-400 transition-colors">
              Candidate Showcase
            </a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              Pricing (EGP)
            </a>
          </nav>

          {/* User & Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>Admin</span>
            </Link>

            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Convert CV Now</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (E-Commerce Luxury & High-Converting) */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            The #1 Executive Portfolio Marketplace for Senior Professionals
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Turn Your Static PDF CV into a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              High-Converting Website
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Stop sending lifeless PDF attachments that get buried in recruiter mailboxes. Give hiring directors, HR executives, and clients an interactive, verified website hosted on Cloudflare Edge with certificate photo galleries and your personal URL.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Upload PDF & Preview Live (Free)</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold text-base transition-colors"
            >
              <Layout className="w-5 h-5 text-amber-400" />
              <span>Explore 4 Executive Templates</span>
            </a>
          </div>

          {/* Social Proof & Trust Metrics Bar */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-white font-bold">4.9/5 Rating</span>
              <span>(1,200+ Recruiters)</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-bold">100% Free Edge Hosting</span>
              <span>(Cloudflare CDN)</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold">Egyptian Gateways</span>
              <span>(Vodafone Cash & InstaPay)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATES MARKETPLACE PRODUCT GRID (Figma 1273571982885059508 Reference) */}
      <section id="templates" className="py-20 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Executive Template Catalog</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Choose Your Locked Public Theme
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Each theme is crafted with precision to convert recruiters into interview invitations. You choose one theme and it locks as the permanent presentation for all visitors.
              </p>
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold self-start md:self-auto"
            >
              <span>Upload PDF to Auto-Apply Theme</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TEMPLATE PRODUCT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.id}
                className={`bg-slate-900/90 border ${tmpl.borderColor} rounded-3xl p-5 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 group`}
              >
                <div className="space-y-4">
                  {/* Mockup Preview Card */}
                  <div className={`aspect-video w-full rounded-2xl bg-gradient-to-br ${tmpl.accentColor} border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-bold text-white border border-slate-700">
                        {tmpl.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{tmpl.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="w-16 h-2 rounded bg-white/40" />
                      <div className="w-28 h-3 rounded bg-white/80 font-bold" />
                      <div className="w-20 h-2 rounded bg-amber-400/80" />
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.tagColor} mb-1.5`}>
                      {tmpl.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {tmpl.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <Link
                    href={`/cv/${tmpl.demoSlug}`}
                    target="_blank"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Interactive Demo</span>
                  </Link>

                  <Link
                    href={`/upload?theme=${tmpl.id}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 hover:scale-[1.02]"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE CANDIDATE SHOWCASE (MAZEN & MOHAMED) */}
      <section id="showcase" className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Verified Portfolios</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Featured Live Candidate Websites
            </h2>
            <p className="text-sm text-slate-400">
              Explore actual live portfolios deployed to Cloudflare Pages edge network with real verified certificate photo galleries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Candidate 1: Mazen Mohamed Hamdy */}
            {mazenProfile && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-500/50 shadow-md shrink-0">
                    <img 
                      src={mazenProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                      alt={mazenProfile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{mazenProfile.fullName}</h3>
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950" title="Verified Candidate">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-amber-400">{mazenProfile.title}</p>
                    <p className="text-xs text-slate-400">{mazenProfile.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      GPA 1.65 (A-) • GUC Engineering
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {mazenProfile.summary}
                </p>

                {/* Certificate badges count */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <strong>{mazenProfile.certificates?.length || 3} Verified Certificates</strong>
                  </span>
                  <a
                    href={`/cv/${mazenProfile.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>View Mazen&apos;s Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Candidate 2: Mohamed El-Sayed */}
            {mohamedProfile && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-500/50 shadow-md shrink-0">
                    <img 
                      src={mohamedProfile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'} 
                      alt={mohamedProfile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{mohamedProfile.fullName}</h3>
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950" title="Verified Candidate">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-amber-400">{mohamedProfile.title}</p>
                    <p className="text-xs text-slate-400">{mohamedProfile.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      9+ Years Experience • AWS Pro
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {mohamedProfile.summary}
                </p>

                {/* Certificate badges count */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <strong>{mohamedProfile.certificates?.length || 2} Verified Credentials</strong>
                  </span>
                  <a
                    href={`/cv/${mohamedProfile.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>View Mohamed&apos;s Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3-Step E-Commerce Fulfillment Flow) */}
      <section id="how-it-works" className="py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Streamlined Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Instant 3-Step Fulfillment
            </h2>
            <p className="text-sm text-slate-400">
              From PDF to live edge deployment in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 font-extrabold text-lg flex items-center justify-center mx-auto border border-amber-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Upload Your PDF CV</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop your standard resume or curriculum vitae. Our edge parser reads your academic history, projects, and contact info instantly.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 font-extrabold text-lg flex items-center justify-center mx-auto border border-amber-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white">AI Customizer & Themes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your locked theme, upload your certificate photos and avatar, or chat with AI to polish your summary and academic GPA.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 font-extrabold text-lg flex items-center justify-center mx-auto border border-amber-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Publish to Edge Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your portfolio is live immediately on your personal link (e.g. cvplatform.com/cv/yourname) or connected to your own custom domain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC EGP PRICING CARDS */}
      <section id="pricing" className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Egyptian Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Transparent EGP Investment
            </h2>
            <p className="text-sm text-slate-400">
              No hidden fees or subscriptions. Pay once in Egyptian Pounds, hosted forever on Cloudflare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`bg-slate-900/90 border-2 rounded-3xl p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-2xl relative ${
                  p.isPopular ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800'
                }`}
              >
                {p.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] shadow-md">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-amber-400">{p.priceEgp}</span>
                    <span className="text-base font-bold text-slate-300">EGP</span>
                    <span className="text-xs text-slate-500">/ one-time</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-slate-800">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/upload"
                  className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all ${
                    p.isPopular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  Get Started with {p.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Egyptian Payment Badge Strip */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <span className="text-xs text-slate-400 font-medium">
              Supported Egyptian Local Payment Gateways
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-rose-400">Vodafone Cash</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">InstaPay Egypt</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">Fawry Pay</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">Visa / Mastercard (EGP)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
              CV
            </span>
            <span>CVtoWeb Platform</span>
          </div>

          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} CVtoWeb. High-converting executive portfolio builder for leaders & specialists.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-amber-400 transition-colors">
              Admin Access
            </Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors">
              User Login
            </Link>
            <Link href="/profile" className="hover:text-amber-400 transition-colors">
              My Profile
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
