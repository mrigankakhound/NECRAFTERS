"use client";

import { useBestSellers } from "@/hooks/useBestSellers";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../ui/loading-spinner";

const BestSellersSectionClient = () => {
  const { bestSellers, isLoading, error, isFallback, success } = useBestSellers(8);

  // Show loading state
  if (isLoading) {
    return (
      <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
        <div className="section-container">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              BEST SELLERS
            </h2>
          </div>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !success) {
    return (
      <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
        <div className="section-container">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              BEST SELLERS
            </h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load best sellers at the moment.</p>
            <p className="text-sm mt-2">Please check back later!</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!bestSellers || bestSellers.length === 0) {
    return (
      <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
        <div className="section-container">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              BEST SELLERS
            </h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>No best sellers available at the moment.</p>
            <p className="text-sm mt-2">Please check back later!</p>
          </div>
        </div>
      </div>
    );
  }

  // Show products
  return (
    <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
            BEST SELLERS
          </h2>
        </div>
        
        <ProductCard
          shop
          heading="BEST SELLERS"
          products={bestSellers as any}
          sectionId="best-sellers"
          isCached={isFallback}
        />
      </div>
    </div>
  );
};

export default BestSellersSectionClient;
