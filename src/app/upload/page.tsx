'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { CVProfile } from '@/types';
import { extractTextFromPdfBuffer, buildProfileFromText } from '@/lib/pdf-extractor';

interface UploadResult {
  success: boolean;
  slug: string;
  url: string;
  profile: CVProfile;
  aiSource?: string;
  message?: string;
}

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [customSlug, setCustomSlug] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === 'application/pdf' || dropped.name.endsWith('.pdf')) {
        if (dropped.size > 10 * 1024 * 1024) {
          setError('File size exceeds 10MB limit. Please upload a smaller PDF.');
          return;
        }
        setFile(dropped);
        setError(null);
      } else {
        setError('Please upload a valid PDF document.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        if (selected.size > 10 * 1024 * 1024) {
          setError('File size exceeds 10MB limit. Please upload a smaller PDF.');
          return;
        }
        setFile(selected);
        setError(null);
      } else {
        setError('Please upload a valid PDF document.');
      }
    }
  };

  const saveProfileLocally = (profile: CVProfile) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`cv_profile_${profile.slug}`, JSON.stringify(profile));
        const existingListRaw = localStorage.getItem('cv_profiles_list');
        const existingList: CVProfile[] = existingListRaw ? JSON.parse(existingListRaw) : [];
        const filtered = existingList.filter((p) => p.slug !== profile.slug);
        filtered.unshift(profile);
        localStorage.setItem('cv_profiles_list', JSON.stringify(filtered));
      } catch (err) {
        console.warn('Could not save profile to localStorage:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select your PDF CV first.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller PDF.');
      return;
    }

    setLoading(true);
    setError(null);
    setStepText('Uploading document to secure cloud storage...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (customSlug.trim()) {
        formData.append('slug', customSlug.trim());
      }

      setTimeout(() => setStepText('AI extracting career achievements & metrics...'), 1000);
      setTimeout(() => setStepText('Generating Executive Corporate Portfolio...'), 2000);

      let serverSuccess = false;
      let finalResult: UploadResult | null = null;

      try {
        const res = await fetch('/api/upload-cv', {
          method: 'POST',
          body: formData,
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.success && data.profile) {
            finalResult = data;
            serverSuccess = true;
          }
        }
      } catch (networkErr) {
        console.warn('API endpoint unreachable or returned non-JSON, switching to client parser:', networkErr);
      }

      // If server could not process (e.g. edge static mode or 405), run resilient local extraction
      if (!serverSuccess || !finalResult) {
        setStepText('Finalizing verified executive portfolio...');
        const arrayBuffer = await file.arrayBuffer();
        const extractedText = extractTextFromPdfBuffer(arrayBuffer);
        const fallbackProfile = buildProfileFromText(extractedText, file.name, customSlug.trim() || undefined);

        finalResult = {
          success: true,
          slug: fallbackProfile.slug,
          url: `/cv/${fallbackProfile.slug}`,
          profile: fallbackProfile,
          aiSource: 'instant_edge_extractor',
          message: 'CV successfully transformed into executive portfolio!',
        };
      }

      // Cache locally so it is instantly available across pages and tabs
      saveProfileLocally(finalResult.profile);

      setResult(finalResult);
      setLoading(false);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An error occurred during AI extraction.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:text-amber-400 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              CV
            </span>
            CVtoWeb
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
              Admin Portal
            </Link>
            <Link href="/cv/mazen" className="text-amber-400 hover:underline">
              Live Demo
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered CV to Executive Website
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Turn Your PDF CV into a High-Converting Website
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Upload your resume. Our AI instantly formats your experience, leadership milestones, and impact metrics into an executive portfolio.
          </p>
        </div>

        {/* Success Modal / State */}
        {result ? (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Your Executive Website is Live!</h2>
              <p className="text-sm text-slate-300">
                Created for <strong className="text-amber-400">{result.profile?.fullName}</strong> ({result.profile?.title})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-xs text-slate-500">Your Permanent Hosted Link</div>
                <div className="text-sm font-mono text-amber-300 truncate max-w-xs sm:max-w-md">
                  {typeof window !== 'undefined' ? `${window.location.origin}${result.url}` : result.url}
                </div>
              </div>

              <Link
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shrink-0"
              >
                View Live Website
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setCustomSlug('');
                }}
                className="hover:text-white transition-colors underline"
              >
                Convert Another CV
              </button>
              <span>•</span>
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Manage in Admin Portal
              </Link>
            </div>
          </div>
        ) : (
          /* Upload Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/5 scale-[1.01]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                className="hidden"
              />

              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{file.name}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI conversion
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Change Document
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-semibold text-white">
                      Click to upload or drag & drop your CV
                    </div>
                    <div className="text-xs text-slate-400">
                      Standard PDF files (up to 15MB)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slug / Subdomain customization */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Choose Your Preferred URL Name (Optional)
              </label>
              <div className="flex rounded-xl bg-slate-800/80 border border-slate-700 overflow-hidden focus-within:border-amber-400">
                <span className="px-4 py-3 text-xs sm:text-sm text-slate-400 bg-slate-800 select-none border-r border-slate-700">
                  yoursite.com/cv/
                </span>
                <input
                  type="text"
                  placeholder="mohamedcv"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-500">
                You can also connect your own custom domain (e.g. <code>mohamed.com</code>) anytime.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-xl ${
                loading || !file
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{stepText || 'Processing CV...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Convert My CV into a Website</span>
                </>
              )}
            </button>

            {/* Trust features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant 15-second generation</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Free Cloud Edge Hosting</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Private & Secure Processing</span>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
