'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface FiltersState {
  category: string;
  fuelType: string;
  transmission: string;
  brand: string;
  maxPrice: number;
  deliveryOnly: boolean;
}

export default function FilterSidebar({
  filters,
  setFilters,
  onReset
}: {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onReset: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Filter Fleet</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition font-bold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Max Price: <span className="text-red-600 font-black">₹{filters.maxPrice} / day</span>
        </label>
        <input
          type="range"
          min={1500}
          max={6000}
          step={200}
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-red-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
          <span>₹1,500</span>
          <span>₹6,000+</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Transmission
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['all', 'automatic', 'manual'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, transmission: t }))}
              className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition ${filters.transmission === t ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Fuel Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['all', 'petrol', 'diesel', 'cng'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, fuelType: f }))}
              className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition ${filters.fuelType === f ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Vehicle Category
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'hatchback', label: 'Hatchback (Swift, i20)' },
            { id: 'sedan', label: 'Sedan (Dzire, Verna)' },
            { id: 'suv', label: 'Compact & Full SUV (Creta, Thar)' },
            { id: 'seven_seater', label: '7-Seater MPV (Innova Crysta)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-xl border transition flex items-center justify-between ${filters.category === cat.id ? 'bg-red-50 text-red-900 border-red-300 font-bold' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.id && <span className="w-2 h-2 rounded-full bg-red-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
          <input
            type="checkbox"
            checked={filters.deliveryOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, deliveryOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-red-600 accent-red-600 cursor-pointer"
          />
          <span>Doorstep Delivery Available</span>
        </label>
      </div>

    </div>
  );
}
