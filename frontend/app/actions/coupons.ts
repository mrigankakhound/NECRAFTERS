"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/app/actions/auth";

export async function validateCoupon(couponCode: string) {
  try {
    // Check if prisma is available
    if (!prisma) {
      console.error("Prisma client is not available");
      return { success: false, error: "Database connection error" };
    }

    // Get authenticated user
    const { userId, error: userError } = await getAuthenticatedUserId();
    if (userError || !userId) {
      return { success: false, error: "Please login to apply coupon" };
    }

    const coupon = await prisma.coupon.findUnique({
      where: {
        coupon: couponCode,
      },
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code" };
    }

    // Check if user has already used this coupon
    const existingUsage = await prisma.couponUsage.findUnique({
      where: {
        couponId_userId: {
          couponId: coupon.id,
          userId: userId,
        },
      },
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code" };
    }

    // Check if coupon is expired
    const currentDate = new Date().toISOString().split("T")[0];
    if (currentDate > coupon.endDate || currentDate < coupon.startDate) {
      return { success: false, error: "Coupon has expired or not yet valid" };
    }

    // Check max users limit
    if (coupon.maxUsers && coupon.currentUserCount >= coupon.maxUsers) {
      return { success: false, error: "Maximum number of users have already used this coupon" };
    }

    // Check per-user limit
    if (coupon.perUserLimit && existingUsage) {
      return { success: false, error: "You have already used this coupon" };
    }

    // Update usage counts
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        currentUserCount: { increment: 1 },
      },
    });

    // Create coupon usage record
    await prisma.couponUsage.create({
      data: {
        couponId: coupon.id,
        userId: userId,
      },
    });

    return {
      success: true,
      data: {
        couponCode: coupon.coupon,
        discount: coupon.discount,
      },
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to validate coupon",
    };
  }
}

export async function getAvailableCoupons() {
  try {
    // Check if prisma is available
    if (!prisma) {
      console.error("Prisma client is not available");
      return { success: false, error: "Database connection error" };
    }

    const currentDate = new Date().toISOString().split("T")[0];
    
    const coupons = await prisma.coupon.findMany({
      where: {
        AND: [
          { startDate: { lte: currentDate } },
          { endDate: { gte: currentDate } },
        ],
      },
      orderBy: {
        discount: 'desc',
      },
    });

    return {
      success: true,
      data: coupons,
    };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch coupons",
    };
  }
}