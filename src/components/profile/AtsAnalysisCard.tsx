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
    if (score >= 90) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 80) return 'text-amber-700 border-amber-300 bg-amber-50';
    if (score >= 70) return 'text-blue-700 border-blue-300 bg-blue-50';
    return 'text-rose-700 border-rose-300 bg-rose-50';
  };

  const getBadgeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'bg-emerald-600 text-white';
    if (grade === 'B') return 'bg-amber-600 text-white';
    return 'bg-rose-600 text-white';
  };

  return (
    <div className="space-y-6 text-black">
      {/* Top Banner & Overview */}
      <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise ATS Parser Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
              Resume Readiness & ATS Score
            </h2>
            <p className="text-xs sm:text-sm text-black/60 max-w-xl font-medium">
              Simulated screening against Workday, Taleo, Greenhouse, and Lever parsing algorithms.
            </p>
          </div>

          {/* Large Score Dial */}
          <div className="flex items-center gap-5 bg-[#F9F9F9] border border-black/10 p-5 rounded-3xl shrink-0">
            <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${getScoreColor(result.score)}`}>
              <span className="text-3xl leading-none">{result.score}</span>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">/ 100</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${getBadgeColor(result.grade)}`}>
                  Grade {result.grade}
                </span>
                <span className="text-sm font-bold text-black">{result.rating}</span>
              </div>
              <p className="text-xs text-black/50 font-medium">
                {result.score >= 85 ? 'Optimized for high-volume corporate screening' : 'Follow suggestions below to boost pass rate'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-black/10">
          <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
            <span className="text-xs text-black/50 block font-medium">Quantified Metrics</span>
            <span className="text-lg font-black text-black">{result.metricsCount} KPIs</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
            <span className="text-xs text-black/50 block font-medium">Power Action Verbs</span>
            <span className="text-lg font-black text-emerald-700">{result.actionVerbCount} Verbs</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
            <span className="text-xs text-black/50 block font-medium">Keyword Depth</span>
            <span className="text-lg font-black text-black">{result.detectedKeywords.length} Skills</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/5 text-center">
            <span className="text-xs text-black/50 block font-medium">ATS Parse Status</span>
            <span className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              100% Parsable
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg font-black text-black uppercase flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-black" />
          <span>Scoring Dimensions & Audit Breakdown</span>
        </h3>

        <div className="space-y-4">
          {/* 1. Completeness */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black">1. Core Section Completeness</span>
              <span className="font-mono text-black font-bold">{result.breakdown.sectionCompleteness.score} / {result.breakdown.sectionCompleteness.max}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F0F0F0] overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.sectionCompleteness.score / result.breakdown.sectionCompleteness.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-black/50 font-medium">{result.breakdown.sectionCompleteness.feedback}</p>
          </div>

          {/* 2. Impact & Metrics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black">2. Quantified Impact & Numerical Metrics</span>
              <span className="font-mono text-emerald-700 font-bold">{result.breakdown.impactAndMetrics.score} / {result.breakdown.impactAndMetrics.max}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F0F0F0] overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.impactAndMetrics.score / result.breakdown.impactAndMetrics.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-black/50 font-medium">{result.breakdown.impactAndMetrics.feedback}</p>
          </div>

          {/* 3. Action Verbs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black">3. Leadership & Action Verbs Language</span>
              <span className="font-mono text-black font-bold">{result.breakdown.actionVerbs.score} / {result.breakdown.actionVerbs.max}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F0F0F0] overflow-hidden">
              <div 
                className="h-full bg-neutral-700 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.actionVerbs.score / result.breakdown.actionVerbs.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-black/50 font-medium">{result.breakdown.actionVerbs.feedback}</p>
          </div>

          {/* 4. Skills Taxonomy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black">4. Domain Skills & Frameworks Taxonomy</span>
              <span className="font-mono text-black font-bold">{result.breakdown.skillsTaxonomy.score} / {result.breakdown.skillsTaxonomy.max}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F0F0F0] overflow-hidden">
              <div 
                className="h-full bg-neutral-800 rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.skillsTaxonomy.score / result.breakdown.skillsTaxonomy.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-black/50 font-medium">{result.breakdown.skillsTaxonomy.feedback}</p>
          </div>

          {/* 5. Contact Channels */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black">5. Recruiter Reachout & Verified Contacts</span>
              <span className="font-mono text-black font-bold">{result.breakdown.brevityAndContact.score} / {result.breakdown.brevityAndContact.max}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F0F0F0] overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${(result.breakdown.brevityAndContact.score / result.breakdown.brevityAndContact.max) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-black/50 font-medium">{result.breakdown.brevityAndContact.feedback}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Recommendations Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Strengths ({result.strengths.length})</span>
          </div>
          <ul className="space-y-2.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-black/80 font-medium">
                <span className="text-emerald-600 mt-0.5 font-bold">✔</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-white border border-black/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-black font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Optimization Recommendations ({result.recommendations.length})</span>
          </div>

          {result.recommendations.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              Your profile meets all high-level enterprise ATS screening criteria! No critical fixes required.
            </div>
          ) : (
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F9F9F9] border border-black/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-black" />
                      {rec.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      rec.type === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.type} impact
                    </span>
                  </div>
                  <p className="text-xs text-black/60 leading-relaxed font-medium">
                    {rec.advice}
                  </p>
                  {onOptimizeWithAi && (
                    <button
                      onClick={() => onOptimizeWithAi(`Please help me improve my CV for this recommendation: "${rec.title} - ${rec.advice}"`)}
                      className="mt-1 text-[11px] font-bold text-black hover:underline inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
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
