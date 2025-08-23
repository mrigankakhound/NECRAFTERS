import type { Metadata } from "next";
import { Caudex } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "sonner";
import TopBar from "@/components/TopBar";

const caudex = Caudex({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NE CRAFTERS - Premium Chili Oil, Spices & Northeast Indian Flavors",
  description: "Discover authentic Northeast Indian chili oil, premium spices, and traditional flavors. Shop the best quality chili oil, spice blends, and regional delicacies. Free shipping on orders above ₹499.",
  keywords: "chili oil, northeast indian spices, premium spices, traditional flavors, chili oil online, spice blends, regional delicacies, authentic indian spices, hot chili oil, gourmet spices",
  authors: [{ name: "NE CRAFTERS" }],
  creator: "NE CRAFTERS",
  publisher: "NE CRAFTERS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://necrafters.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "NE CRAFTERS - Premium Chili Oil & Northeast Indian Spices",
    description: "Authentic Northeast Indian chili oil, premium spices, and traditional flavors. Shop the best quality chili oil and spice blends online.",
    url: 'https://necrafters.com',
    siteName: 'NE CRAFTERS',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NE CRAFTERS - Premium Chili Oil and Spices',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NE CRAFTERS - Premium Chili Oil & Northeast Indian Spices',
    description: 'Authentic Northeast Indian chili oil, premium spices, and traditional flavors.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon_io/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NE CRAFTERS",
              "description": "Premium Northeast Indian chili oil, spices, and traditional flavors",
              "url": "https://necrafters.com",
              "logo": "https://necrafters.com/images/logo.png",
              "sameAs": [
                "https://facebook.com/necrafters",
                "https://instagram.com/necrafters",
                "https://twitter.com/necrafters"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-XXXXXXXXXX",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": "English, Hindi"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "Northeast India"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Chili Oil and Spices",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Premium Chili Oil",
                      "description": "Authentic Northeast Indian chili oil"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Spice Blends",
                      "description": "Traditional spice mixtures"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${caudex.className} antialiased`}>
        <TopBar />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}