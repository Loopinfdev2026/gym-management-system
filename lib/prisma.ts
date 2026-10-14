// lib/prisma.ts
import "dotenv/config"; // ← CRÍTICO: sin esto, DATABASE_URL es undefined
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Validación temprana para evitar errores crípticos como "client password must be a string"
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL no está definida. Verifica que tu archivo .env exista en la raíz del proyecto.",
  );
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL, // ← Pooler (6543)
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;