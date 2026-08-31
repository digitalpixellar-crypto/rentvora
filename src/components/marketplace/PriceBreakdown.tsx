import React from 'react';
import { BookingQuote } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { ShieldCheck, Info, UserCheck } from 'lucide-react';

export default function PriceBreakdown({ quote }: { quote: BookingQuote }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3.5 font-montserrat">
      <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center justify-between">
        <span>Transparent Fare Breakdown</span>
        <span className="text-xs font-normal text-slate-500">Duration: {quote.duration_hours} hrs ({quote.duration_days} days)</span>
      </div>

      <div className="space-y-2 text-xs text-slate-600">
        <div className="flex justify-between items-center">
          <span>Base Vehicle Rental</span>
          <span className="font-semibold text-slate-900">{formatCurrency(quote.base_rental_amount)}</span>
        </div>

        {quote.driver_allowance_amount > 0 && (
          <div className="flex justify-between items-center text-[#D71920] font-semibold bg-red-50/70 p-2 rounded-xl border border-red-200">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#D71920]" />
              <span>Chauffeur / Driver Allowance</span>
            </span>
            <span className="font-black">{formatCurrency(quote.driver_allowance_amount)}</span>
          </div>
        )}

        {quote.delivery_amount > 0 && (
          <div className="flex justify-between items-center text-amber-700">
            <span>Doorstep Delivery Charge</span>
            <span className="font-semibold">{formatCurrency(quote.delivery_amount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Taxes & GST (5%)</span>
          <span className="font-semibold text-slate-900">{formatCurrency(quote.taxes_fees_amount)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 text-red-700 font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Refundable Security Deposit</span>
          </span>
          <span className="font-black">{formatCurrency(quote.security_deposit_amount)}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-300 flex items-center justify-between">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Total Payable Now</span>
          <span className="text-[11px] text-slate-400">(Includes {formatCurrency(quote.refundable_deposit)} refundable deposit)</span>
        </div>
        <div className="text-xl font-black text-slate-950">
          {formatCurrency(quote.total_amount)}
        </div>
      </div>

      <div className="bg-red-50 rounded-xl p-2.5 text-[11px] text-red-900 border border-red-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
        <span>No hidden fees. Full security deposit refunded to your account within 24h after vehicle inspection.</span>
      </div>
    </div>
  );
}
