import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requiere un driver adapter explícito — ya no genera un engine
// binario propio. `pg` funciona igual contra Postgres local (desarrollo)
// y contra Neon (producción), sin necesitar el protocolo serverless de
// Neon, que solo hace falta en runtimes edge.
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function crearPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.prismaGlobal ?? crearPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
