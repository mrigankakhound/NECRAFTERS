"use client";

import BannerCarousel from "@/components/home/BannerCarousel";
import dynamic from "next/dynamic";

// Reduce initial JS by code-splitting non-critical sections
const CrazyDealsSection = dynamic(() => import("@/components/home/CrazyDeals"));
const FeaturedReviewsSection = dynamic(() => import("@/components/home/FeaturedReviews"));
const NeedOfWebsiteSection = dynamic(() => import("@/components/home/NeedOfWebsite"));
const WhyNeCraftersDiagramSection = dynamic(() => import("@/components/home/WhyNeCraftersDiagram"));
const ReviewSectionSection = dynamic(() => import("@/components/home/ReviewSection"));
const BlogImagesSection = dynamic(() => import("@/components/home/BlogImages"));

// SEO metadata - moved to layout.tsx for static pages
import ProductCard from "@/components/home/ProductCard";
import SpecialCombos from "@/components/home/SpecialCombos";
import HashScrollHandler from "@/components/HashScrollHandler";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [data, setData] = useState({
    banners: { data: [] },
    app_banners: { data: [] },
    specialCombos: { data: [] },
    bestSellers: { data: [] },
    crazyDeals: { data: [] },
    featuredProducts: { data: [] },
    featuredReviews: { data: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data on client side
        const [banners, appBanners, specialCombos, bestSellers, crazyDeals, featuredProducts, featuredReviews] = await Promise.allSettled([
          fetch('/api/banners/website').then(res => res.json()),
          fetch('/api/banners/app').then(res => res.json()),
          fetch('/api/offers/special-combos').then(res => res.json()),
          fetch('/api/products/best-sellers?limit=8').then(res => res.json()),
          fetch('/api/offers/crazy-deals').then(res => res.json()),
          fetch('/api/products/featured?limit=4&page=1').then(res => res.json()),
          fetch('/api/featured-reviews').then(res => res.json())
        ]);

        setData({
          banners: banners.status === 'fulfilled' ? banners.value : { data: [] },
          app_banners: appBanners.status === 'fulfilled' ? appBanners.value : { data: [] },
          specialCombos: specialCombos.status === 'fulfilled' ? specialCombos.value : { data: [] },
          bestSellers: bestSellers.status === 'fulfilled' ? bestSellers.value : { data: [] },
          crazyDeals: crazyDeals.status === 'fulfilled' ? crazyDeals.value : { data: [] },
          featuredProducts: featuredProducts.status === 'fulfilled' ? featuredProducts.value : { data: [] },
          featuredReviews: featuredReviews.status === 'fulfilled' ? featuredReviews.value : { data: [] }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading NE CRAFTERS</h1>
          <p className="text-gray-600">Preparing amazing products for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HashScrollHandler />
      <BannerCarousel
        banners={data.banners.data ?? []}
        app_banners={data.app_banners.data ?? []}
      />
      
      <SpecialCombos offers={data.specialCombos.data ?? []} />
      
      {/* Best Sellers Section - Only show if admin has marked products as best sellers */}
      {data.bestSellers.data && data.bestSellers.data.length > 0 ? (
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
              products={data.bestSellers.data}
              sectionId="best-sellers"
            />
          </div>
        </div>
             ) : null}

      <CrazyDealsSection offers={data.crazyDeals.data ?? []} />
      <FeaturedReviewsSection reviews={data.featuredReviews.data?.map((review: any) => ({
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
      {data.featuredProducts.data && data.featuredProducts.data.length > 0 && (
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
              products={data.featuredProducts.data}
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
};

export default HomePage;
