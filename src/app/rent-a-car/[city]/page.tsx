'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  Compass, 
  Car as CarIcon, 
  Clock, 
  Phone, 
  Users, 
  ArrowRight,
  HelpCircle,
  Fuel
} from 'lucide-react';
import SearchBar from '@/components/marketplace/SearchBar';
import CarCard from '@/components/marketplace/CarCard';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { formatCurrency } from '@/lib/utils/formatters';

interface CitySeoData {
  name: string;
  district: string;
  tagline: string;
  description: string;
  hubs: { name: string; landmark: string }[];
  popularTrips: { destination: string; distance: string; description: string }[];
  faqs: { q: string; a: string }[];
}

const CITY_SEO_MAP: Record<string, CitySeoData> = {
  proddatur: {
    name: 'Proddatur',
    district: 'YSR Kadapa District',
    tagline: 'Premier Self-Drive & Chauffeur Car Rental Hub',
    description: 'Rent verified self-drive hatchbacks, compact SUVs, and 7-seaters in Proddatur. Enjoy 100% sanitized vehicles with doorstep delivery at Korrapadu Road, Gandhi Road, Holmespet, and Mydukur Road.',
    hubs: [
      { name: 'Proddatur RTC Bus Stand Hub', landmark: 'Korrapadu Road, Near New Bus Stand' },
      { name: 'Gandhi Road Center', landmark: 'Opposite Clock Tower & Gold Bazaar' },
      { name: 'Mydukur Road Station', landmark: 'Near Reliance Smart Bazaar' },
      { name: 'Holmespet Main Point', landmark: 'Near Sri Vasavi Kanyaka Temple' },
      { name: 'Bollavaram Hub', landmark: 'Near YMR Colony Arch' },
      { name: 'Bypass Junction', landmark: 'Sivarampuram Bypass' }
    ],
    popularTrips: [
      { destination: 'Gandikota (Grand Canyon of India)', distance: '42 km (50 mins)', description: 'Spectacular gorge views, fort exploration, and sunset viewpoints.' },
      { destination: 'Belum Caves & Yaganti', distance: '68 km (1.5 hrs)', description: 'Second largest underground cave system in India with natural formations.' },
      { destination: 'Tirupati & Tirumala Balaji', distance: '168 km (3.5 hrs)', description: 'Smooth 4-lane highway drive for spiritual weekend pilgrimages.' },
      { destination: 'Ahobilam Nava Narasimha Temples', distance: '82 km (1.8 hrs)', description: 'Scenic Nallamala forest mountain route for family excursions.' }
    ],
    faqs: [
      { q: 'What documents are required to rent a self-drive car in Proddatur?', a: 'You need an Original Indian Driving License (minimum 1 year old) and Aadhaar Card. Document verification is completed online once in your profile.' },
      { q: 'Can I get doorstep delivery to my house in Proddatur?', a: 'Yes! Doorstep vehicle delivery is available across all major localities in Proddatur for a nominal charge of ₹250.' },
      { q: 'When will my refundable security deposit be refunded?', a: 'Your security deposit (₹2,000–₹2,500) is 100% refunded directly to your UPI/bank account within 24 hours after return inspection.' },
      { q: 'Can I hire a car with a professional driver instead of driving myself?', a: 'Yes! Simply toggle "With Driver" on any car booking to have an experienced local chauffeur included for just +₹500/day.' }
    ]
  },
  kadapa: {
    name: 'Kadapa',
    district: 'YSR District Headquarters',
    tagline: 'Central Andhra Self-Drive & Airport Rental Services',
    description: 'Looking for a reliable car rental in Kadapa? Book sanitized self-drive cars and chauffeur vehicles at Kadapa RTC Complex, Railway Station, and RIMS Kadapa with transparent rates.',
    hubs: [
      { name: 'Kadapa Central Hub', landmark: 'Main RTC Complex & Seven Roads Circle' },
      { name: 'Kadapa Railway Station Point', landmark: 'Platform 1 Main Exit' },
      { name: 'RIMS Kadapa Station', landmark: 'Near Medical College Bypass' },
      { name: 'Nagarajupalli Point', landmark: 'Near Collectorate Office' }
    ],
    popularTrips: [
      { destination: 'Gandikota & Mylavaram Dam', distance: '85 km (1.5 hrs)', description: 'Ideal day trip from Kadapa for canyon viewing and boating.' },
      { destination: 'Tirupati Balaji Darshan', distance: '140 km (3 hrs)', description: 'Comfortable family SUV rentals for temple visits.' },
      { destination: 'Horsley Hills (Hill Station)', distance: '125 km (2.8 hrs)', description: 'Cool climate, viewpoints, and scenic ghat road driving.' }
    ],
    faqs: [
      { q: 'Can I pick up a car at Kadapa Railway Station or RTC Complex?', a: 'Yes, our hosts provide direct delivery at Kadapa Central Station and RTC Complex.' },
      { q: 'Are kilometers unlimited on RENTVORA?', a: 'We offer flexible packages with generous daily km allowances (up to 300 km/day) and low excess km rates (₹8–₹12/km).' }
    ]
  },
  tirupati: {
    name: 'Tirupati',
    district: 'Tirupati District',
    tagline: 'Pilgrim & Airport Car Rentals with Chauffeur Option',
    description: 'Book self-drive and luxury chauffeur cars in Tirupati for your Tirumala Balaji pilgrimage, Kanipakam, and Srikalahasti temple tours with doorstep airport delivery.',
    hubs: [
      { name: 'Renigunta Airport Hub', landmark: 'Arrivals Terminal Pickup' },
      { name: 'Tirupati Central Bus Stand Point', landmark: 'Near RTC Central Complex' },
      { name: 'Alipiri Toll Gate Station', landmark: 'Foot of Tirumala Hills' }
    ],
    popularTrips: [
      { destination: 'Tirumala Hills Ghat Road', distance: '22 km (45 mins)', description: 'Famous dual ghat road leading to Lord Venkateswara Temple.' },
      { destination: 'Srikalahasti Shiva Temple', distance: '38 km (45 mins)', description: 'Rahu-Ketu Kshetra temple with smooth highway driving.' },
      { destination: 'Kanipakam Varasiddhi Vinayaka', distance: '72 km (1.4 hrs)', description: 'Historic water temple near Chittoor.' }
    ],
    faqs: [
      { q: 'Are RENTVORA cars permitted on the Tirumala Ghat Road?', a: 'Yes! All vehicles have active AP commercial/self-drive permits and pass Tirumala security inspections.' },
      { q: 'Can I book a car with driver for temple tours in Tirupati?', a: 'Yes, our experienced local chauffeurs know the best routes and temple schedules.' }
    ]
  },
  jammalamadugu: {
    name: 'Jammalamadugu',
    district: 'YSR Kadapa District',
    tagline: 'Gateway to Gandikota Grand Canyon Car Rentals',
    description: 'Rent self-drive cars in Jammalamadugu for your Gandikota Fort, Mylavaram Dam, and gorge trips with fast local pickup and sanitized vehicles.',
    hubs: [
      { name: 'Jammalamadugu RTC Bus Stand Point', landmark: 'Main Bus Station Center' },
      { name: 'Gandikota Road Hub', landmark: 'Near Fort Highway Junction' }
    ],
    popularTrips: [
      { destination: 'Gandikota Fort & Gorge View', distance: '15 km (20 mins)', description: 'Quick 15-minute scenic drive right to the canyon rim.' },
      { destination: 'Belum Caves', distance: '45 km (50 mins)', description: 'Fascinating limestone caves and underground passages.' }
    ],
    faqs: [
      { q: 'How far is Gandikota from Jammalamadugu?', a: 'Gandikota is just 15 km away. A self-drive car gives you complete freedom to enjoy the canyon sunrise and sunset.' }
    ]
  },
  mydukur: {
    name: 'Mydukur',
    district: 'YSR Kadapa District',
    tagline: 'Four Roads Junction Self-Drive Car Rental Point',
    description: 'Located at the key intersection of NH 40 and NH 67, Mydukur offers seamless car rental handovers for travelers heading towards Kadapa, Proddatur, Badvel, or Kurnool.',
    hubs: [
      { name: 'Four Roads Junction Station', landmark: 'Near Mydukur Center' },
      { name: 'RTC Bus Depot Hub', landmark: 'Main Highway Bypass' }
    ],
    popularTrips: [
      { destination: 'Brahmamgari Matam', distance: '28 km (35 mins)', description: 'Famous pilgrimage center dedicated to Sri Potuluri Veerabrahmendra Swamy.' },
      { destination: 'Ahobilam Temples', distance: '65 km (1.2 hrs)', description: 'Scenic drive through Allagadda to the 9 Narasimha shrines.' }
    ],
    faqs: [
      { q: 'Can I pick up a car at Mydukur Four Roads Junction?', a: 'Yes, our hosts provide quick roadside handovers at Four Roads Junction with all verification completed.' }
    ]
  },
  pulivendula: {
    name: 'Pulivendula',
    district: 'YSR Kadapa District',
    tagline: 'Verified Self-Drive & Chauffeur Fleet',
    description: 'Book well-maintained cars in Pulivendula for business travel, family functions, and regional travel across Rayalaseema.',
    hubs: [
      { name: 'Pulivendula RTC Complex Hub', landmark: 'Main Bus Station' },
      { name: 'RIMS Pulivendula Point', landmark: 'Near Medical College & Ring Road' }
    ],
    popularTrips: [
      { destination: 'Kadapa City', distance: '70 km (1.3 hrs)', description: 'Direct 4-lane highway drive to district headquarters.' },
      { destination: 'Gandikota Canyon', distance: '60 km (1.2 hrs)', description: 'Picturesque countryside drive through Muddanur and Jammalamadugu.' }
    ],
    faqs: [
      { q: 'How do I book a self-drive car in Pulivendula?', a: 'Search your dates online, choose your preferred vehicle, complete 1-click KYC, and get instant vehicle reservation.' }
    ]
  }
};

const ALL_CITIES = [
  { slug: 'proddatur', name: 'Proddatur' },
  { slug: 'kadapa', name: 'Kadapa' },
  { slug: 'tirupati', name: 'Tirupati' },
  { slug: 'jammalamadugu', name: 'Jammalamadugu' },
  { slug: 'mydukur', name: 'Mydukur' },
  { slug: 'pulivendula', name: 'Pulivendula' },
];

export default function CityLandingPage() {
  const params = useParams();
  const rawCity = ((params.city as string) || 'proddatur').toLowerCase();
  const cityData = CITY_SEO_MAP[rawCity] || CITY_SEO_MAP.proddatur;
  const cityName = cityData.name;

  const { cars } = useMarketplace();
  const approvedCars = cars.filter(c => c.approval_status === 'approved');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // JSON-LD Schema for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    'name': `RENTVORA Self-Drive Car Rental ${cityName}`,
    'description': cityData.description,
    'telephone': '+917893817322',
    'email': 'support@rentvora.com',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': cityName,
      'addressRegion': 'Andhra Pradesh',
      'addressCountry': 'IN'
    },
    'priceRange': '₹2,000 - ₹5,000',
    'openingHours': 'Mo-Su 00:00-23:59',
    'url': `https://rentvora.vercel.app/rent-a-car/${rawCity}`
  };

  return (
    <div className="space-y-16 pb-20 font-montserrat">
      
      {/* Inject Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Showcase Banner */}
      <div className="bg-[#111111] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-slate-900 to-[#111111] opacity-90" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
            <span>{cityData.tagline} • {cityName}, AP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Rent a Self-Drive Car in <span className="text-[#D71920]">{cityName}</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {cityData.description}
          </p>

          {/* Search Widget */}
          <div className="pt-6 max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* 2. City Switcher Pill Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Explore Nearby Andhra Pradesh Hubs:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pt-3 pb-2">
          {ALL_CITIES.map(c => (
            <Link
              key={c.slug}
              href={`/rent-a-car/${c.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                rawCity === c.slug 
                  ? 'bg-[#D71920] text-white shadow-md shadow-[#D71920]/25' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📍 {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Available Fleet in City */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Verified Self-Drive & Chauffeur Fleet in {cityName}
            </h2>
            <p className="text-xs text-slate-500">
              All vehicles sanitized, GPS-equipped, and certified for smooth driving across Rayalaseema & AP.
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#D71920] bg-red-50 px-3 py-1 rounded-full border border-red-200">
            {approvedCars.length} Verified Cars Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedCars.map(c => <CarCard key={c.id} car={c} />)}
        </div>
      </div>

      {/* 4. Local Hubs & Doorstep Delivery Points */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-950">
              Pickup Points & Doorstep Delivery Hubs in {cityName}
            </h3>
            <p className="text-xs text-slate-500">
              Collect your car within 30 minutes at any verified hub or request delivery right to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityData.hubs.map((hub, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">{hub.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 pl-9">{hub.landmark}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Popular Weekend Road Trips from City */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D71920] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Travel Inspiration</span>
          </div>
          <h3 className="text-2xl font-black text-slate-950">
            Top Road Trips & Destinations from {cityName}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cityData.popularTrips.map((trip, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-[#D71920] flex items-center justify-between">
                  <span>{trip.distance}</span>
                </div>
                <h4 className="font-black text-sm text-slate-900">{trip.destination}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{trip.description}</p>
              </div>
              <Link 
                href="/cars" 
                className="pt-3 border-t border-slate-100 text-xs font-bold text-[#D71920] hover:underline flex items-center justify-between"
              >
                <span>Book a Car for this Trip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Why Rent with RENTVORA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black">Why Choose RENTVORA in {cityName}?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Direct peer-to-peer car rental platform built specifically for Andhra Pradesh travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <ShieldCheck className="w-7 h-7 text-[#D71920]" />
              <h4 className="font-extrabold text-sm">100% Refundable Deposit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero deduction hassle. Your security deposit is credited back within 24 hours of vehicle return.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <Users className="w-7 h-7 text-[#D71920]" />
              <h4 className="font-extrabold text-sm">Self-Drive or Chauffeur</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy the freedom of self-drive or add an experienced local driver for just +₹500/day for relaxed family travel.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <Phone className="w-7 h-7 text-[#D71920]" />
              <h4 className="font-extrabold text-sm">24/7 Roadside Assistance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct hotline support (+91 78938 17322) and WhatsApp assistance anywhere across Andhra Pradesh highways.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Frequently Asked Questions (FAQ Accordion) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D71920] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h3 className="text-2xl font-black text-slate-950">
            Frequently Asked Questions about Car Rental in {cityName}
          </h3>
        </div>

        <div className="space-y-3">
          {cityData.faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[#D71920]' : ''}`} />
              </button>
              
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
