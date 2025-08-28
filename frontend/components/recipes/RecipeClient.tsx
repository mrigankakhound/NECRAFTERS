"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChefHat, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: string;
  difficulty: string;
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RecipeClientProps {
  initialRecipe: Recipe;
  slug: string;
}

export default function RecipeClient({ initialRecipe, slug }: RecipeClientProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Real-time recipe updates
  const fetchRecipe = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/recipes/slug/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRecipe(data.recipe);
        } else {
          // Recipe not found or deleted, redirect to 404
          router.push('/404');
        }
      } else if (response.status === 404) {
        // Recipe not found or deleted, redirect to 404
        router.push('/404');
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  // Refresh recipe every 30 seconds and on mount
  useEffect(() => {
    // Immediately fetch fresh data to avoid showing old cached recipe
    fetchRecipe();
    
    // Set up interval for ongoing updates
    // No auto-refresh - fetch only on mount
  }, [slug, router]);

  // If recipe is null (deleted), show loading while redirecting
  if (!recipe) {
    return (
      <div className="ownContainer py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ownContainer py-16">
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

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
          <button
            onClick={fetchRecipe}
            disabled={isLoading}
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
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
