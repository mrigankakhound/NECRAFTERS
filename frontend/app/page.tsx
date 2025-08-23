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

  // SEO-optimized page title and description
  const pageTitle = "Premium Chili Oil & Northeast Indian Spices | NE CRAFTERS";
  const pageDescription = "Discover authentic Northeast Indian chili oil, premium spices, and traditional flavors. Shop the best quality chili oil, spice blends, and regional delicacies online.";


  return (
    <div>
      <HashScrollHandler />
      
      {/* SEO-optimized hero section */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium <span className="text-red-600">Chili Oil</span> & 
            <span className="text-orange-600"> Northeast Indian Spices</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
            Discover authentic flavors from Northeast India. Premium quality chili oil, traditional spice blends, 
            and regional delicacies that bring the authentic taste of Northeast India to your kitchen.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">🔥 Hot Chili Oil</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">🌶️ Premium Spices</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">🏔️ Northeast India</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✨ Authentic Flavors</span>
          </div>
        </div>
      </section>

      <BannerCarousel
        banners={website_banners.data ?? []}
        app_banners={app_banners.data ?? []}
      />
      
      {/* SEO-optimized category showcase */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Our <span className="text-red-600">Premium Collection</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-red-800">Chili Oil Collection</h3>
              <p className="text-gray-700">Authentic Northeast Indian chili oil with perfect heat and flavor balance</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-orange-800">Spice Blends</h3>
              <p className="text-gray-700">Traditional spice mixtures that enhance any dish with authentic flavors</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-yellow-800">Regional Delicacies</h3>
              <p className="text-gray-700">Unique Northeast Indian specialties that bring tradition to your table</p>
            </div>
          </div>
        </div>
      </section>

      <SpecialCombos offers={specialCombos.data ?? []} />
      
      <ProductCard
        shop
        heading="BEST SELLERS - Premium Chili Oil & Spices"
        products={bestSellers.data ?? []}
        sectionId="best-sellers"
      />

      <CrazyDeals offers={crazyDeals.data ?? []} />
      <FeaturedReviews reviews={featuredReviews.data?.map(review => ({
        ...review,
        description: review.description || undefined,
        image: {
          ...review.image,
          url: review.image.url || undefined,
          public_id: review.image.public_id || undefined
        }
      })) ?? []} />
      
      <ProductCard
        shop
        heading="NEW ARRIVALS - Fresh Spice Collection"
        products={newArrivals.data ?? []}
      />
      
      {/* SEO-optimized content section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-red-600">NE CRAFTERS</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏔️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Authentic Northeast Origin</h3>
              <p className="text-gray-600">Directly sourced from Northeast India for authentic flavors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handpicked ingredients ensuring the highest quality standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders above ₹499 across India</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Satisfaction</h3>
              <p className="text-gray-600">Quality guaranteed with easy returns and refunds</p>
            </div>
          </div>
        </div>
      </section>

      <NeedOfWebsite />
      <WhyNeCraftersDiagram />
      <ReviewSection />
      <BlogImages />
      
      {/* SEO-optimized footer content */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the <span className="text-red-400">Authentic Taste</span> of Northeast India
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            From our traditional chili oil to premium spice blends, every product tells a story of Northeast India's 
            rich culinary heritage. Shop now and bring authentic flavors to your kitchen.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>🔥 Hot Chili Oil</span>
            <span>🌶️ Premium Spices</span>
            <span>🏔️ Northeast India</span>
            <span>✨ Authentic Flavors</span>
            <span>🚚 Free Shipping</span>
            <span>💯 Quality Guaranteed</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;