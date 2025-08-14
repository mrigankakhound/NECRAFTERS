import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Create a test recipe
    const recipe = await prisma.recipe.create({
      data: {
        title: "Test Spicy Noodles",
        slug: "test-spicy-noodles",
        description: "A delicious test recipe",
        ingredients: ["Noodles", "Chili Oil", "Soy Sauce"],
        instructions: ["Boil noodles", "Add chili oil", "Mix well"],
        cookingTime: "15 mins",
        servings: "2",
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1607332687543-c86706157324",
        published: true
      }
    });

    return NextResponse.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error("Error creating test recipe:", error);
    return NextResponse.json(
      { error: "Failed to create test recipe", details: error },
      { status: 500 }
    );
  }
}
