import { NextResponse } from 'next/server';
import { getFeaturedProducts } from '@/actions/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 4;
    const page = Number(searchParams.get("page")) || 1;
    
    const result = await getFeaturedProducts(limit, page);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/products/featured:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
