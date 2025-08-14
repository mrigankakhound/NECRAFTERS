import prisma from "@/lib/prisma";

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
      },
    });

    return {
      success: true,
      data: subCategories,
    };
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return {
      success: false,
      error: "Failed to fetch sub-categories",
    };
  }
}