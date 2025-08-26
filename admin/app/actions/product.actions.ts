"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/cloudinary";
import { uploadImage } from "@/lib/cloudinary";

interface ProductSize {
  size: string;
  qty: number;
  price: number;
  sold: number;
}

export async function createProduct(data: {
  title: string;
  description: string;
  longDescription: string;
  brand: string | null;
  slug: string;
  benefits: string[];
  ingredients: string[];
  sku: string;
  images: string[]; // These are now Cloudinary URLs, not base64 strings
  sizes: ProductSize[];
  discount: number;
  featured: boolean;
  categoryId: string;
  subCategoryIds: string[];
}) {
  console.log("=== PRODUCT CREATION STARTED ===");
  console.log("Data received:", {
    title: data.title,
    description: data.description?.substring(0, 50) + "...",
    sku: data.sku,
    categoryId: data.categoryId,
    imagesCount: data.images.length,
    sizesCount: data.sizes.length,
    benefitsCount: data.benefits.length,
    ingredientsCount: data.ingredients.length
  });
  
  try {
    console.log("Starting product creation...");
    console.log("Images count:", data.images.length);
    console.log("Category ID:", data.categoryId);
    console.log("Subcategory IDs:", data.subCategoryIds);

    // Test database connection
    try {
      await prisma.$connect();
      console.log("Database connected successfully");
      
      // Test a simple query
      const categoryCount = await prisma.category.count();
      console.log("Database query test successful, category count:", categoryCount);
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return { success: false, error: "Database connection failed. Please try again." };
    }

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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });
    if (!category) {
      return { success: false, error: "Selected category does not exist." };
    }

    // Validate image URLs (they should already be Cloudinary URLs)
    console.log("=== VALIDATING IMAGE URLS ===");
    for (let i = 0; i < data.images.length; i++) {
      const imageUrl = data.images[i];
      if (!imageUrl || typeof imageUrl !== 'string') {
        return { success: false, error: `Invalid image URL at position ${i + 1}` };
      }
      if (!imageUrl.startsWith('https://res.cloudinary.com/')) {
        return { success: false, error: `Invalid image URL format at position ${i + 1}. Expected Cloudinary URL.` };
      }
    }

    console.log("=== IMAGES ALREADY UPLOADED TO CLOUDINARY ===");
    console.log("Image URLs:", data.images);

    // Create product in database with the provided image URLs
    console.log("=== CREATING PRODUCT IN DATABASE ===");
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        brand: data.brand,
        slug: data.slug,
        benefits: data.benefits.map((name) => ({ name })),
        ingredients: data.ingredients.map((name) => ({ name })),
        sku: data.sku,
        images: data.images.map((url) => ({
          url: url,
          public_id: null, // We don't have public_id from the upload API
        })),
        sizes: data.sizes,
        discount: data.discount,
        featured: data.featured,
        categoryId: data.categoryId,
        productSubCategories: {
          create: data.subCategoryIds.map((subCategoryId) => ({
            subCategoryId,
          })),
        },
      },
      include: {
        category: true,
        productSubCategories: {
          include: {
            subCategory: true,
          },
        },
      },
    });

    console.log("=== PRODUCT CREATED SUCCESSFULLY ===");
    console.log("Product ID:", product.id);
    console.log("Product title:", product.title);
    console.log("Product images count:", product.images.length);
    
    revalidatePath("/products");
    console.log("=== REVALIDATING PATHS ===");
    
    const result = { success: true, data: product };
    console.log("=== RETURNING SUCCESS RESULT ===");
    return result;
  } catch (error) {
    console.error("=== PRODUCT CREATION FAILED ===");
    console.error("Error type:", typeof error);
    console.error("Error constructor:", error?.constructor?.name);
    console.error("Error instanceof Error:", error instanceof Error);
    
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Provide more specific error messages
      if (error.message.includes("SKU already exists")) {
        return { success: false, error: "SKU already exists. Please use a unique SKU." };
      }
      if (error.message.includes("Foreign key constraint")) {
        return { success: false, error: "Invalid category or subcategory selected." };
      }
      if (error.message.includes("Unique constraint")) {
        return { success: false, error: "A product with this title or SKU already exists." };
      }
      if (error.message.includes("Database connection failed")) {
        return { success: false, error: "Database connection failed. Please try again." };
      }
      if (error.message.includes("Invalid image URL")) {
        return { success: false, error: error.message };
      }
    }
    
    // Log the full error for debugging
    console.error("Full error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error: error
    });
    
    return { success: false, error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    // Always disconnect from database
    try {
      await prisma.$disconnect();
      console.log("Database disconnected");
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        productSubCategories: {
          include: {
            subCategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: products.map((product) => ({
        id: product.id,
        title: product.title,
        mainImage: product.images?.[0]?.url || "",
        category: product.category.name,
        sizes: product.sizes.map((size) => ({
          size: size.size,
          price: size.price,
          quantity: size.qty,
        })),
        featured: product.featured,
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
    return { success: true };
  } catch (error) {
    console.error("Error updating product featured status:", error);
    return {
      success: false,
      error: "Failed to update product featured status",
    };
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
              await deleteImage(img.public_id!);
              console.log(`✅ Deleted image: ${img.public_id}`);
            } catch (imgError) {
              console.warn(`⚠️  Failed to delete image ${img.public_id}:`, imgError);
              // Continue with deletion even if image deletion fails
            }
          });
        await Promise.all(deletePromises);
      } catch (cloudinaryError) {
        console.warn('⚠️  Cloudinary deletion failed, continuing with database cleanup:', cloudinaryError);
      }
    }

    // Delete related records first (in the correct order)
    console.log('🗂️  Deleting related records...');
    
    // 1. Delete ProductSubCategory records
    const deletedSubCategories = await prisma.productSubCategory.deleteMany({
      where: { productId },
    });
    console.log(`✅ Deleted ${deletedSubCategories.count} subcategory records`);

    // 2. Delete ProductReview records
    const deletedReviews = await prisma.productReview.deleteMany({
      where: { productId },
    });
    console.log(`✅ Deleted ${deletedReviews.count} review records`);

    // 3. Now delete the product
    console.log('🗑️  Deleting the product...');
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    console.log(`✅ Product deleted successfully: ${deletedProduct.title}`);

    revalidatePath("/products");
    console.log('🔄 Revalidated products page');
    
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    
    // Provide more specific error messages
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2003') {
        return { success: false, error: "Foreign key constraint violation - product has related records" };
      } else if (prismaError.code === 'P2025') {
        return { success: false, error: "Product not found or already deleted" };
      } else if (prismaError.code === 'P2014') {
        return { success: false, error: "Required relation violation - related records need to be deleted first" };
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to delete product: ${errorMessage}` };
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

export async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        productSubCategories: {
          include: {
            subCategory: true,
          },
        },
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return {
      success: true,
      data: {
        id: product.id,
        title: product.title,
        description: product.description,
        longDescription: product.longDescription,
        brand: product.brand,
        slug: product.slug,
        benefits: product.benefits.map((b) => b.name),
        ingredients: product.ingredients.map((i) => i.name),
        sku: product.sku,
        images: product.images,
        sizes: product.sizes,
        discount: product.discount || 0,
        featured: product.featured,
        categoryId: product.categoryId,
        category: product.category,
        subCategories: product.productSubCategories.map((ps) => ps.subCategory),
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function updateProduct(
  productId: string,
  data: {
    title: string;
    description: string;
    longDescription: string;
    brand: string | null;
    slug: string;
    benefits: string[];
    ingredients: string[];
    sku: string;
    images: (string | File)[];
    sizes: ProductSize[];
    discount: number;
    featured: boolean;
    categoryId: string;
    subCategoryIds: string[];
    imagesToDelete?: { public_id: string }[];
  }
) {
  try {
    // Delete old images from Cloudinary if specified
    if (data.imagesToDelete && data.imagesToDelete.length > 0) {
      const deletePromises = data.imagesToDelete.map((img) =>
        deleteImage(img.public_id)
      );
      await Promise.all(deletePromises);
    }

    // Upload new images to Cloudinary (if they are File objects)
    const uploadPromises = data.images
      .filter((img) => img instanceof File)
      .map(async (image) => {
        // Convert File to base64 string
        const bytes = await (image as File).arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${(image as File).type};base64,${buffer.toString('base64')}`;
        return uploadImage(base64Image, "products");
      });
    const uploadedImages = await Promise.all(uploadPromises);

    // Combine existing images (not File objects) with newly uploaded ones
    const finalImages = [
      ...data.images
        .filter((img) => typeof img === 'string')
        .map((url) => {
          const existingImage = data.imagesToDelete?.find(
            (img) => img.public_id && url.includes(img.public_id)
          );
          return existingImage
            ? null
            : { url, public_id: url.split("/").pop()?.split(".")[0] };
        })
        .filter((img): img is { url: string; public_id: string } => img !== null),
      ...uploadedImages.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      })),
    ];

    // Update product in database
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        brand: data.brand,
        slug: data.slug,
        benefits: data.benefits.map((name) => ({ name })),
        ingredients: data.ingredients.map((name) => ({ name })),
        sku: data.sku,
        images: finalImages,
        sizes: data.sizes,
        discount: data.discount,
        featured: data.featured,
        categoryId: data.categoryId,
        productSubCategories: {
          deleteMany: {},
          create: data.subCategoryIds.map((subCategoryId) => ({
            subCategoryId,
          })),
        },
      },
      include: {
        category: true,
        productSubCategories: {
          include: {
            subCategory: true,
          },
        },
      },
    });

    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}
