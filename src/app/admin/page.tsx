'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CVProfile, 
  Plan, 
  PaymentTransaction 
} from '@/types';
import { 
  Settings, 
  Coins, 
  Users, 
  Globe, 
  Check, 
  Trash2, 
  Eye, 
  Plus, 
  ExternalLink,
  CreditCard,
  CheckCircle2,
  LogOut
} from 'lucide-react';

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'plans' | 'profiles' | 'domains' | 'payments' | 'settings'>('plans');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profiles, setProfiles] = useState<CVProfile[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [priceInputs, setPriceInputs] = useState<Record<string, number>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // New Plan State
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    priceEgp: 150,
    description: '',
    featuresText: '',
    customDomainAllowed: false
  });

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/admin/login');
          return;
        }
        const authData = await authRes.json();
        if (!authData.user || authData.user.role !== 'admin') {
          router.push('/admin/login');
          return;
        }

        const [plansRes, profilesRes, paymentsRes] = await Promise.all([
          fetch('/api/plans'),
          fetch('/api/profiles'),
          fetch('/api/payments')
        ]);

        let plansData: Plan[] = [];
        let profilesData: CVProfile[] = [];
        let paymentsData: PaymentTransaction[] = [];

        try {
          if (plansRes.ok && (plansRes.headers.get('content-type') || '').includes('application/json')) {
            plansData = await plansRes.json();
          }
        } catch (e) {
          console.warn('Plans fetch error:', e);
        }

        try {
          if (profilesRes.ok && (profilesRes.headers.get('content-type') || '').includes('application/json')) {
            profilesData = await profilesRes.json();
          }
        } catch (e) {
          console.warn('Profiles fetch error:', e);
        }

        try {
          if (paymentsRes.ok && (paymentsRes.headers.get('content-type') || '').includes('application/json')) {
            paymentsData = await paymentsRes.json();
          }
        } catch (e) {
          console.warn('Payments fetch error:', e);
        }

        // Also merge local client profiles if created in browser
        if (typeof window !== 'undefined') {
          try {
            const localRaw = localStorage.getItem('cv_profiles_list');
            if (localRaw) {
              const localProfiles: CVProfile[] = JSON.parse(localRaw);
              localProfiles.forEach((lp) => {
                if (!profilesData.some((p) => p.slug === lp.slug)) {
                  profilesData.unshift(lp);
                }
              });
            }
          } catch (e) {
            console.warn('Local profiles parse error:', e);
          }
        }

        if (ignore) return;

        setPlans(Array.isArray(plansData) ? plansData : []);
        setProfiles(Array.isArray(profilesData) ? profilesData : []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);

        const initialPrices: Record<string, number> = {};
        if (Array.isArray(plansData)) {
          plansData.forEach((p: Plan) => {
            initialPrices[p.id] = p.priceEgp;
          });
        }
        setPriceInputs(initialPrices);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [router, refreshKey]);

  const handleUpdatePrice = async (planId: string) => {
    const newPrice = priceInputs[planId];
    if (typeof newPrice !== 'number' || newPrice < 0) return;

    setSavingPlanId(planId);
    try {
      const res = await fetch('/api/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: planId, priceEgp: newPrice })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(`Price updated to ${newPrice} EGP successfully!`);
        setTimeout(() => setSaveSuccess(null), 3000);
        setRefreshKey(k => k + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const planToCreate: Plan = {
        id: `plan-${Date.now()}`,
        name: newPlan.name,
        priceEgp: Number(newPlan.priceEgp),
        period: 'one-time',
        description: newPlan.description,
        features: newPlan.featuresText.split('\n').filter(Boolean),
        isActive: true,
        customDomainAllowed: newPlan.customDomainAllowed
      };

      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planToCreate)
      });
      if (res.ok) {
        setShowNewPlanModal(false);
        setNewPlan({ name: '', priceEgp: 150, description: '', featuresText: '', customDomainAllowed: false });
        setRefreshKey(k => k + 1);
      }
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate portfolio?')) return;
    try {
      await fetch(`/api/profiles?id=${id}`, { method: 'DELETE' });
      setProfiles(profiles.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (profile: CVProfile) => {
    const updated = { ...profile, isPublished: !profile.isPublished };
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setProfiles(profiles.map(p => p.id === profile.id ? updated : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDomain = async (profile: CVProfile, domain: string) => {
    const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const updated: CVProfile = {
      ...profile,
      customDomain: cleanDomain || undefined,
      customDomainStatus: cleanDomain ? 'verified' : undefined
    };

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setProfiles(profiles.map(p => p.id === profile.id ? updated : p));
        setSaveSuccess(`Custom domain ${cleanDomain ? `"${cleanDomain}" assigned to` : 'cleared for'} ${profile.fullName}!`);
        setTimeout(() => setSaveSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update custom domain:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
            CV
          </div>
          <div>
            <h1 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              Platform Master Admin
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                Live Control
              </span>
            </h1>
            <p className="text-xs text-slate-400">Manage Pricing, Plans, Websites & Custom Domains</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <Link
            href="/cv/mazen"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
          >
            <span>Mazen&apos;s Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Public Site
          </Link>
          <Link
            href="/upload"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all"
          >
            + Upload CV
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/admin/login');
              router.refresh();
            }}
            className="px-3.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-900/30 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('plans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'plans'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Coins className="w-4 h-4" />
            Pricing & Plans (EGP)
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profiles'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            CV Websites ({profiles.length})
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'domains'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            Custom Domains
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Transactions ({payments.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            System & AI Engine
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto max-w-6xl">
          
          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {/* TAB 1: PRICING & PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Dynamic Pricing & Plans (EGP)</h2>
                  <p className="text-sm text-slate-400">
                    Instantly change what you charge users (e.g. 100 EGP base) and create new tiered offerings.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewPlanModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Create New Plan
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        {plan.isPopular && (
                          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                            Default Plan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{plan.description}</p>

                      {/* Live Price Editor */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                          <span>Current Charge:</span>
                          <span className="text-amber-400 font-mono text-sm">{plan.priceEgp} EGP</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={priceInputs[plan.id] ?? plan.priceEgp}
                            onChange={(e) => setPriceInputs({ ...priceInputs, [plan.id]: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono text-base focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => handleUpdatePrice(plan.id)}
                            disabled={savingPlanId === plan.id}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shrink-0 border border-slate-700 transition-colors"
                          >
                            {savingPlanId === plan.id ? 'Saving...' : 'Update Price'}
                          </button>
                        </div>
                      </div>

                      {/* Features list */}
                      <div className="space-y-1.5 pt-2">
                        <div className="text-xs font-semibold text-slate-500">Included Features:</div>
                        {plan.features.map((f, i) => (
                          <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <span>Custom Domain: {plan.customDomainAllowed ? '✅ Supported' : '❌ Disabled'}</span>
                      <span className="font-mono">{plan.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILES & WEBSITES */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Converted CV Websites</h2>
                <p className="text-sm text-slate-400">
                  Inspect, manage, and share all live candidate portfolios generated on your platform.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Candidate</th>
                        <th className="px-6 py-4">Role / Title</th>
                        <th className="px-6 py-4">Live URL Slug</th>
                        <th className="px-6 py-4">Views</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">
                            {profile.fullName}
                          </td>
                          <td className="px-6 py-4 text-xs text-amber-300">
                            {profile.title}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">
                            /cv/{profile.slug}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">
                            {profile.viewCount || 0}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                              profile.isPublished 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {profile.isPublished ? 'Published' : 'Hidden'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <a
                              href={`/cv/${profile.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </a>
                            <button
                              onClick={() => handleTogglePublish(profile)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                            >
                              {profile.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleDeleteProfile(profile.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM DOMAINS */}
          {activeTab === 'domains' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Custom Domain Management</h2>
                <p className="text-sm text-slate-400">
                  Allow candidates to map their own domain (e.g. <code>mohamed.com</code>) to their CV website.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">DNS Instructions for Candidates</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      To point their personal domain to your platform, candidates simply add a CNAME record at their DNS registrar (e.g. Cloudflare, Namecheap, GoDaddy):
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                  <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                    <span>RECORD TYPE</span>
                    <span>NAME / HOST</span>
                    <span>POINTS TO (VALUE)</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-300 pt-1">
                    <span className="font-bold">CNAME</span>
                    <span>@ or cv</span>
                    <span className="text-white">cname.yourplatform.com (or your Cloudflare fallback)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  💡 With <strong>Cloudflare for SaaS</strong>, SSL certificates are issued automatically and for free for up to 100 customer domains on the free plan!
                </div>
              </div>

              {/* Active Profile Domains Table & Management */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    Mapped Portfolio Domains
                  </h3>
                  <span className="text-xs text-slate-400">
                    {profiles.filter(p => Boolean(p.customDomain)).length} active custom domain(s)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Candidate</th>
                        <th className="px-4 py-3">Default Slug URL</th>
                        <th className="px-4 py-3">Mapped Custom Domain</th>
                        <th className="px-4 py-3">SSL Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">
                            {profile.fullName}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-400">
                            /cv/{profile.slug}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="e.g. mazen.com"
                              defaultValue={profile.customDomain || ''}
                              id={`domain-input-${profile.id}`}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400 w-48 sm:w-56"
                            />
                          </td>
                          <td className="px-4 py-3">
                            {profile.customDomain ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                <Check className="w-3 h-3" />
                                Active & Secured
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500">None</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                const inputEl = document.getElementById(`domain-input-${profile.id}`) as HTMLInputElement;
                                if (inputEl) {
                                  handleUpdateDomain(profile, inputEl.value);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                            >
                              Save Domain
                            </button>
                            {profile.customDomain && (
                              <button
                                onClick={() => {
                                  const inputEl = document.getElementById(`domain-input-${profile.id}`) as HTMLInputElement;
                                  if (inputEl) inputEl.value = '';
                                  handleUpdateDomain(profile, '');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                                title="Remove custom domain"
                              >
                                Clear
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRANSACTIONS & PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Transactions & Paymob Gateway</h2>
                  <p className="text-sm text-slate-400">
                    Track all payments made through Egyptian payment rails (Vodafone Cash, InstaPay, Meeza, Cards).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Total Volume: {payments.reduce((acc, p) => acc + (p.status === 'completed' ? p.amountEgp : 0), 0)} EGP
                  </span>
                </div>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
                  <CreditCard className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">No payment transactions recorded yet.</p>
                  <p className="text-xs text-slate-500">Run a test checkout from any candidate launch page to verify Paymob mock mode.</p>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4">Transaction ID</th>
                          <th className="px-6 py-4">Customer Email</th>
                          <th className="px-6 py-4">Plan</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Method</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {payments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-amber-300">
                              {pay.id}
                            </td>
                            <td className="px-6 py-4 text-xs text-white">
                              {pay.userEmail}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                              {pay.planId}
                            </td>
                            <td className="px-6 py-4 font-bold text-white font-mono">
                              {pay.amountEgp} EGP
                            </td>
                            <td className="px-6 py-4 text-xs">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {pay.paymentMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                                pay.status === 'completed' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {pay.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-slate-400">
                              {new Date(pay.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SYSTEM & AI ENGINE */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">System, Hosting & AI Engine Diagnostics</h2>
                <p className="text-sm text-slate-400">
                  Overview of connected services and fallback pipelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Google Gemini Flash</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Primary AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Reads uploaded PDF CV documents natively and writes high-impact executive summaries and metrics.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Groq Llama 3.3</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Automated Fallback
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Ultra-fast secondary LLM engine if Gemini encounters rate-limits or network interruptions.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Paymob Egyptian Payment Gateway</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Mock / Sandbox Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Test Mode is currently safely active. Supports Vodafone Cash, InstaPay, Meeza, and Debit/Credit cards.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Edge Hosting & Storage</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      100% Free Cloud Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Cloudflare Pages/Workers + Supabase Cloud. Zero hosting fees, ultra-low latency worldwide.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Create New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create New Pricing Plan</h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Executive Career Suite"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Price in Egyptian Pounds (EGP)</label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="150"
                  value={newPlan.priceEgp}
                  onChange={(e) => setNewPlan({ ...newPlan, priceEgp: Number(e.target.value) })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dedicated custom domain, priority recruiter indexing"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Features (1 per line)</label>
                <textarea
                  rows={3}
                  placeholder="Custom Domain Support&#10;Google SEO Indexing&#10;Unlimited Edits"
                  value={newPlan.featuresText}
                  onChange={(e) => setNewPlan({ ...newPlan, featuresText: e.target.value })}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="customDomain"
                  checked={newPlan.customDomainAllowed}
                  onChange={(e) => setNewPlan({ ...newPlan, customDomainAllowed: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="customDomain" className="text-xs text-slate-300">
                  Allow Custom Candidate Domain on this plan
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  Save & Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
