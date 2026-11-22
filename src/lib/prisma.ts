import { PrismaClient } from '@prisma/client';

// Singleton Prisma : évite de multiplier les connexions en développement
// (le hot-reload de Next.js ré-exécute les modules).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
