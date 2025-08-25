import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { address: true },
    });

    return NextResponse.json(userData?.address || null);
  } catch (error) {
    console.error("Error fetching shipping address:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping address" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("Shipping address API called");
    
    // Test database connection first
    try {
      await prisma.$connect();
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json({ 
        error: "Database connection failed - please try again later" 
      }, { status: 503 });
    }
    
    const user = await getAuthenticatedUser();
    console.log("User authentication result:", user ? "Success" : "Failed");
    
    if (!user) {
      console.error("User not authenticated");
      return NextResponse.json({ error: "Unauthorized - User not authenticated" }, { status: 401 });
    }

    const addressData = await request.json();
    console.log("Address data received:", addressData);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address1', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !addressData[field] || addressData[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    console.log("Updating user address for user ID:", user.id);
    console.log("User ID type:", typeof user.id);
    console.log("User ID length:", user.id.length);

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true }
    });

    console.log("Existing user check result:", existingUser);

    if (!existingUser) {
      console.error("User not found in database:", user.id);
      // Try to find any users to see if database is working
      try {
        const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
        console.log("Total users in database:", allUsers.length);
        console.log("Sample user IDs:", allUsers.slice(0, 3).map(u => ({ id: u.id, email: u.email })));
      } catch (countError) {
        console.error("Error counting users:", countError);
      }
      return NextResponse.json({ 
        error: "User not found in database - please login again" 
      }, { status: 404 });
    }

    // Update user's shipping address
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        address: addressData,
      },
      select: { address: true },
    });

    console.log("Address updated successfully");
    return NextResponse.json(updatedUser.address);
  } catch (error) {
    console.error("Error updating shipping address:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json({ 
          error: "User not found in database - please login again" 
        }, { status: 404 });
      }
      if (error.message.includes('Invalid ObjectId')) {
        return NextResponse.json({ 
          error: "Invalid user ID format - please login again" 
        }, { status: 400 });
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ 
          error: "Address update failed - duplicate data" 
        }, { status: 400 });
      }
      if (error.message.includes('PrismaClientKnownRequestError')) {
        return NextResponse.json({ 
          error: "Database constraint error - please check your data" 
        }, { status: 400 });
      }
    }
    
    return NextResponse.json(
      { error: `Failed to update shipping address: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    // Always disconnect from database
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}
