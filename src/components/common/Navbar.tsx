'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { currentUser, logout, locations, isAuthLoaded } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Proddatur');

  const uniqueCities = Array.from(new Set(locations.map(l => l.city)));

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    if (pathname.startsWith('/customer') || pathname.startsWith('/owner') || pathname.startsWith('/admin')) {
      router.push('/auth/login');
    }
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
            
            {/* If Logged In: Show Account Dropdown */}
            {isAuthLoaded && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#D71920] text-white flex items-center justify-center text-xs font-black">
                    {currentUser.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-xs text-slate-900 leading-tight">
                      {currentUser.full_name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-[9px] text-[#D71920] font-bold uppercase tracking-wider">
                      {currentUser.role || 'Customer'}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 font-montserrat">
                    <div className="px-4 py-2.5 border-b border-slate-100 space-y-0.5 bg-slate-50/50">
                      <div className="font-black text-xs text-slate-900">{currentUser.full_name || 'Valued User'}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</div>
                      <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-red-100 text-[#D71920] text-[9px] font-black uppercase tracking-wider">
                        Role: {currentUser.role || 'Customer'}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/customer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2.5 font-semibold"
                      >
                        <User className="w-3.5 h-3.5 text-[#D71920]" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/customer/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2.5 font-semibold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
                        <span>KYC & License Profile</span>
                      </Link>

                      {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
                        <Link
                          href="/owner/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2.5 font-semibold"
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#D71920]" />
                          <span>Host Fleet Dashboard</span>
                        </Link>
                      )}

                      {currentUser.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-[#D71920] flex items-center gap-2.5 font-semibold"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#D71920]" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 px-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* If Logged Out: Show Sign In / Login Button */
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-[#D71920] hover:bg-red-50 border border-slate-200 transition shadow-xs"
              >
                <LogIn className="w-4 h-4 text-[#D71920]" />
                <span>Sign In / Login</span>
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              href={currentUser ? "/customer/dashboard" : "/cars"}
              className="px-4 py-2.5 rounded-xl bg-[#D71920] text-white text-xs font-black hover:bg-[#b8141a] transition shadow-md shadow-[#D71920]/25 flex items-center gap-1.5 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? "My Bookings" : "Book a Car"}</span>
            </Link>

          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            {!currentUser && (
              <Link
                href="/auth/login"
                className="px-3 py-1.5 rounded-xl bg-red-50 text-[#D71920] text-xs font-bold flex items-center gap-1 border border-red-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 font-montserrat">
          
          {/* Mobile User Status / Sign In Card */}
          {currentUser ? (
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D71920] text-white flex items-center justify-center font-black text-sm">
                  {currentUser.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-extrabold text-xs">{currentUser.full_name || 'Driver'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email || currentUser.phone}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-rose-900/40 text-rose-300 hover:text-white text-[11px] font-bold border border-rose-700/50"
              >
                Sign Out
              </button>
            </div>
          ) : (
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
          )}

          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-800">
            <Link href="/cars" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>🚗 Explore Fleet</span>
            </Link>
            <Link href="/hubs" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 text-[#D71920] flex items-center justify-between">
              <span>📍 Pickup Hubs & Map</span>
            </Link>
            {currentUser && (
              <>
                <Link href="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
                  <span>📋 My Bookings</span>
                </Link>
                <Link href="/customer/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
                  <span>🪪 KYC & Driving License</span>
                </Link>
              </>
            )}
            <Link href="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>🏢 Host Portal (Earn ₹40k+/mo)</span>
            </Link>
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between">
              <span>⚙️ Admin Control Center</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
