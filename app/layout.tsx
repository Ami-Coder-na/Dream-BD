
import React from 'react';
import './globals.css';
import { SiteConfigProvider } from '../contexts/SiteConfigContext';
import { DataProvider } from '../contexts/DataContext';
import Script from 'next/script';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Desh BD - রমজান ক্যালেন্ডার ২০২৬, জন্ম নিবন্ধন ও ডিজিটাল সেবা',
  description: 'Digital Desh BD: রমজান ক্যালেন্ডার ২০২৬, সেহরি ও ইফতারের সঠিক সময়সূচি, জন্ম ও মৃত্যু নিবন্ধন চেক/সংশোধন, জাতীয় পরিচয়পত্র, চাকরি খুঁজুন, সিভি জেনারেটর, ডিজিটাল আমিন ও আইনি পরামর্শ এবং আমার জেলার সব তথ্য এক ঠিকানায়। স্মার্ট বাংলাদেশ গড়ার ডিজিটাল সমাধান।',
  keywords: 'Digital Desh BD, Digital Bangladesh, Bangladesh, Digital Solutions, Smart Bangladesh, News, রমজান ক্যালেন্ডার ২০২৬, আপনার জেলার সেহরি ও ইফতারের সঠিক সময়সূচি, জন্ম নিবন্ধন চেক, মৃত্যু নিবন্ধন চেক, জন্ম নিবন্ধন সংশোধন এর আবেদন, উন্মুক্ত বিশ্ববিদ্যালয়, জাতীয় পরিচয়পত্র আবেদনপ্রক্রিয়া, চাকরি খুঁজুন, সিভি জেনারেটর, ডিজিটাল আমিন ও আইনি পরামর্শ, হাজার বছরের ইতিহাস, আমার বাংলাদেশ, আমার জেলা, স্মার্ট বাংলাদেশ গঠন, কৃষি তথ্য, স্বাস্থ্য সেবা, Online Seba, BD Government Services',
  authors: [{ name: 'Digital Desh BD Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://digitaldeshbd.com',
  },
  verification: {
    google: 'Gflhyh1ek3bvLRUbzKcAcOUbhH88bVFFK-8XCZsl1Yo',
  },
  openGraph: {
    title: 'Digital Desh BD - স্মার্ট বাংলাদেশের সমন্বিত ডিজিটাল সমাধান',
    description: 'রমজান ক্যালেন্ডার ২০২৬, জন্ম নিবন্ধন, চাকরি ও সব সরকারি সেবা এক অ্যাপে। ডিজিটাল দেশ - স্মার্ট সমাধান।',
    url: 'https://digitaldeshbd.com',
    siteName: 'Digital Desh BD',
    images: [
      {
        url: 'https://zpsxpqurazjeqviwooky.supabase.co/storage/v1/object/public/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Digital Desh BD Logo',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Desh BD - আপনার ডিজিটাল সেবার সাথী',
    description: 'রমজান ২০২৬, জন্ম নিবন্ধন, চাকরি ও সিভি জেনারেটর সহ সব ডিজিটাল সেবা।',
    images: ['https://zpsxpqurazjeqviwooky.supabase.co/storage/v1/object/public/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Environment Shim for Mobile */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.process = window.process || {};
            window.process.env = window.process.env || { NODE_ENV: 'production' };
            window.global = window.global || window;
          `
        }} />

        {/* Organization Schema for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Digital Desh BD",
              "url": "https://digitaldeshbd.com/",
              "logo": "https://zpsxpqurazjeqviwooky.supabase.co/storage/v1/object/public/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+8801700000000",
                "contactType": "customer service"
              }
            })
          }}
        />

        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5489591650679633"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <SiteConfigProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
