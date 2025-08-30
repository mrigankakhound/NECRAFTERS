"use client";

import React, { useState, useEffect } from 'react';
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Show popup after a short delay when user enters shop
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <ShopPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      {children}
    </>
  );
}