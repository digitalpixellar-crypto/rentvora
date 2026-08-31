'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, Search, UserCheck } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { locations } = useMarketplace();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startDateDefault = tomorrow.toISOString().split('T')[0];

  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 3);
  const returnDateDefault = returnDate.toISOString().split('T')[0];

  const [rentalType, setRentalType] = useState<'self_drive' | 'with_driver'>('self_drive');
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.id || '');
  const [pickupDate, setPickupDate] = useState(startDateDefault);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState(returnDateDefault);
  const [dropoffTime, setDropoffTime] = useState('10:00');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      rentalType,
      location: selectedLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
    }).toString();

    router.push(`/cars?${query}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 sm:p-5 ${compact ? 'max-w-4xl' : 'max-w-5xl'} mx-auto font-montserrat space-y-4`}
    >
      {/* Top Rental Type Tabs */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setRentalType('self_drive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            rentalType === 'self_drive'
              ? 'bg-[#111111] text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🚗 Self-Drive</span>
          {rentalType === 'self_drive' && <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />}
        </button>

        <button
          type="button"
          onClick={() => setRentalType('with_driver')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            rentalType === 'with_driver'
              ? 'bg-[#D71920] text-white shadow-sm shadow-[#D71920]/25'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>With Driver (+₹500/day)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Pickup Hub */}
        <div className="md:col-span-4 bg-slate-50 hover:bg-slate-100/80 transition rounded-2xl p-3 border border-slate-200">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Pickup Hub in Proddatur</span>
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.area_locality} ({loc.pickup_point_name})
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Date & Time */}
        <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/80 transition rounded-2xl p-3 border border-slate-200">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Pickup Date & Time</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none w-full cursor-pointer"
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none w-20 cursor-pointer"
            />
          </div>
        </div>

        {/* Return Date & Time */}
        <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/80 transition rounded-2xl p-3 border border-slate-200">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Return Date & Time</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none w-full cursor-pointer"
            />
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none w-20 cursor-pointer"
            />
          </div>
        </div>

        {/* Find Cars CTA */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full h-full min-h-[52px] rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] transition font-black text-sm text-white shadow-lg shadow-[#D71920]/30 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find Cars</span>
          </button>
        </div>

      </div>
    </form>
  );
}
