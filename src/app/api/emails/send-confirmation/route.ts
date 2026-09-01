import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerEmail, 
      customerName, 
      carName, 
      bookingRef, 
      pickupPoint, 
      startTime, 
      endTime, 
      totalAmount, 
      refundableDeposit, 
      rentalType 
    } = body;

    if (!customerEmail || !bookingRef) {
      return NextResponse.json({ error: 'Missing required customer email or booking reference' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'RENTVORA <support@rentvora.in>';
    const name = customerName || 'Driver';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rentvora.in';
    const mode = rentalType === 'with_driver' ? 'Chauffeur Driven' : 'Self-Drive';

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #111111; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background-color: #111111; padding: 32px 20px; text-align: center; color: #ffffff; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: 2px; }
    .logo span { color: #D71920; }
    .subtitle { font-size: 10px; letter-spacing: 3px; color: #94a3b8; margin-top: 4px; }
    .badge { display: inline-block; background-color: #16a34a; color: #ffffff; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: bold; margin-top: 14px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 600; }
    .val { color: #0f172a; font-weight: 800; text-align: right; }
    .cta-button { display: block; background-color: #D71920; color: #ffffff !important; text-align: center; text-decoration: none; padding: 14px 24px; border-radius: 14px; font-weight: bold; font-size: 14px; margin: 24px 0 12px 0; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">RENT<span>VORA</span></div>
      <div class="subtitle">CAR RENTAL &bull; PRODDATUR &bull; AP</div>
      <div class="badge">&#10003; Booking Confirmed &amp; Paid</div>
    </div>
    <div class="content">
      <h2 class="greeting">Namaste, ${name}! &#128075;</h2>
      <p style="font-size: 13px; color: #475569; line-height: 1.7; margin: 0 0 16px 0;">
        Your reservation for <strong>${carName || 'Vehicle'}</strong> is confirmed. Your vehicle will be sanitized and ready at the designated pickup point.
      </p>

      <div class="card">
        <div style="font-weight: 800; font-size: 13px; color: #D71920; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          &#128663; Trip &amp; Booking Summary
        </div>
        <div class="row">
          <span class="label">Booking Reference:</span>
          <span class="val" style="color: #D71920;">${bookingRef}</span>
        </div>
        <div class="row">
          <span class="label">Rental Mode:</span>
          <span class="val">${mode}</span>
        </div>
        <div class="row">
          <span class="label">Pickup Hub / Location:</span>
          <span class="val">${pickupPoint || 'Proddatur Hub'}</span>
        </div>
        ${startTime ? `<div class="row"><span class="label">Trip Start:</span><span class="val">${startTime}</span></div>` : ''}
        ${endTime ? `<div class="row"><span class="label">Trip Return:</span><span class="val">${endTime}</span></div>` : ''}
        <div class="row">
          <span class="label">Total Paid:</span>
          <span class="val" style="font-size: 15px; color: #16a34a;">&#8377;${totalAmount?.toLocaleString('en-IN') || '0'}</span>
        </div>
        <div class="row">
          <span class="label">Refundable Deposit Included:</span>
          <span class="val">&#8377;${(refundableDeposit || 2000)?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px; font-size: 12px; color: #991b1b; margin-bottom: 20px;">
        &#128204; <strong>Handover Checklist:</strong> Please bring your original Driving License &amp; Aadhaar Card when collecting the car.
      </div>

      <a href="${appUrl}/customer/dashboard" class="cta-button">View Booking in Dashboard &rarr;</a>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
        Need instant help? WhatsApp our Proddatur Hub team at <strong>+91 78938 17322</strong>.
      </p>
    </div>
    <div class="footer">
      RENTVORA Self-Drive Car Rentals &bull; Proddatur, Kadapa &amp; Andhra Pradesh<br>
      Official Support: +91 78938 17322 &bull; support@rentvora.in
    </div>
  </div>
</body>
</html>`;

    if (resendApiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + resendApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [customerEmail],
          subject: `✅ Booking Confirmed: ${carName || 'Car'} (Ref: ${bookingRef}) — RENTVORA`,
          html: htmlContent,
        }),
      });

      const resendData = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error('Resend confirmation email error:', resendData);
        return NextResponse.json({ 
          success: false, 
          error: resendData.message || 'Resend API error',
          hint: 'Verify rentvora.in domain in Resend to send to any email.'
        }, { status: 422 });
      }

      return NextResponse.json({ success: true, resendId: resendData.id, mode: 'live' });
    }

    return NextResponse.json({ 
      success: true, 
      mode: 'simulated', 
      message: 'Email confirmation prepared for ' + customerEmail 
    });

  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch email' }, { status: 500 });
  }
}
