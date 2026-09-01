import { NextResponse } from 'next/server';
import { verifyEmailOtp } from '@/lib/auth/email-otp';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, token, fullName, phone, password, role = 'customer' } = body;

    if (!email || !otp || !token) {
      return NextResponse.json({ error: 'Email, OTP code, and verification token are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    // 1. Validate the OTP code using HMAC signature
    const verification = verifyEmailOtp(cleanEmail, cleanOtp, token);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason || 'Invalid verification code' }, { status: 400 });
    }

    // 2. Verified! Proceed to create user in Supabase & database
    const supabase = createClient();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];
    const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : null;
    const finalPhone = cleanPhone ? '+91' + cleanPhone : null;
    const userRole = ['customer', 'owner', 'admin'].includes(role) ? role : 'customer';

    let authUserId: string | null = null;

    if (password) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: finalPhone,
              role: userRole,
              email_verified: true,
            },
          },
        });

        if (!authError && authData.user) {
          authUserId = authData.user.id;
        }
      } catch (authErr) {
        console.warn('Supabase auth signup notice:', authErr);
      }
    }

    // 3. Upsert into public.profiles table
    const profileId = authUserId || 'usr-' + Date.now();
    try {
      await supabase.from('profiles').upsert({
        id: profileId,
        email: cleanEmail,
        phone: finalPhone,
        full_name: cleanName,
        role: userRole,
        kyc_status: 'pending',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    } catch (dbErr) {
      console.warn('Profile DB upsert notice:', dbErr);
    }

    // 4. Send official welcome email
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'RENTVORA <support@rentvora.in>';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rentvora.in';

    if (resendApiKey) {
      try {
        const welcomeHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px;}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;}.header{background:#111;padding:32px 20px;text-align:center;color:#fff;}.logo{font-size:26px;font-weight:900;letter-spacing:2px;}.logo span{color:#D71920;}.badge{display:inline-block;background:#D71920;color:#fff;padding:5px 14px;border-radius:50px;font-size:12px;font-weight:bold;margin-top:12px;}.content{padding:28px;}.cta{display:block;background:#D71920;color:#fff!important;text-align:center;text-decoration:none;padding:14px;border-radius:12px;font-weight:bold;margin:20px 0;}.footer{background:#f8fafc;padding:20px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;}</style></head><body><div class="container"><div class="header"><div class="logo">RENT<span>VORA</span></div><div style="font-size:10px;letter-spacing:3px;color:#94a3b8;margin-top:4px;">CAR RENTAL &bull; ANDHRA PRADESH</div><div class="badge">&#10003; Email Verified &bull; Account Active</div></div><div class="content"><h2 style="font-size:20px;font-weight:900;color:#0f172a;">Namaste, ${cleanName}! &#128075;</h2><p style="font-size:13px;color:#475569;line-height:1.7;">Your email has been verified and your <strong>RENTVORA</strong> account is ready to roll!</p><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin:18px 0;font-size:13px;color:#334155;"><div style="font-weight:800;color:#D71920;margin-bottom:10px;">&#9889; Get Started in 3 Steps:</div><div style="margin-bottom:8px;">&#129530; <strong>1.</strong> Upload your Driving License for instant KYC.</div><div style="margin-bottom:8px;">&#128663; <strong>2.</strong> Browse SUVs, Hatchbacks & Sedans in Proddatur.</div><div style="margin-bottom:8px;">&#128205; <strong>3.</strong> Pick up at RTC Bus Stand or get doorstep delivery.</div></div><a href="${appUrl}/cars" class="cta">Explore Available Cars &rarr;</a><p style="font-size:12px;color:#64748b;text-align:center;">Support: <strong>+91 78938 17322</strong> (WhatsApp)</p></div><div class="footer">RENTVORA &bull; Proddatur, Kadapa, Tirupati &bull; Andhra Pradesh<br>support@rentvora.in</div></div></body></html>`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [cleanEmail],
            subject: '🎉 Welcome to RENTVORA — Email Verified & Account Ready!',
            html: welcomeHtml,
          }),
        });
      } catch (emailErr) {
        console.warn('Welcome email notice:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: profileId,
        email: cleanEmail,
        phone: finalPhone,
        full_name: cleanName,
        role: userRole,
        email_verified: true,
      },
      message: 'Email verified successfully and account activated!',
    });

  } catch (error: any) {
    console.error('Verify and register error:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
