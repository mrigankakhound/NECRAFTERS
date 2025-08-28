"use client";

import BannerCarousel from "@/components/home/BannerCarousel";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

interface HomePageData {
  website_banners: { data: any[] };
  app_banners: { data: any[] };
  specialCombos: { data: any[] };
  bestSellers: { data: any[] };
  mainCategories: { data: any[] };
  crazyDeals: { data: any[] };
  featuredProducts: { data: any[] };
  featuredReviews: { data: any[] };
}

const HomePage = () => {
  const [data, setData] = useState<HomePageData>({
    website_banners: { data: [] },
    app_banners: { data: [] },
    specialCombos: { data: [] },
    bestSellers: { data: [] },
    mainCategories: { data: [] },
    crazyDeals: { data: [] },
    featuredProducts: { data: [] },
    featuredReviews: { data: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch critical data first
        const [banners, specialCombos, bestSellers] = await Promise.all([
          fetch('/api/banners/website').then(r => r.json()),
          fetch('/api/offers/special-combos').then(r => r.json()),
          fetch('/api/products/best-sellers?limit=8').then(r => r.json())
        ]);

        setData(prev => ({
          ...prev,
          website_banners: banners,
          app_banners: banners, // Use same data for now
          specialCombos,
          bestSellers
        }));

        // Fetch remaining data in background
        const remainingData = await Promise.all([
          fetch('/api/offers/crazy-deals').then(r => r.json()),
          fetch('/api/products/featured?limit=4&page=1').then(r => r.json()),
          fetch('/api/featured-reviews').then(r => r.json())
        ]);

        setData(prev => ({
          ...prev,
          crazyDeals: remainingData[0],
          featuredProducts: remainingData[1],
          featuredReviews: remainingData[2]
        }));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 mb-8" />
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HashScrollHandler />
      <BannerCarousel
        banners={data.website_banners.data ?? []}
        app_banners={data.app_banners.data ?? []}
      />
      
      <SpecialCombos offers={data.specialCombos.data ?? []} />
      <ProductCard
        shop
        heading="BEST SELLERS"
        products={data.bestSellers.data ?? []}
        sectionId="best-sellers"
      />

      <CrazyDealsSection offers={data.crazyDeals.data ?? []} />
      <FeaturedReviewsSection reviews={data.featuredReviews.data?.map(review => ({
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
        products={data.featuredProducts.data ?? []}
        sectionId="featured-products"
      />
      <NeedOfWebsiteSection />
      <WhyNeCraftersDiagramSection />
      <ReviewSectionSection />
      <BlogImagesSection />
    </div>
  );
};

export default HomePage;
