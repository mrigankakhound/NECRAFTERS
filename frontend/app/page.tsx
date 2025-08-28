import BannerCarousel from "@/components/home/BannerCarousel";
import dynamic from "next/dynamic";

// Reduce initial JS by code-splitting non-critical sections
const CrazyDealsSection = dynamic(() => import("@/components/home/CrazyDeals"));
const FeaturedReviewsSection = dynamic(() => import("@/components/home/FeaturedReviews"));
const NeedOfWebsiteSection = dynamic(() => import("@/components/home/NeedOfWebsite"));
const WhyNeCraftersDiagramSection = dynamic(() => import("@/components/home/WhyNeCraftersDiagram"));
const ReviewSectionSection = dynamic(() => import("@/components/home/ReviewSection"));
const BlogImagesSection = dynamic(() => import("@/components/home/BlogImages"));

import ProductCard from "@/components/home/ProductCard";
import SpecialCombos from "@/components/home/SpecialCombos";
import HashScrollHandler from "@/components/HashScrollHandler";
import React from "react";
import { getWebsiteBanners, getAppBanners } from "@/actions/banner.actions";
import { getSpecialCombos } from "@/actions/special-combos";
import { getCrazyDeals } from "@/actions/crazy-deals";
import { getBestSellerProducts, getFeaturedProducts } from "@/actions/products";
import { getMainCategories } from "@/actions/categories/get-main-categories";
import { getActiveFeaturedReviews } from "@/actions/featured-reviews";

const HomePage = async () => {
  // Simple timeout wrapper to prevent build hanging
  const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number): Promise<any> => {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ]);
  };

  try {
    // Fetch critical data first with timeouts
    const [website_banners, app_banners, specialCombos, bestSellers] = await Promise.allSettled([
      fetchWithTimeout(getWebsiteBanners(), 8000),
      fetchWithTimeout(getAppBanners(), 8000),
      fetchWithTimeout(getSpecialCombos(), 8000),
      fetchWithTimeout(getBestSellerProducts(8), 8000)
    ]);

    // Fetch remaining data with timeouts
    const [crazyDeals, featuredProducts, featuredReviews] = await Promise.allSettled([
      fetchWithTimeout(getCrazyDeals(), 12000),
      fetchWithTimeout(getFeaturedProducts(4, 1), 12000),
      fetchWithTimeout(getActiveFeaturedReviews(), 12000)
    ]);

    // Extract data safely
    const banners = website_banners.status === 'fulfilled' ? website_banners.value : { data: [] };
    const app_banners_data = app_banners.status === 'fulfilled' ? app_banners.value : { data: [] };
    const specialCombos_data = specialCombos.status === 'fulfilled' ? specialCombos.value : { data: [] };
    const bestSellers_data = bestSellers.status === 'fulfilled' ? bestSellers.value : { data: [] };
    const crazyDeals_data = crazyDeals.status === 'fulfilled' ? crazyDeals.value : { data: [] };
    const featuredProducts_data = featuredProducts.status === 'fulfilled' ? featuredProducts.value : { data: [] };
    const featuredReviews_data = featuredReviews.status === 'fulfilled' ? featuredReviews.value : { data: [] };

    return (
      <div>
        <HashScrollHandler />
        <BannerCarousel
          banners={banners.data ?? []}
          app_banners={app_banners_data.data ?? []}
        />
        
        <SpecialCombos offers={specialCombos_data.data ?? []} />
        <ProductCard
          shop
          heading="BEST SELLERS"
          products={bestSellers_data.data ?? []}
          sectionId="best-sellers"
        />

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
        <ProductCard
          shop
          heading="FEATURED PRODUCTS"
          products={featuredProducts_data.data ?? []}
          sectionId="featured-products"
        />
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
        </div>
      </div>
    );
  }
};

export default HomePage;
