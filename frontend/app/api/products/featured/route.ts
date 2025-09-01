import { NextResponse } from "next/server";
import { getFeaturedProducts } from "@/actions/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;

    const result = await getFeaturedProducts(limit, page);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to fetch featured products" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Featured products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
