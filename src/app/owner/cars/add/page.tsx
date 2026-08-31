'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  Trash2, 
  Star, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '@/lib/mock-data/client-store';
import { CAR_BRANDS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

interface UploadedImage {
  id: string;
  url: string;
  isPrimary: boolean;
  name: string;
}

export default function AddCarPage() {
  const router = useRouter();
  const { addCar, locations } = useMarketplace();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [brand, setBrand] = useState('Hyundai');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('SX Automatic');
  const [year, setYear] = useState(2024);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState('petrol');
  const [transmission, setTransmission] = useState('automatic');
  const [category, setCategory] = useState('suv');
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [pricePerDay, setPricePerDay] = useState(2800);
  const [securityDeposit, setSecurityDeposit] = useState(2500);
  const [locationId, setLocationId] = useState(locations[0]?.id || '');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [deliveryCharges, setDeliveryCharges] = useState(250);
  const [description, setDescription] = useState('');

  // Multi-image upload state
  const [images, setImages] = useState<UploadedImage[]>([
    {
      id: 'default-1',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
      isPrimary: true,
      name: 'Sample Cover Photo',
    }
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle local file uploads (with Supabase storage integration)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const supabase = createClient();
    const newUploads: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `car-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `vehicles/${fileName}`;

      try {
        // Try uploading to Supabase Storage bucket 'car-images'
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        let publicUrl = '';

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from('car-images')
            .getPublicUrl(filePath);
          publicUrl = urlData.publicUrl;
        } else {
          // Client-side fallback preview URL
          publicUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        newUploads.push({
          id: 'img-' + Date.now() + '-' + i,
          url: publicUrl,
          isPrimary: images.length === 0 && i === 0,
          name: file.name,
        });
      } catch (err: any) {
        console.error('File upload error:', err);
      }
    }

    if (newUploads.length > 0) {
      setImages(prev => [...prev, ...newUploads]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setAsPrimary = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id,
    })));
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setUploadError('Please upload at least 1 photo of your car.');
      return;
    }

    try {
      setSubmitting(true);
      await addCar({
        brand,
        model,
        variant,
        year: Number(year),
        registration_number: registrationNumber.toUpperCase(),
        fuel_type: fuelType as any,
        transmission: transmission as any,
        category: category as any,
        seating_capacity: Number(seatingCapacity),
        price_per_day: Number(pricePerDay),
        security_deposit: Number(securityDeposit),
        delivery_available: deliveryAvailable,
        delivery_charges: deliveryAvailable ? Number(deliveryCharges) : 0,
        location_id: locationId,
        description: description || `${brand} ${model} ${variant} in pristine condition. Well-maintained and sanitized for your trip across Andhra Pradesh.`,
        images: images.map((img, idx) => ({
          id: img.id,
          image_url: img.url,
          is_primary: img.isPrimary || idx === 0,
        })),
      });

      setSuccess(true);
      setTimeout(() => router.push('/owner/dashboard'), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-montserrat">
      
      {/* Back button */}
      <Link href="/owner/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#D71920] transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Host Dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        
        {/* Header */}
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#D71920] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Host Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            List Your Car for Rent in Proddatur
          </h1>
          <p className="text-xs text-slate-500">
            Earn ₹25,000 – ₹60,000 monthly by renting your vehicle to verified customers in Proddatur and Kadapa.
          </p>
        </div>

        {success ? (
          <div className="py-12 text-center text-[#D71920] font-bold space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#D71920] flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Vehicle Submitted Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your car has been submitted to the Admin for inspection and verification. It will be live on RENTVORA within 2–4 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
            
            {/* Section 1: Basic Specifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                1. Vehicle Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Brand / Make</label>
                  <select 
                    value={brand} 
                    onChange={e => setBrand(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Model Name</label>
                  <input 
                    required 
                    placeholder="e.g. Creta, Swift, Thar, Innova" 
                    value={model} 
                    onChange={e => setModel(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none" 
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Variant</label>
                  <input 
                    placeholder="e.g. SX (O), ZXi+, Top Model" 
                    value={variant} 
                    onChange={e => setVariant(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Registration Number (AP Plate)</label>
                  <input 
                    required 
                    placeholder="AP 04 XX 1234" 
                    value={registrationNumber} 
                    onChange={e => setRegistrationNumber(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl uppercase font-black text-slate-900 outline-none" 
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Year of Manufacture</label>
                  <input 
                    type="number" 
                    min={2012} 
                    max={2026} 
                    value={year} 
                    onChange={e => setYear(Number(e.target.value))} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none" 
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Transmission</label>
                  <select 
                    value={transmission} 
                    onChange={e => setTransmission(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none capitalize"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Fuel Type</label>
                  <select 
                    value={fuelType} 
                    onChange={e => setFuelType(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none capitalize"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric (EV)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Pickup Point */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                2. Pricing & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Daily Rental Fare (₹ / 24 hrs)</label>
                  <input 
                    type="number" 
                    required 
                    min={1000} 
                    step={100} 
                    value={pricePerDay} 
                    onChange={e => setPricePerDay(Number(e.target.value))} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none" 
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Refundable Security Deposit (₹)</label>
                  <input 
                    type="number" 
                    required 
                    min={1000} 
                    step={500} 
                    value={securityDeposit} 
                    onChange={e => setSecurityDeposit(Number(e.target.value))} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none" 
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 mb-1.5">Primary Proddatur Pickup Hub</label>
                  <select 
                    value={locationId} 
                    onChange={e => setLocationId(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.area_locality} ({l.pickup_point_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Live Photo Upload (Supabase Storage) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    3. Vehicle Photos (Live Upload)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload high-res photos (Front, Side, Rear, Interiors). Click the star ⭐ on any photo to set it as the Cover Photo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#D71920]" />}
                  <span>+ Upload Photos</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Drag and Drop / Empty State */}
              {images.length === 0 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#D71920] rounded-3xl p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-red-50/20 space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    <ImageIcon className="w-6 h-6 text-[#D71920]" />
                  </div>
                  <div className="font-bold text-slate-800 text-xs">Click here to upload photos from your device</div>
                  <div className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP up to 10 MB each</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div 
                      key={img.id}
                      className={`group relative rounded-2xl overflow-hidden border-2 bg-slate-100 aspect-video shadow-xs transition ${
                        img.isPrimary ? 'border-[#D71920] ring-2 ring-red-200' : 'border-slate-200'
                      }`}
                    >
                      <img src={img.url} alt="vehicle" className="w-full h-full object-cover" />

                      {/* Primary Cover Badge */}
                      {img.isPrimary && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#D71920] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                          Cover Photo
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setAsPrimary(img.id)}
                            title="Set as Cover Photo"
                            className="p-1.5 rounded-lg bg-white/90 text-amber-600 hover:bg-white transition"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          title="Delete photo"
                          className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add More Tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="border-2 border-dashed border-slate-300 hover:border-[#D71920] rounded-2xl aspect-video flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-[#D71920] transition bg-slate-50 hover:bg-red-50/20"
                  >
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] font-bold">+ Add Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 4: Description */}
            <div className="space-y-2 pt-2">
              <label className="font-bold block text-slate-700">Vehicle Description & Host Notes</label>
              <textarea 
                rows={3} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Mention sanitization condition, fuel policy, any special features like sunroof or cruise control..." 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl font-medium text-slate-800 outline-none text-xs leading-relaxed" 
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting || uploading} 
                className="w-full py-4 rounded-2xl bg-[#D71920] hover:bg-[#b8141a] active:scale-[0.98] disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-[#D71920]/30 transition flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>{submitting ? 'Submitting to Admin Queue...' : 'Submit Vehicle for Admin Approval'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
