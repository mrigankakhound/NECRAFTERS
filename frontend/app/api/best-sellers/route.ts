import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get best sellers with all necessary data
    const bestSellers = await prisma.product.findMany({
      where: {
        bestSeller: true,
      },
      take: 8,
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
        sku: true,
        images: true,
        sizes: true,
        discount: true,
        sold: true,
        bestSeller: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: bestSellers,
    });
    
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch best sellers',
        data: []
      },
      { status: 500 }
    );
  }
}
