import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const results: Record<string, { status: string; message: string; details?: any }> = {};

    // Test 1: Check if Prisma can be imported
    try {
      const prisma = (await import('@/lib/prisma')).default;
      results.prisma = {
        status: 'success',
        message: 'Prisma client imported successfully'
      };
    } catch (error) {
      results.prisma = {
        status: 'error',
        message: 'Failed to import Prisma client',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 2: Check database connection
    try {
      const prisma = (await import('@/lib/prisma')).default;
      await prisma.$queryRaw`SELECT 1`;
      results.database = {
        status: 'success',
        message: 'Database connection successful'
      };
    } catch (error) {
      results.database = {
        status: 'error',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 3: Check if categories can be fetched
    try {
      const prisma = (await import('@/lib/prisma')).default;
      const categoryCount = await prisma.category.count();
      results.categories = {
        status: 'success',
        message: `Categories accessible (${categoryCount} found)`
      };
    } catch (error) {
      results.categories = {
        status: 'error',
        message: 'Failed to access categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 4: Check if products table is accessible
    try {
      const prisma = (await import('@/lib/prisma')).default;
      const productCount = await prisma.product.count();
      results.products = {
        status: 'success',
        message: `Products table accessible (${productCount} found)`
      };
    } catch (error) {
      results.products = {
        status: 'error',
        message: 'Failed to access products table',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 5: Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missing: string[] = [];
    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    });

    if (missing.length === 0) {
      results.environment = {
        status: 'success',
        message: 'All required environment variables are set'
      };
    } else {
      results.environment = {
        status: 'warning',
        message: `Missing environment variables: ${missing.join(', ')}`
      };
    }

    // Determine overall status
    const hasErrors = Object.values(results).some(result => result.status === 'error');
    const hasWarnings = Object.values(results).some(result => result.status === 'warning');

    let overallStatus = 'success';
    let overallMessage = 'All system components are working properly';

    if (hasErrors) {
      overallStatus = 'error';
      overallMessage = 'Some system components have critical issues';
    } else if (hasWarnings) {
      overallStatus = 'warning';
      overallMessage = 'Some system components have warnings';
    }

    return NextResponse.json({
      success: true,
      status: overallStatus,
      message: overallMessage,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('System health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'System health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
