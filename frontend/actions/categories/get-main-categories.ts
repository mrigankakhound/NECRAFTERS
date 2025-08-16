import { prisma } from "@/lib/prisma";

export async function getMainCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        images: true,
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching main categories:", error);
    return {
      success: false,
      error: "Failed to fetch main categories",
    };
  }
}
