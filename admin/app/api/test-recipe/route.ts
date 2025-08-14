import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a new PrismaClient instance
const prisma = new PrismaClient();

export async function GET() {
  console.log("Starting test recipe creation...");
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully");

    // Create the recipe
    const recipe = await prisma.recipe.create({
      data: {
        title: "Test Spicy Noodles",
        slug: "test-spicy-noodles",
        description: "A test recipe description",
        ingredients: ["Noodles", "Chili Oil"],
        instructions: ["Cook noodles", "Add chili oil"],
        cookingTime: "10 mins",
        servings: "2",
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de",
        published: true
      }
    });

    console.log("Recipe created:", recipe);

    return NextResponse.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}