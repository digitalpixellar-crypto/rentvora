import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PwaInstallPrompt from '@/components/common/PwaInstallPrompt';
import WhatsAppWidget from '@/components/common/WhatsAppWidget';
import { MarketplaceProvider } from '@/lib/mock-data/client-store';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#D71920',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'RENTVORA | Self Drive Car Rentals in Proddatur & Andhra Pradesh',
  description: 'Rent verified self-drive cars in Proddatur, Andhra Pradesh. Best prices on Maruti Swift, Hyundai Creta, Innova Crysta, Thar & Nexon. Verified owners, zero hidden fees, instant booking.',
  keywords: 'rentvora, car rental proddatur, self drive car rental proddatur, rent a car in proddatur, cars for rent proddatur, self drive cars kadapa, andhra pradesh car rental',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RENTVORA',
  },
  icons: {
    icon: '/images/rentvora-logo.png',
    apple: '/images/rentvora-logo.png',
  },
  openGraph: {
    title: 'RENTVORA — Premier Self-Drive Car Rental Marketplace',
    description: 'Book verified self-drive cars in Proddatur & Kadapa. Transparent pricing & refundable security deposit.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'RENTVORA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-montserrat antialiased flex flex-col min-h-screen bg-white text-[#111111]">
        <MarketplaceProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <PwaInstallPrompt />
          <WhatsAppWidget />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
