import { NextResponse } from 'next/server';
import { formatWhatsAppBookingMessage, NotificationPayload } from '@/lib/notifications/templates';

export async function POST(request: Request) {
  try {
    const payload: NotificationPayload = await request.json();

    if (!payload.recipientPhone || !payload.bookingRef) {
      return NextResponse.json({ error: 'Missing phone or booking reference' }, { status: 400 });
    }

    const messageText = formatWhatsAppBookingMessage(payload);
    const cleanPhone = payload.recipientPhone.replace(/\D/g, '').slice(-10);
    const fullPhone = '+91' + cleanPhone;

    // Direct WhatsApp Click-to-Chat / Webhook URL
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(messageText)}`;

    // Fast2SMS / Interakt / Twilio SMS Provider Integration (if env keys provided)
    const smsApiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
    let smsDispatched = false;

    if (smsApiKey) {
      try {
        const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': smsApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: `RENTVORA: Booking ${payload.bookingRef} confirmed for ${payload.carName}. Handover at ${payload.pickupPoint}. Helpline: 7893817322`,
            language: 'english',
            numbers: cleanPhone,
          }),
        });
        const smsData = await smsRes.json();
        smsDispatched = smsData.return === true;
      } catch (smsErr) {
        console.warn('SMS gateway notice:', smsErr);
      }
    }

    return NextResponse.json({
      success: true,
      phone: fullPhone,
      whatsappUrl: waUrl,
      messagePreview: messageText,
      smsDispatched,
      timestamp: new Date().toISOString(),
      status: 'dispatched',
    });

  } catch (error: any) {
    console.error('Notification dispatch error:', error);
    return NextResponse.json({ error: error.message || 'Notification dispatch failed' }, { status: 500 });
  }
}
