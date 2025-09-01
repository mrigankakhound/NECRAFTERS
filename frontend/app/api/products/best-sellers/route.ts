import { NextResponse } from 'next/server';
import { getBestSellerProducts } from '@/actions/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 8;
    
    const result = await getBestSellerProducts(limit);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/products/best-sellers:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
