import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function Logo({
  className = '',
  variant = 'auto',
  size = 'md',
  showSubtitle = true,
}: LogoProps) {
  const isDarkBg = variant === 'dark';

  const textSizes = {
    sm: { main: 'text-xl', sub: 'text-[8px]', img: 'h-10 w-10' },
    md: { main: 'text-2xl sm:text-[26px]', sub: 'text-[9px] sm:text-[10px]', img: 'h-12 w-12 sm:h-14 sm:w-14' },
    lg: { main: 'text-3xl sm:text-4xl', sub: 'text-[11px] sm:text-[12px]', img: 'h-16 w-16 sm:h-20 sm:w-20' },
  }[size];

  if (isDarkBg) {
    return (
      <Link href="/" className={`inline-flex items-center gap-3.5 group cursor-pointer ${className}`}>
        <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-slate-700/60 group-hover:scale-105 transition-transform duration-300">
          <img
            src="/images/rentvora-logo.png"
            alt="RENTVORA Car Rental"
            className="h-12 w-12 object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-extrabold uppercase leading-none tracking-[0.18em] text-white flex items-center text-2xl">
            <span>RENT</span>
            <span className="text-[#D71920] ml-0.5">VORA</span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-[1px] w-3 bg-slate-600" />
              <span className="font-bold uppercase tracking-[0.35em] text-[9px] text-slate-400">
                CAR RENTAL
              </span>
              <span className="h-[1px] w-3 bg-slate-600" />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Logo Image */}
      <div className={`relative ${textSizes.img} rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-slate-50 border border-slate-200/80 p-1 shadow-xs`}>
        <img
          src="/images/rentvora-logo.png"
          alt="RENTVORA Mark"
          className="w-full h-full object-contain mix-blend-multiply scale-110"
        />
      </div>

      {/* Brand Typography matching logo font */}
      <div className="flex flex-col justify-center">
        <div className={`font-black uppercase leading-none tracking-[0.16em] flex items-center ${textSizes.main}`}>
          <span className="text-[#111111] font-black">
            RENT
          </span>
          <span className="text-[#D71920] font-black tracking-[0.18em] ml-0.5">
            VORA
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-[1px] w-3 bg-slate-300" />
            <span className={`font-extrabold uppercase tracking-[0.32em] leading-none ${textSizes.sub} text-slate-500`}>
              CAR RENTAL
            </span>
            <span className="h-[1px] w-3 bg-slate-300" />
          </div>
        )}
      </div>
    </Link>
  );
}
