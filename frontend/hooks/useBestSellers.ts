import useSWR from 'swr';

interface BestSellerProduct {
  id: string;
  title: string;
  slug: string;
  discount: number;
  rating: number;
  bestSeller: boolean;
  featured: boolean;
  images: { url: string; public_id: string }[];
  sizes: { price: number; size: string; qty: number; sold: number }[];
  numReviews: number;
  sold: number;
}

interface BestSellersResponse {
  success: boolean;
  data: BestSellerProduct[];
  isFallback: boolean;
  error?: string;
}

const fetcher = async (url: string): Promise<BestSellersResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch best sellers');
  }
  return response.json();
};

export const useBestSellers = (limit: number = 8) => {
  const { data, error, isLoading, mutate } = useSWR<BestSellersResponse>(
    `/api/products/best-sellers?limit=${limit}`,
    fetcher,
    {
      // Cache for 5 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      // Prefetch data when hovering over navigation
      onSuccess: (data) => {
        if (data?.success && data.data?.length > 0) {
          // Prefetch product detail pages
          data.data.forEach(product => {
            if (product.slug) {
              // Prefetch product detail page
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = `/product/${product.slug}`;
              document.head.appendChild(link);
            }
          });
        }
      },
    }
  );

  return {
    bestSellers: data?.data || [],
    isLoading,
    error,
    isFallback: data?.isFallback || false,
    mutate,
    success: data?.success || false,
  };
};
