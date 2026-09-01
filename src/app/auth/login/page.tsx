'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  ArrowRight, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/common/Logo';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentUserRole, currentUser } = useMarketplace();
  const supabase = createClient();

  const redirectTo = searchParams.get('redirect') || '/customer/dashboard';

  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'demo'>('email');
  
  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (currentUser) {
      const dest = currentUser.role === 'admin' 
        ? '/admin/dashboard' 
        : currentUser.role === 'owner' 
          ? '/owner/dashboard' 
          : redirectTo;
      router.replace(dest);
    }
  }, [currentUser, redirectTo, router]);

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Send Phone OTP via Supabase
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${cleanPhone.slice(-10)}`;
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });

      if (error) {
        console.warn('SMS OTP notice:', error.message);
        // SMS not enabled in Supabase — fall back gracefully
        setMessage({ 
          type: 'success', 
          text: `For demo: Enter OTP 123456 to continue. (Production: Supabase SMS provider needed)` 
        });
      } else {
        setMessage({ type: 'success', text: `OTP sent to +91${cleanPhone.slice(-10)}!` });
      }
      setOtpSent(true);
      setCountdown(30);
      setCanResend(false);
    } catch (err) {
      setMessage({ type: 'success', text: 'Enter 123456 to continue with demo login.' });
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setCountdown(30);
    setCanResend(false);
    await handleSendPhoneOtp({ preventDefault: () => {} } as any);
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!otpCode || otpCode.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit OTP code.' });
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${phoneNumber.replace(/\D/g, '').slice(-10)}`;

      if (otpCode === '123456') {
        // Demo fallback — log in with local user role
        setCurrentUserRole('customer', {
          email: `user@phone-${phoneNumber.replace(/\D/g, '').slice(-10)}.com`,
          full_name: `Driver +91${phoneNumber.replace(/\D/g, '').slice(-10)}`,
          phone: fullPhone,
        });
        setMessage({ type: 'success', text: '✅ Logged in (Demo Mode)! Redirecting...' });
        setTimeout(() => router.push(redirectTo), 600);
        return;
      }

      // Real Supabase OTP verify
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otpCode,
        type: 'sms',
      });

      if (error) throw error;

      // Profile upsert in background
      if (data.user?.phone) {
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: fullPhone, fullName: 'Driver', role: 'customer' }),
        }).catch(() => {});
      }

      setMessage({ type: 'success', text: '✅ Logged in! Redirecting...' });
      setTimeout(() => router.push(redirectTo), 600);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Invalid OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Email sign-in/sign-up with password OR magic link
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      if (password) {
        // Try sign in first
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });

        if (signInErr) {
          // If user not found, create account
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: email.split('@')[0], role: 'customer' },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (signUpErr) throw signUpErr;

          // Trigger welcome email & register profile
          fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName: email.split('@')[0], role: 'customer' }),
          }).catch(() => {});

          setMessage({ 
            type: 'success', 
            text: '🎉 Account created! Check your email to confirm, then sign in again.' 
          });
        } else {
          // Successful sign in — onAuthStateChange will update currentUser automatically
          setMessage({ type: 'success', text: '✅ Signed in! Redirecting...' });
          setTimeout(() => router.push(redirectTo), 700);
        }
      } else {
        // Magic link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;

        setMagicLinkSent(true);
        setMessage({ 
          type: 'success', 
          text: `✅ Magic sign-in link sent to ${email}! Check your inbox and click the link.` 
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login — bypass Supabase for testing
  const handleQuickDemoLogin = (selectedRole: 'customer' | 'owner' | 'admin') => {
    setCurrentUserRole(selectedRole);
    const dest = selectedRole === 'admin' 
      ? '/admin/dashboard' 
      : selectedRole === 'owner' 
        ? '/owner/dashboard' 
        : '/customer/dashboard';
    router.push(dest);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-montserrat">
      <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950">Welcome to RENTVORA</h1>
            <p className="text-xs text-slate-500">Sign in to manage bookings, KYC, or host your car</p>
          </div>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setMessage(null); }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMethod === 'phone' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setMessage(null); }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMethod === 'email' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('demo'); setMessage(null); }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMethod === 'demo' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Quick Demo</span>
          </button>
        </div>

        {/* Alert Feedback */}
        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. Mobile Phone OTP Form */}
        {authMethod === 'phone' && (
          !otpSent ? (
            <form onSubmit={handleSendPhoneOtp} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Mobile Phone Number (India)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                  <span className="font-extrabold text-slate-900 px-2 border-r border-slate-200">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="78938 17322"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent px-3 py-1 font-bold text-slate-900 outline-none text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-400">We will send a 6-digit verification code.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                <span>{loading ? 'Sending OTP...' : 'Send Verification OTP →'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    Enter 6-Digit OTP
                  </label>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setOtpCode(''); setMessage(null); }} 
                    className="text-[10px] text-[#D71920] font-bold hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-black text-slate-900 outline-none text-center text-lg tracking-widest focus:border-[#D71920]"
                />

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Didn't receive SMS?</span>
                  {!canResend ? (
                    <span className="text-slate-500 font-semibold">Resend OTP in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-[#D71920] font-bold hover:underline cursor-pointer"
                    >
                      Resend OTP Now
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
              </button>
            </form>
          )
        )}

        {/* 2. Email Password / Magic Link Form */}
        {authMethod === 'email' && !magicLinkSent && (
          <form onSubmit={handleEmailAuth} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                Password <span className="text-slate-400 font-normal normal-case tracking-normal">(leave blank for magic link)</span>
              </label>
              <input
                type="password"
                placeholder="Enter password or leave blank for magic link email"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold text-slate-900 outline-none focus:border-[#D71920]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-[#D71920]" />}
              <span>{loading ? 'Processing...' : password ? 'Sign In / Create Account' : 'Send Magic Link Email →'}</span>
            </button>

            <p className="text-center text-[10px] text-slate-400">
              New user? Just enter email + password to auto-create your account.
            </p>
          </form>
        )}

        {/* Magic link sent state */}
        {authMethod === 'email' && magicLinkSent && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Check Your Email!</h3>
              <p className="text-xs text-slate-500 mt-1">We sent a sign-in link to <strong>{email}</strong>. Click it to access your dashboard.</p>
            </div>
            <button
              onClick={() => { setMagicLinkSent(false); setMessage(null); }}
              className="text-xs text-[#D71920] font-bold hover:underline"
            >
              ← Try a different email
            </button>
          </div>
        )}

        {/* 3. Quick Demo One-Click Sign-In */}
        {authMethod === 'demo' && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-500 text-center pb-1 bg-amber-50 border border-amber-200 rounded-xl p-2">
              ⚡ Demo mode — select a pre-configured account to explore the platform instantly:
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#D71920] bg-slate-50 hover:bg-red-50/20 text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>👤 Customer (Pavan Kalyan)</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">DL Verified</span>
                </div>
                <div className="text-[10px] text-slate-500">Rent cars & view bookings in Proddatur</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D71920] transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#D71920] bg-slate-50 hover:bg-red-50/20 text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>🏢 Car Host (Ramesh Reddy)</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[9px] font-black">5 Cars Listed</span>
                </div>
                <div className="text-[10px] text-slate-500">Manage fleet, approve rentals & earnings</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D71920] transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-[#D71920] bg-slate-50 hover:bg-red-50/20 text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>⚙️ Platform Administrator</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-900 text-[9px] font-black">Full Access</span>
                </div>
                <div className="text-[10px] text-slate-500">Approve cars, KYC & view Cashfree payouts</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D71920] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* Security footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium text-center">
          <ShieldCheck className="w-4 h-4 text-[#D71920]" />
          <span>256-Bit Encrypted & Supabase Cloud Secured</span>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#D71920] border-t-transparent rounded-full" />
      </div>
    }>
      <LoginPageInner />
    </Suspense>
  );
}
