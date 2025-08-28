import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      VERCEL_URL: !!process.env.VERCEL_URL,
    };

    // In development, VERCEL_URL is not required
    const requiredVars = process.env.NODE_ENV === 'development' 
      ? ['DATABASE_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'NEXTAUTH_URL']
      : ['DATABASE_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'NEXTAUTH_URL', 'VERCEL_URL'];

    const missingVars = requiredVars.filter(key => !envVars[key as keyof typeof envVars]);

    return NextResponse.json({
      success: true,
      environment: envVars,
      missing: missingVars,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
