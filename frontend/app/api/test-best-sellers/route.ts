import { getBestSellerProducts, clearBestSellersCache } from "@/actions/products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Clear cache first
    clearBestSellersCache();
    
    // Test the function
    const result = await getBestSellerProducts(8);
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error testing best sellers:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
