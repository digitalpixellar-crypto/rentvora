import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, CreditCard } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-block bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <Logo variant="dark" size="lg" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Proddatur's premier verified peer-to-peer self-drive car rental marketplace. Pristine, sanitized cars directly from local verified hosts with 100% refundable deposit guarantee and Cashfree secure checkout.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span>Support: <strong>{APP_CONFIG.supportPhone}</strong> (8 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                <span>Email: <strong>{APP_CONFIG.supportEmail}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Proddatur, YSR Kadapa District, Andhra Pradesh - 516360</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase text-red-500">Service Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/cars?location=loc-prd-1" className="hover:text-red-400 transition">RTC Bus Stand Hub</Link></li>
              <li><Link href="/cars?location=loc-prd-2" className="hover:text-red-400 transition">Gandhi Road Center</Link></li>
              <li><Link href="/cars?location=loc-prd-3" className="hover:text-red-400 transition">Mydukur Road Station</Link></li>
              <li><Link href="/cars?location=loc-prd-4" className="hover:text-red-400 transition">Holmespet Main Point</Link></li>
              <li><Link href="/cars?location=loc-prd-5" className="hover:text-red-400 transition">Bollavaram Hub</Link></li>
              <li><Link href="/rent-a-car/kadapa" className="hover:text-red-400 transition">Kadapa Hub (Expansion)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase text-red-500">Car Hosts</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/owner/register" className="hover:text-red-400 transition">Register as Car Host</Link></li>
              <li><Link href="/owner/cars/add" className="hover:text-red-400 transition">List Your Vehicle</Link></li>
              <li><Link href="/owner/dashboard" className="hover:text-red-400 transition">Earnings & Payouts</Link></li>
              <li><Link href="/#faq" className="hover:text-red-400 transition">Host Safety & Insurance</Link></li>
              <li><Link href="/admin/login" className="hover:text-red-400 transition">Admin Control Panel</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase text-red-500">Trust & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/#faq" className="hover:text-red-400 transition">Rental Terms & Rules</Link></li>
              <li><Link href="/#faq" className="hover:text-red-400 transition">Cancellation & Refund Policy</Link></li>
              <li><Link href="/#faq" className="hover:text-red-400 transition">Security Deposit Terms</Link></li>
              <li><Link href="/#faq" className="hover:text-red-400 transition">Privacy & KYC Policy</Link></li>
              <li><span className="inline-flex items-center gap-1 text-red-400 font-semibold"><ShieldCheck className="w-3.5 h-3.5" /> 100% Verified AP Fleet</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RENTVORA. All rights reserved. Self-Drive Car Rental Marketplace.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-red-500" /> Cashfree Verified PG</span>
            <span>Supabase PostgreSQL + RLS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
