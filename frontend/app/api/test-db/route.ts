import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test basic database connection
    const productCount = await prisma.product.count();
    
    // Test best sellers specifically
    const bestSellers = await prisma.product.findMany({
      where: { bestSeller: true },
      take: 5,
      select: { id: true, title: true, bestSeller: true }
    });
    
    // Test featured products
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      take: 5,
      select: { id: true, title: true, featured: true }
    });
    
    // Test latest products
    const latestProducts = await prisma.product.findMany({
      take: 5,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalProducts: productCount,
        bestSellers: bestSellers,
        featuredProducts: featuredProducts,
        latestProducts: latestProducts,
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    }, { status: 500 });
  }
}
