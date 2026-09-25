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
  Globe,
  ArrowLeft
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
      setError('Please select a PDF CV to convert');
      return;
    }

    setLoading(true);
    setError(null);
    setStepText('Extracting professional achievements from PDF...');

    try {
      // 1. Try server-side upload API first
      const formData = new FormData();
      formData.append('file', file);
      if (customSlug.trim()) {
        formData.append('slug', customSlug.trim().toLowerCase());
      }

      setStepText('Synthesizing executive summary and career metrics with AI...');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: UploadResult = await response.json();
        saveProfileLocally(data.profile);
        setResult(data);
        return;
      }

      // 2. If server API fails (e.g. on static edge worker without Node runtime), run client-side extraction fallback
      console.warn('Server upload failed, using high-res client-side extraction fallback');
      setStepText('Parsing PDF text locally in browser...');

      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPdfBuffer(arrayBuffer);

      if (!text || text.trim().length === 0) {
        throw new Error('Could not read text from this PDF. Please ensure it contains selectable text.');
      }

      setStepText('Generating candidate profile with fallback AI heuristics...');
      const fallbackProfile = await buildProfileFromText(text, file.name);

      // Apply custom slug if provided
      if (customSlug.trim()) {
        const cleanSlug = customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
        fallbackProfile.slug = cleanSlug;
      }

      // Save locally
      saveProfileLocally(fallbackProfile);

      setResult({
        success: true,
        slug: fallbackProfile.slug,
        url: `/cv/${fallbackProfile.slug}`,
        profile: fallbackProfile,
        aiSource: 'browser-parser',
        message: 'Successfully generated profile from PDF document',
      });
    } catch (err: unknown) {
      console.error('Conversion error:', err);
      const message = err instanceof Error ? err.message : 'Failed to convert CV. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
      setStepText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0F1] text-black font-sans selection:bg-black selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-neutral-600 transition-colors px-4 py-2 rounded-full bg-white border border-black/10 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/login" className="text-black/60 hover:text-black transition-colors">
              Candidate Login
            </Link>
            <Link href="/cv/mazen" className="text-black underline">
              Live Demo
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            AI-Powered CV to Executive Website
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight">
            TURN YOUR PDF CV INTO A HIGH-CONVERTING WEBSITE
          </h1>
          <p className="text-black/60 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Upload your resume. Our AI instantly formats your experience, leadership milestones, and impact metrics into an executive portfolio.
          </p>
        </div>

        {/* Success Modal / State */}
        {result ? (
          <div className="bg-white border border-black/10 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                Your Executive Website is Live!
              </h2>
              <p className="text-xs sm:text-sm text-black/70">
                Created for <strong className="text-black font-bold">{result.profile?.fullName}</strong> ({result.profile?.title})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-black/50">Your Permanent Hosted Link</div>
                <div className="text-sm font-mono text-black font-bold truncate max-w-xs sm:max-w-md">
                  {typeof window !== 'undefined' ? `${window.location.origin}${result.url}` : result.url}
                </div>
              </div>

              <Link
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold rounded-full text-xs transition-all shrink-0 shadow-md"
              >
                <span>View Live Website</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-black/60 font-medium">
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setCustomSlug('');
                }}
                className="hover:text-black transition-colors underline font-bold"
              >
                Convert Another CV
              </button>
              <span>•</span>
              <Link href="/admin" className="hover:text-black transition-colors font-bold">
                Manage in Admin Portal
              </Link>
            </div>
          </div>
        ) : (
          /* Upload Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-black bg-neutral-100 scale-[1.01]'
                  : 'border-black/20 hover:border-black bg-white shadow-sm'
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
                  <div className="w-16 h-16 rounded-2xl bg-[#F0EEED] border border-black/10 flex items-center justify-center mx-auto text-black">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-bold text-black text-lg">{file.name}</div>
                    <div className="text-xs text-black/50 mt-1 font-medium">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI conversion
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Change Document
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#F0EEED] flex items-center justify-center mx-auto text-black/60">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-black uppercase">
                      Click to upload or drag & drop your CV
                    </div>
                    <div className="text-xs text-black/50 font-medium">
                      Standard PDF files (up to 15MB)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slug / Subdomain customization */}
            <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wider text-black">
                Choose Your Preferred URL Name (Optional)
              </label>
              <div className="flex rounded-full bg-[#F9F9F9] border border-black/15 overflow-hidden focus-within:border-black focus-within:bg-white">
                <span className="px-5 py-3 text-xs sm:text-sm text-black/50 bg-[#F0F0F0] select-none border-r border-black/10 font-mono">
                  yoursite.com/cv/
                </span>
                <input
                  type="text"
                  placeholder="mohamedcv"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-black placeholder:text-black/40 focus:outline-none"
                />
              </div>
              <p className="text-xs text-black/50 font-medium">
                You can also connect your own custom domain (e.g. <code>mohamed.com</code>) anytime.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                loading || !file
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-black hover:bg-neutral-800 text-white hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
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
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-black/70">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant 15-second generation</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-black/70">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Free Cloud Edge Hosting</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-black/70">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Private & Secure Processing</span>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
