'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';

export default function OwnerRegisterPage() {
  const router = useRouter();
  const { setCurrentUserRole } = useMarketplace();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setCurrentUserRole('owner');
    setTimeout(() => {
      router.push('/owner/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Proddatur Car Host Onboarding</span>
        <h1 className="text-3xl font-black text-slate-900">List Your Car & Start Earning</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">Register as a verified vehicle owner in Proddatur. KYC verification takes only 2-4 hours.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        {submitted ? (
          <div className="py-12 text-center text-emerald-600 space-y-3">
            <CheckCircle className="w-12 h-12 mx-auto" />
            <h3 className="text-xl font-bold">KYC Submitted Successfully!</h3>
            <p className="text-xs text-slate-500">Redirecting to your Car Owner Dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-1">1. Personal & KYC Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Full Name (as per Aadhaar)</label>
                  <input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" placeholder="e.g. Ramesh Reddy" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Mobile Number</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" placeholder="+91 98490 XXXXX" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Email Address</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" placeholder="name@gmail.com" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Aadhaar Card Number</label>
                  <input required value={aadharNumber} onChange={e => setAadharNumber(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" placeholder="XXXX-XXXX-XXXX" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Residential Address in Proddatur</label>
                <input required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" placeholder="Door No, Street, Landmark" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-1">2. Bank Payout Settlement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Bank Account Number</label>
                  <input required value={bankAccount} onChange={e => setBankAccount(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" placeholder="Account Number" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Bank IFSC Code</label>
                  <input required value={bankIfsc} onChange={e => setBankIfsc(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold uppercase" placeholder="e.g. SBIN0000902" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition">
              Submit Owner Registration & KYC
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
