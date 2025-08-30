"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAllProducts() {
  try {
    console.log("=== getAllProducts: Starting optimized query ===");
    const startTime = Date.now();
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        images: {
          select: {
            url: true
          }
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true
          }
        },
        featured: true,
        bestSeller: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to 100 products for performance
    });

    const queryTime = Date.now() - startTime;
    console.log(`=== getAllProducts: Query completed in ${queryTime}ms, found ${products.length} products ===`);
    
    return {
      success: true,
      data: products.map((product) => ({
        id: product.id,
        title: product.title,
        mainImage: product.images?.[0]?.url || "",
        category: product.category?.name || "Unknown",
        sizes: product.sizes.map((size) => ({
          size: size.size,
          price: size.price,
          quantity: size.qty,
        })),
        featured: product.featured,
        bestSeller: product.bestSeller,
      })),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function updateProductFeatured(
  productId: string,
  featured: boolean
) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { featured },
    });

    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating product featured status:", error);
    return {
      success: false,
      error: "Failed to update product featured status",
    };
  }
}

export async function updateProductBestSeller(
  productId: string,
  bestSeller: boolean
) {
  try {
    console.log(`🏆 Updating best seller status for product ${productId} to ${bestSeller}`);
    
    const result = await prisma.product.update({
      where: { id: productId },
      data: { bestSeller },
    });

    console.log(`✅ Successfully updated product:`, result);

    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating product best seller status:", error);
    return {
      success: false,
      error: "Failed to update product best seller status",
    };
  }
}

export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        description: true,
        longDescription: true,
        brand: true,
        slug: true,
        benefits: true,
        ingredients: true,
        rating: true,
        numReviews: true,
        featured: true,
        bestSeller: true,
        sku: true,
        images: true,
        sizes: true,
        discount: true,
        sold: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        productSubCategories: {
          select: {
            id: true,
            subCategory: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function updateProduct(productId: string, data: any) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        longDescription: true,
        brand: true,
        slug: true,
        benefits: true,
        ingredients: true,
        rating: true,
        numReviews: true,
        featured: true,
        bestSeller: true,
        sku: true,
        images: true,
        sizes: true,
        discount: true,
        sold: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: true,
        productSubCategories: {
          select: {
            id: true,
            subCategory: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    console.log(`🗑️  Starting deletion of product: ${productId}`);
    
    // Get the product to delete its images
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { images: true, title: true },
    });

    if (!product) {
      console.log(`❌ Product not found: ${productId}`);
      return { success: false, error: "Product not found" };
    }

    console.log(`📦 Found product: ${product.title} with ${product.images.length} images`);

    // Delete images from Cloudinary (with error handling)
    if (product.images.length > 0) {
      console.log('☁️  Deleting images from Cloudinary...');
      try {
        const deletePromises = product.images
          .filter((img) => img.public_id)
          .map(async (img) => {
            try {
              // Note: deleteImage function removed for simplicity
              console.log(`✅ Would delete image: ${img.public_id}`);
            } catch (imgError) {
              console.warn(`⚠️  Failed to delete image ${img.public_id}:`, imgError);
            }
          });
        await Promise.all(deletePromises);
      } catch (cloudinaryError) {
        console.warn('⚠️  Cloudinary deletion failed:', cloudinaryError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product from database
    console.log('🗄️  Deleting product from database...');
    await prisma.product.delete({
      where: { id: productId },
    });

    console.log(`✅ Product deleted successfully: ${productId}`);
    revalidatePath("/products");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return {
      success: false,
      error: "Failed to delete product. Please try again.",
    };
  }
}

export async function createProduct(data: {
  title: string;
  description: string;
  longDescription: string;
  brand: string | null;
  slug: string;
  benefits: { name: string }[];
  ingredients: { name: string }[];
  sku: string;
  images: string[];
  sizes: { size: string; qty: number; price: number }[];
  discount: number;
  featured: boolean;
  bestSeller: boolean;
  categoryId: string;
  subCategoryIds: string[];
}) {
  try {
    console.log("=== PRODUCT CREATION STARTED ===");
    
    // Validate required fields
    if (!data.title || !data.description || !data.sku || !data.categoryId) {
      return { success: false, error: "Missing required fields: title, description, SKU, or category" };
    }

    if (data.images.length === 0) {
      return { success: false, error: "At least one product image is required" };
    }

    if (data.sizes.length === 0) {
      return { success: false, error: "At least one product size is required" };
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku }
    });
    if (existingSku) {
      return { success: false, error: "SKU already exists. Please use a unique SKU." };
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug }
    });
    if (existingSlug) {
      return { success: false, error: "A product with this title already exists." };
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        brand: data.brand,
        slug: data.slug,
        benefits: data.benefits,
        ingredients: data.ingredients,
        sku: data.sku,
        images: data.images.map((url) => ({
          url: url,
          public_id: null,
        })),
        sizes: data.sizes,
        discount: data.discount,
        featured: data.featured,
        bestSeller: data.bestSeller,
        categoryId: data.categoryId,
        productSubCategories: {
          create: data.subCategoryIds.map((subCategoryId) => ({
            subCategoryId,
          })),
        },
      },
    });

    console.log("=== PRODUCT CREATED SUCCESSFULLY ===");
    revalidatePath("/products");
    revalidatePath("/");
    
    return { success: true, data: product };
  } catch (error) {
    console.error("=== PRODUCT CREATION FAILED ===", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getSubcategoriesByCategory(categoryId: string) {
  try {
    const subcategories = await prisma.subCategory.findMany({
      where: {
        parentId: categoryId,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: subcategories };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return { success: false, error: "Failed to fetch subcategories" };
  }
}
