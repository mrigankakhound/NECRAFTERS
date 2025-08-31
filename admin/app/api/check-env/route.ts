import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check for required environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missing: string[] = [];
    const present: string[] = [];

    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        present.push(envVar);
      } else {
        missing.push(envVar);
      }
    });

    // Check if database connection is working
    let dbStatus = 'unknown';
    try {
      // Import prisma dynamically to avoid build issues
      const prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
      console.error('Database connection check failed:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Environment check completed',
      results: {
        environment: {
          status: missing.length === 0 ? 'success' : 'warning',
          present: present.length,
          missing: missing.length,
          details: {
            present,
            missing
          }
        },
        database: {
          status: dbStatus === 'connected' ? 'success' : 'error',
          message: dbStatus === 'connected' ? 'Database connection successful' : 'Database connection failed'
        }
      },
      missing: missing.length > 0 ? missing : undefined
    });

  } catch (error) {
    console.error('Environment check failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
