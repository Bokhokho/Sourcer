import { PrismaClient } from '@prisma/client';

// In development, it's important to avoid creating multiple
// instances of PrismaClient because Next.js will hot‑reload
// modules.  Attach the client to the global object so that
// it can be reused across reloads.  See:
// https://www.prisma.io/docs/guides/database/troubleshooting-orm/active-record-in-prisma

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}