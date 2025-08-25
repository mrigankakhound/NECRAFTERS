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
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json({ 
          error: "User not found in database" 
        }, { status: 404 });
      }
      if (error.message.includes('Invalid ObjectId')) {
        return NextResponse.json({ 
          error: "Invalid user ID format" 
        }, { status: 400 });
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update shipping address - Database error" },
      { status: 500 }
    );
  }
}
