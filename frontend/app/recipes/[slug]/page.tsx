import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RecipeClient from "@/components/recipes/RecipeClient";

async function getRecipe(slug: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { slug }
    });

    if (!recipe) {
      notFound();
    }

    return recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error("Failed to fetch recipe");
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  return <RecipeClient initialRecipe={recipe} slug={slug} />;
}
