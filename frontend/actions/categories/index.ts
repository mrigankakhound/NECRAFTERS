import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories",
    };
  }
}

export async function getAllSubCategories() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        parent: true,
        images: true,
      },
    });
    
    // Filter out subcategories with null parentId after fetching
    const validSubCategories = subCategories.filter(sc => sc.parentId && sc.parent);

    return {
      success: true,
      data: validSubCategories,
    };
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return {
      success: false,
      error: "Failed to fetch sub-categories",
    };
  }
}