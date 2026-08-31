'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, User, Menu, X, ChevronDown, Sparkles, Building2, KeyRound } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { UserRole } from '@/types';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUserRole, locations } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Proddatur');

  const uniqueCities = Array.from(new Set(locations.map(l => l.city)));

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-4">
          
          {/* 1. Left: Unified RENTVORA Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <Logo size="md" />

            {/* City Selector Pill */}
            <div className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50/80 border border-red-200 text-red-900 text-xs font-semibold whitespace-nowrap shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer pr-1 font-bold text-red-950 text-xs"
              >
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}, AP</option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Center: Clean, Non-wrapping Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-semibold tracking-normal text-slate-700 whitespace-nowrap">
            <Link 
              href="/cars" 
              className={`transition-colors hover:text-[#D71920] ${pathname.startsWith('/cars') ? 'text-[#D71920] font-bold' : ''}`}
            >
              Explore Cars
            </Link>
            <Link 
              href="/rent-a-car/proddatur" 
              className="transition-colors hover:text-[#D71920]"
            >
              Proddatur Hubs
            </Link>
            <Link 
              href="/#how-it-works" 
              className="transition-colors hover:text-[#D71920]"
            >
              How It Works
            </Link>
            <Link 
              href="/owner/dashboard" 
              className="flex items-center gap-1.5 text-slate-800 hover:text-[#D71920] font-semibold transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Host Portal</span>
            </Link>
          </nav>

          {/* 3. Right: Persona Switcher & Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Quick Persona Switcher for demonstration */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition whitespace-nowrap"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Portal: <strong className="capitalize text-[#D71920] font-bold">{currentUser?.role || 'customer'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleRoleChange('customer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 hover:text-[#D71920] flex items-center justify-between font-medium"
                  >
                    <span>Customer (Pavan Kalyan)</span>
                    {currentUser?.role === 'customer' && <span className="w-2 h-2 rounded-full bg-[#D71920]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('owner')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 hover:text-[#D71920] flex items-center justify-between font-medium"
                  >
                    <span>Car Host (Ramesh Reddy)</span>
                    {currentUser?.role === 'owner' && <span className="w-2 h-2 rounded-full bg-[#D71920]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 hover:text-[#D71920] flex items-center justify-between font-medium"
                  >
                    <span>Admin Control Center</span>
                    {currentUser?.role === 'admin' && <span className="w-2 h-2 rounded-full bg-[#D71920]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Role-Specific CTA Button */}
            {currentUser?.role === 'admin' ? (
              <Link
                href="/admin/dashboard"
                className="px-4 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-slate-800 transition whitespace-nowrap shadow-sm"
              >
                Admin Panel
              </Link>
            ) : currentUser?.role === 'owner' ? (
              <Link
                href="/owner/cars/add"
                className="px-4 py-2.5 rounded-xl bg-[#D71920] text-white text-xs font-bold hover:bg-[#b8141a] transition shadow-md shadow-[#D71920]/25 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ List Car</span>
              </Link>
            ) : (
              <Link
                href="/customer/dashboard"
                className="px-4 py-2.5 rounded-xl bg-[#D71920] text-white text-xs font-bold hover:bg-[#b8141a] transition shadow-md shadow-[#D71920]/25 flex items-center gap-1.5 whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Bookings</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-950 text-xs font-semibold">
            <MapPin className="w-4 h-4 text-[#D71920]" />
            <span>Serving <strong>Proddatur</strong> & surrounding Kadapa AP regions</span>
          </div>

          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-800">
            <Link href="/cars" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100">
              Explore Cars
            </Link>
            <Link href="/rent-a-car/proddatur" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100">
              Proddatur Hubs
            </Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100">
              How It Works
            </Link>
            <Link href="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100">
              Host Portal
            </Link>
            <Link href="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 text-[#D71920]">
              My Bookings
            </Link>
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100">
              Admin Control Center
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 mb-2 font-bold uppercase tracking-wider">Switch Persona:</div>
            <div className="flex gap-2">
              <button 
                onClick={() => { handleRoleChange('customer'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-xs rounded-xl border font-bold ${currentUser?.role === 'customer' ? 'bg-[#D71920] text-white border-[#D71920]' : 'bg-slate-50 border-slate-200'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => { handleRoleChange('owner'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-xs rounded-xl border font-bold ${currentUser?.role === 'owner' ? 'bg-[#D71920] text-white border-[#D71920]' : 'bg-slate-50 border-slate-200'}`}
              >
                Host
              </button>
              <button 
                onClick={() => { handleRoleChange('admin'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2 text-xs rounded-xl border font-bold ${currentUser?.role === 'admin' ? 'bg-[#111111] text-white border-[#111111]' : 'bg-slate-50 border-slate-200'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
