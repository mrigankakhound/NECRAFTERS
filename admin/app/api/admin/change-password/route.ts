import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await prisma.admin.findFirst({
      where: { 
        username: 'admin',
        isActive: true 
      }
    });

    if (!admin) {
      console.error("No active admin user found in database");
      return NextResponse.json(
        { success: false, message: "Admin account not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidCurrentPassword = await verifyPassword(currentPassword, admin.password);

    if (!isValidCurrentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = await verifyPassword(newPassword, admin.password);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, message: "New password must be different from current password" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password in database
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    console.log(`Admin password changed successfully for user: ${admin.username}`);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully!",
    });

  } catch (error) {
    console.error("Error changing admin password:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
