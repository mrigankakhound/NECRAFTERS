"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  uploadImage,
  deleteImage,
  getCloudinaryImages,
  comprehensiveCloudinaryTest,
} from "@/lib/cloudinary";

// Test Cloudinary setup
export async function testCloudinarySetup() {
  try {
    console.log(`[ADMIN DEBUG] 🧪 Testing Cloudinary setup from banner actions...`);
    const result = await comprehensiveCloudinaryTest();
    return result;
  } catch (error) {
    console.error(`[ADMIN DEBUG] ❌ Test failed:`, error);
    return { success: false, error: "Test failed" };
  }
}

// Client-side test function (can be called from browser console)
export async function clientTestCloudinary() {
  try {
    console.log(`[CLIENT TEST] 🧪 Starting client-side Cloudinary test...`);
    
    // Test environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    };
    
    console.log(`[CLIENT TEST] 📋 Environment check:`, envCheck);
    
    // Test basic banner fetching
    const banners = await getWebsiteBanners();
    console.log(`[CLIENT TEST] 🖼️ Banner fetch test:`, banners);
    
    return {
      success: true,
      envCheck,
      bannerTest: banners,
      message: 'Client test completed - check console for details'
    };
  } catch (error) {
    console.error(`[CLIENT TEST] ❌ Client test failed:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
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

export async function uploadAppBanner(base64Image: string) {
  try {
    const result = await uploadImage(base64Image, "app-banners");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error uploading app banner:", error);
    return { success: false, error: "Failed to upload app banner" };
  }
}

// Website Banners
export async function getWebsiteBanners() {
  try {
    const images = await getCloudinaryImages("website-banners");
    return { success: true, data: images };
  } catch (error) {
    console.error("Error fetching website banners:", error);
    return { success: false, error: "Failed to fetch website banners" };
  }
}

export async function uploadWebsiteBanner(base64Image: string) {
  try {
    const result = await uploadImage(base64Image, "website-banners");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error uploading website banner:", error);
    return { success: false, error: "Failed to upload website banner" };
  }
}

// Home Screen Offers
export async function getHomeScreenOffers() {
  try {
    const offers = await prisma.homeScreenOffer.findMany({
      select: {
        id: true,
        title: true,
        link: true,
        type: true,
        images: true,
      },
    });
    return {
      success: true,
      data: offers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        link: offer.link,
        type: offer.type,
        images: offer.images.map((img) => ({
          url: img.url || "",
          public_id: img.public_id || "",
        })),
      })),
    };
  } catch (error) {
    console.error("Error fetching home screen offers:", error);
    return { success: false, error: "Failed to fetch offers" };
  }
}

export async function createHomeScreenOffer(
  base64Image: string,
  title: string,
  link: string,
  type: "specialCombo" | "crazyDeal"
) {
  try {
    const uploadedImage = await uploadImage(base64Image, "offers");

    const offer = await prisma.homeScreenOffer.create({
      data: {
        title,
        link,
        type,
        images: [uploadedImage],
      },
      select: {
        id: true,
        title: true,
        link: true,
        type: true,
        images: true,
      },
    });

    const formattedOffer = {
      id: offer.id,
      title: offer.title,
      link: offer.link,
      type: offer.type,
      images: offer.images.map((img) => ({
        url: img.url || "",
        public_id: img.public_id || "",
      })),
    };

    revalidatePath("/offers");
    return { success: true, data: formattedOffer };
  } catch (error) {
    console.error("Error creating home screen offer:", error);
    return { success: false, error: "Failed to create offer" };
  }
}

export async function deleteHomeScreenOffer(id: string, public_id: string) {
  try {
    await deleteImage(public_id);

    await prisma.homeScreenOffer.delete({
      where: { id },
    });

    revalidatePath("/offers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting home screen offer:", error);
    return { success: false, error: "Failed to delete offer" };
  }
}

// Generic Banner Delete
export async function deleteBanner(public_id: string) {
  try {
    console.log(`[ADMIN DEBUG] 🚀 deleteBanner called with public_id:`, public_id);
    console.log(`[ADMIN DEBUG] 📍 Function execution started at:`, new Date().toISOString());
    
    const deleteResult = await deleteImage(public_id);
    console.log(`[ADMIN DEBUG] 🗑️ deleteImage result:`, deleteResult);
    
    // Force cache invalidation for frontend
    console.log(`[ADMIN DEBUG] 🔄 Invalidating frontend cache...`);
    
    // Add a small delay to ensure deletion is processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[ADMIN DEBUG] ⏱️ Waited 1 second after deletion`);
    
    // Test if the image still exists
    console.log(`[ADMIN DEBUG] 🔍 Testing if image still exists...`);
    try {
      const testResult = await fetch(`https://res.cloudinary.com/dtxh3ew7s/image/upload/${public_id}`);
      if (testResult.status === 404) {
        console.log(`[ADMIN DEBUG] ✅ Image successfully deleted (404 response)`);
      } else {
        console.log(`[ADMIN DEBUG] ⚠️ Image might still exist (Status: ${testResult.status})`);
      }
    } catch (testError) {
      console.log(`[ADMIN DEBUG] ✅ Image deletion test completed (Error expected if deleted)`);
    }
    
    console.log(`[ADMIN DEBUG] 🎯 deleteBanner function completed successfully`);
    return { success: true };
  } catch (error) {
    console.error(`[ADMIN DEBUG] ❌ Error in deleteBanner:`, error);
    console.error(`[ADMIN DEBUG] Error details:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    return { success: false, error: "Failed to delete banner" };
  }
}
