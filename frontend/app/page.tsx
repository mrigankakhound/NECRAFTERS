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
import { getBestSellerProducts, getNewArrivals } from "@/actions/products";
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
  const newArrivals = await getNewArrivals(4); // Fetch 4 newest products
  const featuredReviews = await getActiveFeaturedReviews();


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
      <FeaturedReviews reviews={featuredReviews.data ?? []} />
      <ProductCard
        shop
        heading="NEW ARRIVALS"
        products={newArrivals.data ?? []}
      />
      <NeedOfWebsite />
      <WhyNeCraftersDiagram />
      <ReviewSection />
      <BlogImages />
    </div>
  );
};

export default HomePage;