import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/app/actions/auth";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user ID
    const { userId, error } = await getAuthenticatedUserId();
    
    if (error || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the latest order for the user
    const latestOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestOrder) {
      return NextResponse.json(
        { error: "No orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: latestOrder,
    });

  } catch (error) {
    console.error("Error fetching latest order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
