"use server";

import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";

export async function getBestSellerProducts(limit: number = 10) {
  try {
    const bestSellers = await prisma.product.findMany({
      where: {
        bestSeller: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        rating: true,
        numReviews: true,
        bestSeller: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Process the data to get only the first image and size
    const processedData = bestSellers.map((product) => ({
      ...product,
      images: product.images.slice(0, 1),
      sizes: product.sizes.slice(0, 1),
    }));

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error fetching best seller products:", error);
    return { success: false, error: "Failed to fetch best seller products" };
  }
}

export async function getFeaturedProducts(limit: number = 10, page: number = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        rating: true,
        numReviews: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Process the data to get only the first image and size
    const processedData = featuredProducts.map((product) => ({
      ...product,
      images: product.images.slice(0, 1),
      sizes: product.sizes.slice(0, 1),
    }));

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return { success: false, error: "Failed to fetch featured products" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        longDescription: true,
        brand: true,
        benefits: true,
        ingredients: true,
        rating: true,
        numReviews: true,
        featured: true,
        sku: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        sold: true,
        bestSeller: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productSubCategories: {
          select: {
            subCategory: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        longDescription: true,
        brand: true,
        benefits: true,
        ingredients: true,
        rating: true,
        numReviews: true,
        featured: true,
        sku: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        sold: true,
        bestSeller: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        productSubCategories: {
          select: {
            subCategory: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function getProductsByCategory(categoryId: string, limit: number = 20, page: number = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        rating: true,
        numReviews: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Process the data to get only the first image and size
    const processedData = products.map((product) => ({
      ...product,
      images: product.images.slice(0, 1),
      sizes: product.sizes.slice(0, 1),
    }));

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProductsBySubcategory(subcategoryId: string, limit: number = 20, page: number = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const products = await prisma.product.findMany({
      where: {
        productSubCategories: {
          some: {
            subCategoryId: subcategoryId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        rating: true,
        numReviews: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Process the data to get only the first image and size
    const processedData = products.map((product) => ({
      ...product,
      images: product.images.slice(0, 1),
      sizes: product.sizes.slice(0, 1),
    }));

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function searchProducts(query: string, limit: number = 20, page: number = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        rating: true,
        numReviews: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Process the data to get only the first image and size
    const processedData = products.map((product) => ({
      ...product,
      images: product.images.slice(0, 1),
      sizes: product.sizes.slice(0, 1),
    }));

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: "Failed to search products" };
  }
}

export async function getNewArrivals(limit: number = 4) {
  try {
    const newArrivals = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        images: {
          select: {
            url: true,
            public_id: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            qty: true,
          },
        },
        discount: true,
        rating: true,
        numReviews: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Process the data to get only the first image and size
    const processedData = newArrivals.map((product) => ({
      ...product,
      images: product.images.slice(0, 1),
      sizes: product.sizes.slice(0, 1),
    }));

    return { success: true, data: processedData };
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return { success: false, error: "Failed to fetch new arrivals" };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                productSubCategories: true,
              },
            },
          },
        },
      },
    });

    const processedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      subCategories: category.subCategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        _count: {
          productSubCategories: sub._count.productSubCategories,
        },
      })),
    }));

    return { success: true, data: processedCategories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getProductStats() {
  try {
    // Get all unique sizes from products
    const products = await prisma.product.findMany({
      select: {
        sizes: true,
      },
    });

    const sizeCounts: { [key: string]: number } = {};
    const allPrices: number[] = [];

    products.forEach(product => {
      product.sizes.forEach(size => {
        // Count sizes
        if (sizeCounts[size.size]) {
          sizeCounts[size.size]++;
        } else {
          sizeCounts[size.size] = 1;
        }
        
        // Collect prices
        if (size.price) {
          allPrices.push(size.price);
        }
      });
    });

    const sizes = Object.entries(sizeCounts).map(([name, count]) => ({
      name,
      count,
    }));

    const priceRange: [number, number] = allPrices.length > 0 
      ? [Math.min(...allPrices), Math.max(...allPrices)]
      : [0, 0];

    return {
      success: true,
      data: {
        sizes,
        priceRange,
        maxPrice: priceRange[1],
      },
    };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return { success: false, error: "Failed to fetch product stats" };
  }
}







