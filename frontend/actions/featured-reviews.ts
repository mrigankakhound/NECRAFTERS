"use server";

import { prisma } from "@/lib/prisma";

// Get active featured reviews for frontend display
export async function getActiveFeaturedReviews() {
  try {
    // First check if the section is active
    const sectionConfig = await prisma.featuredReviewsSectionConfig.findFirst();
    
    // If section is not active, return empty array (section will be hidden)
    if (!sectionConfig || !sectionConfig.isActive) {
      return {
        success: true,
        data: [],
      };
    }

    // If section is active, get active reviews
    const reviews = await prisma.featuredReviews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    });

    // Only return reviews if there are active ones in the database
    // No fallback sample data - if no active reviews, section should be hidden
    return {
      success: true,
      data: reviews,
    };
  } catch (error) {
    console.error("Error fetching active featured reviews:", error);
    
    // Return empty array on error - section will be hidden
    return {
      success: false,
      error: "Failed to fetch active featured reviews",
      data: [],
    };
  }
}
