# RENTVORA — Self-Drive Car Rental Marketplace

**RENTVORA** is a production-ready, peer-to-peer self-drive car rental marketplace platform built for **Proddatur, Andhra Pradesh** with an expandable multi-city architecture (Proddatur → Kadapa → Andhra Pradesh → Pan-India).

![RENTVORA](/public/images/rentvora-logo.png)

---

## 🌟 Key Features

### 1. Customer Marketplace
- Mobile-first, responsive car discovery with live search widget (Dates & Time pickers in IST).
- Multi-filter sidebar (Fuel Type, Transmission, Seats, 7-Seater/SUV, Doorstep Delivery, Price Slider).
- Car Details page with real-time server-side availability validation (prevents double-booking).
- Transparent price breakdown: Base Fare + Doorstep Delivery + GST (5%) + 100% Refundable Security Deposit.
- Cashfree 256-bit encrypted checkout (UPI: GPay/PhonePe/Paytm, Cards, NetBanking).
- Downloadable/Printable Tax Invoice Receipt with unique references (`PRD-2026-XXXXXX`).
- Customer Dashboard with trip management, policy-driven cancellation & refund computation, and 1-to-5 star reviews.

### 2. Car Host / Owner Portal
- Host Onboarding & KYC collection (Aadhaar, Driving License, Address, Bank Settlement Account / IFSC / UPI).
- Host Dashboard with financial tracking (Gross Earnings, Platform Commission Deduction, Net Settled Payouts).
- Add Car Wizard with specifications, daily/hourly rates, security deposit, photo upload, and features checklist.
- Fleet manager with pause/resume rental controls.

### 3. Admin Control Center
- Real-time business metrics (Platform GMV, Commission earnings, Pending approvals).
- Host KYC verification & approval workflow.
- Car inspection & approval/rejection.
- Bookings ledger and refund management.
- Multi-City Expansion Manager (Add Kadapa, Tirupati, Jammalamadugu, and new pickup hubs with 1 click).
- Platform commission rate configuration (e.g. 10%, 12%, 15%).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS, Montserrat Font, Lucide Icons, Framer Motion
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS) + Private Storage Buckets
- **Payments**: Cashfree Payment Gateway (Order APIs, Server-side verification, Webhooks)
- **Timezone**: `Asia/Kolkata` (IST)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd proddatur-car-rental
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

CASHFREE_ENVIRONMENT=TEST
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_WEBHOOK_SECRET=your_webhook_secret_key
```

### 3. Setup Database (Supabase)
Run the SQL migrations in `supabase/migrations/` in order:
1. `01_initial_schema.sql`
2. `02_functions_and_triggers.sql`
3. `03_rls_policies.sql`
4. `04_seed_data.sql`

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT License. Built for RENTVORA Car Rental.
