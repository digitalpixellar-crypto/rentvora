import { Booking } from '@/types';
import { APP_CONFIG } from '@/lib/constants';
import { formatDateTime } from './formatters';

export function formatWhatsAppPhone(phone: string): string {
  // Remove non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateHostBookingWhatsAppMessage(booking: Booking): string {
  const hostName = booking.owner?.full_name || 'Host';
  const carName = `${booking.car?.brand || 'Car'} ${booking.car?.model || ''}`;
  const pickup = booking.pickup_location?.area_locality || 'Proddatur';
  const mode = booking.rental_type === 'with_driver' ? 'With Chauffeur / Driver' : 'Self-Drive';

  return `Hello ${hostName}! 👋\n\nI have confirmed a booking for your *${carName}* on *RENTVORA*.\n\n📋 *Booking Ref:* ${booking.booking_reference}\n🚘 *Mode:* ${mode}\n📍 *Pickup Location:* ${pickup} (${booking.pickup_location?.pickup_point_name || 'Main Hub'})\n📅 *Start Time:* ${formatDateTime(booking.start_time)}\n📅 *Return Time:* ${formatDateTime(booking.end_time)}\n\nPlease share the vehicle handover location and inspection details. Thank you!`;
}

export function generateCustomerSupportWhatsAppMessage(topic: string = 'General Inquiry'): string {
  return `Hello RENTVORA Support! 👋\n\nI need assistance with: *${topic}* in Proddatur.\n\nPlease guide me with available self-drive cars, pickup points, and pricing.`;
}
