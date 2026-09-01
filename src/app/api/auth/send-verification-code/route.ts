import { NextResponse } from 'next/server';
import { generateEmailOtp } from '@/lib/auth/email-otp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const recipientName = fullName?.trim() || cleanEmail.split('@')[0];

    // Generate secure 6-digit OTP & HMAC verification token
    const { otp, token, expiresAt } = generateEmailOtp(cleanEmail);

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'RENTVORA <support@rentvora.in>';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 32px 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 26px; font-weight: 900; letter-spacing: 2px; }
    .logo span { color: #D71920; }
    .badge { display: inline-block; background: #D71920; color: #ffffff; padding: 4px 14px; border-radius: 50px; font-size: 11px; font-weight: 800; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 32px 28px; }
    .otp-box { background: #f8fafc; border: 2px dashed #D71920; border-radius: 18px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-digits { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #D71920; font-family: monospace; }
    .footer { background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RENT<span>VORA</span></div>
      <div style="font-size: 10px; letter-spacing: 3px; color: #94a3b8; margin-top: 4px;">CAR RENTAL &bull; ANDHRA PRADESH</div>
      <div class="badge">Verify Your Email Address</div>
    </div>
    
    <div class="content">
      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 0;">Namaste, ${recipientName}! &#128075;</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Thank you for choosing <strong>RENTVORA</strong>. To complete your account creation and activate your self-drive booking privileges, please enter the 6-digit verification code below:
      </p>

      <div class="otp-box">
        <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit Email Verification Code</div>
        <div class="otp-digits">${otp}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Valid for <strong>10 minutes</strong> &bull; Do not share this code with anyone.</div>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
        If you did not request this verification code, you can safely ignore this email.
      </p>
      
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
        Need help? WhatsApp Support: <strong>+91 78938 17322</strong>
      </div>
    </div>

    <div class="footer">
      <strong>RENTVORA SELF-DRIVE CAR RENTALS</strong><br>
      Korrapadu Road, Near RTC Bus Stand Hub, Proddatur, AP - 516360<br>
      support@rentvora.in &bull; https://rentvora.in
    </div>
  </div>
</body>
</html>`;

    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [cleanEmail],
          subject: `🔐 ${otp} is your RENTVORA email verification code`,
          html: htmlContent,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        console.warn('Resend send verification code notice:', resData);
      }
    }

    return NextResponse.json({
      success: true,
      token,
      expiresAt,
      message: `Verification code sent to ${cleanEmail}`,
    });

  } catch (error: any) {
    console.error('Send verification code error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send verification code' }, { status: 500 });
  }
}
