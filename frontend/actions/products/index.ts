"use server";
import { prisma } from "@/lib/prisma";

export async function getBestSellerProducts(limit: number = 10) {
  const startTime = Date.now();
  let queryStartTime: number;
  let queryEndTime: number;
  
  try {
    console.log(`🚀 [${new Date().toISOString()}] getBestSellerProducts called with limit: ${limit}`);
    
    // Check database connection first
    const connectionStart = Date.now();
    await prisma.$connect();
    const connectionTime = Date.now() - connectionStart;
    console.log(`🔌 Database connection time: ${connectionTime}ms`);
    
    // EXACTLY like featured products - ONE SINGLE QUERY, no fallbacks
    queryStartTime = Date.now();
    const bestSellers = await prisma.product.findMany({
      where: { bestSeller: true },
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
    queryEndTime = Date.now();
    
    const queryTime = queryEndTime - queryStartTime;
    console.log(`📊 Database query time: ${queryTime}ms, Found ${bestSellers.length} products`);

    // Simple processing exactly like featured products
    const processingStart = Date.now();
    const processedData = bestSellers.map(product => ({
      ...product,
      images: product.images && product.images.length > 0 ? product.images.slice(0, 1) : [],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes.slice(0, 1) : [],
      discount: product.discount || 0,
      rating: product.rating || 0,
      numReviews: 0,
      sold: 0,
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
    }));
    const processingTime = Date.now() - processingStart;
    console.log(`⚙️ Data processing time: ${processingTime}ms`);

    const totalTime = Date.now() - startTime;
    console.log(`✅ Total function time: ${totalTime}ms`);

    return {
      success: true,
      data: processedData,
      isFallback: false,
      performance: { 
        queryTime, 
        processingTime,
        connectionTime,
        totalTime,
        productCount: processedData.length, 
        fromCache: false 
      },
    };

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [${new Date().toISOString()}] Error in getBestSellerProducts after ${totalTime}ms:`, error);
    return {
      success: false,
      error: "Failed to fetch best seller products",
      data: [],
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFeaturedProducts(limit: number = 10, page: number = 1) {
  const startTime = Date.now();
  
  try {
    console.log(`🚀 [${new Date().toISOString()}] getFeaturedProducts called with limit: ${limit}, page: ${page}`);
    
    const skip = (page - 1) * limit;
    
    const queryStart = Date.now();
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
    const queryTime = Date.now() - queryStart;
    console.log(`📊 Featured products query time: ${queryTime}ms, Found ${featuredProducts.length} products`);

    // Process the results to get only the first image and size
    const processingStart = Date.now();
    const processedFeaturedProducts = featuredProducts.map(product => ({
      ...product,
      images: product.images && product.images.length > 0 ? product.images.slice(0, 1) : [],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes.slice(0, 1) : [],
      discount: product.discount || 0,
    }));
    const processingTime = Date.now() - processingStart;
    console.log(`⚙️ Featured products processing time: ${processingTime}ms`);

    const totalTime = Date.now() - startTime;
    console.log(`✅ Featured products total time: ${totalTime}ms`);

    return {
      success: true,
      data: processedFeaturedProducts,
    };
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [${new Date().toISOString()}] Error in getFeaturedProducts after ${totalTime}ms:`, error);
    return {
      success: false,
      error: "Failed to fetch featured products",
      data: [],
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        longDescription: true,
        brand: true,
        slug: true,
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
        benefits: true,
        ingredients: true,
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
      return {
        success: false,
        error: "Product not found",
        data: null,
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return {
      success: false,
      error: "Failed to fetch product",
      data: null,
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
    
    // Use a single query with aggregation for better performance
    const [category, products, totalCount] = await Promise.all([
      prisma.category.findFirst({
        where: { slug: categorySlug },
        select: { id: true, name: true, slug: true }
      }),
      prisma.product.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          longDescription: true,
          brand: true,
          slug: true,
          rating: true,
          numReviews: true,
          featured: true,
          bestSeller: true,
          sku: true,
          images: { select: { url: true, public_id: true } },
          sizes: { select: { price: true, size: true, qty: true, sold: true } },
          discount: true,
          sold: true,
          categoryId: true,
          benefits: { select: { name: true } },
          ingredients: { select: { name: true } },
          category: { select: { name: true, id: true, slug: true } },
          productSubCategories: {
            select: {
              subCategory: { select: { name: true, slug: true } }
            }
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: { 
          category: { slug: categorySlug }
        }
      }),
    ]);

    if (!category) {
      return {
        success: false,
        error: "Category not found",
      };
    }

    // Filter products by category after query (more efficient than complex where clause)
    const filteredProducts = products.filter(product => 
      product.categoryId === category.id
    );

    return { 
      success: true, 
      data: filteredProducts,
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






