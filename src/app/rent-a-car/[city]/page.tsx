'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ShieldCheck, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import SearchBar from '@/components/marketplace/SearchBar';
import CarCard from '@/components/marketplace/CarCard';
import { useMarketplace } from '@/lib/mock-data/client-store';

export default function CityLandingPage() {
  const params = useParams();
  const rawCity = (params.city as string) || 'proddatur';
  const cityName = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
  const { cars, locations } = useMarketplace();
  const approvedCars = cars.filter(c => c.approval_status === 'approved');

  return (
    <div className="space-y-12 pb-16">
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 px-4 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Self-Drive Car Rental in {cityName}, Andhra Pradesh</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Rent a Self Drive Car in {cityName}
        </h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Compare top verified cars from local owners in {cityName} with doorstep delivery, zero deposit hassle, and transparent rates.
        </p>
        <div className="pt-4 max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">Available Self-Drive Cars in {cityName}</h2>
          <span className="text-xs font-bold text-emerald-600">{approvedCars.length} Verified Cars</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedCars.map(c => <CarCard key={c.id} car={c} />)}
        </div>
      </div>
    </div>
  );
}
