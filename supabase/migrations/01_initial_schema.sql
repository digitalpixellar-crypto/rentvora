-- =============================================================================
-- RENTVORA CAR RENTAL MARKETPLACE - INITIAL SCHEMA
-- Database: Supabase PostgreSQL (Supports Proddatur -> Kadapa -> AP -> India)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('customer', 'owner', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending_verification');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'Valued Driver',
    phone TEXT UNIQUE,
    role user_role DEFAULT 'customer' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TYPE kyc_status AS ENUM ('pending_verification', 'approved', 'rejected', 'suspended');

CREATE TABLE IF NOT EXISTS public.owner_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    kyc_status kyc_status DEFAULT 'pending_verification' NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT DEFAULT 'Proddatur' NOT NULL,
    state TEXT DEFAULT 'Andhra Pradesh' NOT NULL,
    pincode TEXT NOT NULL,
    aadhar_masked TEXT,
    driving_license_no TEXT,
    kyc_document_url TEXT,
    bank_account_name TEXT,
    bank_account_number TEXT,
    bank_ifsc TEXT,
    bank_name TEXT,
    upi_id TEXT,
    rejection_reason TEXT,
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    driving_license_no TEXT,
    dl_document_url TEXT,
    is_dl_verified BOOLEAN DEFAULT FALSE NOT NULL,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city TEXT NOT NULL,
    state TEXT DEFAULT 'Andhra Pradesh' NOT NULL,
    area_locality TEXT NOT NULL,
    landmark TEXT,
    pickup_point_name TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TYPE fuel_type_enum AS ENUM ('petrol', 'diesel', 'cng', 'electric');
CREATE TYPE transmission_enum AS ENUM ('manual', 'automatic');
CREATE TYPE car_category_enum AS ENUM ('hatchback', 'sedan', 'suv', 'luxury', 'seven_seater');
CREATE TYPE car_approval_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'temporarily_unavailable', 'suspended');

CREATE TABLE IF NOT EXISTS public.cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    location_id UUID REFERENCES public.locations(id) NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT,
    year INTEGER NOT NULL CHECK (year >= 2005 AND year <= 2030),
    registration_number TEXT UNIQUE NOT NULL,
    fuel_type fuel_type_enum NOT NULL,
    transmission transmission_enum NOT NULL,
    category car_category_enum NOT NULL DEFAULT 'hatchback',
    seating_capacity INTEGER NOT NULL CHECK (seating_capacity >= 2 AND seating_capacity <= 10),
    color TEXT NOT NULL,
    kilometer_reading INTEGER DEFAULT 0 NOT NULL,
    mileage_kmpl NUMERIC(4, 1),
    price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day > 0),
    price_per_hour NUMERIC(10, 2),
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 2000.00,
    min_rental_hours INTEGER DEFAULT 12 NOT NULL,
    max_rental_days INTEGER DEFAULT 30 NOT NULL,
    delivery_available BOOLEAN DEFAULT FALSE NOT NULL,
    delivery_charges NUMERIC(10, 2) DEFAULT 0.00,
    description TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    rc_number TEXT,
    insurance_policy_no TEXT,
    insurance_expiry DATE,
    puc_expiry DATE,
    approval_status car_approval_status DEFAULT 'pending_approval' NOT NULL,
    rejection_reason TEXT,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.car_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TYPE booking_status_enum AS ENUM (
    'pending_payment',
    'payment_processing',
    'confirmed',
    'owner_confirmation_required',
    'active',
    'completed',
    'cancelled_by_customer',
    'cancelled_by_owner',
    'rejected',
    'refund_processing',
    'refunded',
    'disputed'
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    car_id UUID REFERENCES public.cars(id) NOT NULL,
    pickup_location_id UUID REFERENCES public.locations(id) NOT NULL,
    dropoff_location_id UUID REFERENCES public.locations(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_hours INTEGER NOT NULL CHECK (duration_hours > 0),
    rental_type TEXT DEFAULT 'self_drive' NOT NULL,
    delivery_requested BOOLEAN DEFAULT FALSE NOT NULL,
    delivery_address TEXT,
    base_rental_amount NUMERIC(10, 2) NOT NULL,
    delivery_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    taxes_fees_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    security_deposit_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    platform_commission_rate NUMERIC(5, 2) DEFAULT 10.00 NOT NULL,
    platform_commission_amount NUMERIC(10, 2) NOT NULL,
    owner_earnings_amount NUMERIC(10, 2) NOT NULL,
    status booking_status_enum DEFAULT 'pending_payment' NOT NULL,
    cancellation_reason TEXT,
    cancellation_fee NUMERIC(10, 2) DEFAULT 0.00,
    refund_amount NUMERIC(10, 2) DEFAULT 0.00,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    order_id TEXT UNIQUE NOT NULL,
    cf_payment_id TEXT,
    gateway TEXT DEFAULT 'cashfree' NOT NULL,
    payment_method TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    gateway_response JSONB,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES public.bookings(id) NOT NULL,
    car_id UUID REFERENCES public.cars(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()) NOT NULL
);
