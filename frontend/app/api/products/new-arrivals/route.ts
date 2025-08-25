import { NextResponse } from "next/server";
import { getNewArrivals } from "@/actions/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 4;

    const result = await getNewArrivals(limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch new arrivals" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("New arrivals API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch new arrivals" },
      { status: 500 }
    );
  }
}
