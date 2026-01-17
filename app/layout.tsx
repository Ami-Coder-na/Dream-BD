
import React from 'react';
import './globals.css';
import { SiteConfigProvider } from '../contexts/SiteConfigContext';
import { DataProvider } from '../contexts/DataContext';
import Script from 'next/script';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Desh BD - বাংলাদেশের সেরা ডিজিটাল সেবা পোর্টাল | কৃষি, স্বাস্থ্য ও শিক্ষা',
  description: 'বাংলাদেশের একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম যা কারুশিল্প, কৃষি তথ্য, শিক্ষা, স্বাস্থ্য সেবা, পরিবহন এবং দুর্যোগ ব্যবস্থাপনা সেবা প্রদান করে। স্মার্ট বাংলাদেশের পূর্ণাঙ্গ সমাধান এখন এক ঠিকানায়।',
  keywords: 'digital desh bd, bangladesh digital services, কৃষি তথ্য, স্বাস্থ্য সেবা, অনলাইন শিক্ষা, চাকরির খবর, মিঠু এআই, সোনালী দেশ, ডিজিটাল বাংলাদেশ, smart bangladesh',
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
    description: 'কৃষি, স্বাস্থ্য, শিক্ষা ও পরিবহন সেবা এখন আপনার হাতের মুঠোয়। ডিজিটাল বাংলাদেশের এক নতুন দিগন্ত।',
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
    description: 'এক প্ল্যাটফর্মে কৃষি, শিক্ষা, স্বাস্থ্য ও পরিবহন সব সেবা।',
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
