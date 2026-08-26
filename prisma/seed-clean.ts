// `npm run seed:clean` — borra SOLO los datos de prueba (propiedades,
// consultas/tasaciones y FAQs marcados con `esDeSeed: true`). Deja intactos
// la Configuracion y el Usuario admin, que son datos reales del sitio en
// producción aunque se hayan creado originalmente por el seed.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const consultas = await prisma.consulta.deleteMany({
    where: { esDeSeed: true },
  });
  const propiedades = await prisma.propiedad.deleteMany({
    where: { esDeSeed: true },
  });
  const faqs = await prisma.faq.deleteMany({ where: { esDeSeed: true } });

  console.warn("✅ Datos de prueba eliminados:");
  console.warn(`  Propiedades: ${propiedades.count}`);
  console.warn(`  Consultas y tasaciones: ${consultas.count}`);
  console.warn(`  FAQs: ${faqs.count}`);
  console.warn(
    "\nLa configuración del sitio y el usuario admin no se tocaron.\n",
  );
}

main()
  .catch((error: unknown) => {
    console.error("Error al limpiar los datos de prueba:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
