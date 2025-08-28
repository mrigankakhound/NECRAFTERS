import { NextResponse } from "next/server";
import {
  getAllProducts,
  getFilteredProducts,
  getProductsByCategory,
} from "@/actions/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const categories = searchParams.get("categories")?.split(",").filter(Boolean);
    const subCategories = searchParams
      .get("subCategories")
      ?.split(",")
      .filter(Boolean);
    const sizes = searchParams.get("sizes")?.split(",").filter(Boolean);
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;

    // If a single category slug is provided, use category endpoint
    if (category) {
      const result = await getProductsByCategory(category, page, limit);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, ...result });
    }

    // If any filters are provided, use filter endpoint
    const hasFilters =
      (categories && categories.length > 0) ||
      (subCategories && subCategories.length > 0) ||
      (sizes && sizes.length > 0) ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      !!sortBy;

    if (hasFilters) {
      const result = await getFilteredProducts({
        categories,
        subCategories,
        sizes,
        minPrice,
        maxPrice,
        sortBy,
      });
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      // If filters return empty, gracefully fall back to page 1 of all products
      if (!result.data || result.data.length === 0) {
        const fallback = await getAllProducts(1, limit);
        if (!fallback.success) {
          return NextResponse.json({ success: false, error: fallback.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, ...fallback });
      }

      // Wrap to include minimal pagination for filtered list
      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: {
          page: 1,
          limit: result.data?.length ?? 0,
          total: result.data?.length ?? 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    // Default: all products paginated
    const result = await getAllProducts(page, limit);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error in /api/products:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}


