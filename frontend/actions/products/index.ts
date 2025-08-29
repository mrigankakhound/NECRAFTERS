"use server";
import { prisma } from "@/lib/prisma";

export async function getBestSellerProducts(limit: number = 10) {
  try {
    // Get ONLY products marked as best sellers by admin - no fallbacks
    const bestSellers = await prisma.product.findMany({
      where: {
        bestSeller: true,
      },
      take: limit,
      include: {
        category: true,
      },
    });
    
    // If we have best sellers, shuffle them for variety
    if (bestSellers.length > 0) {
      bestSellers.sort(() => Math.random() - 0.5);
    }

    // Return only actual best sellers - no fallbacks
    return {
      success: true,
      data: bestSellers,
    };
  } catch (error) {
    console.error("❌ Error fetching best seller products:", error);
    return {
      success: false,
      error: "Failed to fetch best seller products",
      data: [],
    };
  }
}

export async function getFeaturedProducts(limit: number = 10, page: number = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const [featuredProducts, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          featured: true,
        },
        skip,
        take: limit,
        include: {
          category: true,
          productSubCategories: {
            include: {
              subCategory: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          featured: true,
        },
      }),
    ]);

    return {
      success: true,
      data: featuredProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      }
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      success: false,
      error: "Failed to fetch featured products",
    };
  }
}

export async function getNewArrivals(limit?: number) {
  try {
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return { success: false, error: "Failed to fetch new arrivals" };
  }
}

export async function searchProducts(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 8, // Limit to 8 results
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: "Failed to search products" };
  }
}
export async function getAllProducts(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc', // Default ordering
        },
      }),
      prisma.product.count(), // Get total count for pagination
    ]);

    return { 
      success: true, 
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      }
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    return { success: false, error: "Failed to fetch all products" };
  }
}

export async function sortProducts(sortBy: string, page: number = 1, limit: number = 20) {
  try {
    let orderBy: any = {};
    const skip = (page - 1) * limit;

    switch (sortBy) {
      case "Featured":
        return await getFeaturedProducts(20, page);
      case "Price: Low to High":
        // For MongoDB, we need to sort by the minimum price in the sizes array
        const productsAsc = await prisma.product.findMany({
          skip,
          take: limit,
          include: {
            category: true,
          },
        });
        
        // Sort by minimum price
        const sortedAsc = productsAsc.sort((a, b) => {
          const minPriceA = Math.min(...a.sizes.map((s) => s.price));
          const minPriceB = Math.min(...b.sizes.map((s) => s.price));
          return minPriceA - minPriceB;
        });
        
        return {
          success: true,
          data: sortedAsc,
          pagination: {
            page,
            limit,
            total: await prisma.product.count(),
            totalPages: Math.ceil((await prisma.product.count()) / limit),
            hasNext: page * limit < (await prisma.product.count()),
            hasPrev: page > 1,
          }
        };
      case "Price: High to Low":
        // For MongoDB, we need to sort by the maximum price in the sizes array
        const productsDesc = await prisma.product.findMany({
          skip,
          take: limit,
          include: {
            category: true,
            productSubCategories: {
              include: {
                subCategory: true,
              },
            },
          },
        });
        
        // Sort by maximum price
        const sortedDesc = productsDesc.sort((a, b) => {
          const maxPriceA = Math.max(...a.sizes.map((s) => s.price));
          const maxPriceB = Math.max(...b.sizes.map((s) => s.price));
          return maxPriceB - maxPriceA;
        });
        
        return {
          success: true,
          data: sortedDesc,
          pagination: {
            page,
            limit,
            total: await prisma.product.count(),
            totalPages: Math.ceil((await prisma.product.count()) / limit),
            hasNext: page * limit < (await prisma.product.count()),
            hasPrev: page > 1,
          }
        };
      case "Newest":
        orderBy = { createdAt: "desc" };
        break;
      case "Best Sellers":
        orderBy = { sold: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" }; // Default sorting
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
        },
      }),
      prisma.product.count(),
    ]);

    return { 
      success: true, 
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      }
    };
  } catch (error) {
    console.error("Error sorting products:", error);
    return { success: false, error: "Failed to sort products" };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        subCategories: {
          include: {
            _count: {
              select: { productSubCategories: true },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        productCount: cat._count.products,
      })),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getProductStats() {
  try {
    const products = await prisma.product.findMany({
      select: {
        sizes: true,
      },
    });

    // Get unique sizes and price range
    const uniqueSizes = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let sizeStats: { [key: string]: number } = {};

    products.forEach((product) => {
      product.sizes.forEach((size) => {
        uniqueSizes.add(size.size);
        if (size.price < minPrice) minPrice = size.price;
        if (size.price > maxPrice) maxPrice = size.price;

        // Count products for each size
        if (sizeStats[size.size]) {
          sizeStats[size.size]++;
        } else {
          sizeStats[size.size] = 1;
        }
      });
    });

    return {
      success: true,
      data: {
        sizes: Array.from(uniqueSizes).map((size) => ({
          name: size,
          count: sizeStats[size],
        })),
        priceRange: {
          min: minPrice === Infinity ? 0 : minPrice,
          max: maxPrice === -Infinity ? 0 : maxPrice,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return { success: false, error: "Failed to fetch product stats" };
  }
}

export async function getFilteredProducts(filters: {
  categories?: string[];
  subCategories?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}) {
  try {
    let whereClause: any = {};

    // Add category filter
    if (filters.categories && filters.categories.length > 0) {
      whereClause.category = {
        name: {
          in: filters.categories,
        },
      };
    }

    // Add subcategory filter
    if (filters.subCategories && filters.subCategories.length > 0) {
      whereClause.productSubCategories = {
        some: {
          subCategory: {
            name: {
              in: filters.subCategories,
            },
          },
        },
      };
    }

    // Add size filter
    if (filters.sizes && filters.sizes.length > 0) {
      whereClause.sizes = {
        some: {
          size: {
            in: filters.sizes,
          },
        },
      };
    }

    // Add price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereClause.sizes = {
        some: {
          AND: [
            filters.minPrice !== undefined
              ? { price: { gte: filters.minPrice } }
              : {},
            filters.maxPrice !== undefined
              ? { price: { lte: filters.maxPrice } }
              : {},
          ],
        },
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
      },
    });

    // Handle sorting after fetching
    let sortedProducts = [...products];
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "Price: Low to High":
          sortedProducts.sort((a, b) => {
            const minPriceA = Math.min(...a.sizes.map((s) => s.price));
            const minPriceB = Math.min(...b.sizes.map((s) => s.price));
            return minPriceA - minPriceB;
          });
          break;
        case "Price: High to Low":
          sortedProducts.sort((a, b) => {
            const maxPriceA = Math.max(...a.sizes.map((s) => s.price));
            const maxPriceB = Math.max(...b.sizes.map((s) => s.price));
            return maxPriceB - maxPriceA;
          });
          break;
        case "Newest":
          sortedProducts.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          break;
        case "Best Sellers":
          sortedProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));
          break;
      }
    }

    return { success: true, data: sortedProducts };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return { success: false, error: "Failed to fetch filtered products" };
  }
}

export async function getProductsByCategory(categorySlug: string, page: number = 1, limit: number = 12) {
  try {
    const skip = (page - 1) * limit;
    
    // First find the category by slug
    const category = await prisma.category.findFirst({
      where: {
        slug: categorySlug,
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Category not found",
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId: category.id,
        },
        skip,
        take: limit,
        include: {
          category: true,
          productSubCategories: {
            include: {
              subCategory: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({
        where: {
          categoryId: category.id,
        },
      }),
    ]);

    return { 
      success: true, 
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      }
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return { success: false, error: "Failed to fetch products by category" };
  }
}




