'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef } from 'react';
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
  Lock,
  Camera,
  Trash2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';

export default function CustomerProfilePage() {
  const { currentUser, isAuthLoaded, updateUserProfile } = useMarketplace();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Profile Picture State
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatar_url || '');
  const [fullName, setFullName] = useState<string>(currentUser?.full_name || 'Yeswanth Reddy');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+91 78938 17322');
  const [email, setEmail] = useState<string>(currentUser?.email || 'yeswanthreddykarnapu@gmail.com');
  const [city, setCity] = useState<string>('Proddatur, AP');
  const [emergencyContactName, setEmergencyContactName] = useState('Suresh Reddy (Brother)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98490 55443');

  // Driving License State
  const [dlNumber, setDlNumber] = useState('AP04 20220009876');
  const [dlExpiryDate, setDlExpiryDate] = useState('2038-08-20');
  const [dlFrontUploaded, setDlFrontUploaded] = useState(true);
  const [dlBackUploaded, setDlBackUploaded] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle Profile Picture File Selection
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatarUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Preset Sample Avatars
  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateUserProfile({
        full_name: fullName,
        phone,
        avatar_url: avatarUrl,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  if (isAuthLoaded && !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 font-montserrat">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#D71920] border border-red-200 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Sign In to Edit Profile</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please log in to upload your profile picture and manage your Driving License &amp; KYC verification.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <Link
            href="/auth/login?redirect=/customer/profile"
            className="px-6 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs shadow-lg shadow-[#D71920]/25 transition"
          >
            Sign In to Edit Profile &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-montserrat">
      
      {/* Header & Back */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link 
          href="/customer/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D71920] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* KYC Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>KYC Status: Verified &amp; Approved</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        
        {/* Title */}
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Edit Profile &amp; Photo
          </h1>
          <p className="text-xs text-slate-500">
            Update your profile picture, personal information, and verified Driving License for instant car pickups in Proddatur.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-black">Profile Updated Successfully!</div>
              <div className="text-[11px] text-emerald-700 font-normal">Your profile picture and details have been synchronized.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8 text-xs font-semibold">
          
          {/* ============================================================ */}
          {/* 1. PROFILE PICTURE UPLOAD CARD                                */}
          {/* ============================================================ */}
          <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D71920]" />
                  <span>Profile Picture</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload your photo to personalize your account and trip handover inspection.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Max size: 5MB</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              
              {/* Avatar Preview with Camera Overlay */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-3xl font-black">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span>{fullName?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>

                <label 
                  htmlFor="avatar-file-upload" 
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-[#D71920] hover:bg-[#b8141a] text-white shadow-lg cursor-pointer border-2 border-white transition transform group-hover:scale-105"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </label>
                
                <input
                  ref={fileInputRef}
                  id="avatar-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              {/* Upload Controls & Presets */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <label
                    htmlFor="avatar-file-upload"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs cursor-pointer shadow-xs transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1.5 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Quick Preset Avatars */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold block">Or choose a preset avatar:</span>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {presetAvatars.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-9 h-9 rounded-full border-2 overflow-hidden transition transform hover:scale-110 ${
                          avatarUrl === url ? 'border-[#D71920] ring-2 ring-red-300' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. PERSONAL INFORMATION                                       */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D71920]" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Full Legal Name (as per DL)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
                />
              </div>
            </div>

            {/* Emergency Contact & City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Home City / Locality</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:border-[#D71920]">
                  <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Emergency Contact Person</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Name &amp; Relationship"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. DRIVING LICENSE & KYC DOCUMENTS                           */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D71920]" />
              <span>Driving License &amp; Government KYC</span>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-black text-slate-900 outline-none uppercase tracking-wider focus:border-[#D71920]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">License Valid Till (Expiry Date)</label>
                <input
                  type="date"
                  required
                  value={dlExpiryDate}
                  onChange={(e) => setDlExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">&#10003; Uploaded</span>
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">&#10003; Uploaded</span>
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">&#10003; Uploaded</span>
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
              <span>256-Bit Encrypted and safely stored on Supabase</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving Profile...' : 'Save Profile & Photo'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
