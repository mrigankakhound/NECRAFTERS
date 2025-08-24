"use server";

import { v2 as cloudinary } from "cloudinary";

// Debug environment variables at startup
console.log(`[ADMIN DEBUG] 🌍 Environment check at startup:`, {
  NODE_ENV: process.env.NODE_ENV,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET (' + process.env.CLOUDINARY_API_KEY.substring(0, 8) + '...)' : 'NOT SET',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET (' + process.env.CLOUDINARY_API_SECRET.substring(0, 8) + '...)' : 'NOT SET',
  timestamp: new Date().toISOString()
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration after setup
console.log(`[ADMIN DEBUG] ⚙️ Cloudinary config after setup:`, {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? 'SET' : 'NOT SET',
  api_secret: cloudinary.config().api_secret ? 'SET' : 'NOT SET'
});

// Comprehensive test function to check everything at once
export async function comprehensiveCloudinaryTest() {
  console.log(`[ADMIN DEBUG] 🔍 COMPREHENSIVE CLOUDINARY TEST STARTING...`);
  console.log(`[ADMIN DEBUG] ⏰ Test started at: ${new Date().toISOString()}`);
  
  const results = {
    environmentVariables: { status: '❓', details: {} },
    cloudinaryConfig: { status: '❓', details: {} },
    connectivity: { status: '❓', details: {} },
    deletionCapability: { status: '❓', details: {} }
  };

  try {
    // 1. Check Environment Variables
    console.log(`\n[ADMIN DEBUG] 📋 STEP 1: Checking Environment Variables...`);
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    };
    
    console.log(`[ADMIN DEBUG] Environment Variables:`, envVars);
    
    if (envVars.CLOUDINARY_CLOUD_NAME && envVars.CLOUDINARY_API_KEY === 'SET' && envVars.CLOUDINARY_API_SECRET === 'SET') {
      results.environmentVariables = { status: '✅', details: envVars };
      console.log(`[ADMIN DEBUG] ✅ Environment Variables: ALL SET`);
    } else {
      results.environmentVariables = { status: '❌', details: envVars };
      console.log(`[ADMIN DEBUG] ❌ Environment Variables: MISSING`);
    }

    // 2. Check Cloudinary Configuration
    console.log(`\n[ADMIN DEBUG] ⚙️ STEP 2: Checking Cloudinary Configuration...`);
    const config = cloudinary.config();
    const configCheck = {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? 'SET' : 'NOT SET',
      api_secret: config.api_secret ? 'SET' : 'NOT SET'
    };
    
    console.log(`[ADMIN DEBUG] Cloudinary Config:`, configCheck);
    
    if (config.cloud_name && config.api_key && config.api_secret) {
      results.cloudinaryConfig = { status: '✅', details: configCheck };
      console.log(`[ADMIN DEBUG] ✅ Cloudinary Config: PROPERLY SET`);
    } else {
      results.cloudinaryConfig = { status: '❌', details: configCheck };
      console.log(`[ADMIN DEBUG] ❌ Cloudinary Config: INCOMPLETE`);
    }

    // 3. Test Connectivity
    console.log(`\n[ADMIN DEBUG] 🌐 STEP 3: Testing Cloudinary Connectivity...`);
    try {
      const pingResult = await cloudinary.api.ping();
      console.log(`[ADMIN DEBUG] Ping Result:`, pingResult);
      
      if (pingResult.status === 'ok') {
        results.connectivity = { status: '✅', details: pingResult };
        console.log(`[ADMIN DEBUG] ✅ Connectivity: SUCCESSFUL`);
      } else {
        results.connectivity = { status: '❌', details: pingResult };
        console.log(`[ADMIN DEBUG] ❌ Connectivity: FAILED`);
      }
    } catch (error) {
      results.connectivity = { status: '❌', details: { error: error instanceof Error ? error.message : 'Unknown error' } };
      console.log(`[ADMIN DEBUG] ❌ Connectivity Test Failed:`, error);
    }

    // 4. Test Deletion Capability
    console.log(`\n[ADMIN DEBUG] 🗑️ STEP 4: Testing Deletion Capability...`);
    try {
      // Try to delete a non-existent image to test permissions
      const testDeleteResult = await cloudinary.uploader.destroy('test-non-existent-image');
      console.log(`[ADMIN DEBUG] Test Delete Result:`, testDeleteResult);
      
      // Even if it fails, if we get a response, permissions are working
      if (testDeleteResult && typeof testDeleteResult === 'object') {
        results.deletionCapability = { status: '✅', details: { message: 'Delete API accessible', result: testDeleteResult } };
        console.log(`[ADMIN DEBUG] ✅ Deletion Capability: API ACCESSIBLE`);
      } else {
        results.deletionCapability = { status: '❌', details: { message: 'Unexpected response format', result: testDeleteResult } };
        console.log(`[ADMIN DEBUG] ❌ Deletion Capability: UNEXPECTED RESPONSE`);
      }
    } catch (error) {
      // Check if it's a permission error vs other error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('not found') || errorMessage.includes('Invalid public_id')) {
        results.deletionCapability = { status: '✅', details: { message: 'Delete API working (expected error for non-existent image)', error: errorMessage } };
        console.log(`[ADMIN DEBUG] ✅ Deletion Capability: WORKING (expected error)`);
      } else {
        results.deletionCapability = { status: '❌', details: { message: 'Delete API failed', error: errorMessage } };
        console.log(`[ADMIN DEBUG] ❌ Deletion Capability: FAILED`);
      }
    }

    // 5. Final Summary
    console.log(`\n[ADMIN DEBUG] 📊 COMPREHENSIVE TEST SUMMARY:`);
    console.log(`[ADMIN DEBUG] ==========================================`);
    Object.entries(results).forEach(([key, value]) => {
      console.log(`[ADMIN DEBUG] ${key}: ${value.status}`);
    });
    console.log(`[ADMIN DEBUG] ==========================================`);
    
    // 6. Overall Status
    const allPassed = Object.values(results).every(result => result.status === '✅');
    const overallStatus = allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED';
    console.log(`[ADMIN DEBUG] 🎯 OVERALL STATUS: ${overallStatus}`);
    
    return {
      success: allPassed,
      results,
      overallStatus,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`[ADMIN DEBUG] ❌ Comprehensive test failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
      timestamp: new Date().toISOString()
    };
  }
}

// Test function to verify Cloudinary setup
export async function testCloudinarySetup() {
  try {
    console.log(`[ADMIN DEBUG] 🧪 Testing Cloudinary setup...`);
    
    // Check environment variables
    const envCheck = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
    };
    
    console.log(`[ADMIN DEBUG] 📋 Environment check:`, envCheck);
    
    // Test basic connectivity
    const testResult = await cloudinary.api.ping();
    console.log(`[ADMIN DEBUG] 🏓 Cloudinary ping result:`, testResult);
    
    return { 
      success: true, 
      envCheck, 
      pingResult: testResult 
    };
  } catch (error) {
    console.error(`[ADMIN DEBUG] ❌ Cloudinary setup test failed:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function uploadImage(base64Image: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `e-commerce/${folder}`,
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(`Error uploading to Cloudinary (${folder}):`, error);
    throw error;
  }
}

export async function uploadAppBanner(file: string) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "e-commerce/app-banners",
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function uploadWebsiteBanner(file: string) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "e-commerce/website-banners",
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function uploadHomeScreenOffer(file: string) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "e-commerce/offers",
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function deleteImage(public_id: string) {
  try {
    console.log(`[ADMIN DEBUG] 🎯 deleteImage called with:`, {
      public_id,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      timestamp: new Date().toISOString()
    });
    
    console.log(`[ADMIN DEBUG] 🔄 Calling Cloudinary uploader.destroy...`);
    const result = await cloudinary.uploader.destroy(public_id);
    console.log(`[ADMIN DEBUG] 📊 Cloudinary response:`, result);
    
    // Check if deletion was actually successful
    if (result.result === 'ok') {
      console.log(`[ADMIN DEBUG] ✅ Image deleted successfully from Cloudinary`);
      console.log(`[ADMIN DEBUG] 📝 Response details:`, {
        result: result.result,
        http_code: result.http_code,
        deleted_at: new Date().toISOString()
      });
    } else {
      console.log(`[ADMIN DEBUG] ❌ Image deletion failed:`, result);
      console.log(`[ADMIN DEBUG] ⚠️ Unexpected result:`, result.result);
    }
    
    return result;
  } catch (error) {
    console.error("[ADMIN DEBUG] ❌ Error deleting from Cloudinary:", error);
    console.error("[ADMIN DEBUG] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code || 'Unknown',
      statusCode: (error as any)?.http_code || 'Unknown',
      name: error instanceof Error ? error.name : 'Unknown error type',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    throw error;
  }
}

export async function getCloudinaryImages(folder: string) {
  try {
    const { resources } = await cloudinary.search
      .expression(`folder:e-commerce/${folder}`)
      .execute();

    return resources.map((resource: any) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
    }));
  } catch (error) {
    console.error("Error fetching from Cloudinary:", error);
    throw error;
  }
}
