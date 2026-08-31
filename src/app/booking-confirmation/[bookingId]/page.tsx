'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  Printer, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Car, 
  ShieldCheck, 
  ArrowRight,
  Download,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { createWhatsAppUrl, generateHostBookingWhatsAppMessage } from '@/lib/utils/whatsapp';

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const { bookings } = useMarketplace();
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Booking Not Found</h2>
        <Link href="/cars" className="inline-block px-4 py-2 rounded-xl bg-[#D71920] text-white text-xs font-bold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Success Badge Banner */}
      <div className="bg-[#D71920] rounded-3xl p-8 text-white text-center space-y-4 shadow-xl shadow-[#D71920]/20">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto text-white">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-red-200">Payment Successful & Confirmed</span>
          <h1 className="text-2xl sm:text-4xl font-black">Your Car is Ready to Drive!</h1>
          <p className="text-sm text-red-100 max-w-md mx-auto">
            Booking Reference: <strong className="text-white underline">{booking.booking_reference}</strong>
          </p>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 print:border-none print:shadow-none">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-slate-900">RENT<span className="text-[#D71920]">VORA</span></span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">TAX INVOICE</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">GSTIN: 37AAECP1298K1Z3 • Proddatur, Andhra Pradesh</p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
            <div>Booking Ref: <strong className="text-slate-900">{booking.booking_reference}</strong></div>
            <div>Date: {formatDateTime(booking.created_at)}</div>
            <div>Status: <span className="text-[#D71920] font-bold uppercase">CONFIRMED (PAID)</span></div>
          </div>
        </div>

        {/* Renter & Host Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Renter Details</span>
            <div className="font-bold text-slate-900 text-sm">{booking.customer?.full_name}</div>
            <div className="text-slate-600">Phone: {booking.customer?.phone}</div>
            <div className="text-slate-600">Email: {booking.customer?.email}</div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Host & Pickup Location</span>
            <div className="font-bold text-slate-900 text-sm">Ramesh Reddy (Verified Host)</div>
            <div className="text-slate-600">Pickup: {booking.pickup_location?.area_locality} ({booking.pickup_location?.pickup_point_name})</div>
            <div className="text-slate-600">Host Contact: +91 98490 12345</div>
          </div>
        </div>

        {/* Trip Timings & Vehicle Details */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Rental Specifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Vehicle</div>
              <div className="font-bold text-slate-900 text-sm">{booking.car?.brand} {booking.car?.model}</div>
              <div className="text-xs text-slate-500">{booking.car?.registration_number} • {booking.car?.fuel_type}</div>
              <div className="text-[11px] font-bold text-[#D71920] mt-1 uppercase">Mode: {booking.rental_type === "with_driver" ? "👔 With Chauffeur / Driver" : "🚗 Self-Drive"}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Pickup Schedule</div>
              <div className="font-bold text-slate-900 text-sm">{formatDateTime(booking.start_time)}</div>
              <div className="text-xs text-slate-500">{booking.pickup_location?.area_locality}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 text-xs font-medium">Return Schedule</div>
              <div className="font-bold text-slate-900 text-sm">{formatDateTime(booking.end_time)}</div>
              <div className="text-xs text-slate-500">Duration: {booking.duration_hours} hrs</div>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Payment Breakdown</h3>
          
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase">
                <th className="py-2.5 font-bold">Description</th>
                <th className="py-2.5 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5">Base Self-Drive Vehicle Rental ({booking.duration_hours} hours)</td>
                <td className="py-2.5 text-right font-semibold text-slate-900">{formatCurrency(booking.base_rental_amount)}</td>
              </tr>
              {booking.delivery_amount > 0 && (
                <tr>
                  <td className="py-2.5">Doorstep Delivery Charge (Proddatur)</td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">{formatCurrency(booking.delivery_amount)}</td>
                </tr>
              )}
              <tr>
                <td className="py-2.5">Applicable Taxes & GST (5%)</td>
                <td className="py-2.5 text-right font-semibold text-slate-900">{formatCurrency(booking.taxes_fees_amount)}</td>
              </tr>
              <tr className="text-[#b8141a] font-medium">
                <td className="py-2.5">Refundable Security Deposit (100% Returnable)</td>
                <td className="py-2.5 text-right font-bold">{formatCurrency(booking.security_deposit_amount)}</td>
              </tr>
              <tr className="border-t-2 border-slate-900 text-slate-950 font-black text-sm">
                <td className="py-3">Total Amount Paid (via Cashfree UPI)</td>
                <td className="py-3 text-right">{formatCurrency(booking.total_amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Handover Guidelines */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Pickup Checklist & Handover Rules:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
            <li>Carry your <strong>Original Driving License and Aadhaar Card</strong> at pickup.</li>
            <li>Inspect the car exterior and record a 30-second walkaround video before driving.</li>
            <li>Return the car with the same fuel level as received.</li>
            <li>Security deposit will be credited back within 24 hours after return inspection.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF Receipt</span>
            </button>

            <a
              href={createWhatsAppUrl(booking.owner?.phone || '+91 98490 12345', generateHostBookingWhatsAppMessage(booking))}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-[#25D366]/25"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          <Link
            href="/customer/dashboard"
            className="px-6 py-2.5 rounded-xl bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#D71920]/30"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
