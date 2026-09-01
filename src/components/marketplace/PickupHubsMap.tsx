'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Car, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle,
  Compass
} from 'lucide-react';
import { OFFICIAL_PICKUP_HUBS, PickupHub } from '@/lib/constants/hubs-data';
import { getWhatsAppSupportUrl } from '@/lib/utils/whatsapp';

export default function PickupHubsMap() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedHub, setSelectedHub] = useState<PickupHub>(OFFICIAL_PICKUP_HUBS[0]);

  const cities = ['All', 'Proddatur', 'Kadapa', 'Tirupati', 'Jammalamadugu', 'Mydukur', 'Pulivendula'];

  const filteredHubs = selectedCity === 'All' 
    ? OFFICIAL_PICKUP_HUBS 
    : OFFICIAL_PICKUP_HUBS.filter(h => h.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="space-y-8 font-montserrat">
      
      {/* City Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {cities.map(city => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setSelectedCity(city);
              const firstInCity = city === 'All' 
                ? OFFICIAL_PICKUP_HUBS[0] 
                : OFFICIAL_PICKUP_HUBS.find(h => h.city.toLowerCase() === city.toLowerCase());
              if (firstInCity) setSelectedHub(firstInCity);
            }}
            className={'px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap ' + (
              selectedCity === city 
                ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            )}
          >
            📍 {city} {city === 'All' ? `(${OFFICIAL_PICKUP_HUBS.length})` : ''}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Map Visualizer & Hub Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Simulated Vector Map & Selected Hub Detail (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visual Interactive Map Canvas */}
          <div className="relative bg-[#111111] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-slate-800 min-h-[380px] flex flex-col justify-between">
            {/* Map Grid Pattern background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D71920_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/80" />

            {/* Map Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#D71920] border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 animate-spin" />
                <span>Live GPS Pickup Radar</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{filteredHubs.length} Handover Points Active</span>
            </div>

            {/* Visual Pin Markers Grid */}
            <div className="relative z-10 py-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredHubs.map(hub => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHub(hub)}
                    className={'p-3 rounded-2xl border text-left transition flex flex-col justify-between ' + (
                      isSelected 
                        ? 'bg-[#D71920] text-white border-white/40 shadow-lg shadow-[#D71920]/40 scale-105 ring-2 ring-white/30' 
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <MapPin className={'w-4 h-4 ' + (isSelected ? 'text-white' : 'text-[#D71920]')} />
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/40 text-white">
                        {hub.stationedCarsCount} Cars
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="font-black text-xs truncate">{hub.name.split(' ')[0]} {hub.area}</div>
                      <div className="text-[10px] opacity-75 truncate">{hub.city}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Bottom Bar */}
            <div className="relative z-10 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <span>Coordinates: {selectedHub.lat.toFixed(4)}° N, {selectedHub.lng.toFixed(4)}° E</span>
              <a
                href={selectedHub.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#D71920] hover:bg-[#b8141a] px-4 py-2 rounded-xl shadow-md transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate in Google Maps ↗</span>
              </a>
            </div>
          </div>

          {/* Selected Hub Deep-Dive Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-[#D71920] tracking-wider">{selectedHub.city} • {selectedHub.district}</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedHub.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedHub.fullAddress}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                ✓ Active Handover Point
              </span>
            </div>

            {/* Hub Info Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D71920]" /> Operating Hours
                </span>
                <span className="font-extrabold text-slate-900">{selectedHub.operatingHours}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold block flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-[#D71920]" /> Stationed Vehicles
                </span>
                <span className="font-extrabold text-slate-900">{selectedHub.stationedCarsCount} Verified Cars Ready</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Hub Facilities & Guarantees:</span>
              <div className="flex flex-wrap gap-2">
                {selectedHub.amenities.map((am, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#D71920]" />
                    <span>{am}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={selectedHub.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-[#D71920]/25 transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Google Maps</span>
              </a>

              <a
                href={'tel:' + selectedHub.managerPhone}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hub Manager</span>
              </a>

              <a
                href={getWhatsAppSupportUrl('Hi, I want to inquire about car pickup at ' + selectedHub.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Coordinator</span>
              </a>
            </div>

          </div>

        </div>

        {/* Right: Hubs Directory List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900">Official Pickup Directory</h3>
            <span className="text-xs text-slate-400 font-bold">{filteredHubs.length} Points</span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredHubs.map(hub => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={'p-5 rounded-3xl border-2 transition cursor-pointer space-y-2 ' + (
                    isSelected 
                      ? 'bg-red-50/60 border-[#D71920] shadow-md' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#D71920]">{hub.city}</span>
                      <h4 className="font-black text-sm text-slate-900">{hub.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{hub.landmark}</p>
                    </div>
                    <span className={'w-3 h-3 rounded-full border-2 mt-1 ' + (isSelected ? 'border-[#D71920] bg-[#D71920]' : 'border-slate-300')} />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-semibold">{hub.operatingHours}</span>
                    <a
                      href={hub.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-[#D71920] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
