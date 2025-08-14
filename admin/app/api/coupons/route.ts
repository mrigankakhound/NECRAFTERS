import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.coupon || !data.discount || !data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate discount range
    if (data.discount < 0 || data.discount > 100) {
      return NextResponse.json(
        { error: "Discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        coupon: data.coupon.toUpperCase(),
        discount: Number(data.discount),
        startDate: data.startDate,
        endDate: data.endDate,
        minimumOrderValue: data.minimumOrderValue ? Number(data.minimumOrderValue) : null,
        maxUsers: data.maxUsers ? Number(data.maxUsers) : null,
        perUserLimit: Boolean(data.perUserLimit),
        currentUserCount: 0,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
