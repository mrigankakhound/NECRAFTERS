import { NextResponse } from "next/server";
import { getBestSellerProducts, getFeaturedProducts, getNewArrivals } from "@/actions/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = Number(searchParams.get("limit")) || 12;
    const page = Number(searchParams.get("page")) || 1;

    // Route to specific product types
    if (type === "best-sellers") {
      const result = await getBestSellerProducts(limit);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    if (type === "featured") {
      const result = await getFeaturedProducts(limit, page);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    if (type === "new-arrivals") {
      const result = await getNewArrivals(limit);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    // Default: return featured products
    const result = await getFeaturedProducts(limit, page);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}


