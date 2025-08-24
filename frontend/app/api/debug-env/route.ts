// Temporary debug API route to test environment variables in Vercel
export async function GET() {
  const envVars = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***SET***' : '***MISSING***'
  };
  
  console.log('Environment Variables in Vercel:', envVars);
  
  return Response.json({
    message: 'Environment Variables Check',
    envVars,
    timestamp: new Date().toISOString()
  });
}
