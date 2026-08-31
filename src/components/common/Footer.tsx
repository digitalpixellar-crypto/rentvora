import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#0b0f17] text-slate-300 pt-16 pb-12 border-t border-slate-800 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-block bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <Logo variant="dark" size="lg" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Andhra Pradesh premier verified peer-to-peer self-drive & chauffeur car rental marketplace. Pristine, sanitized cars directly from local verified hosts with 100% refundable deposit guarantee and Cashfree secure checkout.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D71920]" />
                <span>Support Hotline: <strong>{APP_CONFIG.supportPhone}</strong> (8 AM - 11 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D71920]" />
                <span>Email: <strong>{APP_CONFIG.supportEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D71920]" />
                <span>Proddatur & Kadapa Hubs, Andhra Pradesh - 516360</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase text-[#D71920]">Service Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/rent-a-car/proddatur" className="hover:text-red-400 transition">Proddatur Central Hub</Link></li>
              <li><Link href="/rent-a-car/kadapa" className="hover:text-red-400 transition">Kadapa Railway Station</Link></li>
              <li><Link href="/rent-a-car/tirupati" className="hover:text-red-400 transition">Tirupati & Airport</Link></li>
              <li><Link href="/rent-a-car/jammalamadugu" className="hover:text-red-400 transition">Gandikota Hub</Link></li>
              <li><Link href="/rent-a-car/mydukur" className="hover:text-red-400 transition">Mydukur Junction</Link></li>
              <li><Link href="/rent-a-car/pulivendula" className="hover:text-red-400 transition">Pulivendula Hub</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase text-[#D71920]">Car Hosts</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/owner/register" className="hover:text-red-400 transition">Register as Car Host</Link></li>
              <li><Link href="/owner/cars/add" className="hover:text-red-400 transition">List Your Vehicle</Link></li>
              <li><Link href="/owner/dashboard" className="hover:text-red-400 transition">Host Calendar & Payouts</Link></li>
              <li><Link href="/customer/profile" className="hover:text-red-400 transition">KYC & DL Verification</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-red-400 transition">Admin Control Center</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase text-[#D71920]">Trust & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/rental-agreement" className="hover:text-red-400 transition">Rental Agreement</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-red-400 transition">Cancellation & Refund Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-red-400 transition">Privacy & KYC Policy</Link></li>
              <li><span className="inline-flex items-center gap-1 text-[#D71920] font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Fleet</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RENTVORA. All rights reserved. Self-Drive & Chauffeur Car Rental Marketplace.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-[#D71920]" /> Cashfree 256-Bit PG</span>
            <span>Supabase Cloud Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
