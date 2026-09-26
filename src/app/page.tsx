import React from 'react';
import Link from 'next/link';
import { dataStore } from '@/lib/store';
import { DEMO_PROFILES, DEFAULT_PLANS } from '@/lib/default-data';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Search, 
  User, 
  ExternalLink,
  ShieldCheck,
  Award,
  Download,
  Mail,
  ArrowUpRight
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
    price: 100,
    originalPrice: 250,
    discount: '-60%',
    demoSlug: 'mazen',
    bgPreview: 'from-slate-900 to-amber-950/40 text-amber-400',
    description: 'Dark slate with warm amber/gold accents, designed for C-suite leaders, solutions architects, and engineering directors.',
    features: [
      'Verified Candidate Portrait Avatar',
      'Verified Certificate Photo Gallery',
      'Executive Leadership Scope & Summary',
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
    price: 100,
    originalPrice: 250,
    discount: '-60%',
    demoSlug: 'mohamedcv',
    bgPreview: 'from-[#070b14] to-emerald-950/40 text-emerald-400',
    description: 'Cyber terminal dark aesthetic with glowing emerald highlights, live status pulses, and monospace code blocks.',
    features: [
      'Interactive Terminal Hero Header',
      'System Architecture & Skill Matrix',
      'Cryptographic Certificate Verification',
      'Docker & Cloudflare Metrics Breakdown'
    ]
  },
  {
    id: 'creative',
    name: 'Creative Bento',
    category: 'Product & Design',
    rating: 4.92,
    reviewsCount: 215,
    badge: 'FEATURED',
    price: 100,
    originalPrice: 250,
    discount: '-60%',
    demoSlug: 'mazen',
    bgPreview: 'from-purple-950 to-rose-950/50 text-rose-400',
    description: 'Vibrant violet-rose gradients with interactive bento grid modules, ideal for visionary designers, specialists, and founders.',
    features: [
      'Multi-column Bento Grid Layout',
      'Diploma & Visual Achievement Cards',
      'Dynamic Accent Color Customizer',
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
    price: 100,
    originalPrice: 250,
    discount: '-60%',
    demoSlug: 'mazen',
    bgPreview: 'from-stone-100 to-stone-200 text-stone-900',
    description: 'High-contrast typography, ivory background, and clean editorial columns inspired by classic Swiss graphic design.',
    features: [
      'Editorial Ivory Background',
      'Print-ready Clean CSS Layout',
      'Fast 1-Click PDF Resume Download',
      'Academic Publication Timeline'
    ]
  }
];

const REVIEWS = [
  {
    name: 'Sarah Jenkins',
    role: 'Principal Recruiter at Meta',
    text: 'CVtoWeb completely transformed how we evaluate candidates. Opening a live, verified portfolio with certificates instead of parsing another PDF is night and day.',
    rating: 5,
    verified: true
  },
  {
    name: 'Tarek Mansour',
    role: 'Staff Infrastructure Engineer',
    text: 'I converted my resume using the Modern Tech theme. Within two weeks, I had four recruiter outreaches on WhatsApp and LinkedIn referencing my live website.',
    rating: 5,
    verified: true
  },
  {
    name: 'Elena Rostova',
    role: 'VP of Product Design',
    text: 'The Creative Bento theme let me show off my design awards and high-res certificate scans seamlessly. Worth 10x the price!',
    rating: 5,
    verified: true
  }
];

export default async function HomePage() {
  let profiles = await dataStore.getProfiles().catch(() => []);
  if (!profiles || profiles.length === 0) profiles = [...DEMO_PROFILES];

  const mazenProfile = profiles.find(p => p.slug === 'mazen') || profiles[0];
  const mohamedProfile = profiles.find(p => p.slug === 'mohamedcv') || profiles[1] || profiles[0];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* 1. TOP PROMO BANNER (Shop.co Signature) */}
      <div className="bg-black text-white text-xs sm:text-sm py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>Sign up and launch your verified executive CV website in 60 seconds.</span>
          <Link href="/upload" className="underline font-bold hover:text-neutral-300 ml-1">
            Convert Your CV Now →
          </Link>
        </div>
      </div>

      {/* 2. NAVBAR (Shop.co Minimalist High-Fashion Layout) */}
      <header className="border-b border-black/10 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <Link href="/" className="font-black text-2xl sm:text-3xl tracking-tighter text-black uppercase">
            CVTO.WEB
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-black/80">
            <a href="#templates" className="hover:text-black transition-colors">
              Templates Marketplace
            </a>
            <a href="#showcase" className="hover:text-black transition-colors">
              Candidate Showcase
            </a>
            <a href="#styles" className="hover:text-black transition-colors">
              Portfolio Styles
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Pricing (EGP)
            </a>
          </nav>

          {/* Search Bar (Shop.co Signature Pill Search) */}
          <div className="hidden md:flex items-center gap-3 bg-[#F0F0F0] rounded-full px-4 py-2.5 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-black/40" />
            <input 
              type="text" 
              placeholder="Search templates, roles, or skills..." 
              className="bg-transparent text-xs text-black placeholder:text-black/40 focus:outline-none w-full"
            />
          </div>

          {/* Right Action Icons & Pill Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2.5 rounded-full hover:bg-neutral-100 text-black transition-colors"
              title="User Profile & Settings"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/admin"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full border border-black/20 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all"
            >
              Admin Portal
            </Link>

            <Link
              href="/upload"
              className="bg-black text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-neutral-800 transition-all shadow-sm"
            >
              Upload CV
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (Shop.co Exact Layout & Typography) */}
      <section className="bg-[#F2F0F1] pt-12 sm:pt-16 pb-16 sm:pb-24 relative overflow-hidden">
        {/* Floating Starburst Icons (Shop.co Signature) */}
        <span className="absolute top-10 right-12 text-black text-4xl sm:text-6xl font-serif select-none pointer-events-none animate-pulse">
          ✦
        </span>
        <span className="absolute top-44 left-6 text-black text-2xl sm:text-4xl font-serif select-none pointer-events-none">
          ✦
        </span>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-[1.05] uppercase">
                FIND A PORTFOLIO THAT MATCHES YOUR CAREER STYLE
              </h1>

              <p className="text-black/60 text-sm sm:text-base max-w-xl leading-relaxed">
                Browse through our diverse range of meticulously crafted portfolio themes, designed to showcase your verified credentials, highlight career impact, and impress executive recruiters.
              </p>

              <div>
                <Link
                  href="/upload"
                  className="inline-block bg-black hover:bg-neutral-800 text-white rounded-full px-12 py-4 font-bold text-sm sm:text-base transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  Convert CV Now
                </Link>
              </div>

              {/* Stats Counters with Dividers */}
              <div className="pt-8 grid grid-cols-3 divide-x divide-black/15 max-w-lg">
                <div className="pr-4">
                  <div className="text-2xl sm:text-4xl font-black text-black">200+</div>
                  <div className="text-xs text-black/60 mt-0.5">Verified CVs</div>
                </div>
                <div className="px-4">
                  <div className="text-2xl sm:text-4xl font-black text-black">2,000+</div>
                  <div className="text-xs text-black/60 mt-0.5">Recruiter Views</div>
                </div>
                <div className="pl-4">
                  <div className="text-2xl sm:text-4xl font-black text-black">30,000+</div>
                  <div className="text-xs text-black/60 mt-0.5">Impressions</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Candidate Dossier Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-black/10 space-y-5">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={mazenProfile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                      alt={mazenProfile.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border border-black/10 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-black">{mazenProfile.fullName}</h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      </div>
                      <p className="text-xs text-black/60">{mazenProfile.title}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <p className="text-xs text-black/70 leading-relaxed line-clamp-3">
                  {mazenProfile.summary}
                </p>

                {/* Verified Certificate Thumbnail */}
                <div className="bg-[#F0EEED] rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-500" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-black/50 block">Verified Credential</span>
                      <span className="text-xs font-bold text-black">AWS Solutions Architect Professional</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">Verified</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/cv/${mazenProfile.slug}`}
                    className="flex-1 py-2.5 text-center bg-black hover:bg-neutral-800 text-white rounded-full font-bold text-xs transition-colors"
                  >
                    View Live Portfolio →
                  </Link>
                  <Link
                    href="/profile"
                    className="py-2.5 px-4 rounded-full border border-black/20 text-xs font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    Edit CV
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HIRING GIANTS MARQUEE RIBBON (Shop.co Black Band) */}
      <section className="bg-black py-9 px-4 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-8 text-center">
          <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase opacity-90">GOOGLE</span>
          <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase opacity-90">MICROSOFT</span>
          <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase opacity-90">AMAZON</span>
          <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase opacity-90">META</span>
          <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase opacity-90">APPLE</span>
          <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase opacity-90">SPOTIFY</span>
        </div>
      </section>

      {/* 5. NEW ARRIVALS — TEMPLATES MARKETPLACE */}
      <section id="templates" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            NEW ARRIVALS
          </h2>
          <p className="text-black/60 text-sm">
            Curated executive and modern design systems ready for instant deployment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="group flex flex-col justify-between space-y-3">
              <div>
                {/* Image / Preview Box (Shop.co style #F0EEED) */}
                <div className="bg-[#F0EEED] rounded-3xl p-6 aspect-[4/3] flex flex-col justify-between relative overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black text-white">
                      {tmpl.badge}
                    </span>
                    <span className="text-xs font-bold text-black/60">{tmpl.category}</span>
                  </div>

                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${tmpl.bgPreview} shadow-md`}>
                    <h4 className="font-black text-lg text-white">{tmpl.name}</h4>
                    <p className="text-[11px] text-white/80 line-clamp-2 mt-1">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                {/* Title & Star Rating */}
                <h3 className="font-bold text-lg text-black mt-3 group-hover:text-neutral-700 transition-colors">
                  {tmpl.name}
                </h3>

                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="font-bold text-black">{tmpl.rating}</span>
                  <span className="text-black/40">({tmpl.reviewsCount})</span>
                </div>

                {/* Price (Shop.co Signature Strike-through & Discount Pill) */}
                <div className="flex items-center gap-2.5 mt-2">
                  <span className="text-xl font-bold text-black">{tmpl.price} EGP</span>
                  <span className="text-lg font-bold text-black/40 line-through">{tmpl.originalPrice} EGP</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    {tmpl.discount}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/cv/${tmpl.demoSlug}`}
                  className="flex-1 py-2.5 text-center rounded-full border border-black/20 text-xs font-bold text-black hover:bg-black hover:text-white transition-all"
                >
                  Live Demo
                </Link>
                <Link
                  href="/upload"
                  className="py-2.5 px-4 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all"
                >
                  Select
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/upload"
            className="inline-block border border-black/20 text-black hover:bg-black hover:text-white rounded-full px-14 py-3.5 font-medium text-sm transition-all"
          >
            View All Templates
          </Link>
        </div>
      </section>

      {/* 5.5. TOP SELLING — LIVE CANDIDATE CV WEBSITES (Shop.co Exact Layout) */}
      <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-black/10">
        <div className="text-center space-y-2 mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            TOP SELLING CV WEBSITES
          </h2>
          <p className="text-black/60 text-sm">
            Live executive websites built with CVtoWeb, featuring verified certificate galleries and high-speed edge delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((prof) => (
            <div 
              key={prof.id || prof.slug}
              className="bg-white border border-black/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name, Verified Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F0EEED] border border-black/10 shrink-0 relative">
                      {prof.avatarUrl ? (
                        <img 
                          src={prof.avatarUrl} 
                          alt={prof.fullName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/40">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-black group-hover:text-neutral-700 transition-colors">
                          {prof.fullName}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                      </div>
                      <span className="text-[11px] font-medium text-black/50 block line-clamp-1">
                        {prof.title || 'Executive Leader'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-black text-white shrink-0">
                    {prof.theme || 'executive'}
                  </span>
                </div>

                {/* Star rating & views badge */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="font-bold text-black">5.0</span>
                    <span className="text-black/40">({prof.viewCount || 142} views)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Live Edge
                  </span>
                </div>

                {/* Candidate Summary / Tagline */}
                <p className="text-xs text-black/70 leading-relaxed line-clamp-3">
                  {prof.summary || prof.tagline || 'Specialized professional portfolio with verified qualifications.'}
                </p>

                {/* Certificate Count & Verification Badge */}
                <div className="bg-[#F0EEED] rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-black">
                      {prof.certificates && prof.certificates.length > 0
                        ? `${prof.certificates.length} Verified Certificates`
                        : 'Accredited Credentials'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-black/60 bg-white px-2 py-0.5 rounded border border-black/10">
                    Verified
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/cv/${prof.slug}`}
                  className="flex-1 py-3 text-center rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Visit Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/profile"
                  className="py-3 px-4 rounded-full border border-black/20 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/upload"
            className="inline-block bg-black text-white hover:bg-neutral-800 rounded-full px-12 py-3.5 font-bold text-sm transition-all shadow-md"
          >
            Launch Your Website in 60 Seconds →
          </Link>
        </div>
      </section>

      {/* 6. BROWSE BY PORTFOLIO STYLE (Shop.co Bento Grid) */}
      <section id="styles" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F0F0F0] rounded-3xl p-8 sm:p-14 space-y-10">
          <h2 className="text-3xl sm:text-5xl font-black text-black text-center uppercase tracking-tight">
            BROWSE BY PORTFOLIO STYLE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Theme 1: Portfolio WP Pro */}
            <Link 
              href="/cv/mazen"
              className="bg-white rounded-3xl p-7 min-h-[220px] flex flex-col justify-between group hover:shadow-xl transition-all border border-stone-200"
            >
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Theme #1</span>
                <h3 className="text-xl font-bold font-serif text-stone-900 group-hover:translate-x-1 transition-transform">
                  Portfolio WP Pro (Editorial Light)
                </h3>
                <p className="text-xs text-stone-500 pt-2 leading-relaxed">
                  Stone canvas (#fcfbf9), Playfair serif headers, 3-column project archive & prominent GPA card.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-900 pt-4 border-t border-stone-100">
                <span>View Live Demo</span>
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </div>
            </Link>

            {/* Theme 2: Cyber Dark Glass */}
            <Link 
              href="/cv/mazen"
              className="bg-[#07090e] text-white rounded-3xl p-7 min-h-[220px] flex flex-col justify-between group hover:shadow-xl transition-all border border-cyan-500/30"
            >
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">Theme #2</span>
                <h3 className="text-xl font-black text-white group-hover:translate-x-1 transition-transform">
                  Cyber Dark Glass (Cyber Neon)
                </h3>
                <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                  Slate-black canvas (#07090e), glowing cyan/blue accents, glassmorphic panels & floating GPA badge.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pt-4 border-t border-slate-800">
                <span>EXPLORE_TERMINAL()</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
              </div>
            </Link>

            {/* Theme 3: Cobalt & Emerald */}
            <Link 
              href="/cv/mazen"
              className="bg-[#05131a] text-white rounded-3xl p-7 min-h-[220px] flex flex-col justify-between group hover:shadow-xl transition-all border border-emerald-500/30"
            >
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">Theme #3</span>
                <h3 className="text-xl font-black text-white group-hover:translate-x-1 transition-transform">
                  Cobalt & Emerald (Mechatronics)
                </h3>
                <p className="text-xs text-emerald-200/70 pt-2 leading-relaxed">
                  Deep mechatronics slate (#05131a), emerald & cobalt accents with hardware competency grid.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 pt-4 border-t border-emerald-950">
                <span>VIEW_HARDWARE_STACK()</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
              </div>
            </Link>

            {/* Theme 4: Editorial Luxury Warm */}
            <Link 
              href="/cv/mazen"
              className="bg-[#faf8f5] border border-rose-200 text-stone-900 rounded-3xl p-7 min-h-[220px] flex flex-col justify-between group hover:shadow-xl transition-all"
            >
              <div>
                <span className="text-[11px] font-serif text-rose-700 uppercase tracking-wider block mb-1">Theme #4</span>
                <h3 className="text-xl font-serif text-stone-900 group-hover:translate-x-1 transition-transform">
                  Editorial Luxury (Warm & Gold)
                </h3>
                <p className="text-xs text-stone-500 pt-2 leading-relaxed">
                  Warm ivory canvas (#faf8f5), warm stone panels, rose-gold accents, and refined serif typography.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-serif font-bold text-rose-900 pt-4 border-t border-rose-100">
                <span>Inspect Warm Layout</span>
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 7. LIVE CANDIDATE SHOWCASE (With Verified Certificate Photos) */}
      <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            TOP CANDIDATES
          </h2>
          <p className="text-black/60 text-sm">
            Discover senior talent with authentic verified credentials and live portfolios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profiles.slice(0, 2).map((cand) => (
            <div key={cand.id} className="border border-black/10 rounded-3xl p-6 sm:p-8 space-y-6 hover:shadow-xl transition-shadow bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={cand.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                    alt={cand.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border border-black/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-black">{cand.fullName}</h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    </div>
                    <p className="text-xs text-black/60">{cand.title}</p>
                    <span className="text-[10px] font-mono text-black/40">/{cand.slug}</span>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F0EEED] text-black">
                  {cand.viewCount || 142} Views
                </span>
              </div>

              <p className="text-xs text-black/70 leading-relaxed line-clamp-2">
                {cand.tagline || cand.summary}
              </p>

              {/* Verified Certificate Badges */}
              {cand.certificates && cand.certificates.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 block">
                    Verified Certificate Records ({cand.certificates.length})
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {cand.certificates.slice(0, 2).map((c) => (
                      <div key={c.id} className="bg-[#F0EEED] rounded-xl p-2.5 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-semibold text-black truncate">{c.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/cv/${cand.slug}`}
                  className="flex-1 py-3 text-center bg-black hover:bg-neutral-800 text-white rounded-full font-bold text-xs transition-colors"
                >
                  Open Live Website →
                </Link>
                <Link
                  href="/profile"
                  className="py-3 px-5 rounded-full border border-black/20 text-xs font-semibold hover:bg-neutral-50 transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. OUR HAPPY CUSTOMERS (Shop.co Reviews) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight text-center mb-12">
          OUR HAPPY CUSTOMERS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 bg-white shadow-sm">
              <div className="flex text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-black">{rev.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
              <p className="text-xs text-black/50 font-medium">{rev.role}</p>
              <p className="text-xs text-black/70 leading-relaxed italic">
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FLOATING NEWSLETTER CONTAINER (Shop.co Exact Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mb-24">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-14 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase max-w-lg">
            STAY UP TO DATE ABOUT OUR LATEST TEMPLATES & OFFERS
          </h2>

          <div className="w-full lg:max-w-md space-y-3">
            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-3 text-black">
              <Mail className="w-4 h-4 text-black/40" />
              <input 
                type="email" 
                placeholder="Enter your email address..."
                className="bg-transparent text-xs text-black placeholder:text-black/40 focus:outline-none w-full"
              />
            </div>
            <button className="w-full bg-white hover:bg-neutral-200 text-black rounded-full py-3 text-xs sm:text-sm font-bold transition-colors">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* 10. SHOP.CO FOOTER */}
      <footer className="bg-[#F0F0F0] text-black pt-36 pb-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 space-y-4">
              <span className="font-black text-2xl tracking-tighter text-black uppercase">
                CVTO.WEB
              </span>
              <p className="text-xs text-black/60 max-w-sm leading-relaxed">
                We design high-converting, executive-grade portfolio websites that turn lifeless PDF resumes into interactive career opportunities.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-xs font-bold shadow-sm">
                  𝕏
                </span>
                <span className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-xs font-bold shadow-sm">
                  in
                </span>
                <span className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-xs font-bold shadow-sm">
                  gh
                </span>
              </div>
            </div>

            {/* Column 1 */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">COMPANY</h4>
              <ul className="space-y-2 text-xs text-black/60">
                <li><a href="#templates" className="hover:text-black">About Us</a></li>
                <li><a href="#showcase" className="hover:text-black">Features</a></li>
                <li><a href="#templates" className="hover:text-black">Templates</a></li>
                <li><a href="#how-it-works" className="hover:text-black">Career Blog</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">HELP</h4>
              <ul className="space-y-2 text-xs text-black/60">
                <li><Link href="/upload" className="hover:text-black">Convert CV</Link></li>
                <li><Link href="/profile" className="hover:text-black">Profile Editor</Link></li>
                <li><Link href="/admin" className="hover:text-black">Admin Support</Link></li>
                <li><a href="mailto:support@cvtoweb.com" className="hover:text-black">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">RESOURCES</h4>
              <ul className="space-y-2 text-xs text-black/60">
                <li><Link href="/profile" className="hover:text-black">ATS Readiness</Link></li>
                <li><Link href="/cv/mazen" className="hover:text-black">vCard Export</Link></li>
                <li><Link href="/profile" className="hover:text-black">AI Co-Pilot</Link></li>
                <li><Link href="/admin" className="hover:text-black">Visitor Analytics</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Payment Badges */}
          <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/60">
            <p>© {new Date().getFullYear()} CVtoWeb.co. All Rights Reserved.</p>
            
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-white border border-black/10 text-[10px] font-bold text-black">
                Vodafone Cash
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-black/10 text-[10px] font-bold text-black">
                InstaPay
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-black/10 text-[10px] font-bold text-black">
                Fawry
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-black/10 text-[10px] font-bold text-black">
                Visa / MC
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
