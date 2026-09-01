'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMarketplace } from '@/lib/mock-data/client-store';
import InvoiceDocument from '@/components/marketplace/InvoiceDocument';
import { Printer, ArrowLeft, Download, MessageCircle, AlertCircle } from 'lucide-react';

export default function StandaloneInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { bookings } = useMarketplace();
  const booking = bookings.find(b => b.id === bookingId || b.booking_reference === bookingId);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleWhatsAppShare = () => {
    if (!booking) return;
    const text = encodeURIComponent(
      `📄 *RENTVORA Official Tax Invoice & Trip Receipt*\n\n` +
      `🚗 *Vehicle:* ${booking.car?.brand} ${booking.car?.model}\n` +
      `📋 *Booking Reference:* ${booking.booking_reference}\n` +
      `💰 *Total Amount:* Rs. ${booking.total_amount?.toLocaleString('en-IN')}\n` +
      `📍 *Pickup:* ${booking.pickup_location?.area_locality || 'Proddatur Hub'}\n\n` +
      `View Full Tax Invoice: https://rentvora.in/customer/invoice/${booking.id}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-montserrat">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-[#D71920]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-950">Invoice Not Found</h2>
        <p className="text-xs text-slate-500">
          The booking reference <strong>{bookingId}</strong> could not be located in our records.
        </p>
        <div className="pt-2">
          <Link
            href="/customer/dashboard"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#D71920] text-white text-xs font-bold shadow-md shadow-[#D71920]/25"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8 font-montserrat print:p-0 print:bg-white">
      
      {/* Top Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/customer/dashboard"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Receipt</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#D71920]/25 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Invoice Document Component */}
      <InvoiceDocument booking={booking} />

    </div>
  );
}
