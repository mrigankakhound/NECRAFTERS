import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import slugify from "slugify";

// GET - Fetch all recipes
export async function GET() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" }
    });

    console.log(`Found ${recipes.length} recipes`);

    return NextResponse.json({
      success: true,
      recipes
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch recipes",
      details: error
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new recipe
export async function POST(request: Request) {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    const data = await request.json();
    console.log("Received recipe data:", data);
    
    // Generate slug from title
    const slug = slugify(data.title, { lower: true, strict: true });
    console.log("Generated slug:", slug);

    // Check if slug already exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { slug }
    });

    if (existingRecipe) {
      console.log("Recipe with this slug already exists");
      return NextResponse.json({
        success: false,
        error: "A recipe with this title already exists"
      }, { status: 400 });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        instructions: data.instructions,
        cookingTime: data.cookingTime,
        servings: data.servings,
        difficulty: data.difficulty,
        image: data.image,
        published: data.published,
        slug
      }
    });

    console.log("Recipe created successfully:", recipe);

    return NextResponse.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create recipe",
      details: error
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
