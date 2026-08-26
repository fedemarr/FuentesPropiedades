// Configuración central de Prisma (v7). Reemplaza los campos que antes
// vivían en el bloque `datasource` de schema.prisma.
//
// Esta config la usa SOLO el CLI de Prisma (migrate, studio, db pull...),
// nunca la aplicación en runtime — por eso apunta a DIRECT_URL (conexión
// directa, sin pooler): las migraciones necesitan sentencias preparadas que
// el modo de pooling por transacción de Neon (pgbouncer) no soporta bien.
// La app en runtime usa su propio adapter en src/lib/prisma.ts, apuntado a
// DATABASE_URL (que en Neon sí puede ser la conexión "pooled").
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
