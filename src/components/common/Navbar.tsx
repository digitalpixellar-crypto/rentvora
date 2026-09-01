'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Building2, 
  KeyRound, 
  LogIn, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { UserRole } from '@/types';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, setCurrentUserRole, locations } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Proddatur');

  const uniqueCities = Array.from(new Set(locations.map(l => l.city)));

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setUserDropdownOpen(false);
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

          {/* 2. Center: Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-semibold tracking-normal text-slate-700 whitespace-nowrap">
            <Link 
              href="/cars" 
              className={`transition-colors hover:text-[#D71920] ${pathname.startsWith('/cars') ? 'text-[#D71920] font-bold' : ''}`}
            >
              Explore Fleet
            </Link>
            <Link 
              href="/hubs" 
              className={`transition-colors hover:text-[#D71920] ${pathname.startsWith('/hubs') ? 'text-[#D71920] font-bold' : ''}`}
            >
              📍 Pickup Hubs
            </Link>
            <Link 
              href="/rent-a-car/proddatur" 
              className="transition-colors hover:text-[#D71920]"
            >
              Proddatur
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
              <span>Host a Car</span>
            </Link>
          </nav>

          {/* 3. Right: Auth / Login & User Controls */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            
            {/* Direct Login Button */}
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#D71920] hover:bg-red-50/60 border border-slate-200 transition"
            >
              <LogIn className="w-4 h-4 text-[#D71920]" />
              <span>Sign In / Login</span>
            </Link>

            {/* User Account / Role Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition whitespace-nowrap"
              >
                <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-black">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
                <span className="font-bold text-xs">{currentUser?.full_name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 font-montserrat">
                  <div className="px-4 py-2.5 border-b border-slate-100 space-y-0.5">
                    <div className="font-black text-xs text-slate-900">{currentUser?.full_name || 'Active User'}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-red-50 text-[#D71920] text-[9px] font-bold uppercase tracking-wider">
                      Role: {currentUser?.role || 'Customer'}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/customer/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      href="/customer/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>KYC & License Profile</span>
                    </Link>

                    <Link
                      href="/owner/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2 font-medium"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>Host Dashboard</span>
                    </Link>

                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2 font-medium"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>Admin Control Center</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 px-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out / Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <Link
              href="/customer/dashboard"
              className="px-4 py-2.5 rounded-xl bg-[#D71920] text-white text-xs font-black hover:bg-[#b8141a] transition shadow-md shadow-[#D71920]/25 flex items-center gap-1.5 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Bookings</span>
            </Link>

          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/auth/login"
              className="px-3 py-1.5 rounded-xl bg-red-50 text-[#D71920] text-xs font-bold flex items-center gap-1 border border-red-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>

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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4">
          
          {/* Mobile Sign In Header Card */}
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111111] text-white shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D71920] text-white flex items-center justify-center font-bold text-xs">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-xs">Sign In / Register</div>
                <div className="text-[10px] text-slate-400">Phone OTP & Email Magic Link</div>
              </div>
            </div>
            <span className="text-xs text-[#D71920] font-bold">Open →</span>
          </Link>

          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-800">
            <Link href="/cars" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>🚗 Explore Fleet</span>
            </Link>
            <Link href="/hubs" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 text-[#D71920] flex items-center justify-between">
              <span>📍 Pickup Hubs & Map</span>
            </Link>
            <Link href="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>📋 My Bookings</span>
            </Link>
            <Link href="/customer/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>🪪 KYC & Driving License</span>
            </Link>
            <Link href="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>🏢 Host Portal (Earn ₹40k+/mo)</span>
            </Link>
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>⚙️ Admin Control Center</span>
            </Link>
            {currentUser && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out ({currentUser.full_name?.split(' ')[0] || 'User'})</span>
                </div>
                <span className="text-[10px] text-rose-400">Log out →</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
