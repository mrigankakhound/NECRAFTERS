// Force dynamic rendering to avoid build-time database issues
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getWebsiteBanners, getAppBanners } from '@/actions/banner.actions';
import { getSpecialCombos } from '@/actions/special-combos';
import { getCrazyDeals } from '@/actions/crazy-deals';
import { getBestSellerProducts, getFeaturedProducts } from '@/actions/products';
import { getActiveFeaturedReviews } from '@/actions/featured-reviews';
import { fetchWithTimeout } from '@/lib/utils';
import BannerCarousel from '@/components/home/BannerCarousel';
import SpecialCombos from '@/components/home/SpecialCombos';
import ProductCard from '@/components/home/ProductCard';
import CrazyDealsSection from '@/components/home/CrazyDeals';
import FeaturedReviewsSection from '@/components/home/FeaturedReviews';
import HashScrollHandler from '@/components/HashScrollHandler';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Loading components for progressive loading
const BestSellersSection = async () => {
  const bestSellers = await getBestSellerProducts(8);
  return (
    <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
            BEST SELLERS
          </h2>
        </div>
        
        {bestSellers.data && bestSellers.data.length > 0 ? (
          <>
            {bestSellers.isFallback && (
              <div className="text-center py-2 text-gray-500 text-sm mb-4">
                <p>Showing our latest products. Mark products as best sellers in admin to customize this section!</p>
              </div>
            )}
            <ProductCard
              shop
              heading="BEST SELLERS"
              products={bestSellers.data as any}
              sectionId="best-sellers"
            />
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No products available at the moment.</p>
            <p className="text-sm mt-2">Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FeaturedProductsSection = async () => {
  const featuredProducts = await getFeaturedProducts(4, 1);
  return (
    <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
            FEATURED PRODUCTS
          </h2>
        </div>
        
        {featuredProducts.data && featuredProducts.data.length > 0 ? (
          <ProductCard
            shop
            heading="FEATURED PRODUCTS"
            products={featuredProducts.data as any}
            sectionId="featured-products"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No featured products available at the moment.</p>
            <p className="text-sm mt-2">Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default async function Home() {
  // Load critical data first (banners, special combos)
  const [banners, specialCombos] = await Promise.allSettled([
    fetchWithTimeout(getWebsiteBanners(), 5000), // Reduced timeout
    fetchWithTimeout(getSpecialCombos(), 5000),  // Reduced timeout
  ]);

  // Extract data safely
  const banners_data = banners.status === 'fulfilled' ? banners.value : { data: [] };
  const specialCombos_data = specialCombos.status === 'fulfilled' ? specialCombos.value : { data: [] };

  return (
    <div>
      <HashScrollHandler />
      
      {/* Critical sections - load immediately */}
      <BannerCarousel
        banners={banners_data.data ?? []}
        app_banners={[]} // Will be loaded separately
      />
      
      <SpecialCombos offers={specialCombos_data.data ?? []} />
      
      {/* Progressive loading sections */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              BEST SELLERS
            </h2>
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading Best Sellers..." className="text-orange-600" />
            </div>
          </div>
        </div>
      }>
        <BestSellersSection />
      </Suspense>

      {/* Load other sections in parallel */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              FEATURED PRODUCTS
            </h2>
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading Featured Products..." className="text-orange-600" />
            </div>
          </div>
        </div>
      }>
        <FeaturedProductsSection />
      </Suspense>

      {/* Load remaining sections asynchronously */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading More Content..." className="text-orange-600" />
          </div>
        </div>
      }>
        <AsyncSections />
      </Suspense>
    </div>
  );
}

// Async component for non-critical sections
async function AsyncSections() {
  const [appBanners, crazyDeals, featuredReviews] = await Promise.allSettled([
    fetchWithTimeout(getAppBanners(), 5000),
    fetchWithTimeout(getCrazyDeals(), 5000),
    fetchWithTimeout(getActiveFeaturedReviews(), 5000)
  ]);

  const app_banners_data = appBanners.status === 'fulfilled' ? appBanners.value : { data: [] };
  const crazyDeals_data = crazyDeals.status === 'fulfilled' ? crazyDeals.value : { data: [] };
  const featuredReviews_data = featuredReviews.status === 'fulfilled' ? featuredReviews.value : { data: [] };

  return (
    <>
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
    </>
  );
}
