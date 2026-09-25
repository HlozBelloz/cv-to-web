import React, { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, ExternalLink, ArrowLeft } from 'lucide-react';

function SuccessContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const txId = typeof searchParams.txId === 'string' ? searchParams.txId : 'MOCK-TX-DEMO';
  const amount = typeof searchParams.amount === 'string' ? searchParams.amount : '100';
  const plan = typeof searchParams.plan === 'string' ? searchParams.plan : 'Executive Launch';

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Top Brand */}
      <div className="flex items-center justify-between pb-6 border-b border-black/10">
        <Link href="/" className="font-black text-2xl tracking-tighter text-black uppercase">
          CVTO.WEB
        </Link>
        <Link href="/admin" className="text-xs font-bold text-black/60 hover:text-black transition-colors">
          Admin Portal
        </Link>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white border border-black/10 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Payment Verified via Paymob Egypt
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
            Payment Confirmed!
          </h1>
          <p className="text-black/60 text-xs sm:text-sm font-medium">
            Thank you for activating your executive portfolio. Your transaction has been recorded.
          </p>
        </div>

        {/* Receipt Details Box */}
        <div className="bg-[#F9F9F9] border border-black/10 rounded-2xl p-5 text-left text-xs font-mono space-y-3">
          <div className="flex items-center justify-between text-black/60">
            <span>Transaction ID:</span>
            <span className="text-black font-bold truncate max-w-[200px]">{txId}</span>
          </div>
          <div className="flex items-center justify-between text-black/60">
            <span>Plan:</span>
            <span className="text-black font-bold">{plan}</span>
          </div>
          <div className="flex items-center justify-between text-black/60 border-t border-black/10 pt-2">
            <span>Amount Paid:</span>
            <span className="text-emerald-700 font-black text-sm">{amount} EGP</span>
          </div>
          <div className="flex items-center justify-between text-black/60">
            <span>Gateway:</span>
            <span className="text-black/80 font-sans font-semibold">Paymob (Vodafone Cash / Meeza / Card)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/cv/mazen"
            className="flex-1 py-3.5 px-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>View Executive Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admin"
            className="py-3.5 px-6 rounded-full border border-black/20 bg-white hover:bg-neutral-50 text-black text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>Admin Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-black/50 font-medium">
        Need assistance with custom DNS or invoice copies? Contact support at support@cvtoweb.com
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
    <div className="min-h-screen bg-[#F2F0F1] text-black py-16 px-4 sm:px-6 lg:px-8 selection:bg-black selection:text-white font-sans">
      <Suspense fallback={<div className="text-center text-black/40 py-20 font-bold">Loading receipt...</div>}>
        <SuccessContent searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
