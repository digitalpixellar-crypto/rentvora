'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, Lock, ArrowRight } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUserRole } = useMarketplace();
  const [email, setEmail] = useState('pavan.kalyan@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'customer' | 'owner' | 'admin'>('customer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole(role);
    if (role === 'admin') router.push('/admin/dashboard');
    else if (role === 'owner') router.push('/owner/dashboard');
    else router.push('/customer/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
            <Car className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign In to RENTVORA</h1>
          <p className="text-xs text-slate-500">Access your bookings, listed cars or platform administration.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1 text-slate-600">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'owner', 'admin'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-xl capitalize font-bold border transition ${role === r ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1 text-slate-600">Email Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
          </div>

          <div>
            <label className="font-bold block mb-1 text-slate-600">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
          </div>

          <button type="submit" className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition">
            Continue to Dashboard
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          New to RENTVORA? <Link href="/owner/register" className="text-emerald-600 font-bold">List a car</Link> or explore <Link href="/cars" className="text-emerald-600 font-bold">cars for rent</Link>
        </div>
      </div>
    </div>
  );
}
