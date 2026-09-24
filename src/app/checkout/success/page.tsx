import React, { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

function SuccessContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const txId = typeof searchParams.txId === 'string' ? searchParams.txId : 'MOCK-TX-DEMO';
  const amount = typeof searchParams.amount === 'string' ? searchParams.amount : '100';
  const plan = typeof searchParams.plan === 'string' ? searchParams.plan : 'Executive Launch';

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Top Brand */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:text-amber-400 transition-colors">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            CV
          </span>
          CVtoWeb
        </Link>
        <Link href="/admin" className="text-xs text-slate-400 hover:text-white transition-colors">
          Admin Portal
        </Link>
      </div>

      {/* Confirmation Card */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Payment Verified via Paymob Egypt
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Payment Confirmed!
          </h1>
          <p className="text-slate-400 text-sm">
            Thank you for activating your executive portfolio. Your transaction has been recorded.
          </p>
        </div>

        {/* Receipt Details Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-left text-xs font-mono space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span>Transaction ID:</span>
            <span className="text-amber-300 font-semibold truncate max-w-[200px]">{txId}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Plan:</span>
            <span className="text-white font-semibold">{plan}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Amount Paid:</span>
            <span className="text-emerald-400 font-bold text-sm">{amount} EGP</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Gateway:</span>
            <span className="text-slate-300">Paymob (Vodafone Cash / Meeza / Card)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/cv/mazen"
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10"
          >
            <span>View Executive Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admin"
            className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span>Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        Need assistance with custom DNS or invoice copies? Contact support at support@example.com
      </div>
    </div>
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30">
      <Suspense fallback={<div className="text-center text-slate-400 py-20">Loading receipt...</div>}>
        <SuccessContent searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
