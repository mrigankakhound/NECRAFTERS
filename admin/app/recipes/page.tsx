"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { Edit2, Trash2, Plus, Eye } from "lucide-react";

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

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    cookingTime: "",
    servings: "",
    difficulty: "",
    image: "",
    published: false,
  });

  // Fetch recipes
  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setRecipes(data.recipes);
      } else {
        console.error("API Error:", data);
        toast.error(data.error || "Failed to fetch recipes");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error fetching recipes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = selectedRecipe ? `/api/recipes/${selectedRecipe.id}` : "/api/recipes";
      const method = selectedRecipe ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(selectedRecipe ? "Recipe updated successfully" : "Recipe created successfully");
        setIsDialogOpen(false);
        fetchRecipes();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch (error) {
      toast.error("Error saving recipe");
    }
  };

  // Handle recipe deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Recipe deleted successfully");
        fetchRecipes();
      } else {
        toast.error(data.error || "Failed to delete recipe");
      }
    } catch (error) {
      toast.error("Error deleting recipe");
    }
  };

  // Handle edit button click
  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      image: recipe.image,
      published: recipe.published,
    });
    setIsDialogOpen(true);
  };

  // Handle new recipe button click
  const handleNewRecipe = () => {
    setSelectedRecipe(null);
    setFormData({
      title: "",
      description: "",
      ingredients: [],
      instructions: [],
      cookingTime: "",
      servings: "",
      difficulty: "",
      image: "",
      published: false,
    });
    setIsDialogOpen(true);
  };

  // Handle array field updates
  const handleArrayFieldUpdate = (
    field: "ingredients" | "instructions",
    value: string,
    index: number
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: "ingredients" | "instructions") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayField = (field: "ingredients" | "instructions", index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recipe Management</h1>
        <Button onClick={handleNewRecipe} className="spicy-button">
          <Plus className="w-4 h-4 mr-2" />
          New Recipe
        </Button>
      </div>

      {/* Recipes Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{recipe.title}</TableCell>
                <TableCell>{recipe.difficulty}</TableCell>
                <TableCell>{recipe.cookingTime}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      recipe.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {recipe.published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(recipe.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`/recipes/${recipe.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Recipe Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRecipe ? "Edit Recipe" : "Create New Recipe"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter recipe title"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter recipe description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="Enter image URL"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Cooking Time</label>
                  <Input
                    value={formData.cookingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, cookingTime: e.target.value })
                    }
                    placeholder="e.g., 30 mins"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Servings</label>
                  <Input
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                    placeholder="e.g., 4 servings"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Ingredients</label>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) =>
                          handleArrayFieldUpdate("ingredients", e.target.value, index)
                        }
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("ingredients", index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField("ingredients")}
                  >
                    Add Ingredient
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Instructions</label>
                <div className="space-y-2">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={instruction}
                        onChange={(e) =>
                          handleArrayFieldUpdate("instructions", e.target.value, index)
                        }
                        placeholder={`Step ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("instructions", index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField("instructions")}
                  >
                    Add Instruction
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish recipe
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="spicy-button">
                {selectedRecipe ? "Update Recipe" : "Create Recipe"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
