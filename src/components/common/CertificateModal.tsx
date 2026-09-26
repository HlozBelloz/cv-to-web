'use client';

import React from 'react';
import { CertificateItem } from '@/types';
import { X, Award, ExternalLink, CheckCircle2, ShieldCheck, Download, BookOpen } from 'lucide-react';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 relative max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Verified Academic & Industry Credential
                </span>
                {certificate.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {certificate.category}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {certificate.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Image Zoom View */}
        <div className="p-4 sm:p-6 bg-slate-950/90 flex items-center justify-center min-h-[280px] max-h-[460px] overflow-auto shrink-0">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="max-h-[400px] w-auto rounded-xl object-contain shadow-2xl border border-slate-700/80 hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
              <Award className="w-16 h-16 text-amber-500/40" />
              <p className="text-xs">Digital Verification Record</p>
            </div>
          )}
        </div>

        {/* Curriculum Topics if available */}
        {certificate.topics && certificate.topics.length > 0 && (
          <div className="px-5 py-3.5 bg-slate-950/50 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Curriculum & Tested Competencies:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {certificate.topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                >
                  ✓ {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details & Verification Footer */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{certificate.issuer}</span>
              {certificate.issueDate && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">Issued {certificate.issueDate}</span>
                </>
              )}
            </div>
            {certificate.badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {certificate.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {certificate.imageUrl && (
              <a
                href={certificate.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Save High-Res</span>
              </a>
            )}
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
