"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug Cloudinary configuration
console.log(`[FRONTEND DEBUG] Cloudinary config loaded:`, {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

// Test function to check Cloudinary connectivity
export async function testCloudinaryConnection() {
  try {
    console.log(`[TEST] Testing Cloudinary connection...`);
    const { resources } = await cloudinary.search
      .expression(`folder:e-commerce/website-banners`)
      .max_results(1)
      .execute();
    
    console.log(`[TEST] Connection successful! Found ${resources.length} banners`);
    return { success: true, count: resources.length };
  } catch (error) {
    console.error(`[TEST] Connection failed:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getCloudinaryImages(folder: string) {
  try {
    console.log(`[DEBUG] Cloudinary config:`, {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      folder: `e-commerce/${folder}`
    });
    
    const { resources } = await cloudinary.search
      .expression(`folder:e-commerce/${folder}`)
      .execute();

    console.log(`[DEBUG] Found ${resources.length} images in folder: e-commerce/${folder}`);
    
    return resources.map((resource: any) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
    }));
  } catch (error) {
    console.error("Error fetching from Cloudinary:", error);
    throw error;
  }
}
// Website Banners
export async function getWebsiteBanners() {
  try {
    // Force fresh data by adding timestamp to prevent caching
    const timestamp = Date.now();
    console.log(`[DEBUG] Fetching website banners at ${timestamp}`);
    
    const images = await getCloudinaryImages("website-banners");
    console.log(`[DEBUG] Retrieved ${images.length} website banners`);
    
    return { success: true, data: images };
  } catch (error) {
    console.error("Error fetching website banners:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code || 'Unknown',
      statusCode: (error as any)?.http_code || 'Unknown'
    });
    
    // Return empty array instead of failing completely
    return { success: false, error: "Failed to fetch website banners", data: [] };
  }
}
// App Banners
export async function getAppBanners() {
  try {
    const images = await getCloudinaryImages("app-banners");
    return { success: true, data: images };
  } catch (error) {
    console.error("Error fetching app banners:", error);
    return { success: false, error: "Failed to fetch app banners" };
  }
}
