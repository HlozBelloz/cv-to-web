'use client';

import React from 'react';
import { CertificateItem } from '@/types';
import { X, Award, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 relative">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Official Credential Verification
              </span>
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
        <div className="p-6 bg-slate-950/80 flex items-center justify-center min-h-[260px] max-h-[460px] overflow-hidden">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="max-h-[380px] w-auto rounded-xl object-contain shadow-2xl border border-slate-800"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
              <Award className="w-16 h-16 text-amber-500/40" />
              <p className="text-xs">Digital Verification Record</p>
            </div>
          )}
        </div>

        {/* Details & Verification Footer */}
        <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">{certificate.issuer}</span>
              {certificate.issueDate && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">Issued {certificate.issueDate}</span>
                </>
              )}
            </div>
            {certificate.badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {certificate.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Verify on Official Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
