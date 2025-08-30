import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    console.log(`=== PRODUCTS API: page ${page}, limit ${limit} ===`);
    const startTime = Date.now();
    
    // Step 1: Get total count first
    const countStart = Date.now();
    const totalCount = await prisma.product.count();
    const countTime = Date.now() - countStart;
    console.log(`✅ Count query: ${countTime}ms, total: ${totalCount}`);
    
    if (totalCount === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          limit
        },
        performance: { totalTime: Date.now() - startTime, countTime },
        message: "No products found"
      });
    }
    
    // Step 2: Get products with pagination
    const productsStart = Date.now();
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        images: true,
        sizes: true,
        featured: true,
        bestSeller: true,
        categoryId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const productsTime = Date.now() - productsStart;
    console.log(`✅ Products query: ${productsTime}ms, found: ${products.length}`);
    
    // Step 3: Get categories for these products
    const categoryIds = [...new Set(products.map(p => p.categoryId))];
    let categories: Array<{ id: string; name: string }> = [];
    
    if (categoryIds.length > 0) {
      const categoriesStart = Date.now();
      categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true }
      });
      const categoriesTime = Date.now() - categoriesStart;
      console.log(`✅ Categories query: ${categoriesTime}ms, found: ${categories.length}`);
    }
    
    // Step 4: Map the data
    const categoryMap = new Map(categories.map(c => [c.id, c.name]));
    const mappedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      mainImage: product.images?.[0]?.url || "",
      category: categoryMap.get(product.categoryId) || "Unknown",
      sizes: product.sizes?.map((size: { size: string; price: number; qty: number }) => ({
        size: size.size,
        price: size.price,
        quantity: size.qty,
      })) || [],
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
    }));
    
    const totalTime = Date.now() - startTime;
    console.log(`=== TOTAL TIME: ${totalTime}ms ===`);
    
    return NextResponse.json({
      success: true,
      data: mappedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      },
      performance: {
        totalTime,
        countTime,
        productsTime,
        categoriesTime: categories.length > 0 ? Date.now() - (startTime + countTime + productsTime) : 0
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Products API failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
