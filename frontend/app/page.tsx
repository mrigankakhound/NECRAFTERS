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

    // Fetch critical data with very short timeouts
    const [banners, appBanners, specialCombos, bestSellers, crazyDeals, featuredProducts, featuredReviews] = await Promise.allSettled([
      fetchWithTimeout(getWebsiteBanners(), 3000),
      fetchWithTimeout(getAppBanners(), 3000),
      fetchWithTimeout(getSpecialCombos(), 3000),
      fetchWithTimeout(getBestSellerProducts(8), 10000),
      fetchWithTimeout(getCrazyDeals(), 3000),
      fetchWithTimeout(getFeaturedProducts(4, 1), 3000),
      fetchWithTimeout(getActiveFeaturedReviews(), 3000)
    ]);

    // Debug logging for troubleshooting
    console.log('🔍 All API Responses:');
    console.log('Banners:', banners.status, banners.status === 'fulfilled' ? banners.value?.data?.length || 0 : 'rejected');
    console.log('App Banners:', appBanners.status, appBanners.status === 'fulfilled' ? appBanners.value?.data?.length || 0 : 'rejected');
    console.log('Special Combos:', specialCombos.status, specialCombos.status === 'fulfilled' ? specialCombos.value?.data?.length || 0 : 'rejected');
    console.log('Best Sellers:', bestSellers.status, bestSellers.status === 'fulfilled' ? bestSellers.value?.data?.length || 0 : 'rejected');
    console.log('Crazy Deals:', crazyDeals.status, crazyDeals.status === 'fulfilled' ? crazyDeals.value?.data?.length || 0 : 'rejected');
    console.log('Featured Products:', featuredProducts.status, featuredProducts.status === 'fulfilled' ? featuredProducts.value?.data?.length || 0 : 'rejected');
    console.log('Featured Reviews:', featuredReviews.status, featuredReviews.status === 'fulfilled' ? featuredReviews.value?.data?.length || 0 : 'rejected');

    // Extract data safely with better error handling
    const banners_data = banners.status === 'fulfilled' ? banners.value : { data: [] };
    const app_banners_data = appBanners.status === 'fulfilled' ? appBanners.value : { data: [] };
    const specialCombos_data = specialCombos.status === 'fulfilled' ? specialCombos.value : { data: [] };
    const bestSellers_data = bestSellers.status === 'fulfilled' ? bestSellers.value : { data: [] };
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
    console.log('🔍 Best Sellers Data:', bestSellers_data);
    console.log('🔍 Best Sellers Status:', bestSellers.status);
    console.log('🔍 Best Sellers Length:', bestSellers_data.data?.length);

    // Return the page with data
    return (
      <div>
        <HashScrollHandler />
        <BannerCarousel
          banners={banners_data.data ?? []}
          app_banners={app_banners_data.data ?? []}
        />
        
        <SpecialCombos offers={specialCombos_data.data ?? []} />
        
        {/* Best Sellers Section - Only show if admin has marked products as best sellers */}
        {bestSellers_data.data && bestSellers_data.data.length > 0 ? (
          <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
            <div className="section-container">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-lg font-bold sm:text-3xl text-center w-full relative py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  BEST SELLERS
                </h2>
              </div>
              <ProductCard
                shop
                heading="BEST SELLERS"
                products={bestSellers_data.data}
                sectionId="best-sellers"
              />
            </div>
          </div>
        ) : (
          // Show a message when no best sellers exist
          <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
            <div className="section-container">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-lg font-bold sm:text-3xl text-center w-full relative py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  BEST SELLERS
                </h2>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p>No best sellers available at the moment.</p>
                <p className="text-sm mt-2">Check back soon for our top products!</p>
              </div>
            </div>
          </div>
        )}

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
        
        {/* Featured Products Section - Always show if we have featured products */}
        {featuredProducts_data.data && featuredProducts_data.data.length > 0 && (
          <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
            <div className="section-container">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-xl font-bold sm:text-4xl text-center w-full relative py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  FEATURED PRODUCTS
                </h2>
              </div>
              <ProductCard
                shop
                heading="FEATURED PRODUCTS"
                products={featuredProducts_data.data}
                sectionId="featured-products"
              />
            </div>
          </div>
        )}
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
