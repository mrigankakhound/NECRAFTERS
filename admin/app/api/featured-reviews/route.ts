import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.featuredReviews.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch featured reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create sample data if none exists (for initial setup/testing)
    const existingReviews = await prisma.featuredReviews.count();
    
    if (existingReviews === 0) {
      const sampleReviews = [
        {
          title: "Shoyu Ramen with Chilli Oil",
          description: "Amazing ramen with our signature chili oil",
          image: {
            url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
            public_id: "sample-1"
          },
          link: "/product/ramen-chili-oil",
          order: 0,
          isActive: true,
          customerName: "Sarah M.",
          rating: 5,
          reviewText: "Absolutely delicious! The chili oil adds the perfect kick.",
          productName: "Chili Oil"
        },
        {
          title: "Tasty Chili Eggs on Toast",
          description: "Perfect breakfast with our chili oil",
          image: {
            url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop",
            public_id: "sample-2"
          },
          link: "/product/chili-eggs-toast",
          order: 1,
          isActive: true,
          customerName: "Mike R.",
          rating: 4,
          reviewText: "Great way to start the day with some spice!",
          productName: "Chili Oil"
        },
        {
          title: "Best Chilli Prawns",
          description: "Spicy prawns that will blow your mind",
          image: {
            url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
            public_id: "sample-3"
          },
          link: "/product/chili-prawns",
          order: 2,
          isActive: true,
          customerName: "Lisa K.",
          rating: 5,
          reviewText: "Incredible flavor! The prawns are perfectly spiced.",
          productName: "Chili Oil"
        },
        {
          title: "Spicy Noodle Bowl",
          description: "Authentic Northeast flavors in every bite",
          image: {
            url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
            public_id: "sample-4"
          },
          link: "/product/spicy-noodle-bowl",
          order: 3,
          isActive: true,
          customerName: "David L.",
          rating: 4,
          reviewText: "Authentic taste of Northeast India. Love it!",
          productName: "Chili Oil"
        }
      ];

      for (const review of sampleReviews) {
        await prisma.featuredReviews.create({
          data: review
        });
      }
    }

    return NextResponse.json({ success: true, message: "Sample data created" });
  } catch (error) {
    console.error("Error creating sample data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create sample data" },
      { status: 500 }
    );
  }
}
