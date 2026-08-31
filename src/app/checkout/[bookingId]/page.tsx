'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  Car as CarIcon,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const { bookings, confirmPayment } = useMarketplace();
  const booking = bookings.find(b => b.id === bookingId);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('pavan.kalyan@okaxis');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Booking Not Found</h2>
        <p className="text-sm text-slate-500">This reservation session could not be found or has expired.</p>
        <Link href="/cars" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
          Return to Cars Marketplace
        </Link>
      </div>
    );
  }

  const handlePayNow = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Simulate Cashfree PG checkout & server-side verification
      await new Promise(resolve => setTimeout(resolve, 1400));
      await confirmPayment(booking.id, paymentMethod);

      router.push(`/booking-confirmation/${booking.id}`);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link href={`/cars/${booking.car?.slug || ''}`} className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Car Details</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>Cashfree 256-Bit Secure PG</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Payment Options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Complete Payment</h1>
              <p className="text-xs text-slate-500 mt-1">Select your preferred payment method to confirm your reservation.</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Payment Method
              </label>

              {/* UPI Option */}
              <div 
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">UPI Instant Payment (Zero Fee)</div>
                    <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM UPI</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-emerald-600' : 'border-slate-300'}`}>
                  {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                </div>
              </div>

              {/* UPI Input if selected */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@oksbi"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
                  />
                  <div className="text-[11px] text-slate-400">You will receive a payment request notification on your UPI app.</div>
                </div>
              )}

              {/* Cards Option */}
              <div 
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${paymentMethod === 'CARD' ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Credit / Debit Card</div>
                    <div className="text-xs text-slate-500">Visa, MasterCard, RuPay, Maestro</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-emerald-600' : 'border-slate-300'}`}>
                  {paymentMethod === 'CARD' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                </div>
              </div>

              {/* NetBanking Option */}
              <div 
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${paymentMethod === 'NETBANKING' ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Net Banking</div>
                    <div className="text-xs text-slate-500">SBI, HDFC, ICICI, Axis, Andhra Bank</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'NETBANKING' ? 'border-emerald-600' : 'border-slate-300'}`}>
                  {paymentMethod === 'NETBANKING' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Processing Cashfree Payment...' : `Pay ${formatCurrency(booking.total_amount)} Securely`}</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Refund Guarantee</span>
              <span>•</span>
              <span>Encrypted Transaction</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              Reservation Summary
            </h3>

            {/* Vehicle preview */}
            <div className="flex gap-4 items-center">
              <img
                src={booking.car?.images[0]?.image_url}
                alt={booking.car?.model}
                className="w-20 h-16 rounded-2xl object-cover bg-slate-100 shrink-0"
              />
              <div>
                <div className="font-bold text-sm text-slate-900">{booking.car?.brand} {booking.car?.model}</div>
                <div className="text-xs text-slate-500">Reg: {booking.car?.registration_number}</div>
                <div className="text-[11px] font-bold text-emerald-600 capitalize">{booking.car?.category.replace('_', ' ')} • {booking.car?.transmission}</div>
              </div>
            </div>

            {/* Trip Timings */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between items-start">
                <span className="text-slate-400">Pickup:</span>
                <span className="font-semibold text-slate-800 text-right">{formatDateTime(booking.start_time)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400">Return:</span>
                <span className="font-semibold text-slate-800 text-right">{formatDateTime(booking.end_time)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-slate-800">{booking.duration_hours} hours ({Math.ceil(booking.duration_hours / 24)} days)</span>
              </div>
              <div className="flex justify-between items-start pt-2 border-t border-slate-200">
                <span className="text-slate-400">Pickup Point:</span>
                <span className="font-semibold text-slate-800 text-right">{booking.pickup_location?.area_locality} ({booking.pickup_location?.pickup_point_name})</span>
              </div>
              {booking.delivery_requested && (
                <div className="flex justify-between items-start text-amber-700">
                  <span>Doorstep Delivery:</span>
                  <span className="font-semibold text-right">{booking.delivery_address}</span>
                </div>
              )}
            </div>

            {/* Itemized Price */}
            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <div className="flex justify-between">
                <span>Base Rental Fare</span>
                <span className="font-semibold text-slate-900">{formatCurrency(booking.base_rental_amount)}</span>
              </div>
              {booking.delivery_amount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Doorstep Delivery Charge</span>
                  <span className="font-semibold">{formatCurrency(booking.delivery_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(booking.taxes_fees_amount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium pt-2 border-t border-slate-100">
                <span>Refundable Security Deposit</span>
                <span className="font-bold">{formatCurrency(booking.security_deposit_amount)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-black text-sm text-slate-900 uppercase">Total Amount</span>
              <span className="text-2xl font-black text-slate-950">{formatCurrency(booking.total_amount)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
