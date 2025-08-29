import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with proper MongoDB configuration
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Only log errors in production, minimal logging in development
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
});



if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };