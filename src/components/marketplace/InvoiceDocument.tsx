'use client';

import React from 'react';
import { Booking } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { ShieldCheck, CheckCircle2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import Logo from '@/components/common/Logo';

interface InvoiceDocumentProps {
  booking: Booking;
  invoiceNumber?: string;
  invoiceDate?: string;
}

export default function InvoiceDocument({
  booking,
  invoiceNumber,
  invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
}: InvoiceDocumentProps) {
  const invNumber = invoiceNumber || `INV-2026-${booking.booking_reference?.replace(/\D/g, '').slice(-4) || '1001'}`;

  // Tax calculations (GST 5% = CGST 2.5% + SGST 2.5% under SAC 996601 for transport rental)
  const taxableRental = booking.base_rental_amount || 0;
  const deliveryCharge = booking.delivery_amount || 0;
  const driverAllowance = booking.driver_allowance_amount || 0;
  const discountAmount = booking.discount_amount || 0;
  const taxableSubtotal = Math.max(0, taxableRental + deliveryCharge + driverAllowance - discountAmount);

  // 5% GST split
  const cgstAmount = Math.round(taxableSubtotal * 0.025);
  const sgstAmount = Math.round(taxableSubtotal * 0.025);
  const totalGst = cgstAmount + sgstAmount;
  const refundableDeposit = booking.security_deposit_amount || 2000;
  const grandTotal = taxableSubtotal + totalGst + refundableDeposit;

  // Verification URL for QR code simulation
  const verificationUrl = `https://rentvora.in/customer/invoice/${booking.id}`;

  return (
    <div className="bg-white text-slate-900 font-montserrat p-6 sm:p-10 max-w-4xl mx-auto border border-slate-200 rounded-3xl shadow-sm print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full">
      
      {/* 1. Official Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b-2 border-slate-900">
        <div>
          <Logo size="md" />
          <div className="mt-2 text-xs text-slate-600 space-y-0.5">
            <div className="font-bold text-slate-900">RENTVORA SELF-DRIVE CAR RENTALS PRIVATE LIMITED</div>
            <div>Korrapadu Road, Near RTC Bus Stand Hub, Proddatur, AP - 516360</div>
            <div>GSTIN: <span className="font-mono font-bold text-slate-900">37AAECP1298K1Z3</span> &bull; State Code: 37 (Andhra Pradesh)</div>
            <div>SAC Code: <span className="font-mono font-bold">996601</span> (Passenger Car Rental Services)</div>
          </div>
        </div>

        <div className="text-left sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200 print:bg-transparent print:border-none">
          <div className="inline-block px-3 py-1 bg-[#D71920] text-white text-xs font-black rounded-full uppercase tracking-wider mb-2">
            TAX INVOICE &bull; TRIP RECEIPT
          </div>
          <div className="text-xs space-y-1">
            <div><span className="text-slate-500">Invoice No:</span> <strong className="font-mono text-slate-900">{invNumber}</strong></div>
            <div><span className="text-slate-500">Invoice Date:</span> <strong className="text-slate-900">{invoiceDate}</strong></div>
            <div><span className="text-slate-500">Booking Ref:</span> <strong className="font-mono text-[#D71920]">{booking.booking_reference}</strong></div>
            <div><span className="text-slate-500">Payment Status:</span> <span className="inline-flex items-center gap-1 text-emerald-700 font-black text-xs uppercase">&#10003; PAID</span></div>
          </div>
        </div>
      </div>

      {/* 2. Customer & Vehicle Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs">
        
        {/* Customer / Billed To */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
          <div className="font-black text-slate-900 uppercase tracking-wider text-[11px] text-[#D71920] flex items-center justify-between">
            <span>BILLED TO (CUSTOMER)</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">KYC VERIFIED</span>
          </div>
          <div className="font-extrabold text-sm text-slate-950">{booking.customer?.full_name || 'Valued Driver'}</div>
          <div><span className="text-slate-500">Phone:</span> <strong className="text-slate-900">{booking.customer?.phone || '+91 78938 17322'}</strong></div>
          <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{booking.customer?.email || 'customer@rentvora.in'}</strong></div>
          <div><span className="text-slate-500">Pickup Mode:</span> <strong>{booking.delivery_requested ? `Doorstep Delivery (${booking.delivery_address || 'Proddatur'})` : 'Hub Self-Pickup'}</strong></div>
        </div>

        {/* Vehicle & Trip Itinerary */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
          <div className="font-black text-slate-900 uppercase tracking-wider text-[11px] text-[#D71920]">
            VEHICLE &amp; ITINERARY DETAILS
          </div>
          <div className="font-extrabold text-sm text-slate-950">{booking.car?.brand} {booking.car?.model} ({booking.car?.year || 2023})</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-700">
            <div>Reg: <strong className="font-mono uppercase">{booking.car?.registration_number || 'AP04XX2026'}</strong></div>
            <div>Fuel: <strong className="capitalize">{booking.car?.fuel_type || 'Petrol'}</strong></div>
            <div>Transmission: <strong className="capitalize">{booking.car?.transmission || 'Manual'}</strong></div>
            <div>Rental Mode: <strong className="capitalize">{booking.rental_type === 'with_driver' ? 'Chauffeur Driven' : 'Self-Drive'}</strong></div>
          </div>
          <div className="pt-1 text-[11px] border-t border-slate-200 text-slate-600">
            <div><strong>Pickup:</strong> {formatDateTime(booking.start_time)} ({booking.pickup_location?.area_locality || 'RTC Bus Stand Hub, Proddatur'})</div>
            <div><strong>Return:</strong> {formatDateTime(booking.end_time)}</div>
          </div>
        </div>

      </div>

      {/* 3. Itemized Tax Invoice Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden my-6">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3">#</th>
              <th className="p-3">Service Description</th>
              <th className="p-3 text-center">SAC Code</th>
              <th className="p-3 text-right">Qty / Duration</th>
              <th className="p-3 text-right">Taxable Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            
            {/* Base Rental */}
            <tr>
              <td className="p-3 font-mono text-slate-500">1</td>
              <td className="p-3">
                <div className="font-extrabold text-slate-900">Self-Drive Car Rental Service</div>
                <div className="text-[11px] text-slate-500">{booking.car?.brand} {booking.car?.model} &bull; Unlimited Sanitization</div>
              </td>
              <td className="p-3 text-center font-mono text-slate-600">996601</td>
              <td className="p-3 text-right text-slate-700">{booking.duration_hours ? `${Math.round(booking.duration_hours / 24) || 1} Day(s)` : '1 Trip'}</td>
              <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(taxableRental)}</td>
            </tr>

            {/* Delivery Fee if any */}
            {deliveryCharge > 0 && (
              <tr>
                <td className="p-3 font-mono text-slate-500">2</td>
                <td className="p-3">
                  <div className="font-extrabold text-slate-900">Doorstep Vehicle Handover &amp; Return</div>
                  <div className="text-[11px] text-slate-500">{booking.delivery_address || 'Proddatur Locality'}</div>
                </td>
                <td className="p-3 text-center font-mono text-slate-600">996601</td>
                <td className="p-3 text-right text-slate-700">1 Service</td>
                <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(deliveryCharge)}</td>
              </tr>
            )}

            {/* Driver Allowance if any */}
            {driverAllowance > 0 && (
              <tr>
                <td className="p-3 font-mono text-slate-500">3</td>
                <td className="p-3">
                  <div className="font-extrabold text-slate-900">Professional Chauffeur Driver Service</div>
                  <div className="text-[11px] text-slate-500">Experienced Local Driver Allowance</div>
                </td>
                <td className="p-3 text-center font-mono text-slate-600">996601</td>
                <td className="p-3 text-right text-slate-700">1 Chauffeur</td>
                <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(driverAllowance)}</td>
              </tr>
            )}

            {/* Discount if any */}
            {discountAmount > 0 && (
              <tr className="bg-emerald-50/50">
                <td className="p-3 font-mono text-emerald-700">-</td>
                <td className="p-3 text-emerald-800 font-bold">Promotional Discount Applied</td>
                <td className="p-3 text-center font-mono text-emerald-700">-</td>
                <td className="p-3 text-right text-emerald-800">1 Coupon</td>
                <td className="p-3 text-right font-bold text-emerald-800">-{formatCurrency(discountAmount)}</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* 4. GST Breakdown & Final Totals */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 text-xs">
        
        {/* Left: Security Deposit & Refund Notice */}
        <div className="md:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
            <div className="font-black text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>100% REFUNDABLE SECURITY DEPOSIT: {formatCurrency(refundableDeposit)}</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              The security deposit is exempt from GST as per Indian Tax laws. It is <strong>100% refunded directly to your original UPI/bank account</strong> within 24 hours of vehicle return inspection.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Payment Details</div>
            <div>Payment Gateway: <strong>Cashfree Payment Gateway (India)</strong></div>
            <div>Payment Mode: <strong>UPI / NetBanking / Debit Card (Instant)</strong></div>
            <div>Transaction Status: <strong className="text-emerald-700">COMPLETED &bull; VERIFIED</strong></div>
          </div>
        </div>

        {/* Right: Math Summary & Taxes */}
        <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-600">Taxable Subtotal:</span>
            <span className="font-bold text-slate-900">{formatCurrency(taxableSubtotal)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
            <span>CGST (2.5%):</span>
            <span className="font-bold text-slate-900">{formatCurrency(cgstAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
            <span>SGST (2.5%):</span>
            <span className="font-bold text-slate-900">{formatCurrency(sgstAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 text-slate-700 font-semibold">
            <span>Total GST (5.0%):</span>
            <span className="font-bold text-slate-900">{formatCurrency(totalGst)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200 text-amber-900 font-semibold">
            <span>Refundable Deposit:</span>
            <span className="font-bold text-amber-950">{formatCurrency(refundableDeposit)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 text-sm font-black text-slate-950 bg-white p-2.5 rounded-xl border border-slate-300">
            <span>TOTAL AMOUNT PAID:</span>
            <span className="text-base text-[#D71920]">{formatCurrency(booking.total_amount || grandTotal)}</span>
          </div>
        </div>

      </div>

      {/* 5. Sign-off, QR Seal & Terms */}
      <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[10px] text-slate-500">
        
        {/* Terms Summary */}
        <div className="space-y-1 max-w-md">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Rental Terms &amp; Conditions</div>
          <ul className="list-disc pl-3.5 space-y-0.5 leading-normal text-slate-600">
            <li>Speed limit is capped at 100 km/h on national highways as per AP Road Safety guidelines.</li>
            <li>Fuel is provided level-to-level (customer returns the vehicle with the same fuel level as received).</li>
            <li>In case of emergency or mechanical assistance, call our 24/7 hotline at <strong>+91 78938 17322</strong>.</li>
            <li>This is a computer-generated tax invoice and requires no physical signature under Indian IT Act.</li>
          </ul>
        </div>

        {/* Authorized Digital Seal */}
        <div className="text-center sm:text-right shrink-0 space-y-2">
          <div className="inline-block p-3 rounded-2xl border-2 border-emerald-600 text-emerald-800 font-black text-center text-[10px] bg-emerald-50/50">
            <div>RENTVORA CAR RENTALS AP</div>
            <div className="text-[8px] text-emerald-600">DIGITALLY VERIFIED TAX RECEIPT</div>
            <div className="text-[9px] font-mono text-emerald-950 mt-1">{invNumber}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">
            Authorized Signatory &bull; RENTVORA Operations
          </div>
        </div>

      </div>

      {/* 6. Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>🌐 <strong className="text-slate-600">rentvora.in</strong></span>
          <span>📧 <strong className="text-slate-600">support@rentvora.in</strong></span>
          <span>📞 <strong className="text-slate-600">+91 78938 17322</strong></span>
        </div>
        <div>Proddatur &bull; Kadapa &bull; Tirupati &bull; Andhra Pradesh</div>
      </div>

    </div>
  );
}
