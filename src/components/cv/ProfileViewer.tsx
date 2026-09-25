'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CVProfile } from '@/types';
import { ThemeRenderer } from '@/components/theme/ThemeRenderer';
import { Loader2, Sparkles } from 'lucide-react';

interface Props {
  slug: string;
  initialProfile?: CVProfile | null;
}

export function ProfileViewer({ slug, initialProfile }: Props) {
  const [profile, setProfile] = useState<CVProfile | null>(() => initialProfile || null);
  const [loading, setLoading] = useState<boolean>(() => !initialProfile);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (initialProfile) {
      return;
    }

    let isMounted = true;

    async function loadClientProfile() {
      // 1. Check browser local storage first for instant retrieval
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(`cv_profile_${slug}`);
          if (cached) {
            const parsed = JSON.parse(cached) as CVProfile;
            if (parsed && parsed.slug === slug) {
              if (isMounted) {
                setProfile(parsed);
                setLoading(false);
                return;
              }
            }
          }
        } catch {
          // Ignore cache read error
        }
      }

      // 2. Fetch from API endpoint
      try {
        const res = await fetch(`/api/profiles?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data && data.slug) {
              if (isMounted) {
                setProfile(data);
                setLoading(false);
                // Cache for fast subsequent loads
                if (typeof window !== 'undefined') {
                  localStorage.setItem(`cv_profile_${slug}`, JSON.stringify(data));
                }
                return;
              }
            }
          }
        }
      } catch (err) {
        console.warn('API fetch error for profile:', err);
      }

      if (isMounted) {
        setNotFound(true);
        setLoading(false);
      }
    }

    loadClientProfile();

    return () => {
      isMounted = false;
    };
  }, [slug, initialProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Loading Candidate Portfolio...</h2>
          <p className="text-xs text-slate-400">Retrieving career achievements and verified credentials</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 text-2xl font-bold">
            ?
          </div>
          <h1 className="text-2xl font-bold text-white">Candidate Portfolio Not Found</h1>
          <p className="text-slate-400 text-sm">
            The portfolio <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">/cv/{slug}</code> has not been generated or published yet.
          </p>
          <div className="pt-2">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your Executive CV Now</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ThemeRenderer profile={profile} defaultTheme={profile.theme} />;
}
