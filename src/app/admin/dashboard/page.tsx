'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck,
  Lock, 
  Users, 
  Car, 
  Calendar, 
  Settings, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PlusCircle, 
  Download, 
  Phone, 
  Sliders, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink,
  MessageCircle,
  FileText,
  Loader2,
  LogOut
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { getWhatsAppSupportUrl } from '@/lib/utils/whatsapp';

export default function AdminDashboardPage() {
  const { 
    cars, 
    owners, 
    bookings, 
    locations, 
    currentUser,
    commissionRate, 
    updateCommissionRate, 
    updateCarStatus, 
    updateOwnerKycStatus, 
    addLocation,
    confirmPayment,
    cancelBooking,
  } = useMarketplace();

  const [tab, setTab] = useState<'overview' | 'kyc' | 'cars' | 'bookings' | 'locations' | 'settings'>('overview');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [newCommission, setNewCommission] = useState(commissionRate);
  const [surgeMultiplier, setSurgeMultiplier] = useState(0); // 0%, 10%, 20%
  const [searchQuery, setSearchQuery] = useState('');

  // Check existing session token on mount
  useEffect(() => {
    try {
      const token = sessionStorage.getItem('rv_admin_token');
      if (token) {
        fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.valid) {
              setIsAdminUnlocked(true);
            } else {
              sessionStorage.removeItem('rv_admin_token');
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);
  
  // Location form state
  const [newCity, setNewCity] = useState('Kadapa');
  const [newLocality, setNewLocality] = useState('');
  const [newPointName, setNewPointName] = useState('');
  const [locAdded, setLocAdded] = useState(false);

  const pendingCars = cars.filter(c => c.approval_status === 'pending_approval');
  const pendingOwners = owners.filter(o => o.owner_profile.kyc_status === 'pending_verification');
  
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalBaseRental = bookings.reduce((sum, b) => sum + (b.base_rental_amount || 0), 0);
  const totalCommissionEarned = bookings.reduce((sum, b) => sum + (b.platform_commission_amount || 0), 0);
  const totalDepositsHeld = bookings.reduce((sum, b) => sum + (b.security_deposit_amount || 0), 0);

  // 1-Click CSV Export Generator
  const exportBookingsToCsv = () => {
    const headers = [
      'Booking Reference',
      'Vehicle',
      'Registration Number',
      'Renter Name',
      'Renter Phone',
      'Start Time',
      'Return Time',
      'Rental Mode',
      'Base Fare (INR)',
      'Platform Fee (INR)',
      'Deposit Held (INR)',
      'Total Paid (INR)',
      'Status'
    ];

    const rows = bookings.map(b => [
      b.booking_reference,
      `"${b.car?.brand || ''} ${b.car?.model || ''}"`,
      b.car?.registration_number || 'N/A',
      `"${b.customer?.full_name || 'Customer'}"`,
      b.customer?.phone || 'N/A',
      b.start_time,
      b.end_time,
      b.rental_type === 'with_driver' ? 'With Driver' : 'Self-Drive',
      b.base_rental_amount,
      b.platform_commission_amount,
      b.security_deposit_amount,
      b.total_amount,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RENTVORA_Bookings_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocality || !newPointName) return;
    await addLocation({ 
      city: newCity, 
      state: 'Andhra Pradesh', 
      area_locality: newLocality, 
      pickup_point_name: newPointName, 
      is_active: true 
    });
    setNewLocality('');
    setNewPointName('');
    setLocAdded(true);
    setTimeout(() => setLocAdded(false), 2000);
  };

  
  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasscode.trim()) return;
    setAuthErrorMessage('');
    setVerifying(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: adminPasscode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthErrorMessage(data.error || 'Invalid admin credentials');
        return;
      }

      if (data.token) {
        sessionStorage.setItem('rv_admin_token', data.token);
      }
      setIsAdminUnlocked(true);
      setAdminPasscode('');
    } catch (err: any) {
      setAuthErrorMessage('Authentication network error. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleLockAdmin = () => {
    try {
      sessionStorage.removeItem('rv_admin_token');
    } catch {}
    setIsAdminUnlocked(false);
    setAdminPasscode('');
    setAuthErrorMessage('');
  };

  if (!isAdminUnlocked && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 font-montserrat">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#111111] text-[#D71920] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D71920]">Restricted Access</span>
            <h2 className="text-2xl font-black text-slate-900">Super Admin Shield</h2>
            <p className="text-xs text-slate-500">
              Enter the master administration security key to access platform control, KYC verifications, and financial ledgers.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Master Security Key / Passcode
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={adminPasscode}
                onChange={(e) => {
                  setAdminPasscode(e.target.value);
                  setAuthErrorMessage('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-black text-slate-900 outline-none focus:border-[#D71920]"
              />
              {authErrorMessage && (
                <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-bold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{authErrorMessage}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] disabled:opacity-60 text-white font-black text-xs shadow-lg shadow-[#D71920]/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{verifying ? 'Verifying Security Token...' : 'Authenticate & Unlock →'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Server-Side Token Authorization</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-montserrat">
      
      {/* 1. Admin Header */}
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#D71920] border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin Headquarters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">RENTVORA Control Center</h1>
          <p className="text-xs text-slate-400">
            Platform Guard: <span className="text-emerald-400 font-bold">Live &amp; Connected</span> &bull; Database: Supabase PostgreSQL (ap-south-1)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportBookingsToCsv}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D71920]" />
            <span>Export Bookings CSV</span>
          </button>

          <button
            onClick={handleLockAdmin}
            className="px-4 py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-rose-800/60 shadow-md transition cursor-pointer"
            title="Lock Admin Session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Session</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Total Platform GMV</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</div>
          <div className="text-[11px] text-slate-400">{bookings.length} Total Bookings Received</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Net Platform Revenue</span>
          <div className="text-2xl font-black text-emerald-600">{formatCurrency(totalCommissionEarned)}</div>
          <div className="text-[11px] text-slate-400">At {commissionRate}% platform fee</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Security Deposits Held</span>
          <div className="text-2xl font-black text-[#D71920]">{formatCurrency(totalDepositsHeld)}</div>
          <div className="text-[11px] text-slate-400">Escrow account protected</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-600">{pendingCars.length + pendingOwners.length}</div>
          <div className="text-[11px] text-amber-700 font-semibold">{pendingCars.length} cars • {pendingOwners.length} host KYCs</div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'kyc', label: `🪪 KYC Verifications (${owners.length})` },
          { id: 'cars', label: `🚗 Fleet Approvals (${cars.length})` },
          { id: 'bookings', label: `📋 Bookings Ledger (${bookings.length})` },
          { id: 'locations', label: `📍 Service Hubs (${locations.length})` },
          { id: 'settings', label: '⚙️ Commission & Surge' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={'px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap ' + (
              tab === t.id 
                ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4. TAB: OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Cars Awaiting Approval ({pendingCars.length})</h3>
            </div>
            {pendingCars.length === 0 ? (
              <p className="text-xs text-slate-500 italic">All listed host cars have been reviewed and approved!</p>
            ) : (
              pendingCars.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <div className="font-black text-sm text-slate-900">{c.brand} {c.model} ({c.registration_number})</div>
                    <div className="text-slate-500">Host ID: {c.owner_id} • Rate: {formatCurrency(c.price_per_day)}/day • Deposit: {formatCurrency(c.security_deposit)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateCarStatus(c.id, 'approved')} 
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
                    >
                      ✓ Approve Car
                    </button>
                    <button 
                      onClick={() => updateCarStatus(c.id, 'rejected')} 
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. TAB: KYC VERIFICATIONS */}
      {tab === 'kyc' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Host & Renter Identity Verification Queue</h2>
            <p className="text-xs text-slate-500 mt-1">Review government ID (Aadhaar / Driving License) submissions before activating payouts.</p>
          </div>

          <div className="space-y-4">
            {owners.map(o => (
              <div key={o.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{o.full_name}</span>
                    <span className={'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ' + (
                      o.owner_profile.kyc_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}>
                      {o.owner_profile.kyc_status}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Phone: <strong>{o.phone}</strong> • Aadhaar: <strong>{o.owner_profile.aadhar_masked}</strong> • DL: <strong>{o.owner_profile.driving_license_no}</strong>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Bank: {o.owner_profile.bank_name} • IFSC: {o.owner_profile.bank_ifsc} (A/C: {o.owner_profile.bank_account_number})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={'tel:' + o.phone}
                    className="p-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300"
                    title="Call Host"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={getWhatsAppSupportUrl(`Hello ${o.full_name}, this is RENTVORA Admin regarding your KYC verification.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                    title="WhatsApp Host"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {o.owner_profile.kyc_status !== 'approved' ? (
                    <button
                      onClick={() => updateOwnerKycStatus(o.id, 'approved')}
                      className="px-4 py-2 rounded-xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs transition"
                    >
                      ✓ Approve KYC
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB: FLEET APPROVALS */}
      {tab === 'cars' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900">All Marketplace Cars ({cars.length})</h2>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {cars.map(c => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-3 items-center">
                  <img src={c.images[0]?.image_url} alt={c.model} className="w-16 h-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                  <div>
                    <span className="font-extrabold text-sm text-slate-900">{c.brand} {c.model}</span> <span className="text-slate-500 font-semibold">({c.registration_number})</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {c.fuel_type} • {c.transmission} • {formatCurrency(c.price_per_day)}/day • Deposit: {formatCurrency(c.security_deposit)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={'font-bold uppercase text-[10px] px-2.5 py-1 rounded-full ' + (
                    c.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  )}>
                    {c.approval_status.replace('_', ' ')}
                  </span>

                  {c.approval_status !== 'approved' && (
                    <button 
                      onClick={() => updateCarStatus(c.id, 'approved')} 
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  )}

                  {c.approval_status === 'approved' && (
                    <button 
                      onClick={() => updateCarStatus(c.id, 'suspended')} 
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-rose-600 font-bold hover:bg-rose-50"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB: BOOKINGS LEDGER */}
      {tab === 'bookings' && (() => {
        const bookingStatusColor = (status: string) => {
          if (status === 'confirmed' || status === 'active') return 'bg-emerald-100 text-emerald-800';
          if (status === 'pending_payment') return 'bg-amber-100 text-amber-800';
          if (['cancelled_by_customer', 'cancelled_by_owner', 'refunded', 'rejected'].includes(status)) return 'bg-rose-100 text-rose-800';
          if (status === 'completed') return 'bg-blue-100 text-blue-800';
          return 'bg-slate-100 text-slate-700';
        };

        return (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Official Bookings Ledger ({bookings.length})</h2>
                <p className="text-xs text-slate-500">Live transaction records with automatic fee splitting.</p>
              </div>
              <button
                onClick={exportBookingsToCsv}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Ledger CSV</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {bookings.map(b => (
                <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{b.booking_reference}</span>
                      <span className="text-xs text-slate-600 font-semibold">• {b.car?.brand} {b.car?.model}</span>
                      <span className="text-[10px] font-bold text-[#D71920] bg-red-50 px-2 py-0.5 rounded-full">
                        {b.rental_type === 'with_driver' ? '👔 Chauffeur' : '🚗 Self-Drive'}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Renter: <strong>{b.customer?.full_name}</strong> ({b.customer?.phone}) • Pickup: {b.pickup_location?.area_locality}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Schedule: {formatDateTime(b.start_time)} to {formatDateTime(b.end_time)}
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1.5">
                    <div className="font-black text-base text-slate-900">{formatCurrency(b.total_amount)}</div>
                    <div className="text-[11px] text-emerald-700 font-bold">Platform Fee: +{formatCurrency(b.platform_commission_amount)}</div>
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {/* Status Badge */}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${bookingStatusColor(b.status)}`}>
                        {b.status.replace(/_/g, ' ')}
                      </span>

                      {/* Confirm Payment Button (pending_payment only) */}
                      {b.status === 'pending_payment' && (
                        <button
                          onClick={() => confirmPayment(b.id, 'admin_manual')}
                          className="px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] inline-flex items-center gap-1"
                          title="Confirm Payment"
                        >
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Confirm</span>
                        </button>
                      )}

                      {/* Cancel Booking (non-cancelled bookings) */}
                      {!['cancelled_by_customer', 'cancelled_by_owner', 'refunded', 'rejected'].includes(b.status) && (
                        <button
                          onClick={() => cancelBooking(b.id, 'Cancelled by admin', 'admin')}
                          className="px-2 py-0.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[10px] inline-flex items-center gap-1 border border-rose-200"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-2.5 h-2.5" />
                          <span>Cancel</span>
                        </button>
                      )}

                      {/* Call Customer */}
                      <a
                        href={'tel:' + b.customer?.phone}
                        className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center border border-slate-200"
                        title="Call Customer"
                      >
                        <Phone className="w-2.5 h-2.5" />
                      </a>

                      {/* WhatsApp Customer */}
                      <a
                        href={getWhatsAppSupportUrl(`Hello ${b.customer?.full_name}, this is RENTVORA Admin regarding your booking ${b.booking_reference}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center"
                        title="WhatsApp Customer"
                      >
                        <MessageCircle className="w-2.5 h-2.5" />
                      </a>

                      {/* Invoice */}
                      <a
                        href={`/customer/invoice/${b.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] inline-flex items-center gap-1 border border-slate-200"
                      >
                        <FileText className="w-2.5 h-2.5 text-[#D71920]" />
                        <span>Invoice</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}


      {/* 8. TAB: SERVICE HUBS */}
      {tab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4 text-xs">
            <h3 className="font-black text-base text-slate-900">Add New Pickup Service Hub</h3>
            <form onSubmit={handleAddLocation} className="space-y-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700">City</label>
                <input 
                  value={newCity} 
                  onChange={e => setNewCity(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900" 
                  placeholder="e.g. Kadapa, Tirupati, Kurnool" 
                  required 
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700">Area / Locality</label>
                <input 
                  value={newLocality} 
                  onChange={e => setNewLocality(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900" 
                  placeholder="e.g. RTC Complex, Railway Station" 
                  required 
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700">Pickup Point Name</label>
                <input 
                  value={newPointName} 
                  onChange={e => setNewPointName(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900" 
                  placeholder="e.g. Kadapa Central Handover Station" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs shadow-md transition"
              >
                + Add Service Hub to Network
              </button>
              {locAdded && (
                <p className="text-emerald-700 font-bold text-center bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  ✓ New Service Hub Added!
                </p>
              )}
            </form>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-3 text-xs">
            <h3 className="font-black text-base text-slate-900">Active Service Hubs ({locations.length})</h3>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
              {locations.map(l => (
                <div key={l.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-slate-900">{l.city}</span> — <span className="text-slate-700">{l.area_locality}</span>
                    <div className="text-[11px] text-slate-400">{l.pickup_point_name}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB: COMMISSION & SETTINGS */}
      {tab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md max-w-xl space-y-6 text-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900">Platform Economics & Pricing Rules</h2>
            <p className="text-xs text-slate-500 mt-1">Configure take rates and surge pricing algorithms.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span>Platform Take Rate / Commission:</span>
                <span className="text-[#D71920] font-black text-sm">{newCommission}%</span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={25} 
                value={newCommission} 
                onChange={e => setNewCommission(Number(e.target.value))} 
                className="w-full accent-[#D71920] cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Industry standard for peer-to-peer car rentals is 10%–15%.</span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex justify-between font-bold">
                <span>Festive Surge Multiplier:</span>
                <span className="text-amber-600 font-black text-sm">+{surgeMultiplier}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 10, 20].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSurgeMultiplier(s)}
                    className={'py-2 rounded-xl font-bold border transition ' + (
                      surgeMultiplier === s ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                    )}
                  >
                    {s === 0 ? 'Standard' : `+${s}% Surge`}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => updateCommissionRate(newCommission)} 
              className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs shadow-lg shadow-[#D71920]/25 transition cursor-pointer"
            >
              Save Platform Configuration
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
