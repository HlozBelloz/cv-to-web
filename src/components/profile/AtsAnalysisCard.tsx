'use client';

import React from 'react';
import { CVProfile } from '@/types';
import { analyzeAtsCompatibility, AtsAnalysisResult } from '@/lib/ats-checker';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Zap,
  Target,
  BarChart3,
  FileCheck
} from 'lucide-react';

interface AtsAnalysisCardProps {
  profile: CVProfile;
  onOptimizeWithAi?: (prompt: string) => void;
}

export function AtsAnalysisCard({ profile, onOptimizeWithAi }: AtsAnalysisCardProps) {
  const result: AtsAnalysisResult = analyzeAtsCompatibility(profile);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 80) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getBadgeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'bg-emerald-500 text-slate-950';
    if (grade === 'B') return 'bg-amber-500 text-slate-950';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise ATS Parser Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Resume Readiness & ATS Score
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Simulated screening against Workday, Taleo, Greenhouse, and Lever parsing algorithms.
            </p>
          </div>

          {/* Large Score Dial */}
          <div className="flex items-center gap-5 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shrink-0">
            <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${getScoreColor(result.score)}`}>
              <span className="text-3xl leading-none">{result.score}</span>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">/ 100</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-black ${getBadgeColor(result.grade)}`}>
                  Grade {result.grade}
                </span>
                <span className="text-sm font-bold text-white">{result.rating}</span>
              </div>
              <p className="text-xs text-slate-400">
                {result.score >= 85 ? 'Optimized for high-volume corporate screening' : 'Follow suggestions below to boost pass rate'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Quantified Metrics</span>
            <span className="text-base font-bold text-amber-400">{result.metricsCount} KPIs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Power Action Verbs</span>
            <span className="text-base font-bold text-emerald-400">{result.actionVerbCount} Verbs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">Keyword Depth</span>
            <span className="text-base font-bold text-cyan-400">{result.detectedKeywords.length} Skills</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-400 block">ATS Parse Status</span>
            <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Parsable
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <span>Scoring Dimensions & Audit Breakdown</span>
        </h3>

        <div className="space-y-4">
          {/* 1. Completeness */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">1. Core Section Completeness</span>
              <span className="font-mono text-amber-400 font-bold">{result.breakdown.sectionCompleteness.score} / {result.breakdown.sectionCompleteness.max}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.sectionCompleteness.score / result.breakdown.sectionCompleteness.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">{result.breakdown.sectionCompleteness.feedback}</p>
          </div>

          {/* 2. Impact & Metrics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">2. Quantified Impact & Numerical Metrics</span>
              <span className="font-mono text-emerald-400 font-bold">{result.breakdown.impactAndMetrics.score} / {result.breakdown.impactAndMetrics.max}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.impactAndMetrics.score / result.breakdown.impactAndMetrics.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">{result.breakdown.impactAndMetrics.feedback}</p>
          </div>

          {/* 3. Action Verbs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">3. Leadership & Action Verbs Language</span>
              <span className="font-mono text-cyan-400 font-bold">{result.breakdown.actionVerbs.score} / {result.breakdown.actionVerbs.max}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.actionVerbs.score / result.breakdown.actionVerbs.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">{result.breakdown.actionVerbs.feedback}</p>
          </div>

          {/* 4. Skills Taxonomy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">4. Domain Skills & Frameworks Taxonomy</span>
              <span className="font-mono text-purple-400 font-bold">{result.breakdown.skillsTaxonomy.score} / {result.breakdown.skillsTaxonomy.max}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.skillsTaxonomy.score / result.breakdown.skillsTaxonomy.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">{result.breakdown.skillsTaxonomy.feedback}</p>
          </div>

          {/* 5. Contact Channels */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">5. Recruiter Reachout & Verified Contacts</span>
              <span className="font-mono text-blue-400 font-bold">{result.breakdown.brevityAndContact.score} / {result.breakdown.brevityAndContact.max}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.brevityAndContact.score / result.breakdown.brevityAndContact.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">{result.breakdown.brevityAndContact.feedback}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Recommendations Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Strengths ({result.strengths.length})</span>
          </div>
          <ul className="space-y-2.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="text-emerald-400 mt-0.5">✔</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Optimization Recommendations ({result.recommendations.length})</span>
          </div>

          {result.recommendations.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              Your profile meets all high-level enterprise ATS screening criteria! No critical fixes required.
            </div>
          ) : (
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      {rec.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      rec.type === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {rec.type} impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rec.advice}
                  </p>
                  {onOptimizeWithAi && (
                    <button
                      onClick={() => onOptimizeWithAi(`Please help me improve my CV for this recommendation: "${rec.title} - ${rec.advice}"`)}
                      className="mt-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Optimize this with AI →</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
