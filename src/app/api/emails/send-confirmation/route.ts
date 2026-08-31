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
      return NextResponse.json({ error: 'Missing required email or booking reference' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'RENTVORA <onboarding@resend.dev>';

    const htmlContent = '<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px;">' +
      '<h1 style="color: #111;">RENT<span style="color: #D71920;">VORA</span></h1>' +
      '<h3>Booking Confirmed & Paid</h3>' +
      '<p>Namaste, ' + (customerName || 'Valued Customer') + '!</p>' +
      '<p>Your reservation for <strong>' + carName + '</strong> is confirmed.</p>' +
      '<p><strong>Booking Ref:</strong> ' + bookingRef + '</p>' +
      '<p><strong>Rental Mode:</strong> ' + (rentalType === 'with_driver' ? 'With Driver' : 'Self-Drive') + '</p>' +
      '<p><strong>Pickup Hub:</strong> ' + (pickupPoint || 'Proddatur Hub') + '</p>' +
      '<p><strong>Total Amount:</strong> Rs. ' + totalAmount + ' (Includes Rs. ' + (refundableDeposit || 2000) + ' refundable deposit)</p>' +
      '<p>Support Hotline: +91 78938 17322</p>' +
      '</div>';

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
          subject: 'Booking Confirmed: ' + carName + ' (Ref: ' + bookingRef + ') - RENTVORA',
          html: htmlContent,
        }),
      });

      const resendData = await resendResponse.json();
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
