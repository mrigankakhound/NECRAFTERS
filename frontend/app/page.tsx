import BannerCarousel from "@/components/home/BannerCarousel";
import BlogImages from "@/components/home/BlogImages";

import CrazyDeals from "@/components/home/CrazyDeals";
import NeedOfWebsite from "@/components/home/NeedOfWebsite";
import ProductCard from "@/components/home/ProductCard";
import ReviewSection from "@/components/home/ReviewSection";
import SpecialCombos from "@/components/home/SpecialCombos";
import WhyNeCraftersDiagram from "@/components/home/WhyNeCraftersDiagram";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import HashScrollHandler from "@/components/HashScrollHandler";
import React from "react";
import { getWebsiteBanners, getAppBanners } from "@/actions/banner.actions";
import { getSpecialCombos } from "@/actions/special-combos";
import { getCrazyDeals } from "@/actions/crazy-deals";
import { getBestSellerProducts, getFeaturedProducts } from "@/actions/products";
import { getMainCategories } from "@/actions/categories/get-main-categories";
import { getActiveFeaturedReviews } from "@/actions/featured-reviews";

const HomePage = async () => {
  // Fetch all required data
  const website_banners = await getWebsiteBanners();
  const app_banners = await getAppBanners();
  const specialCombos = await getSpecialCombos();
  const bestSellers = await getBestSellerProducts(8); // Fetch top 8 best sellers
  const mainCategories = await getMainCategories();
  const crazyDeals = await getCrazyDeals();
  const featuredProducts = await getFeaturedProducts(4, 1); // Fetch 4 featured products
  const featuredReviews = await getActiveFeaturedReviews();

  // Debug logging
  console.log('🔍 HomePage Debug:');
  console.log('website_banners:', JSON.stringify(website_banners, null, 2));
  console.log('app_banners:', JSON.stringify(app_banners, null, 2));
  console.log('BannerCarousel props:');
  console.log('  banners:', JSON.stringify(website_banners.data ?? [], null, 2));
  console.log('  app_banners:', JSON.stringify(app_banners.data ?? [], null, 2));
  
  // Additional debugging
  console.log('🔍 Data Structure Analysis:');
  console.log('  website_banners.success:', website_banners.success);
  console.log('  website_banners.data:', website_banners.data);
  console.log('  website_banners.data?.length:', website_banners.data?.length);
  console.log('  website_banners.data ?? []:', website_banners.data ?? []);
  console.log('  typeof website_banners.data:', typeof website_banners.data);
  console.log('  Array.isArray(website_banners.data):', Array.isArray(website_banners.data));

  // SEO-optimized page title and description
  const pageTitle = "Premium Chili Oil & Northeast Indian Spices | NE CRAFTERS";
  const pageDescription = "Discover authentic Northeast Indian chili oil, premium spices, and traditional flavors. Shop the best quality chili oil, spice blends, and regional delicacies online.";


  return (
    <div>
      <HashScrollHandler />
      <BannerCarousel
        banners={website_banners.data ?? []}
        app_banners={app_banners.data ?? []}
      />
      
      {/* Debug the actual props being passed */}
      {(() => {
        const bannerProps = {
          banners: website_banners.data ?? [],
          app_banners: app_banners.data ?? []
        };
        console.log('🎯 Actual BannerCarousel props:', bannerProps);
        console.log('  banners prop type:', typeof bannerProps.banners);
        console.log('  banners prop length:', bannerProps.banners?.length);
        console.log('  app_banners prop type:', typeof bannerProps.app_banners);
        console.log('  app_banners prop length:', bannerProps.app_banners?.length);
        return null;
      })()}
      <SpecialCombos offers={specialCombos.data ?? []} />
      <ProductCard
        shop
        heading="BEST SELLERS"
        products={bestSellers.data ?? []}
        sectionId="best-sellers"
      />

      <CrazyDeals offers={crazyDeals.data ?? []} />
      <FeaturedReviews reviews={featuredReviews.data?.map(review => ({
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
        products={featuredProducts.data ?? []}
        sectionId="featured-products"
      />
      <NeedOfWebsite />
      <WhyNeCraftersDiagram />
      <ReviewSection />
      <BlogImages />
    </div>
  );
};

export default HomePage;