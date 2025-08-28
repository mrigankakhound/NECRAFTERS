import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_POPUP = {
  id: 'test',
  isActive: true,
  title: "Welcome to Our Shop!",
  description: "Get 10% off your first order when you sign up for our newsletter.",
  imageUrl: "https://placehold.co/600x400/png"
};

export async function GET() {
  try {
    // Check if database is accessible
    try {
      const popup = await prisma.shopPopup.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (popup) {
        return NextResponse.json({
          success: true,
          data: popup
        });
      }
    } catch (dbError) {
      console.error('API: Database error:', dbError);
      // Continue to fallback instead of returning error
    }

    // Return fallback popup if no database popup found or if database error
    
    // Test image URL before sending
    try {
      await fetch(FALLBACK_POPUP.imageUrl, { method: 'HEAD' });
    } catch (imgError) {
      console.error('API: Image URL test failed:', imgError);
    }
    
    const response = NextResponse.json({
      success: true,
      data: FALLBACK_POPUP
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;

  } catch (error) {
    console.error('Error in shop-popup API:', error);
    // Even in case of error, return the fallback popup
    return NextResponse.json({
      success: true,
      data: FALLBACK_POPUP
    });
  }
}