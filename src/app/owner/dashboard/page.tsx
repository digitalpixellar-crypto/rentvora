'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Car as CarIcon, TrendingUp, Wallet, PlusCircle, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

export default function OwnerDashboardPage() {
  const { cars, bookings, currentUser, updateCarStatus, commissionRate } = useMarketplace();
  const ownerCars = cars.filter(c => c.owner_id === currentUser?.id || c.owner_id === 'usr-owner-1');
  const ownerBookings = bookings.filter(b => b.owner_id === currentUser?.id || b.owner_id === 'usr-owner-1');

  const grossEarnings = ownerBookings.reduce((sum, b) => sum + (b.base_rental_amount || 0), 0);
  const platformCommission = ownerBookings.reduce((sum, b) => sum + (b.platform_commission_amount || 0), 0);
  const netEarnings = grossEarnings - platformCommission;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Proddatur Car Host Partner</div>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome, {currentUser?.full_name || 'Ramesh Reddy'}</h1>
          <p className="text-xs text-slate-300">KYC: <span className="text-emerald-400 font-bold">Approved</span> • Settlement: SBI Proddatur Main Branch</p>
        </div>
        <Link href="/owner/cars/add" className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Car</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Gross Rental Fare</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(grossEarnings)}</div>
          <div className="text-[11px] text-slate-400">{ownerBookings.length} Total Bookings Received</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-bold">Platform Fee ({commissionRate}%)</span>
          <div className="text-2xl font-black text-amber-600">-{formatCurrency(platformCommission)}</div>
          <div className="text-[11px] text-slate-400">Deducted automatically</div>
        </div>

        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-1">
          <span className="text-xs text-emerald-800 font-bold">Net Payout Earnings</span>
          <div className="text-2xl font-black text-emerald-700">{formatCurrency(netEarnings)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% Settled to Bank</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-slate-900">My Listed Fleet in Proddatur ({ownerCars.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ownerCars.map(c => (
            <div key={c.id} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <img src={c.images[0]?.image_url} alt={c.model} className="w-full h-40 rounded-2xl object-cover" />
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-slate-900">{c.brand} {c.model}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${c.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{c.approval_status.replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-slate-500">{c.registration_number} • {c.fuel_type} • {c.transmission}</p>
              </div>
              <div className="flex justify-between text-xs font-bold pt-2 border-t">
                <span>{formatCurrency(c.price_per_day)} / day</span>
                <span>Deposit: {formatCurrency(c.security_deposit)}</span>
              </div>
              <div>
                {c.approval_status === 'approved' ? (
                  <button onClick={() => updateCarStatus(c.id, 'temporarily_unavailable')} className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">Pause Bookings</button>
                ) : c.approval_status === 'temporarily_unavailable' ? (
                  <button onClick={() => updateCarStatus(c.id, 'approved')} className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Resume Bookings</button>
                ) : (
                  <div className="w-full text-center py-2 text-[11px] text-amber-700 font-semibold bg-amber-50 rounded-xl">Pending Admin Approval</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
