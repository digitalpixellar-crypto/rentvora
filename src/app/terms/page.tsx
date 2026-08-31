import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-montserrat">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D71920] transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: September 1, 2026 • RENTVORA Car Rentals</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">1. Acceptance of Terms</h3>
          <p>By accessing or using the RENTVORA web app and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">2. Platform Intermediary Role</h3>
          <p>RENTVORA operates as a marketplace platform connecting vehicle hosts with verified renters. We facilitate reservations, payments, and KYC verification but are not the direct owners of all fleet vehicles.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">3. Renter Responsibilities</h3>
          <p>Renters agree to operate vehicles safely in compliance with all Indian Motor Vehicle Laws, speed limits, and traffic guidelines. Any traffic fines or toll violations incurred during the rental period are the sole responsibility of the renter.</p>
        </section>
      </div>
    </div>
  );
}
