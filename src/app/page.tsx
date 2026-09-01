'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Car, 
  ShieldCheck, 
  Key, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  UserCheck,
  Compass,
  HeartHandshake
} from 'lucide-react';
import SearchBar from '@/components/marketplace/SearchBar';
import CarCard from '@/components/marketplace/CarCard';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { APP_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const { cars, locations } = useMarketplace();
  const approvedCars = cars.filter(c => c.approval_status === 'approved');

  return (
    <div className="space-y-20 pb-20 font-montserrat">
      
      {/* 1. HERO SECTION - Sleek Carbon Black & Crimson Red */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Aerodynamic background glow in crimson red */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-extrabold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>🚗 Self-Drive &amp; 👨‍✈️ With-Driver Car Rentals in Andhra Pradesh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            Self-Drive &amp; Chauffeur Cars in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-300">Proddatur</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Drive yourself with 100% privacy <strong>OR</strong> relax with a verified professional chauffeur. Spotless sanitized fleet, instant booking at Proddatur RTC Bus Stand &amp; doorstep delivery.
          </p>

          {/* Search Box Component */}
          <div className="pt-6">
            <SearchBar />
          </div>

          {/* Quick Location Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold">Popular Proddatur Hubs:</span>
            {locations.slice(0, 5).map(loc => (
              <Link 
                key={loc.id} 
                href={`/cars?location=${loc.id}`}
                className="px-3 py-1 rounded-full bg-slate-900/90 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 transition font-medium text-slate-200"
              >
                📍 {loc.area_locality}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-950">50+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified AP Cars</div>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-[#D71920]">4.9 ★</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Renter Rating</div>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-slate-950">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deposit Refund Guarantee</div>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-[#D71920]">24/7</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Local Support Helpline</div>
          </div>
        </div>
      </section>

      {/* 2.5. TWO TRAVEL OPTIONS SHOWCASE (SELF-DRIVE VS WITH-DRIVER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D71920]">Two Flexible Ways to Travel</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Choose Your Driving Style</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Whether you want the freedom of driving yourself or the comfort of a dedicated driver, RENTVORA has you covered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: Self-Drive */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black text-xl shadow-inner">
                  🚗
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider border border-white/20">
                  100% Privacy
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">Option 1: Self-Drive Rentals</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">Take the steering wheel and travel on your own schedule with complete privacy.</p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited freedom &amp; privacy for family and couple trips</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Indian Driving License verification (Zero paperwork)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant self-pickup at RTC Bus Stand or doorstep delivery</span>
                </div>
              </div>
            </div>

            <Link
              href="/cars?rentalType=self_drive"
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Explore Self-Drive Cars &rarr;</span>
            </Link>
          </div>

          {/* Card 2: With Driver */}
          <div className="bg-gradient-to-br from-[#1b0809] to-[#2d0e10] text-white rounded-3xl p-8 border border-red-900/60 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#D71920] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#D71920]/40">
                  👨‍✈️
                </div>
                <span className="px-3 py-1 rounded-full bg-[#D71920]/30 text-red-200 text-xs font-black uppercase tracking-wider border border-red-500/40">
                  +₹500/day Only
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">Option 2: With-Driver Chauffeur</h3>
                <p className="text-xs sm:text-sm text-red-100 mt-1">Sit back, relax, and let our verified professional drivers handle the driving.</p>
              </div>

              <div className="space-y-2.5 pt-2 text-xs font-semibold text-red-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Polite, background-verified local drivers across Rayalaseema</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero driving fatigue for outstation trips (Tirupati, Bangalore, Hyderabad)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Perfect for wedding functions, temple pilgrimages &amp; business travel</span>
                </div>
              </div>
            </div>

            <Link
              href="/cars?rentalType=with_driver"
              className="w-full py-3.5 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#D71920]/30 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Book With-Driver (+₹500/day) &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D71920]">Ready to Drive</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Featured Fleet in Proddatur</h2>
            <p className="text-slate-500 text-sm mt-1">Book directly with verified car hosts in Korrapadu Road, Gandhi Road &amp; Mydukur Road.</p>
          </div>

          <Link 
            href="/cars" 
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D71920] hover:text-[#b8141a] transition"
          >
            <span>View All Cars ({approvedCars.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedCars.slice(0, 6).map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">Simple 4-Step Booking</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">How RENTVORA Works</h2>
            <p className="text-slate-500 text-sm">Rent your favorite self-drive car in under 2 minutes with zero paper friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Search & Select",
                desc: "Choose your pickup hub in Proddatur, enter your travel dates and pick from hatchback, sedan, or SUV.",
                icon: Car,
              },
              {
                step: "02",
                title: "Book & Pay Online",
                desc: "Review transparent price breakdown and pay securely via Cashfree (UPI, Cards, NetBanking).",
                icon: CreditCard,
              },
              {
                step: "03",
                title: "Pick Up & Drive",
                desc: "Meet the verified host at RTC Bus Stand or receive doorstep delivery. Show your DL and drive away!",
                icon: Key,
              },
              {
                step: "04",
                title: "Easy Return & Refund",
                desc: "Return the vehicle at the agreed time. Your security deposit is credited back directly within 24h.",
                icon: ShieldCheck,
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="text-3xl font-black text-red-600/30">{item.step}</div>
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-950">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">Road Trips & Pilgrimages</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Popular Getaways from Proddatur</h2>
          <p className="text-slate-500 text-sm">Our self-drive cars come with all-AP permits, ideal for weekend trips with family.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Gandikota (Grand Canyon)",
              distance: "40 km (45 mins drive)",
              desc: "Gorge viewpoint, Gandikota Fort, Kayaking in Pennar river.",
              image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80"
            },
            {
              name: "Belum Caves",
              distance: "65 km (1.2 hours drive)",
              desc: "Second largest underground cave system in Indian subcontinent.",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80"
            },
            {
              name: "Ahobilam Nava Narasimha",
              distance: "75 km (1.5 hours drive)",
              desc: "Sacred 9 Narasimha shrines nestled in scenic Nallamala hills.",
              image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80"
            },
            {
              name: "Tirupati Balaji Temple",
              distance: "180 km (3.5 hours drive)",
              desc: "Comfortable highway journey via Kadapa and Rajampet.",
              image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80"
            },
          ].map((dest, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition">
              <div className="relative h-36 bg-slate-200 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur text-white text-[10px] font-bold">
                  {dest.distance}
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-sm text-slate-900">{dest.name}</h4>
                <p className="text-xs text-slate-500">{dest.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. OWNER ONBOARDING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-red-500/30 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold">
              <span>Earn Passive Income with RENTVORA</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Have an Idle Car in Proddatur? <br />
              <span className="text-red-500">Earn ₹25,000 – ₹60,000 / Month</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              List your Swift, Creta, Innova or any AP-registered vehicle. We verify all renters with Government ID and Driving License. You maintain 100% control over pricing and calendar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Verified Renter KYC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Direct Bank Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Only {APP_CONFIG.defaultCommissionRate}% Platform Fee</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/owner/register"
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm transition shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                <span>List Your Car on RENTVORA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/owner/dashboard"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition"
              >
                Host Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What documents do I need to rent a self-drive car in Proddatur?",
              a: "You need an Original Indian Driving License (minimum 1 year old) and an Aadhaar Card for physical identity verification during vehicle pickup."
            },
            {
              q: "How does the refundable security deposit work?",
              a: "A security deposit (typically ₹2,000 to ₹3,500 depending on car category) is collected securely at checkout. When you return the vehicle in good condition with matching fuel level, the full amount is credited back to your bank account / UPI within 24 hours."
            },
            {
              q: "Can I take the car outside Proddatur (to Kadapa, Bangalore, Tirupati, etc.)?",
              a: "Yes! All vehicles are registered in Andhra Pradesh and are fully permitted for travel across Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu. Standard state tax / toll rules apply."
            },
            {
              q: "What is your cancellation and refund policy?",
              a: "Free 100% refund if cancelled up to 24 hours before your scheduled pickup time. If cancelled within 24 hours of trip start, a standard 20% convenience fee is deducted and remaining amount refunded."
            },
            {
              q: "How can I register my car as a Host in Proddatur?",
              a: "Click 'List Your Car', fill in your KYC details (Aadhaar, Driving License, Bank IFSC) and vehicle RC details. Platform Admin will verify your documents within 2–4 hours and activate your listings."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-2 shadow-sm">
              <h4 className="font-bold text-sm sm:text-base text-slate-950">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
