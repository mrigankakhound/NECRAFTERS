"use server";

import { prisma } from "@/lib/prisma";

// Get active featured reviews for frontend display
export async function getActiveFeaturedReviews() {
  try {
    const reviews = await prisma.featuredReviews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    });

    // If no reviews in database, return sample data for demonstration
    if (reviews.length === 0) {
      const sampleReviews = [
        {
          id: "sample-1",
          title: "Amazing Chili Oil Experience",
          description: "The best chili oil I've ever tasted!",
          image: {
            url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
            public_id: "sample-1"
          },
          link: "/product/chili-oil",
          order: 0,
          isActive: true,
          customerName: "Sarah M.",
          rating: 5,
          reviewText: "Absolutely delicious! The chili oil adds the perfect kick.",
          productName: "Chili Oil"
        },
        {
          id: "sample-2",
          title: "Perfect for Breakfast",
          description: "Makes my morning eggs so much better!",
          image: {
            url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop",
            public_id: "sample-2"
          },
          link: "/product/chili-oil",
          order: 1,
          isActive: true,
          customerName: "Mike R.",
          rating: 4,
          reviewText: "Great way to start the day with some spice!",
          productName: "Chili Oil"
        },
        {
          id: "sample-3",
          title: "Authentic Northeast Flavors",
          description: "Brings back memories of home!",
          image: {
            url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
            public_id: "sample-3"
          },
          link: "/product/chili-oil",
          order: 2,
          isActive: true,
          customerName: "Lisa K.",
          rating: 5,
          reviewText: "Incredible flavor! The prawns are perfectly spiced.",
          productName: "Chili Oil"
        },
        {
          id: "sample-4",
          title: "Spicy Noodle Bowl",
          description: "Authentic taste of Northeast India",
          image: {
            url: "https://images.unsplash.com/photo-1565299624942-a8c00f16cc92?w=400&h=300&fit=crop",
            public_id: "sample-4"
          },
          link: "/product/chili-oil",
          order: 3,
          isActive: true,
          customerName: "David L.",
          rating: 4,
          reviewText: "Authentic taste of Northeast India. Love it!",
          productName: "Chili Oil"
        }
      ];

      return {
        success: true,
        data: sampleReviews,
      };
    }

    return {
      success: true,
      data: reviews,
    };
  } catch (error) {
    console.error("Error fetching active featured reviews:", error);
    
    // Return sample data on error for demonstration
    const sampleReviews = [
      {
        id: "fallback-1",
        title: "Sample Review 1",
        description: "This is a sample review for demonstration",
        image: {
          url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
          public_id: "fallback-1"
        },
        link: "/product/sample",
        order: 0,
        isActive: true,
        customerName: "Sample Customer",
        rating: 5,
        reviewText: "Sample review text for demonstration purposes.",
        productName: "Sample Product"
      }
    ];

    return {
      success: false,
      error: "Failed to fetch active featured reviews",
      data: sampleReviews,
    };
  }
}
