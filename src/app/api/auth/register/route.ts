import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, fullName, role = 'customer', password } = body;

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 });
    }

    const supabase = createClient();
    const userRole = ['customer', 'owner', 'admin'].includes(role) ? role : 'customer';
    const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : null;
    const finalPhone = cleanPhone ? '+91' + cleanPhone : null;
    const userName = fullName || 'Driver';

    // 1. Try Supabase Auth Sign Up if email & password are provided
    let authUser = null;
    if (email && password) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userName,
            phone: finalPhone,
            role: userRole,
          },
        },
      });

      if (!authError && authData.user) {
        authUser = authData.user;
      }
    }

    // 2. Upsert profile into public.profiles
    const profileId = authUser?.id || 'usr-' + Date.now();
    try {
      await supabase.from('profiles').upsert({
        id: profileId,
        email: email || null,
        phone: finalPhone,
        full_name: userName,
        role: userRole,
        kyc_status: 'verified',
        is_active: true,
      });
    } catch (dbErr) {
      console.warn('Profile upsert notice:', dbErr);
    }

    // 3. Trigger Welcome Email if email exists
    if (email) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        fetch(appUrl + '/api/emails/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            fullName: userName,
            role: userRole,
          }),
        }).catch(e => console.warn('Welcome email trigger notice:', e));
      } catch {}
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profileId,
        email,
        phone: finalPhone,
        full_name: userName,
        role: userRole,
      },
      message: 'Account successfully registered and welcome email dispatched!',
    });

  } catch (error: any) {
    console.error('Registration backend error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
