'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, ShieldCheck, Phone, ArrowLeft, Car } from 'lucide-react';
import PickupHubsMap from '@/components/marketplace/PickupHubsMap';
import SearchBar from '@/components/marketplace/SearchBar';

export default function HubsDirectoryPage() {
  return (
    <div className="space-y-12 pb-20 font-montserrat">
      
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-slate-900 to-[#111111] opacity-90" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Official Handover Network • Andhra Pradesh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Official Pickup & Return <span className="text-[#D71920]">Hubs</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Collect your sanitized self-drive or chauffeur car at verified landmark hubs across Proddatur, Kadapa, Tirupati Airport, and Gandikota with 1-tap Google Maps directions.
          </p>

          <div className="pt-4 max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Interactive Map & Directory Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Explore Handover Locations</h2>
            <p className="text-xs text-slate-500">Select any hub to view exact landmarks, manager contacts, and Google Maps GPS navigation.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D71920] bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Verified Physical Hubs</span>
          </div>
        </div>

        <PickupHubsMap />
      </div>

      {/* Doorstep Delivery Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-slate-900">Need doorstep vehicle delivery in Proddatur?</h3>
            <p className="text-xs text-slate-600">
              Our hosts deliver sanitized cars directly to your home, office, or hotel for just ₹200–₹250.
            </p>
          </div>

          <Link
            href="/cars"
            className="px-6 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-extrabold shadow-lg shadow-[#D71920]/25 transition shrink-0"
          >
            Find Cars with Doorstep Delivery →
          </Link>
        </div>
      </div>

    </div>
  );
}
