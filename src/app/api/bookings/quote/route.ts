import { NextResponse } from 'next/server';
import { calculateServerQuote } from '@/lib/pricing/calculator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quote = calculateServerQuote({
      pricePerDay: body.pricePerDay,
      pricePerHour: body.pricePerHour,
      securityDeposit: body.securityDeposit,
      deliveryAvailable: body.deliveryAvailable,
      deliveryCharges: body.deliveryCharges,
      deliveryRequested: body.deliveryRequested,
      startTime: body.startTime,
      endTime: body.endTime,
    });

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
