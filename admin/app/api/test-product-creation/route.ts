import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const results = {
      database: { status: "pending", message: "" },
      cloudinary: { status: "pending", message: "" },
      environment: { status: "pending", message: "" },
      validation: { status: "pending", message: "" }
    };

    // Test database connection
    try {
      await prisma.$connect();
      const categoryCount = await prisma.category.count();
      results.database = { 
        status: "success", 
        message: `Connected successfully. Found ${categoryCount} categories.` 
      };
    } catch (error) {
      results.database = { 
        status: "error", 
        message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }

    // Test Cloudinary connection
    try {
      const testResult = await cloudinary.api.ping();
      results.cloudinary = { 
        status: "success", 
        message: `Cloudinary connected successfully. Response: ${JSON.stringify(testResult)}` 
      };
    } catch (error) {
      results.cloudinary = { 
        status: "error", 
        message: `Cloudinary connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }

    // Check environment variables
    const requiredEnvVars = {
      DATABASE_URL: process.env.DATABASE_URL,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingVars.length === 0) {
      results.environment = { 
        status: "success", 
        message: "All required environment variables are set." 
      };
    } else {
      results.environment = { 
        status: "error", 
        message: `Missing environment variables: ${missingVars.join(', ')}` 
      };
    }

    // Test basic validation
    try {
      const testData = {
        title: "Test Product",
        description: "Test Description",
        longDescription: "Test Long Description",
        brand: "Test Brand",
        slug: "test-product",
        benefits: ["Test Benefit"],
        ingredients: ["Test Ingredient"],
        sku: "TEST-SKU-001",
        images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="],
        sizes: [{ size: "M", qty: 10, price: 100, sold: 0 }],
        discount: 0,
        featured: false,
        categoryId: "507f1f77bcf86cd799439011", // Test ObjectId
        subCategoryIds: []
      };

      // Validate required fields
      if (!testData.title || !testData.description || !testData.sku || !testData.categoryId) {
        results.validation = { 
          status: "error", 
          message: "Basic validation failed: missing required fields" 
        };
      } else if (testData.images.length === 0) {
        results.validation = { 
          status: "error", 
          message: "Basic validation failed: no images provided" 
        };
      } else if (testData.sizes.length === 0) {
        results.validation = { 
          status: "error", 
          message: "Basic validation failed: no sizes provided" 
        };
      } else {
        results.validation = { 
          status: "success", 
          message: "Basic validation passed." 
        };
      }
    } catch (error) {
      results.validation = { 
        status: "error", 
        message: `Validation test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }

    // Always disconnect from database
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error disconnecting from database:", error);
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
