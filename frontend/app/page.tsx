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