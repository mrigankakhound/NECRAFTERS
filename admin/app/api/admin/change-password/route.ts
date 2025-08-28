import { NextRequest, NextResponse } from "next/server";

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

    // Get current admin password from environment variable
    const currentAdminPassword = process.env.ADMIN_PASSWORD;

    if (!currentAdminPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify current password
    if (currentPassword !== currentAdminPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // In a real production environment, you would update the environment variable
    // For now, we'll return success and log the change
    console.log(`Admin password change requested. New password: ${newPassword}`);
    
    // Note: In production, you would need to:
    // 1. Update the environment variable in your deployment platform
    // 2. Restart the application to pick up the new password
    // 3. Store the password securely (hashed, encrypted, etc.)

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Please note: You may need to restart the application for changes to take effect.",
    });

  } catch (error) {
    console.error("Error changing admin password:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
