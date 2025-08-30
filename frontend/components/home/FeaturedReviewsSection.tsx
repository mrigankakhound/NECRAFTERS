import { getActiveFeaturedReviews } from '@/actions/featured-reviews';
import FeaturedReviews from './FeaturedReviews';

const FeaturedReviewsSection = async () => {
  try {
    const featuredReviews = await getActiveFeaturedReviews();
    console.log('FeaturedReviewsSection: Raw result:', featuredReviews);
    
    // If no reviews or section is not active, don't render anything
    if (!featuredReviews.success || !featuredReviews.data || featuredReviews.data.length === 0) {
      console.log('FeaturedReviewsSection: No data, returning null');
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

    console.log('FeaturedReviewsSection: Mapped reviews:', mappedReviews);
    console.log('FeaturedReviewsSection: Rendering with', mappedReviews.length, 'reviews');

    return (
      <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
        <FeaturedReviews reviews={mappedReviews} />
      </div>
    );
  } catch (error) {
    console.error('FeaturedReviewsSection: Error:', error);
    return null;
  }
};

export default FeaturedReviewsSection;
