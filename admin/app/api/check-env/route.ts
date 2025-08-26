import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requiredEnvVars = {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing",
      VERCEL_URL: process.env.VERCEL_URL ? "✅ Set" : "❌ Missing",
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, status]) => status === "❌ Missing")
      .map(([key, _]) => key);

    return NextResponse.json({
      success: true,
      environment: requiredEnvVars,
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
