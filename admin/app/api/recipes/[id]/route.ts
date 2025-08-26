import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import slugify from "slugify";

// GET - Fetch single recipe
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id }
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// PUT - Update recipe
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Generate new slug if title changed
    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if new slug already exists (excluding current recipe)
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (existingRecipe) {
      return NextResponse.json(
        { error: "A recipe with this title already exists" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      recipe
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

// DELETE - Delete recipe
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    await prisma.recipe.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
