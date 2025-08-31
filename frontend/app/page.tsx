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
import FeaturedReviews from '@/components/home/FeaturedReviews';
import WhyNeCraftersDiagram from '@/components/home/WhyNeCraftersDiagram';
import BlogImages from '@/components/home/BlogImages';
import NeedOfWebsite from '@/components/home/NeedOfWebsite';
import CategorySection from '@/components/home/CategorySection';
import MainCategorySection from '@/components/home/MainCategorySection';
import ReviewSection from '@/components/home/ReviewSection';
import HashScrollHandler from '@/components/HashScrollHandler';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Loading components for progressive loading
const BestSellersSection = async () => {
  try {
    const bestSellers = await getBestSellerProducts(8); // Remove timeout wrapper
    return (
    <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
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
  } catch (error) {
    console.error('Error loading best sellers:', error);
    return (
      <div id="best-sellers" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
        <div className="section-container">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              BEST SELLERS
            </h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load best sellers at the moment.</p>
            <p className="text-sm mt-2">Please check back later!</p>
          </div>
        </div>
      </div>
    );
  }
};

const GiftHampersSection = async () => {
  const crazyDeals = await getCrazyDeals();
  return (
    <div id="gift-hamper" className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <CrazyDealsSection offers={crazyDeals.data ?? []} />
    </div>
  );
};

const FeaturedProductsSection = async () => {
  const featuredProducts = await getFeaturedProducts(4, 1);
  return (
    <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
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

const FeaturedReviewsSection = async () => {
  const featuredReviews = await getActiveFeaturedReviews();
  
  // If no reviews or section is not active, don't render anything
  if (!featuredReviews.success || !featuredReviews.data || featuredReviews.data.length === 0) {
    return null;
  }

  // Map the data to match the FeaturedReview interface (convert null to undefined)
  const mappedReviews = featuredReviews.data.map(review => ({
    ...review,
    description: review.description || undefined,
    customerName: review.customerName || undefined,
    reviewText: review.reviewText || undefined,
    productName: review.productName || undefined,
    image: {
      url: review.image.url || undefined,
      public_id: review.image.public_id || undefined
    }
  }));

  return (
    <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <FeaturedReviews reviews={mappedReviews} />
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
      
      {/* 1. Banners */}
      <BannerCarousel
        banners={banners_data.data ?? []}
        app_banners={[]} // Will be loaded separately
      />
      
      {/* 2. Special Combos */}
      <SpecialCombos offers={specialCombos_data.data ?? []} />
      
      {/* 3. Best Sellers */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              BEST SELLERS
            </h2>
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Loading Best Sellers..." className="text-orange-600" />
            </div>
          </div>
        </div>
      }>
        <BestSellersSection />
      </Suspense>

      {/* 4. Gift Hampers */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              GIFT HAMPER
            </h2>
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading Gift Hampers..." className="text-orange-600" />
            </div>
          </div>
        </div>
      }>
        <GiftHampersSection />
      </Suspense>

      {/* 5. Featured Products */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
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

      {/* 6. Reviews of Food Enthusiasts (Admin Controlled) */}
      <Suspense fallback={
        <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
          <div className="section-container">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-center w-full relative py-6 sm:py-8 lg:py-10 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              REVIEWS OF FOOD ENTHUSIASTS
            </h2>
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading Reviews..." className="text-orange-600" />
            </div>
          </div>
        </div>
      }>
        <FeaturedReviewsSection />
      </Suspense>

      {/* 7. Why NE Crafters (Icons) */}
      <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
        <div className="section-container">
          <NeedOfWebsite />
        </div>
      </div>

      {/* 8. Why NE Crafters (Image) */}
      <WhyNeCraftersDiagram />

      {/* 9. What Our Customers Have to Say */}
      <ReviewSection />

      {/* 10. Moments of NE Crafters */}
      <BlogImages />
    </div>
  );
}

// Async component for non-critical sections
async function AsyncSections() {
  const [appBanners] = await Promise.allSettled([
    fetchWithTimeout(getAppBanners(), 5000)
  ]);

  const app_banners_data = appBanners.status === 'fulfilled' ? appBanners.value : { data: [] };

  return (
    <>
      {/* App banners can be loaded here if needed */}
    </>
  );
}
