import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Testing Cloudinary connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***SET***' : '***MISSING***');

    // Test connection
    const pingResult = await cloudinary.api.ping();
    console.log('Cloudinary ping result:', pingResult);

    // Test banner fetching
    const { resources } = await cloudinary.search
      .expression('folder:e-commerce/website-banners')
      .execute();

    console.log('Banners found:', resources.length);

    return Response.json({
      success: true,
      message: 'Banner test successful',
      cloudinaryPing: pingResult,
      bannersFound: resources.length,
      bannerDetails: resources.map((r: any) => ({
        public_id: r.public_id,
        url: r.secure_url
      })),
      envVars: {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***SET***' : '***MISSING***'
      }
    });

  } catch (error) {
    console.error('Banner test failed:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      envVars: {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***SET***' : '***MISSING***'
      }
    }, { status: 500 });
  }
}
