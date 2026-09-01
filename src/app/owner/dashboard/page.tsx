'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Car as CarIcon, 
  TrendingUp, 
  Wallet, 
  PlusCircle, 
  ShieldCheck,
  Lock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Ban, 
  Clock, 
  UserCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

export default function OwnerDashboardPage() {
  const { cars, bookings, currentUser, isAuthLoaded, setCurrentUserRole, updateCarStatus, commissionRate } = useMarketplace();
  const ownerCars = cars.filter(c => c.owner_id === currentUser?.id || c.owner_id === 'usr-owner-1');
  const ownerBookings = bookings.filter(b => b.owner_id === currentUser?.id || b.owner_id === 'usr-owner-1');

  const [selectedCarId, setSelectedCarId] = useState<string>(ownerCars[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'calendar' | 'fleet' | 'earnings'>('calendar');

  // State to store custom blocked dates (keyed by carId -> Set of ISO date strings YYYY-MM-DD)
  const [blockedDatesMap, setBlockedDatesMap] = useState<Record<string, string[]>>({
    'car-creta-02': ['2026-09-08', '2026-09-09'],
  });

  const grossEarnings = ownerBookings.reduce((sum, b) => sum + (b.base_rental_amount || 0), 0);
  const driverEarnings = ownerBookings.reduce((sum, b) => sum + (b.driver_allowance_amount || 0), 0);
  const platformCommission = ownerBookings.reduce((sum, b) => sum + (b.platform_commission_amount || 0), 0);
  const netEarnings = (grossEarnings - platformCommission) + driverEarnings;

  const currentSelectedCar = ownerCars.find(c => c.id === selectedCarId) || ownerCars[0];

  // Generate 28 upcoming calendar days starting from today (dynamic)
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayNum = d.getDate();
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });

    // Check if booked by customer
    const isBooked = (selectedCarId === 'car-creta-02' && [3, 4].includes(dayNum)) || 
                     (selectedCarId === 'car-swift-01' && [5, 6].includes(dayNum));

    // Check if host blocked
    const carBlocked = blockedDatesMap[selectedCarId] || [];
    const isHostBlocked = carBlocked.includes(iso);

    return {
      date: d,
      iso,
      dayNum,
      dayName,
      monthName,
      isBooked,
      isHostBlocked,
      isAvailable: !isBooked && !isHostBlocked,
    };
  });

  const toggleBlockDate = (iso: string, isBooked: boolean) => {
    if (isBooked) return; // Cannot unblock customer booking
    setBlockedDatesMap(prev => {
      const currentList = prev[selectedCarId] || [];
      if (currentList.includes(iso)) {
        return { ...prev, [selectedCarId]: currentList.filter(d => d !== iso) };
      } else {
        return { ...prev, [selectedCarId]: [...currentList, iso] };
      }
    });
  };

  const handleBlockQuick = (mode: 'weekend' | 'week') => {
    if (!selectedCarId) return;
    const targetDates: string[] = [];
    if (mode === 'weekend') {
      calendarDays.forEach(d => {
        if ((d.dayName === 'Sat' || d.dayName === 'Sun') && !d.isBooked) {
          targetDates.push(d.iso);
        }
      });
    } else if (mode === 'week') {
      calendarDays.slice(0, 7).forEach(d => {
        if (!d.isBooked) targetDates.push(d.iso);
      });
    }
    setBlockedDatesMap(prev => {
      const existing = prev[selectedCarId] || [];
      const merged = Array.from(new Set([...existing, ...targetDates]));
      return { ...prev, [selectedCarId]: merged };
    });
  };

  const handleClearBlocks = () => {
    if (!selectedCarId) return;
    setBlockedDatesMap(prev => ({ ...prev, [selectedCarId]: [] }));
  };

  
  if (isAuthLoaded && (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin'))) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 font-montserrat">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#D71920] border border-red-200 flex items-center justify-center mx-auto shadow-md">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Car Host Partner Access Required</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            This portal is reserved for verified RENTVORA vehicle hosts in Proddatur and Kadapa to manage availability, bookings, and bank payouts.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/login?role=owner&redirect=/owner/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs shadow-lg shadow-[#D71920]/25 transition"
          >
            Sign In as Car Host →
          </Link>
          <Link
            href="/owner/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition"
          >
            + Register New Vehicle (Earn ₹40k+/mo)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-montserrat">
      
      {/* 1. Host Partner Header */}
      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#D71920] border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Proddatur Host Partner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {currentUser?.full_name || 'Ramesh Reddy'}
          </h1>
          <p className="text-xs text-slate-400">
            KYC: <span className="text-emerald-400 font-bold">Verified & Active</span> • Direct Payouts: <span className="text-slate-300 font-semibold">SBI Proddatur Main Branch (A/C: ******4892)</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link 
            href="/owner/cars/add" 
            className="px-5 py-3 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#D71920]/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List Another Car</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Gross Bookings</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(grossEarnings)}</div>
          <div className="text-[11px] text-slate-400">{ownerBookings.length} Trips Completed</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Chauffeur Earnings</span>
          <div className="text-2xl font-black text-[#D71920]">+{formatCurrency(driverEarnings)}</div>
          <div className="text-[11px] text-slate-400">100% Payout to Host</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Platform Fee ({commissionRate}%)</span>
          <div className="text-2xl font-black text-amber-600">-{formatCurrency(platformCommission)}</div>
          <div className="text-[11px] text-slate-400">Automated deduction</div>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-1">
          <span className="text-xs text-emerald-800 font-bold">Net Bank Settlement</span>
          <div className="text-2xl font-black text-emerald-700">{formatCurrency(netEarnings)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Direct NEFT Transfer</div>
        </div>
      </div>

      {/* 3. Dashboard Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('calendar')}
          className={'px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ' + (activeTab === 'calendar' ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>📅 Availability Calendar & Date Blocker</span>
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={'px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ' + (activeTab === 'fleet' ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')}
        >
          <CarIcon className="w-4 h-4" />
          <span>🚗 My Listed Fleet ({ownerCars.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={'px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ' + (activeTab === 'earnings' ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')}
        >
          <Wallet className="w-4 h-4" />
          <span>💳 Settlement & Bank Payouts</span>
        </button>
      </div>

      {/* 4. TAB 1: AVAILABILITY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          
          {/* Header & Car Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900">Manage Vehicle Availability & Maintenance</h2>
              <p className="text-xs text-slate-500">
                Click on any date to toggle between <strong>Available</strong> and <strong>Blocked</strong> for personal use or vehicle service.
              </p>
            </div>

            {/* Select Car Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Select Car:</span>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#D71920]"
              >
                {ownerCars.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.brand} {c.model} ({c.registration_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Batch Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-slate-500">Legend:</span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Available for Booking
              </span>
              <span className="flex items-center gap-1.5 text-red-600">
                <div className="w-3 h-3 rounded-full bg-[#D71920]" /> Reserved by Customer
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <div className="w-3 h-3 rounded-full bg-amber-500" /> Blocked by You (Personal/Service)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBlockQuick('weekend')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 transition"
              >
                Block Weekends
              </button>
              <button
                type="button"
                onClick={handleClearBlocks}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-rose-600 transition"
              >
                Clear My Blocks
              </button>
            </div>
          </div>

          {/* 28-Day Interactive Calendar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {calendarDays.map((d, index) => {
              let bgClass = 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-100/80 cursor-pointer';
              let statusLabel = 'Available';
              let badgeColor = 'text-emerald-700 bg-emerald-100';

              if (d.isBooked) {
                bgClass = 'bg-red-50 border-red-200 text-red-950 cursor-not-allowed opacity-90';
                statusLabel = 'Booked (PRD-89)';
                badgeColor = 'text-red-700 bg-red-100 font-extrabold';
              } else if (d.isHostBlocked) {
                bgClass = 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 cursor-pointer shadow-xs';
                statusLabel = 'Blocked by Host';
                badgeColor = 'text-amber-800 bg-amber-100 font-bold';
              }

              return (
                <div
                  key={index}
                  onClick={() => toggleBlockDate(d.iso, d.isBooked)}
                  className={'p-3.5 rounded-2xl border-2 transition flex flex-col justify-between h-28 select-none ' + bgClass}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold uppercase opacity-60">{d.dayName}</span>
                    <span className={'text-[9px] px-1.5 py-0.5 rounded-md ' + badgeColor}>
                      {d.isBooked ? 'Reserved' : d.isHostBlocked ? 'Blocked' : 'Open'}
                    </span>
                  </div>

                  <div>
                    <div className="text-xl font-black">{d.dayNum}</div>
                    <div className="text-[10px] opacity-70 font-semibold">{d.monthName} 2026</div>
                  </div>

                  <div className="text-[10px] font-bold truncate">
                    {statusLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
            <span>
              <strong>Tip for Hosts:</strong> Keeping your vehicle available during weekends (Friday–Sunday) and local festive seasons increases your monthly earnings by over 45% in Proddatur.
            </span>
          </div>
        </div>
      )}

      {/* 5. TAB 2: MY LISTED FLEET */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-slate-900">My Listed Fleet in Proddatur ({ownerCars.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownerCars.map(c => (
              <div key={c.id} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-md flex flex-col justify-between">
                <img src={c.images[0]?.image_url} alt={c.model} className="w-full h-44 rounded-2xl object-cover" />
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-slate-900">{c.brand} {c.model}</h3>
                    <span className={'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ' + (c.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
                      {c.approval_status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{c.registration_number} • {c.fuel_type} • {c.transmission}</p>
                </div>
                <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-100">
                  <span>{formatCurrency(c.price_per_day)} / day</span>
                  <span>Deposit: {formatCurrency(c.security_deposit)}</span>
                </div>
                <div>
                  {c.approval_status === 'approved' ? (
                    <button onClick={() => updateCarStatus(c.id, 'temporarily_unavailable')} className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition">
                      Pause Bookings
                    </button>
                  ) : c.approval_status === 'temporarily_unavailable' ? (
                    <button onClick={() => updateCarStatus(c.id, 'approved')} className="w-full py-2.5 rounded-xl bg-[#D71920] text-white text-xs font-bold hover:bg-[#b8141a] transition">
                      Resume Bookings
                    </button>
                  ) : (
                    <div className="w-full text-center py-2 text-[11px] text-amber-700 font-semibold bg-amber-50 rounded-xl">
                      Pending Admin Verification
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 3: SETTLEMENT & BANK PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Host Settlement & Payout Details</h2>
            <p className="text-xs text-slate-500 mt-1">
              RENTVORA settles earnings directly to your verified bank account within 24 hours of trip completion.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">Registered Bank Account</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">Bank Name</span>
                <span className="font-bold text-slate-900">State Bank of India (SBI)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Account Number</span>
                <span className="font-bold text-slate-900">XXXX-XXXX-4892</span>
              </div>
              <div>
                <span className="text-slate-400 block">Branch & IFSC</span>
                <span className="font-bold text-slate-900">Proddatur Main (SBIN0000902)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">Recent Booking Payouts</h3>
            <div className="space-y-2">
              {ownerBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{b.car?.brand} {b.car?.model} — Ref: {b.booking_reference}</div>
                    <div className="text-slate-400 text-[11px]">Completed: {formatDateTime(b.end_time)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 text-sm">+{formatCurrency((b.base_rental_amount - b.platform_commission_amount) + (b.driver_allowance_amount || 0))}</div>
                    <div className="text-[10px] text-emerald-700 font-bold">✓ Settled via IMPS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
