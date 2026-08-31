import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Phone, ArrowLeft, Fuel, Clock, MapPin } from 'lucide-react';

export default function RentalAgreementPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-montserrat">
      
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#D71920] transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2 pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#D71920] border border-red-200 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>Official Agreement</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Standard Self-Drive Rental Agreement</h1>
        <p className="text-xs text-slate-500">
          Last Updated: September 2026 • Governing Law: Andhra Pradesh Motor Vehicles Rules & Indian Contract Act
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
        
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
          <h3 className="font-extrabold text-sm text-slate-900 m-0">1. Parties to the Agreement</h3>
          <p className="m-0">
            This Self-Drive Car Rental Agreement is entered into between the <strong>Verified Vehicle Host / Owner</strong> ("Lessor") and the <strong>Customer / Renter</strong> ("Lessee") through <strong>RENTVORA Car Rentals</strong> ("Platform Intermediary").
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900">2. Eligibility & Document Verification</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The Lessee must be at least <strong>21 years of age</strong> at the time of booking.</li>
            <li>The Lessee must possess a valid, original <strong>Indian Driving License (Light Motor Vehicle - LMV)</strong> with at least 1 year of driving history.</li>
            <li>Lessee must produce their Original Driving License and Original Government ID (Aadhaar / Passport) at the time of vehicle physical handover in Proddatur/Kadapa.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900">3. Handover & Return Protocol</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D71920]" /> Punctuality</span>
              <p className="text-xs text-slate-500">A grace period of 30 minutes is allowed for vehicle return. Late returns beyond 30 mins are charged at the hourly rate.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-[#D71920]" /> Fuel Policy</span>
              <p className="text-xs text-slate-500">Same-to-same fuel policy. The Lessee is required to return the vehicle with the same fuel level as received during handover.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" /> 360° Inspection</span>
              <p className="text-xs text-slate-500">Both parties must record vehicle odometer, fuel gauge, and exterior photos on their phones before handover.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900">4. Permitted Driving Zones & Territory</h3>
          <p>
            RENTVORA vehicles are permitted to be driven across <strong>Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu</strong>. Prior notification via WhatsApp (+91 78938 17322) is required for interstate highway trips to ensure toll and permit clearances.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900">5. Security Deposit & Refund Timeline</h3>
          <p>
            The refundable security deposit (₹2,000–₹2,500) will be <strong>100% refunded within 24 hours</strong> of vehicle return after verifying that no RTO challans or major body damages occurred during the trip.
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-[#D71920]" /> Prohibited Activities:</span>
          <p className="m-0">
            Sub-leasing the vehicle, driving under the influence of alcohol/narcotics, racing, off-roading, and commercial taxi usage without a commercial badge are strictly prohibited and will result in forfeiture of deposit and legal reporting.
          </p>
        </div>

      </div>
    </div>
  );
}
