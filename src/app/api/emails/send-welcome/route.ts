import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing recipient email address' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const name = fullName || 'Driver';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rentvora.in';

    // NOTE: When using onboarding@resend.dev (Resend sandbox/free tier),
    // emails can ONLY be sent to your own verified Resend account email.
    // To send to ANY email, add a verified domain in Resend dashboard:
    // https://resend.com/domains → Add domain → set RESEND_FROM_EMAIL=noreply@yourdomain.com

    const htmlContent = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<style>' +
          'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #111111; }' +
          '.container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }' +
          '.header { background-color: #111111; padding: 36px 20px; text-align: center; color: #ffffff; }' +
          '.logo { font-size: 28px; font-weight: 900; letter-spacing: 2px; }' +
          '.logo span { color: #D71920; }' +
          '.subtitle { font-size: 10px; letter-spacing: 3px; color: #94a3b8; margin-top: 4px; }' +
          '.badge { display: inline-block; background-color: #D71920; color: #ffffff; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: bold; margin-top: 14px; }' +
          '.content { padding: 32px 28px; }' +
          '.greeting { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0; }' +
          '.text { font-size: 13px; color: #475569; line-height: 1.7; margin: 0 0 20px 0; }' +
          '.card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 20px 0; }' +
          '.card-item { margin-bottom: 12px; font-size: 13px; color: #334155; }' +
          '.card-item strong { color: #0f172a; }' +
          '.cta-button { display: block; background-color: #D71920; color: #ffffff !important; text-align: center; text-decoration: none; padding: 14px 24px; border-radius: 14px; font-weight: bold; font-size: 14px; margin: 24px 0 12px 0; }' +
          '.footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<div class="container">' +
          '<div class="header">' +
            '<div class="logo">RENT<span>VORA</span></div>' +
            '<div class="subtitle">CAR RENTAL &bull; PRODDATUR &bull; AP</div>' +
            '<div class="badge">Successfully Registered! &#127881;</div>' +
          '</div>' +
          '<div class="content">' +
            '<h2 class="greeting">Namaste, ' + name + '! &#128075;</h2>' +
            '<p class="text">' +
              'Welcome to <strong>RENTVORA</strong> &mdash; Andhra Pradesh\'s premier peer-to-peer car rental platform. Your account is now active and ready for self-drive and chauffeur bookings across Proddatur, Kadapa, and Tirupati.' +
            '</p>' +
            '<div class="card">' +
              '<div style="font-weight: 800; font-size: 13px; color: #D71920; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">&#9889; 3 Quick Steps to Your First Drive:</div>' +
              '<div class="card-item">&#129530; <strong>1. Upload Driving License (DL):</strong> Verify your license once in your profile for instant 1-click rentals.</div>' +
              '<div class="card-item">&#128663; <strong>2. Choose Self-Drive or Driver:</strong> Pick from our verified hatchbacks, SUVs, and 7-seaters.</div>' +
              '<div class="card-item">&#128205; <strong>3. Pickup in Proddatur:</strong> Collect your sanitized car at RTC Bus Stand, Gandhi Road, or get doorstep delivery.</div>' +
            '</div>' +
            '<a href="' + appUrl + '/cars" class="cta-button">Explore Available Cars Now &rarr;</a>' +
            '<p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">' +
              'Need immediate support? WhatsApp us at <strong>+91 78938 17322</strong>.' +
            '</p>' +
          '</div>' +
          '<div class="footer">' +
            'RENTVORA Self-Drive Car Rentals &bull; Proddatur, Kadapa &amp; Andhra Pradesh<br>' +
            'Official Support: +91 78938 17322 &bull; support@rentvora.in' +
          '</div>' +
        '</div>' +
      '</body>' +
      '</html>';

    if (!resendApiKey) {
      return NextResponse.json({ 
        success: true, 
        mode: 'simulated', 
        message: 'RESEND_API_KEY not set. Welcome email simulated for ' + email + '.' 
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + resendApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: '🎉 Welcome to RENTVORA — Your Account is Ready!',
        html: htmlContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      // Resend returned an error (e.g. sandbox restriction: can only send to verified email)
      console.error('Resend API error:', resendData);
      return NextResponse.json({ 
        success: false, 
        mode: 'resend_error',
        error: resendData.message || 'Resend API error',
        hint: 'If using onboarding@resend.dev, you can only send to your verified Resend account email. Add a custom domain at resend.com/domains to send to any email.'
      }, { status: 422 });
    }

    return NextResponse.json({ success: true, resendId: resendData.id, mode: 'live' });

  } catch (error: any) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch welcome email' }, { status: 500 });
  }
}
