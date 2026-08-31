import { NextResponse } from 'next/server';
import { cashfree } from '@/lib/cashfree/cashfree';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await cashfree.createOrder({
      order_id: body.order_id || `order_${Date.now()}`,
      order_amount: Number(body.order_amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: body.customer_id || 'cust_demo',
        customer_name: body.customer_name || 'Customer',
        customer_email: body.customer_email || 'customer@example.com',
        customer_phone: body.customer_phone || '9999999999',
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
