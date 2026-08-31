import React from 'react';
import Link from 'next/link';
import { Fuel, Gauge, Users, ShieldCheck, Star, ArrowRight, Truck } from 'lucide-react';
import { Car } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

export default function CarCard({ car }: { car: Car }) {
  const primaryImage = car.images.find(img => img.is_primary)?.image_url || car.images[0]?.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 hover:border-red-400 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur text-white text-[10px] font-extrabold uppercase tracking-wider">
            {car.category.replace('_', ' ')}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-red-600/90 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified AP</span>
          </span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur text-slate-900 text-xs font-extrabold capitalize shadow-sm">
            {car.transmission}
          </span>
          <span className="px-2 py-1 rounded-lg bg-[#111111]/90 backdrop-blur text-white text-[10px] font-bold shadow-sm">
            👔 Driver Opt.
          </span>
        </div>
          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur text-slate-900 text-xs font-extrabold capitalize shadow-sm">
            {car.transmission}
          </span>
        </div>

        {car.delivery_available && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur text-red-400 text-[10px] font-bold flex items-center gap-1 shadow-sm border border-red-500/30">
              <Truck className="w-3 h-3 text-red-500" />
              <span>Doorstep Delivery</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{car.rating && car.rating > 0 ? car.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-400 font-normal">({car.total_reviews || 12} reviews)</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">{car.year} Model</span>
          </div>

          <h3 className="font-extrabold text-lg text-slate-950 group-hover:text-red-600 transition tracking-tight">
            {car.brand} {car.model} <span className="text-sm font-normal text-slate-500">{car.variant}</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 pt-3 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Fuel className="w-3.5 h-3.5 text-red-500" />
              <span className="capitalize font-semibold">{car.fuel_type}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Users className="w-3.5 h-3.5 text-red-500" />
              <span className="font-semibold">{car.seating_capacity} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Gauge className="w-3.5 h-3.5 text-red-500" />
              <span className="font-semibold">{car.mileage_kmpl ? `${car.mileage_kmpl} kmpl` : '18 kmpl'}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-950">{formatCurrency(car.price_per_day)}</span>
              <span className="text-xs text-slate-500 font-medium">/ day</span>
            </div>
            <div className="text-[11px] text-red-600 font-bold">
              Deposit: {formatCurrency(car.security_deposit)} (Refundable)
            </div>
          </div>

          <Link
            href={`/cars/${car.slug}`}
            className="px-4 py-2.5 rounded-xl bg-slate-950 group-hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
