'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Car as CarIcon, 
  Fuel, 
  Gauge, 
  Users, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Clock, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  ChevronRight, 
  Info,
  Building,
  Lock
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { calculateServerQuote } from '@/lib/pricing/calculator';
import PriceBreakdown from '@/components/marketplace/PriceBreakdown';

export default function CarDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { cars, locations, reviews, getCarBySlug, checkAvailability, createBooking, commissionRate } = useMarketplace();
  const car = getCarBySlug(slug);

  // Active Image Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Widget State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startDateStr = tomorrow.toISOString().split('T')[0];

  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 3);
  const returnDateStr = returnDate.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(startDateStr);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState(returnDateStr);
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [deliveryRequested,
        rental_type: rentalType,
        withDriver: rentalType === "with_driver", setDeliveryRequested] = useState(false);
  const [rentalType, setRentalType] = useState<'self_drive' | 'with_driver'>('self_drive');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedPickupLocationId, setSelectedPickupLocationId] = useState(car?.location_id || locations[0]?.id || '');

  // Customer contact state for quick booking
  const [customerName, setCustomerName] = useState('Pavan Kalyan M');
  const [customerEmail, setCustomerEmail] = useState('pavan.kalyan@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+91 91234 56780');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // ISO Timestamps in IST
  const startIsoString = useMemo(() => `${pickupDate}T${pickupTime}:00`, [pickupDate, pickupTime]);
  const endIsoString = useMemo(() => `${dropoffDate}T${dropoffTime}:00`, [dropoffDate, dropoffTime]);

  // Server Quote Calculation
  const quote = useMemo(() => {
    if (!car) return null;
    try {
      return calculateServerQuote({
        pricePerDay: car.price_per_day,
        pricePerHour: car.price_per_hour,
        securityDeposit: car.security_deposit,
        deliveryAvailable: car.delivery_available,
        deliveryCharges: car.delivery_charges,
        deliveryRequested: deliveryRequested,
        startTime: startIsoString,
        endTime: endIsoString,
        customCommissionRate: commissionRate,
      });
    } catch {
      return null;
    }
  }, [car, deliveryRequested, rentalType, startIsoString, endIsoString, commissionRate]);

  // Real-time Availability check
  const isCarAvailable = useMemo(() => {
    if (!car) return false;
    return checkAvailability(car.id, startIsoString, endIsoString);
  }, [car, checkAvailability, startIsoString, endIsoString]);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Car Not Found</h2>
        <p className="text-sm text-slate-500">The vehicle you are looking for does not exist or has been removed.</p>
        <Link href="/cars" className="inline-block px-4 py-2 rounded-xl bg-[#D71920] text-white text-xs font-bold">
          Explore Available Cars
        </Link>
      </div>
    );
  }

  const carReviews = reviews.filter(r => r.car_id === car.id);
  const carLocation = locations.find(l => l.id === car.location_id) || locations[0];

  const handleProceedToBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!isCarAvailable) {
      setBookingError('Selected vehicle is already booked for these dates. Please choose different dates/times.');
      return;
    }

    if (deliveryRequested && !deliveryAddress.trim()) {
      setBookingError('Please enter your delivery address in Proddatur.');
      return;
    }

    try {
      setBookingLoading(true);
      const { booking } = await createBooking({
        carId: car.id,
        pickupLocationId: selectedPickupLocationId,
        startTime: startIsoString,
        endTime: endIsoString,
        deliveryRequested,
        deliveryAddress: deliveryRequested ? deliveryAddress : undefined,
        customerName,
        customerEmail,
        customerPhone,
      });

      router.push(`/checkout/${booking.id}`);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to create booking reservation.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#D71920]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/cars" className="hover:text-[#D71920]">Cars in Proddatur</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">{car.brand} {car.model}</span>
      </nav>

      {/* Main Grid: Details Left, Booking Widget Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Photos, Specs, Description, Reviews (8 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Photo Gallery */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-slate-200">
              <img
                src={car.images[activeImageIndex]?.image_url || car.images[0]?.image_url}
                alt={car.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-xs font-bold uppercase tracking-wider">
                  {car.category.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#D71920]/90 backdrop-blur text-white text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified AP Vehicle</span>
                </span>
              </div>
            </div>

            {/* Thumbnail switcher */}
            {car.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {car.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${activeImageIndex === idx ? 'border-[#D71920] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Highlights */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
                  <span>{car.year} Model</span>
                  <span>•</span>
                  <span>Reg: <strong className="text-slate-800">{car.registration_number}</strong></span>
                  <span>•</span>
                  <span className="text-[#b8141a] font-bold">Proddatur, AP</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {car.brand} {car.model} <span className="font-normal text-slate-500 text-xl">{car.variant}</span>
                </h1>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <div>
                  <div className="font-black text-sm text-amber-900">{car.rating || 5.0} / 5.0</div>
                  <div className="text-[10px] text-amber-700">{car.total_reviews || 12} Verified Reviews</div>
                </div>
              </div>
            </div>

            {/* Core Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Fuel className="w-4 h-4 text-[#D71920]" />
                  <span>Fuel Type</span>
                </div>
                <div className="font-bold text-sm text-slate-900 capitalize">{car.fuel_type}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CarIcon className="w-4 h-4 text-[#D71920]" />
                  <span>Transmission</span>
                </div>
                <div className="font-bold text-sm text-slate-900 capitalize">{car.transmission}</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-[#D71920]" />
                  <span>Capacity</span>
                </div>
                <div className="font-bold text-sm text-slate-900">{car.seating_capacity} Seater</div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Gauge className="w-4 h-4 text-[#D71920]" />
                  <span>Mileage / KM</span>
                </div>
                <div className="font-bold text-sm text-slate-900">{car.mileage_kmpl ? `${car.mileage_kmpl} kmpl` : '20 kmpl'}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900">Vehicle Description</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{car.description}</p>
            </div>

            {/* Features Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-base text-slate-900">Key Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {car.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host / Owner Info */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-900 flex items-center justify-center font-bold text-base">
                RR
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">Hosted by Ramesh Reddy</h4>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-bold">KYC Approved</span>
                </div>
                <p className="text-xs text-slate-500">Verified Proddatur Car Host • 100% On-time handover rate</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">Customer Ratings & Reviews</h3>
              <span className="text-xs font-semibold text-[#D71920]">Only verified completed rentals</span>
            </div>

            <div className="space-y-4">
              {carReviews.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-4">No reviews yet for this vehicle. Be the first to rent and review!</div>
              ) : (
                carReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#D71920] text-white text-xs font-bold flex items-center justify-center">
                          {rev.customer?.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{rev.customer?.full_name || 'Verified Renter'}</div>
                          <div className="text-[10px] text-slate-400">{formatDateTime(rev.created_at)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Booking Widget (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
            
            {/* Widget Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-2xl font-black text-slate-900">{formatCurrency(car.price_per_day)}</span>
                <span className="text-xs font-semibold text-slate-500"> / day</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#D71920] block">Security Deposit: {formatCurrency(car.security_deposit)}</span>
                <span className="text-[10px] text-slate-400 font-medium">(100% Refundable)</span>
              </div>
            </div>

            {/* Availability Indicator */}
            {isCarAvailable ? (
              <div className="bg-red-50 text-red-900 border border-red-200 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                <span>Available for your selected rental period in Proddatur!</span>
              </div>
            ) : (
              <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Vehicle is not available for these exact dates/times.</span>
              </div>
            )}

            <form onSubmit={handleProceedToBooking} className="space-y-4">
              {/* Rental Mode: Self-Drive vs With Chauffeur */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Rental Type / Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRentalType('self_drive')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${rentalType === 'self_drive' ? 'bg-[#111111] text-white border-[#111111] shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs">🚗 Self-Drive</span>
                      {rentalType === 'self_drive' && <span className="w-2 h-2 rounded-full bg-[#D71920]" />}
                    </div>
                    <span className="text-[10px] opacity-70 mt-0.5">Drive yourself (DL req.)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRentalType('with_driver')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${rentalType === 'with_driver' ? 'bg-[#D71920] text-white border-[#D71920] shadow-md shadow-[#D71920]/25' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs">👔 With Driver</span>
                      {rentalType === 'with_driver' && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[10px] opacity-90 mt-0.5">+₹500/day (Relaxed trip)</span>
                  </button>
                </div>
              </div>

              
              {/* Pickup Hub Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Pickup Hub in Proddatur
                </label>
                <select
                  value={selectedPickupLocationId}
                  onChange={(e) => setSelectedPickupLocationId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.area_locality} - {loc.pickup_point_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Return Time
                  </label>
                  <input
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Doorstep Delivery Option */}
              {car.delivery_available && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={deliveryRequested}
                      onChange={(e) => setDeliveryRequested(e.target.checked)}
                      className="w-4 h-4 rounded text-[#D71920] accent-[#D71920] cursor-pointer"
                    />
                    <span>Request Doorstep Delivery (+{formatCurrency(car.delivery_charges)})</span>
                  </label>
                  
                  {deliveryRequested && (
                    <input
                      type="text"
                      placeholder="Enter house/landmark address in Proddatur"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 outline-none"
                    />
                  )}
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Renter Contact Information
                </div>
                <input
                  type="text"
                  placeholder="Full Name (as per Driving License)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Live Transparent Price Breakdown */}
              {quote && (
                <div className="pt-2">
                  <PriceBreakdown quote={quote} />
                </div>
              )}

              {bookingError && (
                <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-xl p-3 text-xs font-medium">
                  {bookingError}
                </div>
              )}

              {/* Checkout CTA */}
              <button
                type="submit"
                disabled={bookingLoading || !isCarAvailable}
                className="w-full py-4 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-xl shadow-[#D71920]/30 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{bookingLoading ? 'Reserving...' : 'Proceed to Secure Checkout'}</span>
              </button>

              <div className="text-center text-[11px] text-slate-400">
                🔒 256-bit Encrypted Cashfree Checkout • Free cancellation before 24h
              </div>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
