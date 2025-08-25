import { NextResponse } from "next/server";
import { getBestSellerProducts } from "@/actions/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;

    const result = await getBestSellerProducts(limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch best seller products" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Best sellers API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch best seller products" },
      { status: 500 }
    );
  }
}
