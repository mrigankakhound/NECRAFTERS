// Force dynamic rendering to avoid build-time database issues
export const dynamic = 'force-dynamic';

import BannerCarousel from "@/components/home/BannerCarousel";
import dynamicImport from "next/dynamic";

// Reduce initial JS by code-splitting non-critical sections
const CrazyDealsSection = dynamicImport(() => import("@/components/home/CrazyDeals"));
const FeaturedReviewsSection = dynamicImport(() => import("@/components/home/FeaturedReviews"));
const NeedOfWebsiteSection = dynamicImport(() => import("@/components/home/NeedOfWebsite"));
const WhyNeCraftersDiagramSection = dynamicImport(() => import("@/components/home/WhyNeCraftersDiagram"));
const ReviewSectionSection = dynamicImport(() => import("@/components/home/ReviewSection"));
const BlogImagesSection = dynamicImport(() => import("@/components/home/BlogImages"));

import ProductCard from "@/components/home/ProductCard";
import SpecialCombos from "@/components/home/SpecialCombos";
import HashScrollHandler from "@/components/HashScrollHandler";
import React from "react";
import { getWebsiteBanners, getAppBanners } from "@/actions/banner.actions";
import { getSpecialCombos } from "@/actions/special-combos";
import { getCrazyDeals } from "@/actions/crazy-deals";
import { getBestSellerProducts, getFeaturedProducts } from "@/actions/products";
import { getActiveFeaturedReviews } from "@/actions/featured-reviews";

const HomePage = async () => {
  try {
    // Fast server-side data fetching with short timeouts
    const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeoutMs)
        )
      ]);
    };

    // Fetch critical data with longer timeouts to prevent errors
    const [banners, appBanners, specialCombos, bestSellers, crazyDeals, featuredProducts, featuredReviews] = await Promise.allSettled([
      fetchWithTimeout(getWebsiteBanners(), 10000),
      fetchWithTimeout(getAppBanners(), 10000),
      fetchWithTimeout(getSpecialCombos(), 10000),
      getBestSellerProducts(8), // No timeout wrapper - direct call
      fetchWithTimeout(getCrazyDeals(), 10000),
      fetchWithTimeout(getFeaturedProducts(4, 1), 10000),
      fetchWithTimeout(getActiveFeaturedReviews(), 10000)
    ]);

    // Debug logging for troubleshooting


    // Extract data safely with better error handling
    const banners_data = banners.status === 'fulfilled' ? banners.value : { data: [] };
    const app_banners_data = appBanners.status === 'fulfilled' ? appBanners.value : { data: [] };
    const specialCombos_data = specialCombos.status === 'fulfilled' ? specialCombos.value : { data: [] };
    const bestSellers_data = bestSellers.status === 'fulfilled' ? bestSellers.value : { data: [], isFallback: false };
    const crazyDeals_data = crazyDeals.status === 'fulfilled' ? crazyDeals.value : { data: [] };
    const featuredProducts_data = featuredProducts.status === 'fulfilled' ? featuredProducts.value : { data: [] };
    const featuredReviews_data = featuredReviews.status === 'fulfilled' ? featuredReviews.value : { data: [] };

    // Log specific errors for debugging
    if (bestSellers.status === 'rejected') {
      console.error('❌ Best Sellers API failed:', bestSellers.reason);
    }
    if (featuredProducts.status === 'rejected') {
      console.error('❌ Featured Products API failed:', featuredProducts.reason);
    }

    // Debug logging


    // Return the page with data
    return (
      <div>
        <HashScrollHandler />
        <BannerCarousel
          banners={banners_data.data ?? []}
          app_banners={app_banners_data.data ?? []}
        />
        
        <SpecialCombos offers={specialCombos_data.data ?? []} />
        
        {/* Best Sellers Section - Always show products, either best sellers or recent ones */}
        <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center gap-2 mb-4">
                                            <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                BEST SELLERS
              </h2>
            </div>
            
            {bestSellers_data.data && bestSellers_data.data.length > 0 ? (
              <>
                {bestSellers_data.isFallback && (
                  <div className="text-center py-2 text-gray-500 text-sm mb-4">
                    <p>Showing our latest products. Mark products as best sellers in admin to customize this section!</p>
                  </div>
                )}
                <ProductCard
                  shop
                  heading="BEST SELLERS"
                  products={bestSellers_data.data}
                  sectionId="best-sellers"
                />
              </>
            ) : (
              // Show a message when no products exist at all
              <div className="text-center py-8 text-gray-500">
                <p>No products available at the moment.</p>
                <p className="text-sm mt-2">Please check back later!</p>
              </div>
            )}
          </div>
        </div>

        <CrazyDealsSection offers={crazyDeals_data.data ?? []} />
        <FeaturedReviewsSection reviews={featuredReviews_data.data?.map((review: any) => ({
          ...review,
          description: review.description || undefined,
          customerName: review.customerName || undefined,
          reviewText: review.reviewText || undefined,
          productName: review.productName || undefined,
          image: {
            ...review.image,
            url: review.image.url || undefined,
            public_id: review.image.public_id || undefined
          }
        })) ?? []} />
        
        {/* Featured Products Section - Always visible like best sellers */}
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                FEATURED PRODUCTS
              </h2>
            </div>
            
            {featuredProducts_data.data && featuredProducts_data.data.length > 0 ? (
              <ProductCard
                shop
                heading="FEATURED PRODUCTS"
                products={featuredProducts_data.data}
                sectionId="featured-products"
              />
            ) : (
              // Show a message when no featured products exist
              <div className="text-center py-8 text-gray-500">
                <p>No featured products available at the moment.</p>
                <p className="text-sm mt-2">Mark products as featured in admin to see them here!</p>
              </div>
            )}
          </div>
        </div>
        <NeedOfWebsiteSection />
        <WhyNeCraftersDiagramSection />
        <ReviewSectionSection />
        <BlogImagesSection />
      </div>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    // Return fallback content if data fetching fails
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to NE CRAFTERS</h1>
          <p className="text-gray-600">Loading amazing products for you...</p>
          <p className="text-sm text-gray-500 mt-2">Please refresh the page to see the latest content.</p>
        </div>
      </div>
    );
  }
};

export default HomePage;
