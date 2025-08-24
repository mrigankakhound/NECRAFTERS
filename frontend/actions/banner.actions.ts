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
    console.log(`[FRONTEND TEST] 🧪 Testing Cloudinary connection...`);
    const { resources } = await cloudinary.search
      .expression(`folder:e-commerce/website-banners`)
      .max_results(1)
      .execute();
    
    console.log(`[FRONTEND TEST] Connection successful! Found ${resources.length} banners`);
    return { success: true, count: resources.length };
  } catch (error) {
    console.error(`[FRONTEND TEST] Connection failed:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Comprehensive frontend banner test
export async function comprehensiveFrontendBannerTest() {
  console.log(`[FRONTEND TEST] 🔍 COMPREHENSIVE FRONTEND BANNER TEST STARTING...`);
  console.log(`[FRONTEND TEST] ⏰ Test started at: ${new Date().toISOString()}`);
  
  const results = {
    environmentVariables: { status: '❓', details: {} },
    cloudinaryConfig: { status: '❓', details: {} },
    bannerFetching: { status: '❓', details: {} },
    cacheBehavior: { status: '❓', details: {} }
  };

  try {
    // 1. Check Environment Variables
    console.log(`\n[FRONTEND TEST] 📋 STEP 1: Checking Environment Variables...`);
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    };
    
    console.log(`[FRONTEND TEST] Environment Variables:`, envVars);
    
    if (envVars.CLOUDINARY_CLOUD_NAME && envVars.CLOUDINARY_API_KEY === 'SET' && envVars.CLOUDINARY_API_SECRET === 'SET') {
      results.environmentVariables = { status: '✅', details: envVars };
      console.log(`[FRONTEND TEST] ✅ Environment Variables: ALL SET`);
    } else {
      results.environmentVariables = { status: '❌', details: envVars };
      console.log(`[FRONTEND TEST] ❌ Environment Variables: MISSING`);
    }

    // 2. Check Cloudinary Configuration
    console.log(`\n[FRONTEND TEST] ⚙️ STEP 2: Checking Cloudinary Configuration...`);
    const configCheck = {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? 'SET' : 'NOT SET',
      api_secret: cloudinary.config().api_secret ? 'SET' : 'NOT SET'
    };
    
    console.log(`[FRONTEND TEST] Cloudinary Config:`, configCheck);
    
    if (configCheck.cloud_name && configCheck.api_key && configCheck.api_secret) {
      results.cloudinaryConfig = { status: '✅', details: configCheck };
      console.log(`[FRONTEND TEST] ✅ Cloudinary Config: PROPERLY SET`);
    } else {
      results.cloudinaryConfig = { status: '❌', details: configCheck };
      console.log(`[FRONTEND TEST] ❌ Cloudinary Config: INCOMPLETE`);
    }

    // 3. Test Banner Fetching
    console.log(`\n[FRONTEND TEST] 🖼️ STEP 3: Testing Banner Fetching...`);
    try {
      const banners = await getWebsiteBanners();
      console.log(`[FRONTEND TEST] Banner fetch result:`, banners);
      
      if (banners.success && Array.isArray(banners.data)) {
        results.bannerFetching = { 
          status: '✅', 
          details: { 
            count: banners.data.length, 
            success: banners.success,
            data: banners.data 
          } 
        };
        console.log(`[FRONTEND TEST] ✅ Banner Fetching: SUCCESSFUL (${banners.data.length} banners)`);
      } else {
        results.bannerFetching = { 
          status: '❌', 
          details: { 
            success: banners.success, 
            error: banners.error || 'Unknown error' 
          } 
        };
        console.log(`[FRONTEND TEST] ❌ Banner Fetching: FAILED`);
      }
    } catch (error) {
      results.bannerFetching = { 
        status: '❌', 
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      };
      console.log(`[FRONTEND TEST] ❌ Banner Fetching Test Failed:`, error);
    }

    // 4. Test Cache Behavior
    console.log(`\n[FRONTEND TEST] 🔄 STEP 4: Testing Cache Behavior...`);
    try {
      const timestamp1 = Date.now();
      const banners1 = await getWebsiteBanners();
      const time1 = Date.now() - timestamp1;
      
      const timestamp2 = Date.now();
      const banners2 = await getWebsiteBanners();
      const time2 = Date.now() - timestamp2;
      
      console.log(`[FRONTEND TEST] First fetch: ${time1}ms, Second fetch: ${time2}ms`);
      
      if (banners1.success && banners2.success) {
        results.cacheBehavior = { 
          status: '✅', 
          details: { 
            firstFetch: time1, 
            secondFetch: time2,
            cacheWorking: time2 < time1 || time2 < 100 // Second fetch should be faster or very fast
          } 
        };
        console.log(`[FRONTEND TEST] ✅ Cache Behavior: NORMAL`);
      } else {
        results.cacheBehavior = { 
          status: '❌', 
          details: { 
            firstFetch: time1, 
            secondFetch: time2,
            error: 'One or both fetches failed' 
          } 
        };
        console.log(`[FRONTEND TEST] ❌ Cache Behavior: FETCH FAILED`);
      }
    } catch (error) {
      results.cacheBehavior = { 
        status: '❌', 
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      };
      console.log(`[FRONTEND TEST] ❌ Cache Behavior Test Failed:`, error);
    }

    // 5. Final Summary
    console.log(`\n[FRONTEND TEST] 📊 COMPREHENSIVE FRONTEND TEST SUMMARY:`);
    console.log(`[FRONTEND TEST] ==========================================`);
    Object.entries(results).forEach(([key, value]) => {
      console.log(`[FRONTEND TEST] ${key}: ${value.status}`);
    });
    console.log(`[FRONTEND TEST] ==========================================`);
    
    // 6. Overall Status
    const allPassed = Object.values(results).every(result => result.status === '✅');
    const overallStatus = allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED';
    console.log(`[FRONTEND TEST] 🎯 OVERALL STATUS: ${overallStatus}`);
    
    return {
      success: allPassed,
      results,
      overallStatus,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`[FRONTEND TEST] ❌ Comprehensive frontend test failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
      timestamp: new Date().toISOString()
    };
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
