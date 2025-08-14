"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ShopPopup with no SSR to avoid hydration issues
const ShopPopup = dynamic(() => import('@/components/ShopPopup'), {
  ssr: false,
});

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ShopPopup />
      {children}
    </>
  );
}