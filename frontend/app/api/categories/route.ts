import { NextResponse } from 'next/server';
import { getMainCategories } from '@/actions/categories/get-main-categories';

export async function GET() {
  try {
    const result = await getMainCategories();
    
    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch categories' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
