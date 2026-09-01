export interface NotificationPayload {
  type: 'BOOKING_CONFIRMED' | 'HOST_NEW_TRIP' | 'HANDOVER_READY' | 'DEPOSIT_REFUNDED';
  recipientPhone: string;
  recipientName: string;
  bookingRef: string;
  carName: string;
  pickupPoint: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  rentalMode?: string;
  hostPhone?: string;
  refundAmount?: number;
}

export function formatWhatsAppBookingMessage(payload: NotificationPayload): string {
  const mode = payload.rentalMode === 'with_driver' ? '👔 With Chauffeur' : '🚗 Self-Drive';
  
  if (payload.type === 'BOOKING_CONFIRMED') {
    return `🚗 *RENTVORA BOOKING CONFIRMED* 🚗

Namaste ${payload.recipientName}! Your reservation in Proddatur is confirmed.

📋 *Booking Ref:* ${payload.bookingRef}
🚘 *Vehicle:* ${payload.carName}
👔 *Rental Mode:* ${mode}
📍 *Pickup Hub:* ${payload.pickupPoint}
📅 *Start Time:* ${payload.startTime}
📅 *Return Time:* ${payload.endTime}
💳 *Total Paid:* ₹${payload.totalAmount} (Includes 100% Refundable Deposit)

📌 *Handover Checklist:* Please carry your Original Driving License and Aadhaar Card.

Need help? Hotline: +91 78938 17322
Drive safe with RENTVORA!`;
  }

  if (payload.type === 'HOST_NEW_TRIP') {
    return `🔔 *RENTVORA NEW TRIP ALERT* 🔔

Hello Host! You have received a new confirmed rental booking.

📋 *Booking Ref:* ${payload.bookingRef}
🚘 *Vehicle:* ${payload.carName}
👤 *Renter:* ${payload.recipientName}
📞 *Renter Phone:* ${payload.recipientPhone}
📅 *Trip Dates:* ${payload.startTime} to ${payload.endTime}
💰 *Your Projected Payout:* ₹${payload.totalAmount}

Please keep the vehicle sanitized with full fuel for handover.`;
  }

  if (payload.type === 'DEPOSIT_REFUNDED') {
    return `💰 *SECURITY DEPOSIT REFUND PROCESSED* 💰

Namaste ${payload.recipientName}! 
Your security deposit of *₹${payload.refundAmount || 2000}* for booking *${payload.bookingRef}* has been 100% refunded to your UPI/bank account.

Thank you for choosing RENTVORA for your Andhra Pradesh road trip! ⭐ Rate your trip at rentvora.vercel.app`;
  }

  return `Hello ${payload.recipientName}, updates regarding your RENTVORA booking ${payload.bookingRef}.`;
}
