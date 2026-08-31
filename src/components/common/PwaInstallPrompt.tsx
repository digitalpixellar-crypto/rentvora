'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share2, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Service Worker registration failed:', err);
      });
    }

    // 2. Check if already installed / standalone
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // 3. Check if user recently dismissed the prompt
    const dismissed = localStorage.getItem('rentvora_pwa_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 1000 * 60 * 60 * 24 * 3) {
      return; // Dismissed within 3 days
    }

    // 4. iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 5. Android / Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt on mobile after 3 seconds if not installed
    const timer = setTimeout(() => {
      if (isIosDevice && !isStandaloneMode) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('rentvora_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <aside aria-label="Mobile app installation prompt" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#111111] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-red-500/40 backdrop-blur-xl relative flex items-center justify-between gap-4">
        
        {/* App Icon & Details */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 shrink-0 shadow-md flex items-center justify-center">
            <img
              src="/images/rentvora-logo.png"
              alt="RENTVORA App"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-wide">Install RENTVORA</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D71920] font-bold uppercase tracking-wider text-white">App</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {isIOS ? 'Tap Share ⎋ then "Add to Home Screen"' : '1-Tap instant car booking in Proddatur'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {isIOS ? (
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              <Share2 className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Share ⎋</span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D71920] hover:bg-[#b8141a] active:scale-95 text-white font-bold text-xs shadow-md shadow-[#D71920]/30 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Dismiss installation prompt"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
