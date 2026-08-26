-- CreateEnum
CREATE TYPE "Operacion" AS ENUM ('VENTA', 'ALQUILER');

-- CreateEnum
CREATE TYPE "TipoPropiedad" AS ENUM ('CASA', 'DEPARTAMENTO', 'PH', 'LOTE', 'LOCAL', 'OFICINA', 'QUINTA', 'GALPON', 'COCHERA', 'CAMPO');

-- CreateEnum
CREATE TYPE "EstadoPropiedad" AS ENUM ('DISPONIBLE', 'RESERVADA', 'VENDIDA', 'ALQUILADA');

-- CreateEnum
CREATE TYPE "EstadoPub" AS ENUM ('BORRADOR', 'PUBLICADA', 'ARCHIVADA');

-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('USD', 'ARS');

-- CreateEnum
CREATE TYPE "Antiguedad" AS ENUM ('A_ESTRENAR', 'EN_POZO', 'HASTA_5', 'ENTRE_5_10', 'ENTRE_10_20', 'MAS_20');

-- CreateEnum
CREATE TYPE "Condicion" AS ENUM ('EXCELENTE', 'MUY_BUENO', 'BUENO', 'A_REFACCIONAR');

-- CreateEnum
CREATE TYPE "Situacion" AS ENUM ('VACIA', 'OCUPADA', 'ALQUILADA');

-- CreateEnum
CREATE TYPE "Orientacion" AS ENUM ('NORTE', 'SUR', 'ESTE', 'OESTE', 'NORESTE', 'NOROESTE', 'SUDESTE', 'SUDOESTE');

-- CreateEnum
CREATE TYPE "EstadoConsulta" AS ENUM ('NUEVA', 'CONTACTADA', 'CERRADA');

-- CreateEnum
CREATE TYPE "TipoConsulta" AS ENUM ('PROPIEDAD', 'GENERAL', 'TASACION', 'ADMINISTRACION');

-- CreateEnum
CREATE TYPE "OrigenConsulta" AS ENUM ('HOME', 'FICHA_PROPIEDAD', 'LISTADO', 'CONTACTO', 'TASACIONES', 'ADMINISTRACIONES', 'FAVORITOS', 'COMPARADOR');

-- CreateTable
CREATE TABLE "Propiedad" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "operacion" "Operacion" NOT NULL,
    "tipo" "TipoPropiedad" NOT NULL,
    "estado" "EstadoPropiedad" NOT NULL DEFAULT 'DISPONIBLE',
    "publicacion" "EstadoPub" NOT NULL DEFAULT 'BORRADOR',
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "moneda" "Moneda" NOT NULL DEFAULT 'USD',
    "precio" DECIMAL(14,2),
    "consultarPrecio" BOOLEAN NOT NULL DEFAULT false,
    "expensas" DECIMAL(14,2),
    "aptoCredito" BOOLEAN NOT NULL DEFAULT false,
    "direccionExacta" TEXT,
    "calle" TEXT,
    "barrio" TEXT,
    "localidad" TEXT NOT NULL,
    "partido" TEXT,
    "provincia" TEXT NOT NULL DEFAULT 'Buenos Aires',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "radioMapa" INTEGER NOT NULL DEFAULT 300,
    "ambientes" INTEGER,
    "dormitorios" INTEGER,
    "banos" INTEGER,
    "toilettes" INTEGER,
    "plantas" INTEGER,
    "cocheras" INTEGER,
    "antiguedad" "Antiguedad",
    "condicion" "Condicion",
    "situacion" "Situacion",
    "orientacion" "Orientacion",
    "supCubierta" DECIMAL(10,2),
    "supSemicubierta" DECIMAL(10,2),
    "supDescubierta" DECIMAL(10,2),
    "supTerreno" DECIMAL(10,2),
    "medidaFrente" DECIMAL(10,2),
    "medidaFondo" DECIMAL(10,2),
    "servicios" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ambientesList" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "adicionales" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "planoUrl" TEXT,
    "videoUrl" TEXT,
    "tour360Url" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "esDeSeed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Propiedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "alt" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "esPortada" BOOLEAN NOT NULL DEFAULT false,
    "width" INTEGER,
    "height" INTEGER,
    "blurDataUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "tipo" "TipoConsulta" NOT NULL,
    "estado" "EstadoConsulta" NOT NULL DEFAULT 'NUEVA',
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "mensaje" TEXT,
    "propiedadId" TEXT,
    "direccionInmueble" TEXT,
    "tipoInmueble" TEXT,
    "ambientesInmueble" TEXT,
    "antiguedadInmueble" TEXT,
    "supCubiertaInm" TEXT,
    "supTotalInm" TEXT,
    "cantUnidades" TEXT,
    "fotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notaInterna" TEXT,
    "origen" "OrigenConsulta" NOT NULL,
    "esDeSeed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VistaPropiedad" (
    "id" TEXT NOT NULL,
    "propiedadId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VistaPropiedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "telefono" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "horarios" TEXT NOT NULL,
    "matricula" TEXT NOT NULL DEFAULT 'C.S.M. 0000',
    "instagram" TEXT,
    "facebook" TEXT,
    "heroTitulo" TEXT NOT NULL,
    "heroSubtitulo" TEXT,
    "textoNosotros" TEXT NOT NULL,
    "textoAdmin" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "esDeSeed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_codigo_key" ON "Propiedad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_slug_key" ON "Propiedad"("slug");

-- CreateIndex
CREATE INDEX "Propiedad_operacion_tipo_publicacion_idx" ON "Propiedad"("operacion", "tipo", "publicacion");

-- CreateIndex
CREATE INDEX "Propiedad_localidad_barrio_idx" ON "Propiedad"("localidad", "barrio");

-- CreateIndex
CREATE INDEX "Propiedad_precio_moneda_idx" ON "Propiedad"("precio", "moneda");

-- CreateIndex
CREATE INDEX "Propiedad_destacada_publicacion_idx" ON "Propiedad"("destacada", "publicacion");

-- CreateIndex
CREATE INDEX "Propiedad_slug_idx" ON "Propiedad"("slug");

-- CreateIndex
CREATE INDEX "Imagen_propiedadId_orden_idx" ON "Imagen"("propiedadId", "orden");

-- CreateIndex
CREATE INDEX "Consulta_estado_createdAt_idx" ON "Consulta"("estado", "createdAt");

-- CreateIndex
CREATE INDEX "Consulta_tipo_estado_idx" ON "Consulta"("tipo", "estado");

-- CreateIndex
CREATE INDEX "Consulta_propiedadId_idx" ON "Consulta"("propiedadId");

-- CreateIndex
CREATE INDEX "VistaPropiedad_propiedadId_fecha_idx" ON "VistaPropiedad"("propiedadId", "fecha");

-- CreateIndex
CREATE INDEX "VistaPropiedad_fecha_idx" ON "VistaPropiedad"("fecha");

-- CreateIndex
CREATE INDEX "Faq_orden_idx" ON "Faq"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VistaPropiedad" ADD CONSTRAINT "VistaPropiedad_propiedadId_fkey" FOREIGN KEY ("propiedadId") REFERENCES "Propiedad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
