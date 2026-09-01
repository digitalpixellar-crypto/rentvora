'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, Booking, Location, Profile, OwnerProfile, Review, BookingQuote, UserRole } from '@/types';
import { INITIAL_CARS, INITIAL_LOCATIONS, INITIAL_OWNERS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from './store';
import { calculateServerQuote } from '@/lib/pricing/calculator';
import { createClient } from '@/lib/supabase/client';

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
    rentalType?: 'self_drive' | 'with_driver';
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
  updateUserProfile: (data: Partial<Profile>) => Promise<void>;
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

  // 1. On mount: load localStorage state AND sync Supabase session
  useEffect(() => {
    const supabase = createClient();

    const loadLocalData = () => {
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
      } catch (e) {
        console.error('Failed to load local marketplace state', e);
      }
    };

    const buildProfileFromSupabaseUser = (sbUser: any): Profile => ({
      id: sbUser.id,
      email: sbUser.email || null,
      full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Driver',
      phone: sbUser.user_metadata?.phone || sbUser.phone || null,
      role: (sbUser.user_metadata?.role as UserRole) || 'customer',
      status: 'active',
      avatar_url: sbUser.user_metadata?.avatar_url || null,
      created_at: sbUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Load local data first
    loadLocalData();

    // 2. Get the initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = buildProfileFromSupabaseUser(session.user);
        setCurrentUser(profile);
        try {
          localStorage.setItem('rentvora_user', JSON.stringify(profile));
        } catch {}
      } else {
        // Fall back to stored user from localStorage
        try {
          const savedUser = localStorage.getItem('rentvora_user');
          if (savedUser) setCurrentUser(JSON.parse(savedUser));
        } catch {}
      }
      setIsAuthLoaded(true);
    }).catch(() => {
      // If Supabase fails, still try localStorage
      try {
        const savedUser = localStorage.getItem('rentvora_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
      } catch {}
      setIsAuthLoaded(true);
    });

    // 3. Subscribe to live auth state changes (login/logout from any tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = buildProfileFromSupabaseUser(session.user);
        setCurrentUser(profile);
        try {
          localStorage.setItem('rentvora_user', JSON.stringify(profile));
        } catch {}
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        try {
          localStorage.removeItem('rentvora_user');
        } catch {}
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
    try {
      localStorage.removeItem('rentvora_user');
    } catch {}
  };

  const setCurrentUserRole = (role: UserRole, customUser?: Partial<Profile>) => {
    let userObj: Profile;
    if (role === 'admin') {
      userObj = {
        id: customUser?.id || 'usr-admin-1',
        email: customUser?.email || 'admin@rentvora.in',
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
        email: customUser?.email || 'customer@rentvora.in',
        full_name: customUser?.full_name || 'Valued Driver',
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

    const conflict = bookings.some(b => {
      if (b.car_id !== carId) return false;
      if (b.id === excludeBookingId) return false;
      if (['cancelled_by_customer', 'cancelled_by_owner', 'rejected', 'refunded'].includes(b.status)) return false;
      const bStart = new Date(b.start_time).getTime();
      const bEnd = new Date(b.end_time).getTime();
      return reqStart < bEnd && reqEnd > bStart;
    });

    return !conflict;
  };

  const createBooking = async (params: {
    carId: string;
    pickupLocationId: string;
    startTime: string;
    endTime: string;
    deliveryRequested: boolean;
    deliveryAddress?: string;
    rentalType?: 'self_drive' | 'with_driver';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<{ booking: Booking; quote: BookingQuote }> => {
    const car = getCarById(params.carId);
    if (!car) throw new Error('Car not found');

    const pickupLoc = locations.find(l => l.id === params.pickupLocationId) || locations[0];
    const isWithDriver = params.rentalType === 'with_driver';
    const quote = calculateServerQuote({
      pricePerDay: car.price_per_day,
      pricePerHour: car.price_per_hour,
      securityDeposit: car.security_deposit || 3000,
      deliveryAvailable: car.delivery_available ?? true,
      deliveryRequested: params.deliveryRequested,
      deliveryCharges: car.delivery_charges,
      withDriver: isWithDriver,
      startTime: params.startTime,
      endTime: params.endTime,
      customCommissionRate: commissionRate,
    });

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      booking_reference: 'RV-' + Date.now().toString().slice(-6),
      car_id: params.carId,
      car,
      customer_id: currentUser?.id || 'guest',
      customer: {
        id: currentUser?.id || 'guest',
        full_name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone,
        role: 'customer',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      owner_id: car.owner_id || owners[0]?.id,
      owner: owners[0],
      pickup_location_id: params.pickupLocationId,
      pickup_location: pickupLoc,
      start_time: params.startTime,
      end_time: params.endTime,
      duration_hours: quote.duration_hours,
      rental_type: params.rentalType || 'self_drive',
      status: 'pending_payment',
      base_rental_amount: quote.base_rental_amount,
      driver_allowance_amount: quote.driver_allowance_amount,
      taxes_fees_amount: quote.taxes_fees_amount,
      platform_commission_rate: commissionRate,
      platform_commission_amount: quote.platform_commission_amount,
      owner_earnings_amount: quote.owner_earnings_amount,
      security_deposit_amount: quote.security_deposit_amount,
      delivery_amount: quote.delivery_amount || 0,
      total_amount: quote.total_amount,
      delivery_requested: params.deliveryRequested,
      delivery_address: params.deliveryAddress,
      created_at: new Date().toISOString(),
    };


    const updatedBookings = [...bookings, newBooking];
    saveState(undefined, updatedBookings);
    return { booking: newBooking, quote };
  };

  const confirmPayment = async (bookingId: string, paymentMethod: string = 'cashfree_upi'): Promise<Booking> => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'confirmed' as Booking['status'], payment_method: paymentMethod, updated_at: new Date().toISOString() };
      }
      return b;
    });
    saveState(undefined, updatedBookings);
    return updatedBookings.find(b => b.id === bookingId)!;
  };

  const cancelBooking = async (bookingId: string, reason: string, cancelledByRole: 'customer' | 'owner' | 'admin'): Promise<Booking> => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        const cancelStatus = cancelledByRole === 'customer' ? 'cancelled_by_customer' : cancelledByRole === 'owner' ? 'cancelled_by_owner' : 'refunded';
        const refundAmt = cancelledByRole === 'admin' ? b.total_amount : b.base_rental_amount * 0.8;
        return { ...b, status: cancelStatus as Booking['status'], cancellation_reason: reason, refund_amount: refundAmt, updated_at: new Date().toISOString() };
      }
      return b;
    });
    saveState(undefined, updatedBookings);
    return updatedBookings.find(b => b.id === bookingId)!;
  };

  const addCar = async (carData: Partial<Car>): Promise<Car> => {
    const locId = carData.location_id || locations[0]?.id || 'loc-1';
    const newCar: Car = {
      id: 'car-' + Date.now(),
      slug: (carData.brand || 'car').toLowerCase() + '-' + (carData.model || 'vehicle').toLowerCase() + '-' + Date.now(),
      owner_id: carData.owner_id || owners[0]?.id || 'owner-1',
      location_id: locId,
      location: locations.find(l => l.id === locId) || locations[0],
      brand: carData.brand || 'Unknown',
      model: carData.model || 'Vehicle',
      variant: carData.variant,
      year: carData.year || 2022,
      registration_number: carData.registration_number || 'AP00XX0000',
      fuel_type: carData.fuel_type || 'petrol',
      transmission: carData.transmission || 'manual',
      category: carData.category || 'hatchback',
      seating_capacity: carData.seating_capacity || 5,
      color: carData.color || 'White',
      kilometer_reading: carData.kilometer_reading || 0,
      mileage_kmpl: carData.mileage_kmpl || 15,
      price_per_day: carData.price_per_day || 1500,
      price_per_hour: carData.price_per_hour,
      security_deposit: carData.security_deposit || 3000,
      min_rental_hours: carData.min_rental_hours || 4,
      max_rental_days: carData.max_rental_days || 30,
      delivery_available: carData.delivery_available ?? true,
      delivery_charges: carData.delivery_charges || 0,
      description: carData.description || '',
      approval_status: 'pending_approval',
      features: carData.features || [],
      images: carData.images || [],
      rating: 0,
      total_reviews: 0,
      created_at: new Date().toISOString(),
    };
    const updatedCars = [...cars, newCar];
    saveState(updatedCars);
    return newCar;
  };

  const updateCarStatus = async (carId: string, status: Car['approval_status'], reason?: string): Promise<void> => {
    const updatedCars = cars.map(c => c.id === carId ? { ...c, approval_status: status, updated_at: new Date().toISOString() } : c);
    saveState(updatedCars);
  };

  const updateOwnerKycStatus = async (ownerId: string, status: OwnerProfile['kyc_status'], reason?: string): Promise<void> => {
    const updatedOwners = owners.map(o => o.id === ownerId ? { ...o, owner_profile: { ...o.owner_profile, kyc_status: status, verified_at: new Date().toISOString() } } : o);
    saveState(undefined, undefined, undefined, updatedOwners);
  };

  const addLocation = async (locData: Omit<Location, 'id'>): Promise<Location> => {
    const newLoc: Location = { id: 'loc-' + Date.now(), ...locData };
    const updatedLocs = [...locations, newLoc];
    saveState(undefined, undefined, updatedLocs);
    return newLoc;
  };

  const updateCommissionRate = (newRate: number) => {
    setCommissionRate(newRate);
    localStorage.setItem('rentvora_commission', String(newRate));
  };

  const addReview = async (params: { bookingId: string; carId: string; rating: number; comment: string }): Promise<Review> => {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      booking_id: params.bookingId,
      car_id: params.carId,
      customer_id: currentUser?.id || 'guest',
      owner_id: cars.find(c => c.id === params.carId)?.owner_id || owners[0]?.id || 'owner-1',
      customer: currentUser ? { full_name: currentUser.full_name } : undefined,
      rating: params.rating,
      comment: params.comment,
      created_at: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newRev]);
    const updatedCars = cars.map(c => {
      if (c.id === params.carId) {
        const allCarRevs = [...reviews.filter(r => r.car_id === c.id), newRev];
        const avgRating = allCarRevs.reduce((sum, r) => sum + r.rating, 0) / allCarRevs.length;
        return { ...c, rating: Math.round(avgRating * 10) / 10, total_reviews: allCarRevs.length };
      }
      return c;
    });
    saveState(updatedCars);
    return newRev;
  };

  const updateUserProfile = async (data: Partial<Profile>): Promise<void> => {
    if (!currentUser) return;
    const updated: Profile = { ...currentUser, ...data, updated_at: new Date().toISOString() };
    setCurrentUser(updated);
    try {
      localStorage.setItem('rentvora_user', JSON.stringify(updated));
    } catch {}

    // Update Supabase profiles table
    try {
      if (updated.id && !updated.id.startsWith('guest')) {
        const supabase = createClient();
        await supabase.from('profiles').upsert({
          id: updated.id,
          full_name: updated.full_name,
          phone: updated.phone,
          avatar_url: updated.avatar_url,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      }
    } catch (e) {
      console.warn('Profile DB update notice:', e);
    }
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
        updateUserProfile,
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

export function useMarketplace(): MarketplaceContextType {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}
