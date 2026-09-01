'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  Lock
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';

export default function CustomerProfilePage() {
  const { currentUser, isAuthLoaded } = useMarketplace();

  const [fullName, setFullName] = useState(currentUser?.full_name || 'Pavan Kalyan M');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 91234 56780');
  const [email, setEmail] = useState(currentUser?.email || 'pavan.kalyan@gmail.com');
  const [emergencyContactName, setEmergencyContactName] = useState('Suresh Kumar M (Brother)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98490 55443');

  // Driving License State
  const [dlNumber, setDlNumber] = useState('AP04 20210009876');
  const [dlExpiryDate, setDlExpiryDate] = useState('2036-05-15');
  const [dlFrontUploaded, setDlFrontUploaded] = useState(true);
  const [dlBackUploaded, setDlBackUploaded] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [kycStatus, setKycStatus] = useState<'verified' | 'pending' | 'rejected'>('verified');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
  };

  
  if (isAuthLoaded && !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 font-montserrat">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#D71920] border border-red-200 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Sign In to Manage KYC Profile</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please log in to upload and manage your Driving License and Aadhaar document verification.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <Link
            href="/auth/login?redirect=/customer/profile"
            className="px-6 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs shadow-lg shadow-[#D71920]/25 transition"
          >
            Sign In with Phone / Email →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-montserrat">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <Link 
          href="/customer/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D71920] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* KYC Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#D71920] border border-red-200 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>KYC Status: 100% Verified & Approved</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        
        {/* Title */}
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Customer Profile & License Verification
          </h1>
          <p className="text-xs text-slate-500">
            Your verified Driving License allows 1-click instant booking for all self-drive cars in Proddatur without repeated paperwork.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-900 border border-red-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
            <span>Profile and KYC documents updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8 text-xs font-semibold">
          
          {/* 1. Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D71920]" />
              <span>1. Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Full Legal Name (as per DL)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Emergency Contact Person</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Name & Relationship"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Driving License (DL) & Documents */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D71920]" />
              <span>2. Driving License & Government KYC</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Indian Driving License Number</label>
                <input
                  type="text"
                  required
                  placeholder="AP04 20210009876"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-black text-slate-900 outline-none uppercase tracking-wider"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">License Valid Till (Expiry Date)</label>
                <input
                  type="date"
                  required
                  value={dlExpiryDate}
                  onChange={(e) => setDlExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Document Upload Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* DL Front */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">DL Front Photo</span>
                  {dlFrontUploaded ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#D71920] text-[10px] font-bold">Uploaded ?</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Required</span>
                  )}
                </div>
                <label className="cursor-pointer block border border-dashed border-slate-300 hover:border-[#D71920] bg-white rounded-xl p-3 text-center transition">
                  <Upload className="w-4 h-4 mx-auto text-[#D71920] mb-1" />
                  <span className="text-[11px] font-bold text-slate-600">Choose Front Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={() => setDlFrontUploaded(true)} />
                </label>
              </div>

              {/* DL Back */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">DL Back Photo</span>
                  {dlBackUploaded ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#D71920] text-[10px] font-bold">Uploaded ?</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Required</span>
                  )}
                </div>
                <label className="cursor-pointer block border border-dashed border-slate-300 hover:border-[#D71920] bg-white rounded-xl p-3 text-center transition">
                  <Upload className="w-4 h-4 mx-auto text-[#D71920] mb-1" />
                  <span className="text-[11px] font-bold text-slate-600">Choose Back Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={() => setDlBackUploaded(true)} />
                </label>
              </div>

              {/* Aadhaar Card */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Aadhaar Card</span>
                  {aadhaarUploaded ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#D71920] text-[10px] font-bold">Uploaded ?</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Optional</span>
                  )}
                </div>
                <label className="cursor-pointer block border border-dashed border-slate-300 hover:border-[#D71920] bg-white rounded-xl p-3 text-center transition">
                  <Upload className="w-4 h-4 mx-auto text-[#D71920] mb-1" />
                  <span className="text-[11px] font-bold text-slate-600">Choose ID Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={() => setAadhaarUploaded(true)} />
                </label>
              </div>

            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Encrypted and safely stored on Supabase</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving Profile...' : 'Save Profile & KYC'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
