'use client';

import React, { useState, useMemo } from 'react';
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
  ArrowLeft,
  Tag,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { validateAndApplyCoupon, ACTIVE_PROMO_CODES, CouponValidationResult } from '@/lib/pricing/coupons';
import { calculateServerQuote } from '@/lib/pricing/calculator';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const { bookings, confirmPayment } = useMarketplace();
  const booking = bookings.find(b => b.id === bookingId);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Promo Code State
  const [inputCoupon, setInputCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const durationDays = useMemo(() => {
    if (!booking) return 1;
    return Math.max(1, Math.ceil(booking.duration_hours / 24));
  }, [booking]);

  // Recalculate dynamic quote with coupon
  const quote = useMemo(() => {
    if (!booking) return null;
    try {
      return calculateServerQuote({
        pricePerDay: booking.car?.price_per_day || 2000,
        pricePerHour: booking.car?.price_per_hour,
        securityDeposit: booking.security_deposit_amount,
        deliveryAvailable: booking.delivery_requested,
        deliveryCharges: booking.delivery_amount,
        deliveryRequested: booking.delivery_requested,
        withDriver: booking.rental_type === 'with_driver',
        discountAmount: appliedCoupon?.discountAmount || 0,
        couponCode: appliedCoupon?.code,
        startTime: booking.start_time,
        endTime: booking.end_time,
      });
    } catch {
      return null;
    }
  }, [booking, appliedCoupon]);

  const handleApplyCoupon = (codeToApply?: string) => {
    setCouponError(null);
    const code = codeToApply || inputCoupon;
    if (!code.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const result = validateAndApplyCoupon(
      code,
      booking?.base_rental_amount || 2000,
      durationDays
    );

    if (result.isValid) {
      setAppliedCoupon(result);
      setInputCoupon(result.code);
    } else {
      setCouponError(result.error || 'Invalid promo code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setInputCoupon('');
    setCouponError(null);
  };

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-montserrat">
        <h2 className="text-2xl font-bold text-slate-900">Booking Not Found</h2>
        <p className="text-sm text-slate-500">This reservation session could not be found or has expired.</p>
        <Link href="/cars" className="inline-block px-4 py-2 rounded-xl bg-[#D71920] text-white text-xs font-bold">
          Return to Cars Marketplace
        </Link>
      </div>
    );
  }

  const payableTotal = quote ? quote.total_amount : booking.total_amount;

  const handlePayNow = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Simulate Cashfree PG checkout & server-side verification
      await new Promise(resolve => setTimeout(resolve, 1400));
      await confirmPayment(booking.id, paymentMethod);

      // Trigger Resend email invoice delivery in background
      try {
        const carTitle = (booking.car?.brand || 'Car') + ' ' + (booking.car?.model || '');
        fetch('/api/emails/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: booking.customer?.email || 'pavan.kalyan@gmail.com',
            customerName: booking.customer?.full_name || 'Pavan Kalyan',
            carName: carTitle,
            bookingRef: booking.booking_reference,
            pickupPoint: booking.pickup_location?.area_locality,
            startTime: formatDateTime(booking.start_time),
            endTime: formatDateTime(booking.end_time),
            totalAmount: payableTotal,
            refundableDeposit: booking.security_deposit_amount,
            rentalType: booking.rental_type,
          }),
        }).catch(err => console.warn('Email dispatch background notice:', err));
      } catch {}

      router.push('/booking-confirmation/' + booking.id);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-montserrat">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link href={'/cars/' + (booking.car?.slug || '')} className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#D71920] transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Car Details</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#b8141a] bg-red-50 px-3 py-1 rounded-full border border-red-200 shadow-2xs">
          <Lock className="w-3.5 h-3.5" />
          <span>Cashfree 256-Bit Secure PG</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Payment Options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Complete Payment</h1>
              <p className="text-xs text-slate-500 mt-1">Select your preferred payment method to confirm your reservation in Proddatur.</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Payment Method
              </label>

              {/* UPI Option */}
              <div 
                onClick={() => setPaymentMethod('UPI')}
                className={'p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ' + (paymentMethod === 'UPI' ? 'border-[#D71920] bg-red-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D71920] flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Instant UPI (Recommended)</div>
                    <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                  </div>
                </div>
                <div className={'w-4 h-4 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'UPI' ? 'border-[#D71920]' : 'border-slate-300')}>
                  {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-[#D71920]" />}
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                  <label className="block text-xs font-bold text-slate-700">Enter Virtual Payment Address (VPA / UPI ID)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okaxis"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['@okaxis', '@ybl', '@paytm', '@ibl'].map(handle => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => setUpiId((upiId.split('@')[0] || 'pavan.kalyan') + handle)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-[#D71920]"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Debit/Credit Card Option */}
              <div 
                onClick={() => setPaymentMethod('CARD')}
                className={'p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ' + (paymentMethod === 'CARD' ? 'border-[#D71920] bg-red-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Credit / Debit Card</div>
                    <div className="text-xs text-slate-500">Visa, Mastercard, RuPay, Maestro</div>
                  </div>
                </div>
                <div className={'w-4 h-4 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'CARD' ? 'border-[#D71920]' : 'border-slate-300')}>
                  {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-[#D71920]" />}
                </div>
              </div>

              {/* NetBanking Option */}
              <div 
                onClick={() => setPaymentMethod('NETBANKING')}
                className={'p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ' + (paymentMethod === 'NETBANKING' ? 'border-[#D71920] bg-red-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">NetBanking</div>
                    <div className="text-xs text-slate-500">SBI, HDFC, ICICI, Andhra Pragathi Grameena Bank</div>
                  </div>
                </div>
                <div className={'w-4 h-4 rounded-full border-2 flex items-center justify-center ' + (paymentMethod === 'NETBANKING' ? 'border-[#D71920]' : 'border-slate-300')}>
                  {paymentMethod === 'NETBANKING' && <div className="w-2 h-2 rounded-full bg-[#D71920]" />}
                </div>
              </div>

            </div>

            {/* Error feedback */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-60 text-white font-extrabold text-sm shadow-xl shadow-[#D71920]/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Processing Cashfree Payment...' : ('Pay ' + formatCurrency(payableTotal) + ' Securely')}</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" /> 100% Refund Guarantee</span>
              <span>•</span>
              <span>Encrypted Transaction</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon Code Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D71920]" />
              <h3 className="font-extrabold text-sm text-slate-900">Have a Promo Coupon?</h3>
            </div>

            {!appliedCoupon ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. FIRSTDRIVE)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black uppercase text-slate-900 outline-none focus:border-[#D71920]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-slate-800 text-white font-bold text-xs transition"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}

                {/* Quick Coupon Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Available Offers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ACTIVE_PROMO_CODES.slice(0, 2).map((cpn) => (
                      <button
                        key={cpn.code}
                        type="button"
                        onClick={() => handleApplyCoupon(cpn.code)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] font-bold text-[#D71920] transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{cpn.code} ({cpn.type === 'flat' ? ('₹' + cpn.value + ' OFF') : (cpn.value + '% OFF')})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied!</span>
                  </div>
                  <div className="text-[11px] text-emerald-700">You save {formatCurrency(appliedCoupon.discountAmount)} on this rental.</div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Reservation Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
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
                <div className="text-[11px] font-bold text-[#D71920] capitalize">
                  {booking.rental_type === 'with_driver' ? '👔 With Chauffeur' : '🚗 Self-Drive'} • {booking.car?.transmission}
                </div>
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
                <span className="font-semibold text-slate-800">{booking.duration_hours} hours ({durationDays} days)</span>
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

              {appliedCoupon && appliedCoupon.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon ({appliedCoupon.code})</span>
                  </span>
                  <span>-{formatCurrency(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              {booking.rental_type === 'with_driver' && (
                <div className="flex justify-between text-[#D71920] font-semibold">
                  <span>Chauffeur / Driver Allowance</span>
                  <span className="font-bold">+{formatCurrency(durationDays * 500)}</span>
                </div>
              )}

              {booking.delivery_amount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Doorstep Delivery Charge</span>
                  <span className="font-semibold">+{formatCurrency(booking.delivery_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(quote?.taxes_fees_amount || booking.taxes_fees_amount)}</span>
              </div>
              <div className="flex justify-between text-[#b8141a] font-medium pt-2 border-t border-slate-100">
                <span>Refundable Security Deposit</span>
                <span className="font-bold">{formatCurrency(booking.security_deposit_amount)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-black text-sm text-slate-900 uppercase">Total Payable</span>
              <span className="text-2xl font-black text-slate-950">{formatCurrency(payableTotal)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
