import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-montserrat">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D71920] transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Privacy & KYC Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: September 1, 2026 • RENTVORA Car Rentals</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">1. Information We Collect</h3>
          <p>We collect essential identity verification details including your Name, Mobile Phone Number, Email, Driving License copy, and Aadhaar card purely for KYC compliance and vehicle safety verification.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">2. Security & Storage</h3>
          <p>All sensitive identity documents and photos are stored securely with 256-bit AES encryption in our Supabase Cloud Storage. We never sell or share your personal data with third-party advertisers.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">3. Payment Security</h3>
          <p>All payment transactions are processed directly via Cashfree Payments with bank-grade 256-Bit SSL encryption. RENTVORA does not store full credit/debit card details on our servers.</p>
        </section>
      </div>
    </div>
  );
}
