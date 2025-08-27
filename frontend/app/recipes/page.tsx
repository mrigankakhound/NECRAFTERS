import { prisma } from "@/lib/prisma";
import RecipesClient from "@/components/recipes/RecipesClient";

async function getRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return <RecipesClient initialRecipes={recipes} />;
}