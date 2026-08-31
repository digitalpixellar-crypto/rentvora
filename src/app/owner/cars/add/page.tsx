'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { CAR_BRANDS } from '@/lib/constants';

export default function AddCarPage() {
  const router = useRouter();
  const { addCar, locations } = useMarketplace();
  const [brand, setBrand] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('VXi');
  const [year, setYear] = useState(2024);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState('petrol');
  const [transmission, setTransmission] = useState('manual');
  const [category, setCategory] = useState('hatchback');
  const [pricePerDay, setPricePerDay] = useState(2000);
  const [securityDeposit, setSecurityDeposit] = useState(2000);
  const [locationId, setLocationId] = useState(locations[0]?.id || '');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addCar({
        brand,
        model,
        variant,
        year,
        registration_number: registrationNumber.toUpperCase(),
        fuel_type: fuelType as any,
        transmission: transmission as any,
        category: category as any,
        price_per_day: Number(pricePerDay),
        security_deposit: Number(securityDeposit),
        location_id: locationId,
        description,
        images: [{ id: 'img-' + Date.now(), image_url: photoUrl, is_primary: true }],
      });
      setSuccess(true);
      setTimeout(() => router.push('/owner/dashboard'), 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/owner/dashboard" className="flex items-center gap-1 text-xs font-bold text-slate-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Owner Dashboard</span>
      </Link>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-2xl font-black text-slate-900">List Your Car for Rent in Proddatur</h1>
        {success ? (
          <div className="py-8 text-center text-emerald-600 font-bold space-y-2">
            <CheckCircle className="w-12 h-12 mx-auto" />
            <p>Vehicle submitted for Admin Approval! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">Brand</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold">
                  {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Model Name</label>
                <input required placeholder="e.g. Swift, Creta" value={model} onChange={e => setModel(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">Registration Number</label>
                <input required placeholder="AP 04 XX 1234" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl uppercase font-semibold" />
              </div>
              <div>
                <label className="font-bold block mb-1">Manufacturing Year</label>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-bold block mb-1">Fuel Type</label>
                <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold capitalize">
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Transmission</label>
                <select value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold capitalize">
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold capitalize">
                  <option value="hatchback">Hatchback</option>
                  <option value="suv">SUV</option>
                  <option value="seven_seater">7-Seater</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">Rental Price / Day (₹)</label>
                <input type="number" value={pricePerDay} onChange={e => setPricePerDay(Number(e.target.value))} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
              </div>
              <div>
                <label className="font-bold block mb-1">Refundable Deposit (₹)</label>
                <input type="number" value={securityDeposit} onChange={e => setSecurityDeposit(Number(e.target.value))} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Proddatur Pickup Hub</label>
              <select value={locationId} onChange={e => setLocationId(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold">
                {locations.map(l => <option key={l.id} value={l.id}>{l.area_locality} ({l.pickup_point_name})</option>)}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Car Photo URL</label>
              <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold" />
            </div>

            <div>
              <label className="font-bold block mb-1">Vehicle Description</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Condition, mileage, clean interiors..." className="w-full bg-slate-50 border p-2.5 rounded-xl font-medium" />
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition">
              {submitting ? 'Submitting...' : 'Submit Vehicle for Admin Approval'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
