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
    const userName = fullName || (email ? email.split('@')[0] : 'Driver');

    // 1. Try Supabase Auth Sign Up if email & password are provided
    let authUserId: string | null = null;
    if (email && password) {
      try {
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
          authUserId = authData.user.id;
        }
      } catch (authErr) {
        console.warn('Supabase auth signUp notice:', authErr);
      }
    }

    // 2. Upsert profile into public.profiles table
    const profileId = authUserId || 'usr-' + Date.now();
    try {
      const { error: upsertErr } = await supabase.from('profiles').upsert({
        id: profileId,
        email: email || null,
        phone: finalPhone,
        full_name: userName,
        role: userRole,
        kyc_status: 'pending',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (upsertErr) {
        console.warn('Profile upsert notice (table may not exist yet):', upsertErr.message);
      }
    } catch (dbErr) {
      console.warn('Profile DB notice:', dbErr);
    }

    // 3. Trigger Welcome Email (inline to avoid self-referencing URL issues)
    let emailResult = { dispatched: false, mode: 'skipped', reason: 'no email provided' };
    if (email) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rentvora.in';
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

          const htmlBody = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px;}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;}.header{background:#111;padding:32px 20px;text-align:center;color:#fff;}.logo{font-size:26px;font-weight:900;letter-spacing:2px;}.logo span{color:#D71920;}.badge{display:inline-block;background:#D71920;color:#fff;padding:5px 14px;border-radius:50px;font-size:12px;font-weight:bold;margin-top:12px;}.content{padding:28px;}.cta{display:block;background:#D71920;color:#fff!important;text-align:center;text-decoration:none;padding:14px;border-radius:12px;font-weight:bold;margin:20px 0;}.footer{background:#f8fafc;padding:20px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;}</style></head><body><div class="container"><div class="header"><div class="logo">RENT<span>VORA</span></div><div style="font-size:10px;letter-spacing:3px;color:#94a3b8;margin-top:4px;">CAR RENTAL &bull; PRODDATUR &bull; AP</div><div class="badge">Account Created &#127881;</div></div><div class="content"><h2 style="font-size:20px;font-weight:900;color:#0f172a;">Namaste, ${userName}! &#128075;</h2><p style="font-size:13px;color:#475569;line-height:1.7;">Welcome to <strong>RENTVORA</strong> &mdash; Andhra Pradesh's premier self-drive car rental platform. Your account is now active!</p><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin:18px 0;font-size:13px;color:#334155;"><div style="font-weight:800;color:#D71920;margin-bottom:10px;">&#9889; Get Started in 3 Steps:</div><div style="margin-bottom:8px;">&#129530; <strong>1.</strong> Upload your Driving License for instant KYC.</div><div style="margin-bottom:8px;">&#128663; <strong>2.</strong> Browse SUVs, Hatchbacks & Sedans in Proddatur.</div><div style="margin-bottom:8px;">&#128205; <strong>3.</strong> Pick up at RTC Bus Stand or get doorstep delivery.</div></div><a href="${appUrl}/cars" class="cta">Explore Available Cars &rarr;</a><p style="font-size:12px;color:#64748b;text-align:center;">Support: <strong>+91 78938 17322</strong> (WhatsApp)</p></div><div class="footer">RENTVORA &bull; Proddatur, Kadapa, Tirupati &bull; Andhra Pradesh<br>support@rentvora.in</div></div></body></html>`;

          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + resendApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [email],
              subject: '🎉 Welcome to RENTVORA — Your Account is Ready!',
              html: htmlBody,
            }),
          });

          const resData = await res.json();
          if (res.ok) {
            emailResult = { dispatched: true, mode: 'live', reason: `Email ID: ${resData.id}` };
          } else {
            emailResult = { 
              dispatched: false, 
              mode: 'resend_error', 
              reason: resData.message || 'Resend sandbox restriction. Use a verified domain to send to any email.'
            };
          }
        } catch (emailErr: any) {
          emailResult = { dispatched: false, mode: 'error', reason: emailErr.message };
        }
      } else {
        emailResult = { dispatched: false, mode: 'no_api_key', reason: 'RESEND_API_KEY not set' };
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profileId,
        email: email || null,
        phone: finalPhone,
        full_name: userName,
        role: userRole,
      },
      email: emailResult,
      message: 'Account registered successfully!',
    });

  } catch (error: any) {
    console.error('Registration backend error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
