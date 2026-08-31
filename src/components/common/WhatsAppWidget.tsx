'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Phone, Car, MapPin, Send } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';
import { createWhatsAppUrl, generateCustomerSupportWhatsAppMessage } from '@/lib/utils/whatsapp';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const supportPhone = APP_CONFIG.supportPhone || '+91 98490 12345';

  const handleQuickChat = (topic: string) => {
    const message = generateCustomerSupportWhatsAppMessage(topic);
    const url = createWhatsAppUrl(supportPhone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-montserrat">
      {/* Popover Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header in WhatsApp Emerald Green */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">RENTVORA Proddatur</h4>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Online • Instant Reply</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-50/50">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed shadow-xs">
              Namaste! 🙏 Welcome to <strong>RENTVORA Car Rental</strong>. How can we help you travel across Proddatur & Andhra Pradesh today?
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Inquiries:
              </div>

              <button
                type="button"
                onClick={() => handleQuickChat('Car Availability & Rates')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-xs font-semibold text-slate-800 transition flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Check Available Cars Today</span>
                </span>
                <Send className="w-3 h-3 text-slate-400 group-hover:text-[#25D366]" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickChat('Doorstep Delivery in Proddatur')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-xs font-semibold text-slate-800 transition flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Book Doorstep Delivery</span>
                </span>
                <Send className="w-3 h-3 text-slate-400 group-hover:text-[#25D366]" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickChat('Car Host Partner Onboarding')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-xs font-semibold text-slate-800 transition flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>List my car as Host</span>
                </span>
                <Send className="w-3 h-3 text-slate-400 group-hover:text-[#25D366]" />
              </button>
            </div>
          </div>

          {/* Footer Direct Call Option */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Direct Support Line:</span>
            <a
              href={`tel:${supportPhone}`}
              className="font-bold text-[#D71920] hover:underline"
            >
              {supportPhone}
            </a>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:shadow-emerald-500/30 group"
        aria-label="Open WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">Chat with Support</span>
      </button>
    </div>
  );
}
