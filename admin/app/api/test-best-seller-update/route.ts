import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    console.log('🧪 Testing Best Seller Update API...');
    
    const { productId, bestSeller } = await request.json();
    console.log('📝 Received request:', { productId, bestSeller });
    
    // Test 1: Check database connection
    console.log('🔌 Testing database connection...');
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful:', connectionTest);
    
    // Test 2: Check if product exists
    console.log('🔍 Checking if product exists...');
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true, bestSeller: true }
    });
    
    if (!product) {
      console.log('❌ Product not found');
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    console.log('📦 Found product:', product);
    
    // Test 3: Update best seller status
    console.log('🔄 Updating best seller status...');
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { bestSeller },
      select: { id: true, title: true, bestSeller: true }
    });
    
    console.log('✅ Successfully updated product:', updatedProduct);
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Best seller status updated successfully',
        product: updatedProduct
      }
    });
    
  } catch (error) {
    console.error('❌ Error in test-best-seller-update API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
