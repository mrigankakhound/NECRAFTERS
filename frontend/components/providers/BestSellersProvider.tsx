"use client";

import { useEffect } from 'react';
import { useBestSellers } from '@/store/useBestSellers';

interface BestSellersProviderProps {
  children: React.ReactNode;
  initialData?: any[];
}

export function BestSellersProvider({ children, initialData }: BestSellersProviderProps) {
  const { setProducts, setLoaded } = useBestSellers();

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setProducts(initialData);
      setLoaded(true);
    }
  }, [initialData, setProducts, setLoaded]);

  return <>{children}</>;
}
