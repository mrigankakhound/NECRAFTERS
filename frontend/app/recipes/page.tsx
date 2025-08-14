import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChefHat } from "lucide-react";
import { prisma } from "@/lib/db";

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

  return (
    <div className="ownContainer py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
          Spicy Recipes
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Discover delicious ways to use our chili oils and spices. From traditional
          recipes to modern fusion dishes, explore our collection of fiery delights.
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="space-y-24">
        {recipes.map((recipe, index) => (
          <article
            key={recipe.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
              index % 2 === 0 ? "" : "lg:grid-flow-col-dense"
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
        ))}
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