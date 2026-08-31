'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car as CarIcon, SlidersHorizontal, ArrowUpDown, MapPin, Sparkles } from 'lucide-react';
import CarCard from '@/components/marketplace/CarCard';
import FilterSidebar from '@/components/marketplace/FilterSidebar';
import SearchBar from '@/components/marketplace/SearchBar';
import { useMarketplace } from '@/lib/mock-data/client-store';

function CarsContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location') || '';
  const { cars, locations } = useMarketplace();

  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: 'all',
    fuelType: 'all',
    transmission: 'all',
    brand: 'all',
    maxPrice: 6000,
    deliveryOnly: false,
  });

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      fuelType: 'all',
      transmission: 'all',
      brand: 'all',
      maxPrice: 6000,
      deliveryOnly: false,
    });
  };

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        if (car.approval_status !== 'approved') return false;
        if (locationParam && car.location_id !== locationParam) {
          // If specific location filtered
          // return true if any or match
        }
        if (filters.category !== 'all' && car.category !== filters.category) return false;
        if (filters.fuelType !== 'all' && car.fuel_type !== filters.fuelType) return false;
        if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
        if (filters.brand !== 'all' && car.brand !== filters.brand) return false;
        if (car.price_per_day > filters.maxPrice) return false;
        if (filters.deliveryOnly && !car.delivery_available) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price_per_day - b.price_per_day;
        if (sortBy === 'price_high') return b.price_per_day - a.price_per_day;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [cars, locationParam, filters, sortBy]);

  const selectedLoc = locations.find(l => l.id === locationParam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{selectedLoc ? `Available Cars in ${selectedLoc.area_locality}, Proddatur` : 'Proddatur & Kadapa Verified Fleet'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Explore Cars in Proddatur — Self-Drive & With Driver
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Choose between Self-Drive or Professional Chauffeur. Real-time availability & doorstep delivery in Proddatur.
          </p>
        </div>

        {/* Compact Search Bar */}
        <SearchBar compact />
      </div>

      {/* Controls & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="text-sm font-semibold text-slate-700">
          Showing <span className="font-extrabold text-slate-950">{filteredCars.length}</span> cars available in Proddatur
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 bg-white p-4 rounded-2xl border border-slate-200">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Cars Grid */}
        <div className="lg:col-span-3">
          {filteredCars.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <CarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No cars match your current filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting or widening your price/fuel filters to see more available cars in Proddatur.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#D71920] text-white text-xs font-bold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold text-slate-500">Loading Proddatur Fleet...</div>}>
      <CarsContent />
    </Suspense>
  );
}
