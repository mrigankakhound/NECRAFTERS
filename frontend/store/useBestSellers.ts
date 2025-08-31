import { create } from 'zustand';

interface BestSellerProduct {
  id: string;
  title: string;
  images: { url: string }[];
  slug: string;
  discount?: number;
  rating?: number;
  bestSeller?: boolean;
  featured?: boolean;
  sizes?: { price: number; size: string; qty: number }[];
}

interface BestSellersStore {
  products: BestSellerProduct[];
  isLoading: boolean;
  isLoaded: boolean;
  setProducts: (products: BestSellerProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  fetchBestSellers: (limit?: number) => Promise<BestSellerProduct[]>;
}

export const useBestSellers = create<BestSellersStore>((set, get) => ({
  products: [],
  isLoading: false,
  isLoaded: false,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  
  // Smart function that only fetches if not already loaded
  fetchBestSellers: async (limit = 8) => {
    const { isLoaded, products, setProducts, setLoading, setLoaded } = get();
    
    // If already loaded and we have enough products, return existing data
    if (isLoaded && products.length >= limit) {
      return products.slice(0, limit);
    }
    
    // If already loading, wait a bit and return existing data
    if (get().isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return get().products.slice(0, limit);
    }
    
    // Fetch new data
    setLoading(true);
    try {
      const response = await fetch(`/api/products/best-sellers?limit=${Math.max(limit, 8)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProducts(data.data);
          setLoaded(true);
          return data.data.slice(0, limit);
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    } finally {
      setLoading(false);
    }
  },
}));
