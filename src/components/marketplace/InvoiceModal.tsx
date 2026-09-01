'use client';

import React from 'react';
import { Booking } from '@/types';
import { X, Printer, Download, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import InvoiceDocument from './InvoiceDocument';

interface InvoiceModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export default function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
  if (!booking) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleWhatsAppShare = () => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static">
      
      {/* Container */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Action Header (Hidden during browser print) */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden font-montserrat">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Close"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="font-black text-sm text-white">GST Tax Invoice &amp; Trip Receipt</h3>
              <p className="text-[11px] text-slate-400 font-mono">Ref: {booking.booking_reference}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#D71920]/25 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF / Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Invoice Document Body */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-100/60 print:p-0 print:bg-white print:overflow-visible flex-1">
          <InvoiceDocument booking={booking} />
        </div>

        {/* Modal Action Footer (Hidden during print) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium print:hidden font-montserrat flex items-center justify-between px-6">
          <span>Click <strong>"Download PDF / Print"</strong> and select <em>"Save as PDF"</em> to keep a digital copy for your records.</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-950 underline"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
