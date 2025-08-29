"use client";

import Link from "next/link";
import { Star } from "lucide-react";

interface FeaturedReview {
  id: string;
  title: string;
  description?: string;
  image: {
    url?: string;
    public_id?: string;
  };
  link: string;
  order: number;
  isActive: boolean;
  // Customer Review Fields
  customerName?: string;
  rating: number;
  reviewText?: string;
  productName?: string;
}

interface FeaturedReviewsProps {
  reviews: FeaturedReview[];
}

const FeaturedReviews = ({ reviews }: FeaturedReviewsProps) => {
  // If no reviews or empty array, don't render anything
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
         <div id="featured-reviews" className="container mx-auto mt-24 mb-0 px-4">
                    <div className="text-center mb-10">
          {/* Decorative elements */}
          <div className="flex justify-center items-center mb-3">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
            <div className="mx-3">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
          </div>
          
          {/* Main heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent font-capriola">
            REVIEWS OF FOOD ENTHUSIASTS
          </h2>
          
          {/* Subheading with enhanced styling */}
          <div className="max-w-xl mx-auto">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Discover what our customers are saying about our products
            </p>
            <p className="text-xs text-gray-500 mt-1 italic">
              Real experiences from food lovers across the country
            </p>
          </div>
          
          {/* Bottom decorative line */}
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-orange-300 via-red-400 to-orange-300 rounded-full"></div>
          </div>
        </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-8">
        {reviews.slice(0, 4).map((review, index) => (
          <Link
            href={review.link}
            key={review.id}
            className="group block"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-[400px] flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                {review.image.url ? (
                  <img
                    src={review.image.url}
                    alt={review.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"

                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  </div>
                )}
                
                {/* Rating overlay */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="min-h-[60px]">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {review.title}
                  </h3>
                  
                  {review.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {review.description}
                    </p>
                  )}
                </div>
                
                {/* Customer Review Info */}
                <div className="space-y-2 mt-auto min-h-[80px]">
                  {review.customerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">
                        {review.customerName}
                      </span>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {review.productName && (
                    <p className="text-xs text-blue-600 font-medium">
                      {review.productName}
                    </p>
                  )}
                  
                  {review.reviewText && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      "{review.reviewText}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedReviews;
