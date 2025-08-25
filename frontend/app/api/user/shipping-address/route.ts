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
    // Test database connection first
    try {
      await prisma.$connect();
    } catch (dbError) {
      return NextResponse.json({ 
        error: "Database connection failed - please try again later" 
      }, { status: 503 });
    }
    
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized - User not authenticated" }, { status: 401 });
    }

    const addressData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address1', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !addressData[field] || addressData[field].trim() === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true }
    });

    if (!existingUser) {
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

    return NextResponse.json(updatedUser.address);
  } catch (error) {
    // Provide more specific error messages
    if (error instanceof Error) {
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
      // Silent disconnect error
    }
  }
}
