import BannerCarousel from "@/components/home/BannerCarousel";
import dynamic from "next/dynamic";

// Reduce initial JS by code-splitting non-critical sections
const CrazyDealsSection = dynamic(() => import("@/components/home/CrazyDeals"));
const FeaturedReviewsSection = dynamic(() => import("@/components/home/FeaturedReviews"));
const NeedOfWebsiteSection = dynamic(() => import("@/components/home/NeedOfWebsite"));
const WhyNeCraftersDiagramSection = dynamic(() => import("@/components/home/WhyNeCraftersDiagram"));
const ReviewSectionSection = dynamic(() => import("@/components/home/ReviewSection"));
const BlogImagesSection = dynamic(() => import("@/components/home/BlogImages"));

// Balance freshness with performance
export const revalidate = 60;
import BlogImages from "@/components/home/BlogImages";

// Moved to dynamic imports above
// import CrazyDeals from "@/components/home/CrazyDeals";
// import NeedOfWebsite from "@/components/home/NeedOfWebsite";
import ProductCard from "@/components/home/ProductCard";
// import ReviewSection from "@/components/home/ReviewSection";
import SpecialCombos from "@/components/home/SpecialCombos";
// import WhyNeCraftersDiagram from "@/components/home/WhyNeCraftersDiagram";
// import FeaturedReviews from "@/components/home/FeaturedReviews";
import HashScrollHandler from "@/components/HashScrollHandler";
import React from "react";
import { getWebsiteBanners, getAppBanners } from "@/actions/banner.actions";
import { getSpecialCombos } from "@/actions/special-combos";
import { getCrazyDeals } from "@/actions/crazy-deals";
import { getBestSellerProducts, getFeaturedProducts } from "@/actions/products";
import { getMainCategories } from "@/actions/categories/get-main-categories";
import { getActiveFeaturedReviews } from "@/actions/featured-reviews";

// Type for the data structure
interface DataResult {
  data: any[];
  success?: boolean;
  error?: string;
}

const HomePage = async () => {
  // Add overall timeout to prevent build hanging
  const pageTimeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Page timeout')), 30000)
  );

  try {
    // Fetch critical data with timeouts to prevent build hanging
    const criticalDataResults = await Promise.race([
      Promise.allSettled([
        Promise.race([
          getWebsiteBanners(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]),
        Promise.race([
          getAppBanners(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]),
        Promise.race([
          getSpecialCombos(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]),
        Promise.race([
          getBestSellerProducts(8),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ])
      ]),
      pageTimeout
    ]) as PromiseSettledResult<DataResult>[];

    const [website_banners, app_banners, specialCombos, bestSellers] = criticalDataResults;

  // Fetch non-critical data with timeouts
  const [crazyDeals, featuredProducts, featuredReviews] = await Promise.allSettled([
    Promise.race([
      getCrazyDeals(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
    ]),
    Promise.race([
      getFeaturedProducts(4, 1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
    ]),
    Promise.race([
      getActiveFeaturedReviews(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
    ])
  ]);

  // Extract data safely with proper typing
  const banners = (website_banners.status === 'fulfilled' ? website_banners.value : { data: [] }) as DataResult;
  const app_banners_data = (app_banners.status === 'fulfilled' ? app_banners.value : { data: [] }) as DataResult;
  const specialCombos_data = (specialCombos.status === 'fulfilled' ? specialCombos.value : { data: [] }) as DataResult;
  const bestSellers_data = (bestSellers.status === 'fulfilled' ? bestSellers.value : { data: [] }) as DataResult;
  const crazyDeals_data = (crazyDeals.status === 'fulfilled' ? crazyDeals.value : { data: [] }) as DataResult;
  const featuredProducts_data = (featuredProducts.status === 'fulfilled' ? featuredProducts.value : { data: [] }) as DataResult;
  const featuredReviews_data = (featuredReviews.status === 'fulfilled' ? featuredReviews.value : { data: [] }) as DataResult;



  // SEO-optimized page title and description
  const pageTitle = "Premium Chili Oil & Northeast Indian Spices | NE CRAFTERS";
  const pageDescription = "Discover authentic Northeast Indian chili oil, premium spices, and traditional flavors. Shop the best quality chili oil, spice blends, and regional delicacies online.";


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