export type UserRole = 'customer' | 'owner' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending_verification';
export type KycStatus = 'pending_verification' | 'approved' | 'rejected' | 'suspended';
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'electric';
export type Transmission = 'manual' | 'automatic';
export type CarCategory = 'hatchback' | 'sedan' | 'suv' | 'luxury' | 'seven_seater';
export type CarApprovalStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'temporarily_unavailable' | 'suspended';
export type BookingStatus = 
  | 'pending_payment'
  | 'payment_processing'
  | 'confirmed'
  | 'owner_confirmation_required'
  | 'active'
  | 'completed'
  | 'cancelled_by_customer'
  | 'cancelled_by_owner'
  | 'rejected'
  | 'refund_processing'
  | 'refunded'
  | 'disputed';

export interface Location {
  id: string;
  city: string;
  state: string;
  area_locality: string;
  landmark?: string;
  pickup_point_name: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerProfile {
  id: string;
  kyc_status: KycStatus;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  aadhar_masked?: string;
  driving_license_no?: string;
  kyc_document_url?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_name?: string;
  upi_id?: string;
  rejection_reason?: string;
  verified_at?: string;
}

export interface CustomerProfile {
  id: string;
  driving_license_no?: string;
  dl_document_url?: string;
  is_dl_verified: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Car {
  id: string;
  owner_id: string;
  location_id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  registration_number: string;
  fuel_type: FuelType;
  transmission: Transmission;
  category: CarCategory;
  seating_capacity: number;
  color: string;
  kilometer_reading: number;
  mileage_kmpl?: number;
  price_per_day: number;
  price_per_hour?: number;
  security_deposit: number;
  min_rental_hours: number;
  max_rental_days: number;
  delivery_available: boolean;
  delivery_charges: number;
  description: string;
  features: string[];
  approval_status: CarApprovalStatus;
  rejection_reason?: string;
  slug: string;
  images: { id: string; image_url: string; is_primary: boolean }[];
  location?: Location;
  owner?: { full_name: string; phone: string; avatar_url?: string; kyc_status?: KycStatus };
  rating?: number;
  total_reviews?: number;
  created_at: string;
}

export interface BookingQuote {
  duration_hours: number;
  duration_days: number;
  base_rental_amount: number;
  delivery_amount: number;
  taxes_fees_amount: number;
  security_deposit_amount: number;
  platform_commission_amount: number;
  owner_earnings_amount: number;
  total_amount: number;
  payable_now: number;
  refundable_deposit: number;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  owner_id: string;
  car_id: string;
  pickup_location_id: string;
  dropoff_location_id?: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  rental_type: 'self_drive' | 'with_driver';
  delivery_requested: boolean;
  delivery_address?: string;
  base_rental_amount: number;
  delivery_amount: number;
  taxes_fees_amount: number;
  security_deposit_amount: number;
  total_amount: number;
  platform_commission_rate: number;
  platform_commission_amount: number;
  owner_earnings_amount: number;
  status: BookingStatus;
  cancellation_reason?: string;
  cancellation_fee?: number;
  refund_amount?: number;
  created_at: string;
  car?: Car;
  customer?: Profile;
  owner?: Profile;
  pickup_location?: Location;
  payment?: {
    id: string;
    order_id: string;
    status: string;
    payment_method?: string;
  };
}

export interface Review {
  id: string;
  booking_id: string;
  car_id: string;
  customer_id: string;
  owner_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  customer?: { full_name: string; avatar_url?: string };
}
