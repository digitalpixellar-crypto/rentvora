import { NextResponse } from 'next/server';
import { cashfree } from '@/lib/cashfree/cashfree';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';

    // Verify signature in production
    const isMock = process.env.NODE_ENV === 'development' || !signature;
    const isValid = isMock || cashfree.verifyWebhookSignature(rawBody, signature, timestamp);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody || '{}');
    console.log('Cashfree payment webhook event:', event.type);

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
