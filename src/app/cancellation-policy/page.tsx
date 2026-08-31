import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-montserrat">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D71920] transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Refunds</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Cancellation & Refund Policy</h1>
        <p className="text-xs text-slate-500">Fair and transparent cancellation terms for all renters and car hosts.</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Free Cancellation</span>
            <h3 className="text-lg font-black text-slate-900 m-0">100% Refund</h3>
            <p className="text-xs text-slate-600 m-0">Cancellations made <strong>more than 24 hours</strong> before scheduled pickup time receive a 100% full refund with zero cancellation charges.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">Partial Refund</span>
            <h3 className="text-lg font-black text-slate-900 m-0">50% Refund</h3>
            <p className="text-xs text-slate-600 m-0">Cancellations made <strong>between 6 to 24 hours</strong> before pickup receive a 50% refund of the base fare. Security deposit is 100% refunded.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Deposit Protected</span>
            <h3 className="text-lg font-black text-slate-900 m-0">Deposit 100% Safe</h3>
            <p className="text-xs text-slate-600 m-0">For cancellations <strong>under 6 hours</strong> or no-shows, the base rental is retained, but the <strong>100% security deposit is refunded</strong>.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
          <h3 className="text-base font-black text-slate-900 m-0">Host-Initiated Cancellation Guarantee</h3>
          <p className="m-0">
            In the rare event that a car host cancels your booking due to unforeseen vehicle maintenance, RENTVORA provides:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>100% Immediate Full Refund</strong> to your original payment method.</li>
            <li><strong>Free Upgrade or Replacement Vehicle</strong> arranged by our local Proddatur support team.</li>
            <li><strong>₹500 Travel Credit Voucher</strong> applied automatically to your next rental.</li>
          </ul>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Refunds are processed automatically via Cashfree PG to your UPI / bank account within 24 to 48 hours.</span>
        </div>

      </div>
    </div>
  );
}
