'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Car, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Star, 
  FileText, 
  X, 
  CheckCircle,
  MapPin,
  MessageCircle,
  Lock
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { createWhatsAppUrl, generateHostBookingWhatsAppMessage } from '@/lib/utils/whatsapp';
import { Booking } from '@/types';

export default function CustomerDashboardPage() {
  const { bookings, currentUser, isAuthLoaded, logout, cancelBooking, addReview } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plans');
  const [cancelling, setCancelling] = useState(false);

  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const customerBookings = bookings.filter(b => b.customer_id === currentUser?.id || b.customer?.email === currentUser?.email);

  const upcomingBookings = customerBookings.filter(b => ['confirmed', 'active', 'pending_payment'].includes(b.status));
  const completedBookings = customerBookings.filter(b => b.status === 'completed');
  const cancelledBookings = customerBookings.filter(b => ['cancelled_by_customer', 'cancelled_by_owner', 'rejected', 'refunded'].includes(b.status));

  const handleCancelSubmit = async () => {
    if (!cancelModalBooking) return;
    try {
      setCancelling(true);
      await cancelBooking(cancelModalBooking.id, cancelReason, 'customer');
      setCancelModalBooking(null);
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewModalBooking) return;
    try {
      setSubmittingReview(true);
      await addReview({
        bookingId: reviewModalBooking.id,
        carId: reviewModalBooking.car_id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewModalBooking(null);
      setReviewComment('');
    } finally {
      setSubmittingReview(false);
    }
  };

  
  if (isAuthLoaded && !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 font-montserrat">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#D71920] border border-red-200 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Sign In to View Your Bookings</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please log in with your mobile number or email to access your active reservations, digital receipts, and Driving License verification.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/login?redirect=/customer/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-extrabold text-xs shadow-lg shadow-[#D71920]/25 transition"
          >
            Sign In with Phone / Email →
          </Link>
          <Link
            href="/cars"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Browse Fleet First
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D71920] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#D71920]/30">
            {currentUser?.full_name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{currentUser?.full_name || 'Pavan Kalyan M'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-bold">Verified Customer</span>
            </div>
            <p className="text-xs text-slate-500">{currentUser?.email} • {currentUser?.phone}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/customer/profile"
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
          >
            <ShieldCheck className="w-4 h-4 text-[#D71920]" />
            <span>KYC & License</span>
          </Link>

          <Link
            href="/cars"
            className="px-5 py-3 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-[#D71920]/25"
          >
            <Car className="w-4 h-4" />
            <span>Book Another Car</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 rounded-xl transition ${activeTab === 'upcoming' ? 'bg-[#D71920] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2.5 rounded-xl transition ${activeTab === 'completed' ? 'bg-[#D71920] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Completed ({completedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2.5 rounded-xl transition ${activeTab === 'cancelled' ? 'bg-[#D71920] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Cancelled ({cancelledBookings.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-500">
              No upcoming trips. <Link href="/cars" className="text-[#D71920] font-bold ml-1">Find Cars in Proddatur</Link>
            </div>
          ) : (
            upcomingBookings.map(b => (
              <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 text-xs">
                  <span className="font-black bg-slate-100 px-3 py-1 rounded-lg">{b.booking_reference}</span>
                  <span className="font-bold text-[#b8141a] bg-red-50 px-2.5 py-0.5 rounded-full uppercase">{b.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-3">
                    <img src={b.car?.images[0]?.image_url} alt="car" className="w-full h-32 rounded-2xl object-cover bg-slate-100" />
                  </div>
                  <div className="md:col-span-5 space-y-2 text-xs">
                    <h3 className="font-black text-base text-slate-900">{b.car?.brand} {b.car?.model}</h3>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>{formatDateTime(b.start_time)} → {formatDateTime(b.end_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>Pickup: {b.pickup_location?.area_locality}</span>
                    </div>
                  </div>
                  <div className="md:col-span-4 flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Amount</span>
                      <span className="text-xl font-black text-slate-950">{formatCurrency(b.total_amount)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <a
                        href={createWhatsAppUrl(b.owner?.phone || '+91 78938 17322', generateHostBookingWhatsAppMessage(b))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Host</span>
                      </a>
                      <Link href={`/booking-confirmation/${b.id}`} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </Link>
                      <button onClick={() => setCancelModalBooking(b)} className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'completed' && completedBookings.map(b => (
          <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 flex justify-between items-center text-xs">
            <div>
              <h4 className="font-bold text-slate-900">{b.car?.brand} {b.car?.model}</h4>
              <p className="text-slate-500">{formatDateTime(b.start_time)}</p>
            </div>
            <button onClick={() => setReviewModalBooking(b)} className="px-4 py-2 rounded-xl bg-[#D71920] text-white font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
          </div>
        ))}

        {activeTab === 'cancelled' && cancelledBookings.map(b => (
          <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between font-bold">
              <span>{b.booking_reference}</span>
              <span className="text-rose-700 uppercase">{b.status}</span>
            </div>
            <p className="text-slate-500">Refund: {formatCurrency(b.refund_amount || 0)}</p>
          </div>
        ))}
      </div>

      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between font-bold text-sm">
              <span>Cancel Booking {cancelModalBooking.booking_reference}</span>
              <button onClick={() => setCancelModalBooking(null)}><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-600">Free cancellation if &gt;24h before trip start. 20% convenience fee if within 24h.</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setCancelModalBooking(null)} className="flex-1 py-2 rounded-xl border font-bold">Keep</button>
              <button onClick={handleCancelSubmit} disabled={cancelling} className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold">
                {cancelling ? 'Cancelling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between font-bold text-sm">
              <span>Review Trip</span>
              <button onClick={() => setReviewModalBooking(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setReviewRating(s)}>
                  <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <textarea rows={3} placeholder="Share feedback..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-xl" />
            <button onClick={handleReviewSubmit} disabled={submittingReview} className="w-full py-2.5 rounded-xl bg-[#D71920] text-white font-bold">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

