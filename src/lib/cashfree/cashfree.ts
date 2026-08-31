import crypto from 'crypto';

export interface CashfreeOrderPayload {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
  };
  order_note?: string;
}

export class CashfreeService {
  private appId: string;
  private secretKey: string;
  private env: 'TEST' | 'PRODUCTION';
  private baseUrl: string;

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || 'TEST_APP_ID';
    this.secretKey = process.env.CASHFREE_SECRET_KEY || 'TEST_SECRET_KEY';
    this.env = (process.env.CASHFREE_ENVIRONMENT as 'TEST' | 'PRODUCTION') || 'TEST';
    this.baseUrl = this.env === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';
  }

  async createOrder(payload: CashfreeOrderPayload) {
    // If running in development without live keys, return simulated Cashfree session
    if (this.appId === 'TEST_APP_ID' || process.env.NODE_ENV === 'development') {
      return {
        cf_order_id: `cf_order_${Date.now()}`,
        order_id: payload.order_id,
        payment_session_id: `session_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        order_status: 'ACTIVE',
        order_amount: payload.order_amount,
        order_currency: payload.order_currency,
        mock_mode: true,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'x-client-id': this.appId,
          'x-client-secret': this.secretKey,
          'x-api-version': '2023-08-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create Cashfree order');
      }
      return data;
    } catch (error: any) {
      console.error('Cashfree order error:', error);
      throw error;
    }
  }

  async verifyPayment(orderId: string) {
    if (this.appId === 'TEST_APP_ID' || process.env.NODE_ENV === 'development') {
      return {
        order_id: orderId,
        order_status: 'PAID',
        payment_status: 'SUCCESS',
        cf_payment_id: `pay_${Date.now()}`,
        payment_method: 'UPI',
        is_mock: true,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/payments`, {
        method: 'GET',
        headers: {
          'x-client-id': this.appId,
          'x-client-secret': this.secretKey,
          'x-api-version': '2023-08-01',
        },
      });

      const payments = await response.json();
      if (Array.isArray(payments) && payments.length > 0) {
        const successPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');
        return {
          order_id: orderId,
          order_status: successPayment ? 'PAID' : 'FAILED',
          payment_status: successPayment ? 'SUCCESS' : 'FAILED',
          cf_payment_id: successPayment?.cf_payment_id,
          payment_method: successPayment?.payment_group || 'UPI',
          raw: payments,
        };
      }
      return { order_status: 'PENDING', payment_status: 'PENDING' };
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean {
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || this.secretKey;
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(timestamp + rawBody)
      .digest('base64');
    return computedSignature === signature;
  }
}

export const cashfree = new CashfreeService();
