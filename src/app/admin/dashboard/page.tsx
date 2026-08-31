'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Car, Calendar, Settings, MapPin, CheckCircle, XCircle, AlertCircle, PlusCircle } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

export default function AdminDashboardPage() {
  const { cars, owners, bookings, locations, commissionRate, updateCommissionRate, updateCarStatus, updateOwnerKycStatus, addLocation } = useMarketplace();
  const [tab, setTab] = useState<'overview' | 'cars' | 'owners' | 'bookings' | 'locations' | 'settings'>('overview');
  const [newCommission, setNewCommission] = useState(commissionRate);
  const [newCity, setNewCity] = useState('Kadapa');
  const [newLocality, setNewLocality] = useState('');
  const [newPointName, setNewPointName] = useState('');
  const [locAdded, setLocAdded] = useState(false);

  const pendingCars = cars.filter(c => c.approval_status === 'pending_approval');
  const pendingOwners = owners.filter(o => o.owner_profile.kyc_status === 'pending_verification');
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const totalCommissionEarned = bookings.reduce((sum, b) => sum + (b.platform_commission_amount || 0), 0);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocality || !newPointName) return;
    await addLocation({ city: newCity, state: 'Andhra Pradesh', area_locality: newLocality, pickup_point_name: newPointName, is_active: true });
    setNewLocality('');
    setNewPointName('');
    setLocAdded(true);
    setTimeout(() => setLocAdded(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex justify-between items-center shadow-xl">
        <div>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Super Admin Control Center</span>
          <h1 className="text-2xl sm:text-3xl font-black">RENTVORA Administration</h1>
        </div>
        <div className="text-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 font-semibold text-emerald-400">
          ● Live Platform Guard
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2 text-xs font-bold">
        {['overview', 'cars', 'owners', 'bookings', 'locations', 'settings'].map(t => (
          <button key={t} onClick={() => setTab(t as any)} className={`px-4 py-2 rounded-xl uppercase transition ${tab === t ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold">Total Platform GMV</span>
              <div className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold">Net Platform Commission</span>
              <div className="text-2xl font-black text-emerald-600">{formatCurrency(totalCommissionEarned)}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold">Pending Car Approvals</span>
              <div className="text-2xl font-black text-amber-600">{pendingCars.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold">Pending Owner KYC</span>
              <div className="text-2xl font-black text-amber-600">{pendingOwners.length}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
            <h3 className="font-black text-base text-slate-900">Pending Car Approval Requests</h3>
            {pendingCars.length === 0 ? <p className="text-xs text-slate-500">No cars currently awaiting approval.</p> : (
              pendingCars.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.brand} {c.model} ({c.registration_number})</div>
                    <div className="text-slate-500">Rate: {formatCurrency(c.price_per_day)}/day • Deposit: {formatCurrency(c.security_deposit)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateCarStatus(c.id, 'approved')} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold">Approve</button>
                    <button onClick={() => updateCarStatus(c.id, 'rejected')} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'cars' && (
        <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">All Marketplace Cars ({cars.length})</h2>
          <div className="divide-y text-xs">
            {cars.map(c => (
              <div key={c.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{c.brand} {c.model}</span> <span className="text-slate-500">({c.registration_number})</span>
                  <div className="text-[11px] text-slate-400">{c.fuel_type} • {c.transmission} • {formatCurrency(c.price_per_day)}/day</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100">{c.approval_status}</span>
                  {c.approval_status !== 'approved' && (
                    <button onClick={() => updateCarStatus(c.id, 'approved')} className="text-emerald-600 font-bold hover:underline">Approve</button>
                  )}
                  {c.approval_status === 'approved' && (
                    <button onClick={() => updateCarStatus(c.id, 'suspended')} className="text-rose-600 font-bold hover:underline">Suspend</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'owners' && (
        <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Car Owners & KYC Verification</h2>
          <div className="divide-y text-xs">
            {owners.map(o => (
              <div key={o.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{o.full_name} ({o.phone})</div>
                  <div className="text-slate-500">Aadhaar: {o.owner_profile.aadhar_masked || 'Submitted'} • Bank: {o.owner_profile.bank_ifsc || 'SBI000902'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100">{o.owner_profile.kyc_status}</span>
                  {o.owner_profile.kyc_status !== 'approved' && (
                    <button onClick={() => updateOwnerKycStatus(o.id, 'approved')} className="text-emerald-600 font-bold hover:underline">Verify KYC</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">All Bookings Ledger ({bookings.length})</h2>
          <div className="divide-y text-xs">
            {bookings.map(b => (
              <div key={b.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{b.booking_reference} • {b.car?.brand} {b.car?.model}</div>
                  <div className="text-slate-500">Renter: {b.customer?.full_name} • {formatDateTime(b.start_time)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatCurrency(b.total_amount)}</div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Add New Expansion Service Hub</h3>
            <form onSubmit={handleAddLocation} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">City</label>
                <input value={newCity} onChange={e => setNewCity(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" placeholder="e.g. Kadapa, Tirupati" required />
              </div>
              <div>
                <label className="font-bold block mb-1">Area / Locality</label>
                <input value={newLocality} onChange={e => setNewLocality(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" placeholder="e.g. RTC Complex, Railway Station" required />
              </div>
              <div>
                <label className="font-bold block mb-1">Pickup Point Hub Name</label>
                <input value={newPointName} onChange={e => setNewPointName(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" placeholder="e.g. Kadapa Central Hub" required />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold">+ Add Service Hub</button>
              {locAdded && <p className="text-emerald-600 font-bold text-center">New Service Location Added!</p>}
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Active Service Hubs ({locations.length})</h3>
            <div className="divide-y max-h-80 overflow-y-auto">
              {locations.map(l => (
                <div key={l.id} className="py-2 flex justify-between">
                  <span><strong>{l.city}</strong> — {l.area_locality}</span>
                  <span className="text-slate-400">{l.pickup_point_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border shadow-sm max-w-md space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900">Platform Settings</h2>
          <div>
            <label className="font-bold block mb-1">Platform Commission Rate (%)</label>
            <input type="number" min={0} max={30} value={newCommission} onChange={e => setNewCommission(Number(e.target.value))} className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold" />
          </div>
          <button onClick={() => updateCommissionRate(newCommission)} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold">
            Save Commission Settings
          </button>
        </div>
      )}
    </div>
  );
}
