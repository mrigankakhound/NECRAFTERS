import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      recipes
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
