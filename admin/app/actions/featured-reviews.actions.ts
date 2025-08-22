"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface FeaturedReview {
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
  customerName?: string;
  rating: number;
  reviewText?: string;
  productName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeaturedReviewData {
  title: string;
  description?: string;
  image: {
    url: string;
    public_id: string;
  };
  link: string;
  order: number;
  customerName?: string;
  rating: number;
  reviewText?: string;
  productName?: string;
}

export interface UpdateFeaturedReviewData {
  title?: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  link?: string;
  order?: number;
  isActive?: boolean;
  customerName?: string;
  rating?: number;
  reviewText?: string;
  productName?: string;
}

// Get all featured reviews ordered by order field
export async function getFeaturedReviews() {
  try {
    const reviews = await prisma.featuredReviews.findMany({
      orderBy: { order: "asc" },
    });

    return {
      success: true,
      data: reviews,
    };
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return {
      success: false,
      error: "Failed to fetch featured reviews",
      data: [],
    };
  }
}

// Get section configuration
export async function getFeaturedReviewsSectionConfig() {
  try {
    let config = await prisma.featuredReviewsSectionConfig.findFirst();
    
    if (!config) {
      // Create default configuration if none exists
      config = await prisma.featuredReviewsSectionConfig.create({
        data: {
          isActive: false,
          title: "Featured Reviews",
          subtitle: "Discover what our customers are saying about our products"
        }
      });
    }

    return {
      success: true,
      data: config,
    };
  } catch (error) {
    console.error("Error fetching featured reviews section config:", error);
    return {
      success: false,
      error: "Failed to fetch section config",
      data: null,
    };
  }
}

// Get active featured reviews for frontend
export async function getActiveFeaturedReviews() {
  try {
    const reviews = await prisma.featuredReviews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    });

    return {
      success: true,
      data: reviews,
    };
  } catch (error) {
    console.error("Error fetching active featured reviews:", error);
    return {
      success: false,
      error: "Failed to fetch active featured reviews",
      data: [],
    };
  }
}

// Create a new featured review
export async function createFeaturedReview(data: CreateFeaturedReviewData) {
  try {
    const review = await prisma.featuredReviews.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        order: data.order,
        customerName: data.customerName,
        rating: data.rating,
        reviewText: data.reviewText,
        productName: data.productName,
      },
    });

    revalidatePath("/admin/featured-reviews");
    revalidatePath("/");

    return {
      success: true,
      data: review,
    };
  } catch (error) {
    console.error("Error creating featured review:", error);
    return {
      success: false,
      error: "Failed to create featured review",
    };
  }
}

// Update a featured review
export async function updateFeaturedReview(
  id: string,
  data: UpdateFeaturedReviewData
) {
  try {
    const review = await prisma.featuredReviews.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/featured-reviews");
    revalidatePath("/");

    return {
      success: true,
      data: review,
    };
  } catch (error) {
    console.error("Error updating featured review:", error);
    return {
      success: false,
      error: "Failed to update featured review",
    };
  }
}

// Delete a featured review
export async function deleteFeaturedReview(id: string) {
  try {
    await prisma.featuredReviews.delete({
      where: { id },
    });

    revalidatePath("/admin/featured-reviews");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting featured review:", error);
    return {
      success: false,
      error: "Failed to delete featured review",
    };
  }
}

// Toggle section on/off by updating section configuration
export async function toggleFeaturedReviewsSection(isActive: boolean) {
  try {
    // Get or create section configuration
    let config = await prisma.featuredReviewsSectionConfig.findFirst();
    
    if (!config) {
      // Create default configuration if none exists
      config = await prisma.featuredReviewsSectionConfig.create({
        data: {
          isActive: false,
          title: "Featured Reviews",
          subtitle: "Discover what our customers are saying about our products"
        }
      });
    }

    // Update the section configuration
    await prisma.featuredReviewsSectionConfig.update({
      where: { id: config.id },
      data: { isActive },
    });

    revalidatePath("/admin/featured-reviews");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error toggling featured reviews section:", error);
    return {
      success: false,
      error: "Failed to toggle featured reviews section",
    };
  }
}

// Update section title and subtitle
export async function updateFeaturedReviewsConfig(title: string, subtitle?: string) {
  try {
    // Get or create section configuration
    let config = await prisma.featuredReviewsSectionConfig.findFirst();
    
    if (!config) {
      // Create default configuration if none exists
      config = await prisma.featuredReviewsSectionConfig.create({
        data: {
          isActive: false,
          title: "Featured Reviews",
          subtitle: "Discover what our customers are saying about our products"
        }
      });
    }

    // Update the section configuration
    await prisma.featuredReviewsSectionConfig.update({
      where: { id: config.id },
      data: {
        title,
        subtitle,
      },
    });

    revalidatePath("/admin/featured-reviews");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating featured reviews config:", error);
    return {
      success: false,
      error: "Failed to update featured reviews config",
    };
  }
}

// Reorder featured reviews
export async function reorderFeaturedReviews(reviewIds: string[]) {
  try {
    const updates = reviewIds.map((id, index) =>
      prisma.featuredReviews.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath("/admin/featured-reviews");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error reordering featured reviews:", error);
    return {
      success: false,
      error: "Failed to reorder featured reviews",
    };
  }
}
