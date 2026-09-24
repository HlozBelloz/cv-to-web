import React from 'react';
import { dataStore } from '@/lib/store';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  Globe, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  Zap, 
  Layers
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const plans = await dataStore.getPlans();
  const profiles = await dataStore.getProfiles();
  const demoProfile = profiles.find(p => p.slug === 'mazen') || profiles[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      
      {/* NAVBAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 font-extrabold text-lg text-white">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20">
              CV
            </span>
            CVtoWeb
          </a>

          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="/cv/mazen" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
              <span>Mazen's Portfolio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">LIVE</span>
            </a>
            <a
              href="/dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              My Dashboard
            </a>
            <a
              href="/admin"
              className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Admin
            </a>
            <a
              href="/upload"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
            >
              Convert CV Now
            </a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Land Your Dream Role with an Executive Portfolio
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Turn Your PDF CV into a <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              High-Converting Website
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop sending static PDFs that get lost in recruiter inboxes. Give HR, hiring managers, and clients an interactive executive portfolio with your own personal link.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5" />
              Upload PDF & Generate Live Site
              <ArrowRight className="w-5 h-5" />
            </a>

            {demoProfile && (
              <a
                href={`/cv/${demoProfile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold text-base transition-colors"
              >
                <span>View Live Demo ({demoProfile.fullName})</span>
                <span className="text-xs font-mono text-amber-400">↗</span>
              </a>
            )}
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Free Edge Cloud Hosting
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Executive Corporate Aesthetic
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Custom Domain Support
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Starting at just 100 EGP
            </span>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="py-20 border-y border-slate-900 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              3-Step Autonomous Engine
            </h2>
            <p className="text-3xl font-extrabold text-white">
              From PDF to Live Executive Website in Seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Upload Your PDF CV</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag and drop your standard resume or CV. Our multi-provider AI engine reads and indexes your career data securely.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">AI Extracts Leadership & Impact</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini Flash highlights your key metrics, achievements, responsibilities, and skill categories into an executive corporate layout.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Share Your Executive Link</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Get an instant URL (e.g. <code>yoursite.com/cv/mohamed</code>) or link your own custom domain name (<code>mohamed.com</code>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              Transparent Egyptian Pricing
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Launch Your Executive CV Today
            </p>
            <p className="text-sm text-slate-400">
              One-time charge. Full edge hosting included. Pay via Vodafone Cash, InstaPay, or Card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? 'bg-slate-900 border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10'
                    : 'bg-slate-900/50 border border-slate-800'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-3.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{plan.priceEgp}</span>
                    <span className="text-lg font-bold text-amber-400">EGP</span>
                    <span className="text-xs text-slate-500">/ {plan.period}</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href="/upload"
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      plan.isPopular
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    Select Plan ({plan.priceEgp} EGP)
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500">
            Platform owner note: Pricing and plans can be modified instantly inside your <a href="/admin" className="text-amber-400 underline">Admin Portal</a>.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
              CV
            </span>
            CVtoWeb
          </div>

          <div className="flex items-center gap-6">
            <a href="/upload" className="hover:text-amber-400 transition-colors">
              Upload CV
            </a>
            <a href="/admin" className="hover:text-amber-400 transition-colors">
              Admin Portal
            </a>
            <a href="/cv/mazen" className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
              Mazen's Portfolio
            </a>
            <a href="/cv/mohamedcv" className="hover:text-amber-400 transition-colors">
              Mohamed's Sample
            </a>
          </div>

          <p>© {new Date().getFullYear()} CVtoWeb. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
