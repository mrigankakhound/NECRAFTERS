"use server";
import { prisma } from "@/lib/prisma";

// Simple in-memory cache for best sellers (resets on server restart)
let bestSellersCache: {
  data: any[];
  timestamp: number;
  ttl: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Function to clear cache for debugging
export async function clearBestSellersCache() {
  bestSellersCache = null;
  console.log("🧹 Best sellers cache cleared");
}

export async function getBestSellerProducts(limit: number = 10) {
  console.log(`🔍 getBestSellerProducts called with limit: ${limit}`);
  
  // AGGRESSIVE CACHING STRATEGY - Load instantly from cache if available
  if (bestSellersCache && (Date.now() - bestSellersCache.timestamp) < CACHE_TTL) {
    console.log(`✅ Best sellers served from cache: ${bestSellersCache.data.length} products`);
    return {
      success: true,
      data: bestSellersCache.data.slice(0, limit),
      isFallback: false,
      performance: {
        queryTime: 0,
        productCount: bestSellersCache.data.length,
        fromCache: true,
      },
    };
  }

  // IMMEDIATE FALLBACK - Skip slow database queries, use working approach
  console.log("🚀 Using immediate fallback for instant loading...");
  
  try {
    // Get featured products immediately (we know this works fast)
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        discount: true,
        rating: true,
        bestSeller: true,
        featured: true,
        images: { select: { url: true } },
        sizes: { select: { price: true, size: true, qty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (featuredProducts.length > 0) {
      console.log(`✅ Featured products loaded instantly: ${featuredProducts.length} products`);
      
      const processedData = featuredProducts.map(product => ({
        ...product,
        images: product.images || [],
        sizes: product.sizes || [],
        discount: product.discount || 0,
        rating: product.rating || 0,
        numReviews: 0,
        sold: 0,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
      }));

      // Cache this data immediately for future requests
      bestSellersCache = {
        data: processedData,
        timestamp: Date.now(),
        ttl: CACHE_TTL,
      };

      return {
        success: true,
        data: processedData,
        isFallback: true,
        performance: { queryTime: 0, productCount: processedData.length, fromCache: false },
      };
    }
  } catch (error) {
    console.log("⚠️ Featured products failed, trying latest products:", error);
  }

  // Final fallback: Get latest products
  try {
    const latestProducts = await prisma.product.findMany({
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        discount: true,
        rating: true,
        bestSeller: true,
        featured: true,
        images: { select: { url: true } },
        sizes: { select: { price: true, size: true, qty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (latestProducts.length > 0) {
      console.log(`✅ Latest products fallback loaded: ${latestProducts.length} products`);
      
      const processedData = latestProducts.map(product => ({
        ...product,
        images: product.images || [],
        sizes: product.sizes || [],
        discount: product.discount || 0,
        rating: product.rating || 0,
        numReviews: 0,
        sold: 0,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
      }));

      // Cache this data immediately
      bestSellersCache = {
        data: processedData,
        timestamp: Date.now(),
        ttl: CACHE_TTL,
      };

      return {
        success: true,
        data: processedData,
        isFallback: true,
        performance: { queryTime: 0, productCount: processedData.length, fromCache: false },
      };
    }
  } catch (error) {
    console.log("⚠️ Featured products fallback failed, using latest products:", error);
  }

  // Final fallback: Get latest products
  try {
    console.log("🔄 Final fallback to latest products...");
    const latestProducts = await prisma.product.findMany({
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        discount: true,
        rating: true,
        bestSeller: true,
        featured: true,
        images: { select: { url: true } },
        sizes: { select: { price: true, size: true, qty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (latestProducts.length > 0) {
      console.log(`✅ Latest products fallback successful: ${latestProducts.length} products`);
      const processedData = latestProducts.map(product => ({
        ...product,
        images: product.images || [],
        sizes: product.sizes || [],
        discount: product.discount || 0,
        rating: product.rating || 0,
        numReviews: 0,
        sold: 0,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
      }));

      return {
        success: true,
        data: processedData,
        isFallback: true,
        performance: { queryTime: 0, productCount: processedData.length, fromCache: false },
      };
    }
  } catch (error) {
    console.error("❌ All fallback queries failed:", error);
  }

  // If we reach here, no products at all
  console.log("❌ No products found at all");
  return {
    success: true,
    data: [],
    isFallback: true,
    performance: { queryTime: 0, productCount: 0, fromCache: false },
  };
}

export async function getFeaturedProducts(limit: number = 10, page: number = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        discount: true,
        images: {
          select: {
            url: true,
          }
        },
        sizes: {
          select: {
            price: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Process the results to get only the first image and size
    const processedFeaturedProducts = featuredProducts.map(product => ({
      ...product,
      images: product.images && product.images.length > 0 ? product.images.slice(0, 1) : [],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes.slice(0, 1) : [],
      discount: product.discount || 0,
    }));

    return {
      success: true,
      data: processedFeaturedProducts,
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      success: false,
      error: "Failed to fetch featured products",
      data: [],
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




