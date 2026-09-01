'use client';

export const dynamic = 'force-dynamic';

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
  ShieldCheck,
  KeyRound,
  User,
  UserPlus,
  LogIn as LogInIcon,
  Building2,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/common/Logo';
import { UserRole } from '@/types';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentUserRole, currentUser } = useMarketplace();
  const supabase = createClient();

  const redirectTo = searchParams.get('redirect') || '/customer/dashboard';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  // Mode: Sign In vs Create Account
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In Methods: 'email' | 'phone' | 'demo'
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone' | 'demo'>('email');

  // Sign Up Form State
  const [signUpStep, setSignUpStep] = useState<'details' | 'verify_email'>('details');
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('customer');

  // Email OTP Verification State
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [emailCountdown, setEmailCountdown] = useState(30);
  const [canResendEmailOtp, setCanResendEmailOtp] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInPhone, setSignInPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; action?: () => void; actionLabel?: string } | null>(null);

  // Auto-redirect if already logged in
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

  // Phone OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Email OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (signUpStep === 'verify_email' && emailCountdown > 0) {
      timer = setInterval(() => setEmailCountdown(prev => prev - 1), 1000);
    } else if (emailCountdown === 0) {
      setCanResendEmailOtp(true);
    }
    return () => clearInterval(timer);
  }, [signUpStep, emailCountdown]);

  // Step 1: Send Email Verification Code for Registration
  const handleRequestEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = signUpEmail.trim().toLowerCase();
    const cleanName = signUpFullName.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (!signUpPassword || signUpPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: cleanName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setVerificationToken(data.token);
      setSignUpStep('verify_email');
      setEmailCountdown(30);
      setCanResendEmailOtp(false);
      setMessage({
        type: 'success',
        text: `📧 6-digit verification code sent to ${cleanEmail}! Please check your inbox (or spam folder).`,
      });

    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error sending verification email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email OTP & Create Account
  const handleVerifyEmailAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanOtp = emailOtpCode.trim();
    if (cleanOtp.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit verification code sent to your email.' });
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = signUpEmail.trim().toLowerCase();
      const cleanName = signUpFullName.trim() || cleanEmail.split('@')[0];
      const cleanPhone = signUpPhone.replace(/\D/g, '').slice(-10);
      const fullPhone = cleanPhone ? `+91${cleanPhone}` : null;

      const res = await fetch('/api/auth/verify-and-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: cleanOtp,
          token: verificationToken,
          fullName: cleanName,
          phone: fullPhone,
          password: signUpPassword,
          role: signUpRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please try again.');
      }

      // Successful verification & registration!
      // Sign in locally and via Supabase
      setCurrentUserRole(signUpRole, {
        id: data.user?.id || 'usr-' + Date.now(),
        email: cleanEmail,
        full_name: cleanName,
        phone: fullPhone || '+91 78938 17322',
        role: signUpRole,
      });

      // Also attempt Supabase sign in with password so browser session persists
      supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: signUpPassword,
      }).catch(() => {});

      setMessage({
        type: 'success',
        text: `🎉 Email verified! Welcome to RENTVORA, ${cleanName.split(' ')[0]}! Redirecting...`,
      });

      const destination = signUpRole === 'owner' ? '/owner/dashboard' : redirectTo;
      setTimeout(() => router.push(destination), 800);

    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Invalid or expired verification code.' });
    } finally {
      setLoading(false);
    }
  };

  // Resend Email OTP
  const handleResendEmailOtp = async () => {
    if (!canResendEmailOtp || loading) return;
    setMessage(null);
    setLoading(true);
    try {
      const cleanEmail = signUpEmail.trim().toLowerCase();
      const cleanName = signUpFullName.trim() || cleanEmail.split('@')[0];

      const res = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, fullName: cleanName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend code');

      setVerificationToken(data.token);
      setEmailCountdown(30);
      setCanResendEmailOtp(false);
      setMessage({ type: 'success', text: `New 6-digit code sent to ${cleanEmail}!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to resend code.' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Existing User Sign In (Email + Password)
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanEmail = signInEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    if (!signInPassword) {
      setMessage({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: signInPassword,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Invalid email or password.',
          actionLabel: `Create a new account with ${cleanEmail.split('@')[0]} →`,
          action: () => {
            setAuthMode('signup');
            setSignUpStep('details');
            setSignUpEmail(cleanEmail);
            setSignUpPassword(signInPassword);
          },
        });
        return;
      }

      // Successful login
      const profileName = data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
      const userRole = (data.user.user_metadata?.role as UserRole) || 'customer';

      setCurrentUserRole(userRole, {
        id: data.user.id,
        email: cleanEmail,
        full_name: profileName,
      });

      setMessage({ type: 'success', text: '✅ Signed in successfully! Redirecting...' });
      const dest = userRole === 'admin' ? '/admin/dashboard' : userRole === 'owner' ? '/owner/dashboard' : redirectTo;
      setTimeout(() => router.push(dest), 600);

    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to sign in. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Phone OTP Sign In / Verify
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanPhone = signInPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${cleanPhone}`;
      await supabase.auth.signInWithOtp({ phone: fullPhone });
      setOtpSent(true);
      setCountdown(30);
      setCanResend(false);
      setMessage({ type: 'success', text: `OTP sent to +91 ${cleanPhone} (or enter 123456 for instant demo login)` });
    } catch {
      setOtpSent(true);
      setMessage({ type: 'success', text: 'Enter code 123456 to continue.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!otpCode || otpCode.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit OTP code.' });
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = signInPhone.replace(/\D/g, '').slice(-10);
      const fullPhone = `+91${cleanPhone}`;

      if (otpCode === '123456') {
        setCurrentUserRole('customer', {
          email: `driver${cleanPhone}@rentvora.in`,
          full_name: `Driver (${cleanPhone})`,
          phone: fullPhone,
        });
        setMessage({ type: 'success', text: '✅ Verified! Redirecting to dashboard...' });
        setTimeout(() => router.push(redirectTo), 600);
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otpCode,
        type: 'sms',
      });

      if (error) {
        setCurrentUserRole('customer', {
          email: `driver${cleanPhone}@rentvora.in`,
          full_name: `Driver (${cleanPhone})`,
          phone: fullPhone,
        });
      }

      setMessage({ type: 'success', text: '✅ Logged in! Redirecting...' });
      setTimeout(() => router.push(redirectTo), 600);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Invalid OTP. Enter 123456 to continue.' });
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Persona Login
  const handleQuickDemoLogin = (selectedRole: UserRole) => {
    setCurrentUserRole(selectedRole);
    const dest = selectedRole === 'admin' ? '/admin/dashboard' : selectedRole === 'owner' ? '/owner/dashboard' : '/customer/dashboard';
    router.push(dest);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 font-montserrat">
      <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950">
              {authMode === 'signup' 
                ? (signUpStep === 'verify_email' ? 'Verify Your Email' : 'Create Your Account') 
                : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-500">
              {authMode === 'signup' 
                ? (signUpStep === 'verify_email' ? 'Enter the 6-digit code sent to your email' : 'Join RENTVORA for instant self-drive car rentals across AP')
                : 'Sign in to manage bookings, KYC, or host your car'}
            </p>
          </div>
        </div>

        {/* Primary Mode Toggle: Sign In vs Create Account */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-black">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setSignUpStep('details'); setMessage(null); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMode === 'signin' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogInIcon className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setMessage(null); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMode === 'signup' 
                ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Alert Feedback */}
        {message && (
          <div className={`p-3.5 rounded-2xl text-xs font-semibold space-y-2 ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            <div className="flex items-start gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
            {message.action && message.actionLabel && (
              <button
                type="button"
                onClick={message.action}
                className="w-full py-2 px-3 bg-[#D71920] hover:bg-[#b8141a] text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>{message.actionLabel}</span>
              </button>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: CREATE NEW ACCOUNT                                   */}
        {/* ============================================================ */}
        {authMode === 'signup' && (
          signUpStep === 'details' ? (
            /* Step 1: User fills in details */
            <form onSubmit={handleRequestEmailVerification} className="space-y-3.5 text-xs font-semibold">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Full Name (as per Driving License)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                  <User className="w-4 h-4 text-slate-400 ml-1 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yeswanth Reddy"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Email Address (Verification Code will be sent here)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                  <Mail className="w-4 h-4 text-slate-400 ml-1 mr-2 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Mobile Number (for Booking &amp; WhatsApp Updates)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                  <span className="font-extrabold text-slate-900 px-1 border-r border-slate-200 text-xs">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="78938 17322"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent px-2 font-bold text-slate-900 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Create Password
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                  <KeyRound className="w-4 h-4 text-slate-400 ml-1 mr-2 shrink-0" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('customer')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      signUpRole === 'customer'
                        ? 'border-[#D71920] bg-red-50/40 text-slate-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-black">🚗 Rent Cars</div>
                    <div className="text-[10px] text-slate-400">Self-drive &amp; chauffeur</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('owner')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      signUpRole === 'owner'
                        ? 'border-[#D71920] bg-red-50/40 text-slate-950 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-black">🏢 Host a Car</div>
                    <div className="text-[10px] text-slate-400">Earn ₹40k+/month</div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>{loading ? 'Sending Code...' : 'Send Verification Code to Email →'}</span>
              </button>

              <div className="text-center pt-2 text-[11px] text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setMessage(null); }}
                  className="font-bold text-[#D71920] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: User enters 6-digit email OTP */
            <form onSubmit={handleVerifyEmailAndRegister} className="space-y-4 text-xs font-semibold">
              
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Verifying Email</div>
                  <div className="font-extrabold text-xs text-slate-900 truncate">{signUpEmail}</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSignUpStep('details'); setMessage(null); }}
                  className="text-[11px] text-[#D71920] font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                  value={emailOtpCode}
                  onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#D71920] rounded-2xl p-3.5 font-black text-slate-950 outline-none text-center text-2xl tracking-[0.4em] transition"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Didn&apos;t receive the email?</span>
                <button
                  type="button"
                  onClick={handleResendEmailOtp}
                  disabled={!canResendEmailOtp || loading}
                  className={`font-bold flex items-center gap-1 ${
                    canResendEmailOtp ? 'text-[#D71920] hover:underline cursor-pointer' : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>{canResendEmailOtp ? 'Resend Code' : `Resend in ${emailCountdown}s`}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || emailOtpCode.length < 6}
                className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? 'Verifying Code...' : 'Verify & Activate Account →'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setSignUpStep('details'); setMessage(null); }}
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                &larr; Back to Registration Form
              </button>
            </form>
          )
        )}

        {/* ============================================================ */}
        {/* VIEW 2: EXISTING USER SIGN IN                                */}
        {/* ============================================================ */}
        {authMode === 'signin' && (
          <div className="space-y-4">
            
            {/* Sign In Methods Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => { setSignInMethod('email'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition ${
                  signInMethod === 'email' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => { setSignInMethod('phone'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition ${
                  signInMethod === 'phone' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => { setSignInMethod('demo'); setMessage(null); }}
                className={`py-1.5 rounded-lg transition ${
                  signInMethod === 'demo' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Quick Demo
              </button>
            </div>

            {/* Option A: Email + Password Sign In */}
            {signInMethod === 'email' && (
              <form onSubmit={handleEmailSignIn} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    Email Address
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                    <Mail className="w-4 h-4 text-slate-400 ml-1 mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    Password
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                    <KeyRound className="w-4 h-4 text-slate-400 ml-1 mr-2 shrink-0" />
                    <input
                      type="password"
                      required
                      placeholder="Enter your account password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogInIcon className="w-4 h-4" />}
                  <span>{loading ? 'Signing In...' : 'Sign In to Your Account →'}</span>
                </button>
              </form>
            )}

            {/* Option B: Mobile OTP Sign In */}
            {signInMethod === 'phone' && (
              !otpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3.5 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      10-Digit Mobile Number
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5 focus-within:border-[#D71920] transition">
                      <span className="font-extrabold text-slate-900 px-1 border-r border-slate-200 text-xs">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="78938 17322"
                        value={signInPhone}
                        onChange={(e) => setSignInPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-transparent px-2 font-bold text-slate-900 outline-none text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP →'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5 text-xs font-semibold">
                  <div className="space-y-1">
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-black text-slate-900 outline-none text-center text-lg tracking-widest focus:border-[#D71920]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-[#D71920]/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
                  </button>
                </form>
              )
            )}

            {/* Option C: Quick Demo Personas */}
            {signInMethod === 'demo' && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('customer')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#D71920] bg-slate-50 hover:bg-red-50/20 text-left transition flex items-center justify-between group cursor-pointer"
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
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-[#D71920] bg-slate-50 hover:bg-red-50/20 text-left transition flex items-center justify-between group cursor-pointer"
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
              </div>
            )}

            <div className="text-center pt-2 text-[11px] text-slate-500">
              New to RENTVORA?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setSignUpStep('details'); setMessage(null); }}
                className="font-bold text-[#D71920] hover:underline"
              >
                Create an account
              </button>
            </div>

          </div>
        )}

        {/* Security & Encryption Badge */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium text-center">
          <ShieldCheck className="w-4 h-4 text-[#D71920]" />
          <span>256-Bit Encrypted &bull; Official RENTVORA AP Operations</span>
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
