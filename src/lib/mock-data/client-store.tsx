'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, Booking, Location, Profile, OwnerProfile, Review, BookingQuote, UserRole } from '@/types';
import { INITIAL_CARS, INITIAL_LOCATIONS, INITIAL_OWNERS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from './store';
import { calculateServerQuote } from '@/lib/pricing/calculator';

interface MarketplaceContextType {
  cars: Car[];
  locations: Location[];
  bookings: Booking[];
  owners: (Profile & { owner_profile: OwnerProfile })[];
  reviews: Review[];
  currentUser: Profile | null;
  commissionRate: number;
  setCurrentUserRole: (role: UserRole, customUser?: Partial<Profile>) => void;
  logout: () => void;
  isAuthLoaded: boolean;
  getCarBySlug: (slug: string) => Car | undefined;
  getCarById: (id: string) => Car | undefined;
  checkAvailability: (carId: string, startTime: string, endTime: string, excludeBookingId?: string) => boolean;
  createBooking: (params: {
    carId: string;
    pickupLocationId: string;
    startTime: string;
    endTime: string;
    deliveryRequested: boolean;
    deliveryAddress?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => Promise<{ booking: Booking; quote: BookingQuote }>;
  confirmPayment: (bookingId: string, paymentMethod?: string) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason: string, cancelledByRole: 'customer' | 'owner' | 'admin') => Promise<Booking>;
  addCar: (carData: Partial<Car>) => Promise<Car>;
  updateCarStatus: (carId: string, status: Car['approval_status'], reason?: string) => Promise<void>;
  updateOwnerKycStatus: (ownerId: string, status: OwnerProfile['kyc_status'], reason?: string) => Promise<void>;
  addLocation: (locData: Omit<Location, 'id'>) => Promise<Location>;
  updateCommissionRate: (newRate: number) => void;
  addReview: (params: { bookingId: string; carId: string; rating: number; comment: string }) => Promise<Review>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [owners, setOwners] = useState<(Profile & { owner_profile: OwnerProfile })[]>(INITIAL_OWNERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  // Load state from localStorage on mount if available
  useEffect(() => {
    try {
      const savedCars = localStorage.getItem('rentvora_cars');
      if (savedCars) setCars(JSON.parse(savedCars));

      const savedBookings = localStorage.getItem('rentvora_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedLocations = localStorage.getItem('rentvora_locations');
      if (savedLocations) setLocations(JSON.parse(savedLocations));

      const savedOwners = localStorage.getItem('rentvora_owners');
      if (savedOwners) setOwners(JSON.parse(savedOwners));

      const savedRate = localStorage.getItem('rentvora_commission');
      if (savedRate) setCommissionRate(Number(savedRate));

      const savedUser = localStorage.getItem('rentvora_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to load local marketplace state', e);
    } finally {
      setIsAuthLoaded(true);
    }
  }, []);

  const saveState = (updatedCars?: Car[], updatedBookings?: Booking[], updatedLocs?: Location[], updatedOwners?: any[]) => {
    if (updatedCars) {
      setCars(updatedCars);
      localStorage.setItem('rentvora_cars', JSON.stringify(updatedCars));
    }
    if (updatedBookings) {
      setBookings(updatedBookings);
      localStorage.setItem('rentvora_bookings', JSON.stringify(updatedBookings));
    }
    if (updatedLocs) {
      setLocations(updatedLocs);
      localStorage.setItem('rentvora_locations', JSON.stringify(updatedLocs));
    }
    if (updatedOwners) {
      setOwners(updatedOwners);
      localStorage.setItem('rentvora_owners', JSON.stringify(updatedOwners));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('rentvora_user');
    } catch {}
  };

  const setCurrentUserRole = (role: UserRole, customUser?: Partial<Profile>) => {
    let userObj: Profile;
    if (role === 'admin') {
      userObj = {
        id: 'usr-admin-1',
        email: customUser?.email || 'admin@rentvora.com',
        full_name: customUser?.full_name || 'Platform Administrator',
        phone: customUser?.phone || '+91 78938 17322',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (role === 'owner') {
      userObj = {
        ...owners[0],
        ...(customUser || {}),
        role: 'owner',
      };
    } else {
      userObj = {
        id: customUser?.id || 'usr-cust-' + Date.now(),
        email: customUser?.email || 'customer@rentvora.com',
        full_name: customUser?.full_name || 'Pavan Kalyan',
        phone: customUser?.phone || '+91 78938 17322',
        role: 'customer',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    setCurrentUser(userObj);
    try {
      localStorage.setItem('rentvora_user', JSON.stringify(userObj));
    } catch {}
  };

  const getCarBySlug = (slug: string) => cars.find(c => c.slug === slug);
  const getCarById = (id: string) => cars.find(c => c.id === id);

  const checkAvailability = (carId: string, startTime: string, endTime: string, excludeBookingId?: string): boolean => {
    const car = getCarById(carId);
    if (!car || car.approval_status !== 'approved') return false;

    const reqStart = new Date(startTime).getTime();
    const reqEnd = new Date(endTime).getTime();

    if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) return false;

    // Check overlapping bookings
    const hasOverlap = bookings.some(b => {
      if (b.car_id !== carId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (['cancelled_by_customer', 'cancelled_by_owner', 'rejected', 'refunded'].includes(b.status)) return false;

      const bStart = new Date(b.start_time).getTime();
      const bEnd = new Date(b.end_time).getTime();

      return (reqStart < bEnd && reqEnd > bStart);
    });

    return !hasOverlap;
  };

  const createBooking = async (params: {
    carId: string;
    pickupLocationId: string;
    startTime: string;
    endTime: string;
    deliveryRequested: boolean;
    deliveryAddress?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => {
    const car = getCarById(params.carId);
    if (!car) throw new Error('Car not found');

    const isAvailable = checkAvailability(params.carId, params.startTime, params.endTime);
    if (!isAvailable) {
      throw new Error('Vehicle is already booked or unavailable for the selected dates/times.');
    }

    // Calculate server quote
    const quote = calculateServerQuote({
      pricePerDay: car.price_per_day,
      pricePerHour: car.price_per_hour,
      securityDeposit: car.security_deposit,
      deliveryAvailable: car.delivery_available,
      deliveryCharges: car.delivery_charges,
      deliveryRequested: params.deliveryRequested,
      startTime: params.startTime,
      endTime: params.endTime,
      customCommissionRate: commissionRate,
    });

    const seq = bookings.length + 101;
    const bookingRef = `PRD-2026-${String(seq).padStart(6, '0')}`;

    const newBooking: Booking = {
      id: `bk-prd-${Date.now()}`,
      booking_reference: bookingRef,
      customer_id: currentUser?.id || `usr-cust-${Date.now()}`,
      owner_id: car.owner_id,
      car_id: car.id,
      pickup_location_id: params.pickupLocationId,
      start_time: params.startTime,
      end_time: params.endTime,
      duration_hours: quote.duration_hours,
      rental_type: 'self_drive',
      delivery_requested: params.deliveryRequested,
      delivery_address: params.deliveryAddress,
      base_rental_amount: quote.base_rental_amount,
      delivery_amount: quote.delivery_amount,
      taxes_fees_amount: quote.taxes_fees_amount,
      security_deposit_amount: quote.security_deposit_amount,
      total_amount: quote.total_amount,
      platform_commission_rate: commissionRate,
      platform_commission_amount: quote.platform_commission_amount,
      owner_earnings_amount: quote.owner_earnings_amount,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
      car: car,
      pickup_location: locations.find(l => l.id === params.pickupLocationId) || locations[0],
      customer: {
        id: currentUser?.id || 'usr-cust-new',
        email: params.customerEmail,
        full_name: params.customerName,
        phone: params.customerPhone,
        role: 'customer',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    };

    const updatedBookings = [newBooking, ...bookings];
    saveState(undefined, updatedBookings);
    return { booking: newBooking, quote };
  };

  const confirmPayment = async (bookingId: string, paymentMethod: string = 'UPI') => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'confirmed' as const,
          payment: {
            id: `pay-${Date.now()}`,
            order_id: `order_${b.booking_reference}_${Date.now()}`,
            status: 'successful',
            payment_method: paymentMethod,
          }
        };
      }
      return b;
    });

    saveState(undefined, updated);
    const confirmed = updated.find(b => b.id === bookingId);
    if (!confirmed) throw new Error('Booking not found');
    return confirmed;
  };

  const cancelBooking = async (bookingId: string, reason: string, cancelledByRole: 'customer' | 'owner' | 'admin') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const hoursUntilStart = (new Date(booking.start_time).getTime() - Date.now()) / (1000 * 60 * 60);
    let cancellationFee = 0;
    let refundAmount = booking.total_amount;

    if (cancelledByRole === 'customer') {
      if (hoursUntilStart < 24) {
        cancellationFee = Math.round(booking.base_rental_amount * 0.20);
        refundAmount = booking.total_amount - cancellationFee;
      }
    }

    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: (cancelledByRole === 'owner' ? 'cancelled_by_owner' : 'cancelled_by_customer') as any,
          cancellation_reason: reason,
          cancellation_fee: cancellationFee,
          refund_amount: refundAmount,
        };
      }
      return b;
    });

    saveState(undefined, updated);
    return updated.find(b => b.id === bookingId)!;
  };

  const addCar = async (carData: Partial<Car>) => {
    const newCar: Car = {
      id: `car-prd-${Date.now()}`,
      owner_id: currentUser?.id || 'usr-owner-1',
      location_id: carData.location_id || locations[0].id,
      brand: carData.brand || 'Maruti Suzuki',
      model: carData.model || 'Swift',
      variant: carData.variant || 'VXi',
      year: carData.year || 2024,
      registration_number: carData.registration_number || `AP 04 XX ${Math.floor(1000 + Math.random() * 9000)}`,
      fuel_type: carData.fuel_type || 'petrol',
      transmission: carData.transmission || 'manual',
      category: carData.category || 'hatchback',
      seating_capacity: carData.seating_capacity || 5,
      color: carData.color || 'White',
      kilometer_reading: carData.kilometer_reading || 10000,
      price_per_day: carData.price_per_day || 2000,
      price_per_hour: carData.price_per_hour || 150,
      security_deposit: carData.security_deposit || 2000,
      min_rental_hours: carData.min_rental_hours || 12,
      max_rental_days: carData.max_rental_days || 30,
      delivery_available: carData.delivery_available ?? true,
      delivery_charges: carData.delivery_charges || 200,
      description: carData.description || 'Verified rental car in Proddatur.',
      features: carData.features || ['Air Conditioning', 'Power Steering', 'Bluetooth Audio'],
      approval_status: 'pending_approval',
      slug: `${(carData.brand || 'car').toLowerCase()}-${(carData.model || 'rental').toLowerCase()}-proddatur-${Date.now()}`,
      images: carData.images?.length ? carData.images : [
        { id: 'img-new-1', image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80', is_primary: true }
      ],
      created_at: new Date().toISOString(),
    };

    const updated = [newCar, ...cars];
    saveState(updated);
    return newCar;
  };

  const updateCarStatus = async (carId: string, status: Car['approval_status'], reason?: string) => {
    const updated = cars.map(c => {
      if (c.id === carId) {
        return { ...c, approval_status: status, rejection_reason: reason };
      }
      return c;
    });
    saveState(updated);
  };

  const updateOwnerKycStatus = async (ownerId: string, status: OwnerProfile['kyc_status'], reason?: string) => {
    const updated = owners.map(o => {
      if (o.id === ownerId) {
        return {
          ...o,
          owner_profile: {
            ...o.owner_profile,
            kyc_status: status,
            rejection_reason: reason,
            verified_at: status === 'approved' ? new Date().toISOString() : undefined,
          }
        };
      }
      return o;
    });
    saveState(undefined, undefined, undefined, updated);
  };

  const addLocation = async (locData: Omit<Location, 'id'>) => {
    const newLoc: Location = {
      ...locData,
      id: `loc-${Date.now()}`,
    };
    const updated = [...locations, newLoc];
    saveState(undefined, undefined, updated);
    return newLoc;
  };

  const updateCommissionRate = (newRate: number) => {
    setCommissionRate(newRate);
    localStorage.setItem('rentvora_commission', String(newRate));
  };

  const addReview = async (params: { bookingId: string; carId: string; rating: number; comment: string }) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      booking_id: params.bookingId,
      car_id: params.carId,
      customer_id: currentUser?.id || 'usr-cust-1',
      owner_id: getCarById(params.carId)?.owner_id || 'usr-owner-1',
      rating: params.rating,
      comment: params.comment,
      created_at: new Date().toISOString(),
      customer: {
        full_name: currentUser?.full_name || 'Verified Customer',
        avatar_url: currentUser?.avatar_url,
      }
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    return newRev;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        cars,
        locations,
        bookings,
        owners,
        reviews,
        currentUser,
        isAuthLoaded,
        logout,
        commissionRate,
        setCurrentUserRole,
        getCarBySlug,
        getCarById,
        checkAvailability,
        createBooking,
        confirmPayment,
        cancelBooking,
        addCar,
        updateCarStatus,
        updateOwnerKycStatus,
        addLocation,
        updateCommissionRate,
        addReview,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return ctx;
}
