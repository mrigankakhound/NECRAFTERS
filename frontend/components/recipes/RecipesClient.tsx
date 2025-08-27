"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChefHat, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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

interface RecipesClientProps {
  initialRecipes: Recipe[];
}

export default function RecipesClient({ initialRecipes }: RecipesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isLoading, setIsLoading] = useState(false);
  const [newRecipeIds, setNewRecipeIds] = useState<Set<string>>(new Set());
  const [updatedRecipeIds, setUpdatedRecipeIds] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time recipes updates
  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/recipes');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newRecipes = data.recipes || [];
          const previousCount = recipes.length;
          
          // Check for new recipes by comparing IDs
          const newRecipeIds = new Set(newRecipes.map(r => r.id));
          const previousRecipeIds = new Set(recipes.map(r => r.id));
          
          // Find newly added recipes
          const addedRecipes = newRecipes.filter(recipe => !previousRecipeIds.has(recipe.id));
          // Find removed recipes
          const removedRecipes = recipes.filter(recipe => !newRecipeIds.has(recipe.id));
          // Find updated recipes (same ID but different content)
          const updatedRecipes = newRecipes.filter(newRecipe => {
            const oldRecipe = recipes.find(r => r.id === newRecipe.id);
            return oldRecipe && (
              oldRecipe.title !== newRecipe.title ||
              oldRecipe.description !== newRecipe.description ||
              oldRecipe.ingredients.length !== newRecipe.ingredients.length ||
              oldRecipe.instructions.length !== newRecipe.instructions.length ||
              oldRecipe.cookingTime !== newRecipe.cookingTime ||
              oldRecipe.servings !== newRecipe.servings ||
              oldRecipe.difficulty !== newRecipe.difficulty ||
              oldRecipe.image !== newRecipe.image ||
              oldRecipe.published !== newRecipe.published
            );
          });
          
          setRecipes(newRecipes);
          setLastUpdated(new Date());
          
          // Show notifications for changes
          if (addedRecipes.length > 0) {
            if (addedRecipes.length === 1) {
              toast.success(`New recipe added: "${addedRecipes[0].title}"!`);
            } else {
              toast.success(`${addedRecipes.length} new recipes added!`);
            }
            
            // Mark new recipes for visual highlighting
            const newIds = new Set([...newRecipeIds, ...addedRecipes.map(r => r.id)]);
            setNewRecipeIds(newIds);
            
            // Remove the "new" indicator after 5 minutes
            setTimeout(() => {
              setNewRecipeIds(prev => {
                const updated = new Set(prev);
                addedRecipes.forEach(recipe => updated.delete(recipe.id));
                return updated;
              });
            }, 5 * 60 * 1000); // 5 minutes
          }
          
          if (removedRecipes.length > 0) {
            if (removedRecipes.length === 1) {
              toast.info(`Recipe removed: "${removedRecipes[0].title}"`);
            } else {
              toast.info(`${removedRecipes.length} recipes removed`);
            }
          }
          
          if (updatedRecipes.length > 0) {
            if (updatedRecipes.length === 1) {
              toast.info(`Recipe updated: "${updatedRecipes[0].title}"`);
            } else {
              toast.info(`${updatedRecipes.length} recipes updated`);
            }
            
            // Mark updated recipes for visual highlighting
            const updatedIds = new Set([...updatedRecipeIds, ...updatedRecipes.map(r => r.id)]);
            setUpdatedRecipeIds(updatedIds);
            
            // Remove the "updated" indicator after 3 minutes
            setTimeout(() => {
              setUpdatedRecipeIds(prev => {
                const updated = new Set(prev);
                updatedRecipes.forEach(recipe => updated.delete(recipe.id));
                return updated;
              });
            }, 3 * 60 * 1000); // 3 minutes
          }
          
          // Also check for count changes as fallback
          if (newRecipes.length !== previousCount && addedRecipes.length === 0 && removedRecipes.length === 0) {
            if (newRecipes.length > previousCount) {
              toast.success(`Added ${newRecipes.length - previousCount} new recipe(s)!`);
            } else if (newRecipes.length < previousCount) {
              toast.info(`Removed ${previousCount - newRecipes.length} recipe(s)`);
            }
          }
        }
      }
    } catch (error) {
      console.log('Recipes refresh failed:', error);
      toast.error('Failed to refresh recipes');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh recipes every 30 seconds and on mount
  useEffect(() => {
    // Immediately fetch fresh data to avoid showing old cached recipes
    fetchRecipes();
    
    // Set up interval for ongoing updates
    const interval = setInterval(fetchRecipes, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ownContainer py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
          Spicy Recipes
        </h1>
        <div className="text-sm text-foreground/60 mb-2">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} available
          <span className="ml-4 text-xs">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          {(newRecipeIds.size > 0 || updatedRecipeIds.size > 0) && (
            <span className="ml-4 text-xs">
              {newRecipeIds.size > 0 && (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {newRecipeIds.size} new
                </span>
              )}
              {updatedRecipeIds.size > 0 && (
                <span className="inline-flex items-center gap-1 text-blue-600 ml-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {updatedRecipeIds.size} updated
                </span>
              )}
            </span>
          )}
        </div>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Discover delicious ways to use our chili oils and spices. From traditional
          recipes to modern fusion dishes, explore our collection of fiery delights.
        </p>
        <button
          onClick={() => {
            toast.info('Refreshing recipes...');
            fetchRecipes();
          }}
          disabled={isLoading}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Recipes'}
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Recipes Grid */}
      <div className="space-y-24">
        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-foreground/60 mb-2">
              No recipes available
            </h3>
            <p className="text-foreground/40">
              Check back later for new recipes!
            </p>
          </div>
        ) : (
          recipes.map((recipe, index) => (
            <article
              key={recipe.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-500 ${
                index % 2 === 0 ? "" : "lg:grid-flow-col-dense"
              } ${
                newRecipeIds.has(recipe.id) 
                  ? 'ring-2 ring-green-500/30 bg-green-50/50 rounded-2xl p-4' 
                  : updatedRecipeIds.has(recipe.id)
                  ? 'ring-2 ring-blue-500/30 bg-blue-50/50 rounded-2xl p-4'
                  : ''
              }`}
            >
              {/* Image Column */}
              <div
                className={`relative h-[400px] w-full rounded-[2rem] overflow-hidden shadow-xl ${
                  index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                }`}
                style={{
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08)",
                }}
              >
                {/* New Recipe Badge */}
                {newRecipeIds.has(recipe.id) && (
                  <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    New!
                  </div>
                )}
                {/* Updated Recipe Badge */}
                {updatedRecipeIds.has(recipe.id) && (
                  <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    Updated!
                  </div>
                )}
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Decorative blur background */}
                <div
                  className={`absolute w-full h-full rounded-[2rem] z-0 ${
                    index % 2 === 0
                      ? "bg-gradient-to-br from-accent/20 to-transparent -left-8 -top-8"
                      : "bg-gradient-to-bl from-accent/20 to-transparent -right-8 -top-8"
                  }`}
                  style={{ filter: "blur(30px)" }}
                />
              </div>

              {/* Content Column */}
              <div
                className={`space-y-6 ${
                  index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <h2 className="text-3xl font-display font-bold text-primary">
                  {recipe.title}
                </h2>
                <p className="text-foreground/70 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Recipe Details */}
                <div className="flex flex-wrap gap-6 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>

                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="font-medium">View Recipe</span>
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
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Newsletter Section */}
      <div className="mt-24 text-center">
        <div className="spicy-card p-8 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-display text-primary mb-4">
            Get More Recipes!
          </h2>
          <p className="text-foreground/70 mb-6">
            Subscribe to our newsletter for new recipes, cooking tips, and exclusive
            offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
