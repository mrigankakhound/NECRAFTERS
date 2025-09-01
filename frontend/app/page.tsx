import { Suspense } from "react";
import { getBestSellerProducts } from "@/actions/products";
import BestSellersSection from "@/components/home/BestSellersSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import SpecialComboSection from "@/components/home/SpecialComboSection";
import GiftHamperSection from "@/components/home/GiftHamperSection";
import WhyNECraftersSection from "@/components/home/WhyNECraftersSection";
import GloryMomentsSection from "@/components/home/GloryMomentsSection";
import HeroSection from "@/components/home/HeroSection";
import CrazyDealsSection from "@/components/home/CrazyDealsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NE Crafters - Handcrafted Products",
  description: "Discover unique handcrafted products from NE Crafters. Best sellers, featured products, and special combos.",
};

export default async function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <BestSellersSection />
      </Suspense>

      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <FeaturedProductsSection />
      </Suspense>

      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <SpecialComboSection />
      </Suspense>

      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <GiftHamperSection />
      </Suspense>

      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <WhyNECraftersSection />
      </Suspense>

      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <GloryMomentsSection />
      </Suspense>

      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }>
        <CrazyDealsSection />
      </Suspense>
    </main>
  );
}
