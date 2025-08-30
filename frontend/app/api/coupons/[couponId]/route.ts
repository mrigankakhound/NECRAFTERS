import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

// PATCH /api/coupons/[couponId]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ couponId: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponId } = await params;
    const data = await request.json();

    // Validate required fields
    if (!data.coupon || !data.endDate || !data.discount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update coupon
    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        coupon: data.coupon,
        startDate: data.startDate,
        endDate: data.endDate,
        discount: data.discount,
        minimumOrderValue: data.minimumOrderValue,
        maxUsers: data.maxUsers,
        perUserLimit: data.perUserLimit,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE /api/coupons/[couponId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ couponId: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponId } = await params;

    await prisma.coupon.delete({
      where: { id: couponId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
