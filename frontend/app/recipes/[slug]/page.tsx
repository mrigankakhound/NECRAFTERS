import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChefHat } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
  params: { slug: string };
}) {
  const recipe = await getRecipe(params.slug);

  return (
    <div className="ownContainer py-16">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] overflow-hidden shadow-xl mb-12">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
            {recipe.title}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
        <div className="space-y-8">
          {/* Instructions */}
          <section>
            <h2 className="text-2xl font-display font-bold text-primary mb-4">
              Instructions
            </h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-card border border-border/10"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <p className="text-foreground/80">{instruction}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Recipe Info */}
          <div className="p-6 rounded-lg bg-card border border-border/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-primary" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="p-6 rounded-lg bg-card border border-border/10">
            <h2 className="text-xl font-display font-bold text-primary mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-foreground/80">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Back to Recipes */}
      <div className="mt-12">
        <Link
          href="/recipes"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Recipes
        </Link>
      </div>
    </div>
  );
}
