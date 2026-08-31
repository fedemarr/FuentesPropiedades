// Seed de datos de prueba — FUENTES PROPIEDADES
//
// `npm run seed`       → borra los datos de prueba anteriores (esDeSeed=true)
//                         y vuelve a cargarlos, junto con config/admin/FAQs.
// `npm run seed:clean` → borra SOLO los datos de prueba (ver scripts/seed-clean.ts),
//                         deja intactos la configuración y el usuario admin.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  Antiguedad,
  Condicion,
  EstadoConsulta,
  EstadoPropiedad,
  EstadoPub,
  Moneda,
  Operacion,
  Orientacion,
  OrigenConsulta,
  Situacion,
  TipoConsulta,
  TipoPropiedad,
} from "../src/generated/prisma/enums";
import { generarSlugPropiedad } from "../src/lib/propiedad-codigo";
import { imagenesSeed } from "../src/lib/seed-images";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// PROPIEDADES DE PRUEBA
// ============================================================================

interface PropiedadSeedInput {
  codigo: string;
  titulo: string;
  descripcion: string;
  operacion: Operacion;
  tipo: TipoPropiedad;
  estado: EstadoPropiedad;
  publicacion: EstadoPub;
  destacada: boolean;
  moneda: Moneda;
  precio: number;
  expensas?: number;
  aptoCredito: boolean;
  direccionExacta: string;
  calle: string;
  barrio?: string;
  localidad: string;
  partido: string;
  lat: number;
  lng: number;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  toilettes?: number;
  plantas?: number;
  cocheras?: number;
  antiguedad?: Antiguedad;
  condicion?: Condicion;
  situacion?: Situacion;
  orientacion?: Orientacion;
  supCubierta?: number;
  supSemicubierta?: number;
  supDescubierta?: number;
  supTerreno?: number;
  medidaFrente?: number;
  medidaFondo?: number;
  servicios: string[];
  ambientesList: string[];
  adicionales: string[];
  cantidadFotos: number;
  planoUrl?: string;
  videoUrl?: string;
  vistas: number;
  diasDesdeCreacion: number;
}

const PROPIEDADES: PropiedadSeedInput[] = [
  {
    codigo: "FP-0001",
    titulo: "Casa 4 ambientes con jardín",
    descripcion:
      "Casa de una planta en el corazón de San Miguel, a ocho cuadras de la estación. Living comedor con ventanales al jardín, cocina separada con desayunador y tres dormitorios, el principal en suite. El jardín tiene parrilla techada y espacio para reciclar una pileta. Cochera para un auto con portón corredizo. Ideal primera vivienda o inversión para alquilar: la zona tiene muy buena demanda por la cercanía a colegios y al centro comercial de Belgrano y Perú.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.CASA,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: true,
    moneda: Moneda.USD,
    precio: 145000,
    aptoCredito: true,
    direccionExacta: "Belgrano 1487, San Miguel",
    calle: "Belgrano al 1400",
    barrio: "Centro",
    localidad: "San Miguel",
    partido: "San Miguel",
    lat: -34.5441,
    lng: -58.7096,
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    toilettes: 0,
    plantas: 1,
    cocheras: 1,
    antiguedad: Antiguedad.ENTRE_10_20,
    condicion: Condicion.MUY_BUENO,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.NORTE,
    supCubierta: 130,
    supDescubierta: 40,
    supTerreno: 200,
    medidaFrente: 10,
    medidaFondo: 20,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad", "pavimento", "internet-fibra"],
    ambientesList: ["living-comedor", "cocina-separada", "jardin", "lavadero"],
    adicionales: ["parrilla-techada", "cochera-fija", "apto-mascotas", "luminoso"],
    cantidadFotos: 10,
    planoUrl: "https://picsum.photos/seed/fp-0001-plano/1000/700",
    vistas: 284,
    diasDesdeCreacion: 38,
  },
  {
    codigo: "FP-0002",
    titulo: "Casa 3 ambientes a estrenar",
    descripcion:
      "A estrenar, en una calle tranquila de Bella Vista muy cerca de la Panamericana. Construcción moderna con aberturas de aluminio, pisos de porcelanato y calefacción por losa radiante. Dos dormitorios, baño completo y toilette en planta baja, living comedor integrado a la cocina con isla. Patio con parrilla, terminaciones de primera. Lista para escriturar.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.CASA,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.USD,
    precio: 195000,
    aptoCredito: true,
    direccionExacta: "Av. Balbín 2318, Bella Vista",
    calle: "Av. Balbín al 2300",
    barrio: "Santa Rosa",
    localidad: "Bella Vista",
    partido: "San Miguel",
    lat: -34.5952,
    lng: -58.6781,
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    toilettes: 1,
    plantas: 1,
    cocheras: 1,
    antiguedad: Antiguedad.A_ESTRENAR,
    condicion: Condicion.EXCELENTE,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.ESTE,
    supCubierta: 98,
    supDescubierta: 25,
    supTerreno: 150,
    medidaFrente: 8.66,
    medidaFondo: 17.3,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad", "pavimento", "internet-fibra"],
    ambientesList: ["living-comedor", "cocina", "toilette", "patio"],
    adicionales: ["parrilla", "calefaccion", "a-estrenar", "carpinteria-aluminio", "estilo-moderno"],
    cantidadFotos: 9,
    vistas: 156,
    diasDesdeCreacion: 12,
  },
  {
    codigo: "FP-0003",
    titulo: "Casa 5 ambientes con cochera doble",
    descripcion:
      "Casa familiar de dos plantas a metros del centro de Muñiz. Planta baja con living, comedor diario, cocina amplia y toilette; planta alta con cuatro dormitorios y dos baños, el principal con vestidor. Cochera doble cubierta y fondo con quincho y parrilla. Muy luminosa, todos los ambientes con ventanas grandes. A cinco cuadras de la estación Muñiz.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.CASA,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.USD,
    precio: 178000,
    aptoCredito: false,
    direccionExacta: "Ameghino 856, Muñiz",
    calle: "Ameghino al 800",
    barrio: "Centro",
    localidad: "Muñiz",
    partido: "San Miguel",
    lat: -34.5312,
    lng: -58.6689,
    ambientes: 5,
    dormitorios: 4,
    banos: 2,
    toilettes: 1,
    plantas: 2,
    cocheras: 2,
    antiguedad: Antiguedad.ENTRE_10_20,
    condicion: Condicion.MUY_BUENO,
    situacion: Situacion.OCUPADA,
    orientacion: Orientacion.NOROESTE,
    supCubierta: 175,
    supDescubierta: 35,
    supTerreno: 250,
    medidaFrente: 10,
    medidaFondo: 25,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad", "pavimento"],
    ambientesList: ["living", "comedor-diario", "cocina", "toilette", "vestidor", "lavadero"],
    adicionales: ["parrilla", "cochera-fija", "armarios-empotrados", "luminoso"],
    cantidadFotos: 11,
    vistas: 201,
    diasDesdeCreacion: 25,
  },
  {
    codigo: "FP-0004",
    titulo: "Casa a refaccionar sobre lote propio",
    descripcion:
      "Casa antigua sobre lote de 300 m² en Los Polvorines, a reciclar o para demoler y construir. Estructura sana, buena orientación, dos dormitorios y living comedor amplio. Muy buena relación precio por m² de terreno para quien busca invertir. Zona en crecimiento, a diez cuadras de la Ruta 197.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.CASA,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.BORRADOR,
    destacada: false,
    moneda: Moneda.USD,
    precio: 62000,
    aptoCredito: false,
    direccionExacta: "Ruta 197 km 3.5, Los Polvorines",
    calle: "Zona Ruta 197",
    barrio: "Villa Verde",
    localidad: "Los Polvorines",
    partido: "Malvinas Argentinas",
    lat: -34.4897,
    lng: -58.7264,
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    plantas: 1,
    cocheras: 0,
    antiguedad: Antiguedad.MAS_20,
    condicion: Condicion.A_REFACCIONAR,
    situacion: Situacion.VACIA,
    supCubierta: 75,
    supTerreno: 300,
    medidaFrente: 10,
    medidaFondo: 30,
    servicios: ["agua-corriente", "electricidad", "pavimento"],
    ambientesList: ["living-comedor", "cocina", "patio"],
    adicionales: ["lote-interno"],
    cantidadFotos: 6,
    vistas: 47,
    diasDesdeCreacion: 6,
  },
  {
    codigo: "FP-0005",
    titulo: "Casa 4 ambientes con quincho",
    descripcion:
      "En alquiler, casa de un ambiente al frente sobre calle asfaltada en Tortuguitas, muy cerca del acceso a la Panamericana. Tres dormitorios, dos baños, cocina comedor y un fondo con quincho cerrado ideal para reuniones. Cochera para dos autos. Apta para mascotas. Se solicitan los recibos de sueldo y garantía propietaria habituales.",
    operacion: Operacion.ALQUILER,
    tipo: TipoPropiedad.CASA,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.ARS,
    precio: 620000,
    expensas: 0,
    aptoCredito: false,
    direccionExacta: "Los Aromos 245, Tortuguitas",
    calle: "Los Aromos al 200",
    barrio: "Ayres del Pilar",
    localidad: "Tortuguitas",
    partido: "Malvinas Argentinas",
    lat: -34.4368,
    lng: -58.7342,
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    plantas: 1,
    cocheras: 2,
    antiguedad: Antiguedad.HASTA_5,
    condicion: Condicion.EXCELENTE,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.SUR,
    supCubierta: 120,
    supDescubierta: 60,
    supTerreno: 220,
    servicios: ["agua-corriente", "gas-natural", "electricidad", "pavimento", "internet-fibra"],
    ambientesList: ["cocina", "quincho", "lavadero"],
    adicionales: ["parrilla-techada", "apto-mascotas", "cochera-fija", "seguridad-privada"],
    cantidadFotos: 8,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    vistas: 132,
    diasDesdeCreacion: 9,
  },
  {
    codigo: "FP-0006",
    titulo: "Departamento 2 ambientes a estrenar",
    descripcion:
      "Unidad a estrenar en edificio nuevo a cuatro cuadras de la estación San Miguel. Dormitorio en suite, living comedor con salida a balcón y cocina integrada totalmente equipada con muebles bajo mesada. El edificio cuenta con SUM, terraza con parrilla y cochera opcional. Apto crédito hipotecario. Entrega inmediata.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.DEPARTAMENTO,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: true,
    moneda: Moneda.USD,
    precio: 79000,
    expensas: 45000,
    aptoCredito: true,
    direccionExacta: "Av. Perú 1156, piso 4 depto B, San Miguel",
    calle: "Av. Perú al 1100",
    barrio: "Centro",
    localidad: "San Miguel",
    partido: "San Miguel",
    lat: -34.5401,
    lng: -58.7135,
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    plantas: 1,
    cocheras: 1,
    antiguedad: Antiguedad.A_ESTRENAR,
    condicion: Condicion.EXCELENTE,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.NORESTE,
    supCubierta: 48,
    supSemicubierta: 6,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad", "internet-fibra"],
    ambientesList: ["living-comedor", "cocina", "balcon"],
    adicionales: ["sum", "amenities", "seguridad-24hs", "a-estrenar", "cochera-fija"],
    cantidadFotos: 8,
    planoUrl: "https://picsum.photos/seed/fp-0006-plano/1000/700",
    vistas: 340,
    diasDesdeCreacion: 20,
  },
  {
    codigo: "FP-0007",
    titulo: "Departamento monoambiente",
    descripcion:
      "Monoambiente luminoso a dos cuadras de la estación San Miguel, ideal para estudiantes o como primera vivienda. Cocina americana equipada con anafe y horno, baño completo y placard. Edificio con portero. Muy buena conexión de transporte hacia Capital por tren y colectivo.",
    operacion: Operacion.ALQUILER,
    tipo: TipoPropiedad.DEPARTAMENTO,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.ARS,
    precio: 410000,
    expensas: 55000,
    aptoCredito: false,
    direccionExacta: "San Martín 632, piso 2 depto A, San Miguel",
    calle: "San Martín al 600",
    barrio: "Centro",
    localidad: "San Miguel",
    partido: "San Miguel",
    lat: -34.5433,
    lng: -58.7108,
    ambientes: 1,
    dormitorios: 0,
    banos: 1,
    plantas: 1,
    cocheras: 0,
    antiguedad: Antiguedad.ENTRE_5_10,
    condicion: Condicion.BUENO,
    situacion: Situacion.VACIA,
    supCubierta: 28,
    servicios: ["agua-corriente", "cloacas", "electricidad", "internet-fibra"],
    ambientesList: ["cocina"],
    adicionales: ["porteria", "luminoso"],
    cantidadFotos: 6,
    vistas: 98,
    diasDesdeCreacion: 4,
  },
  {
    codigo: "FP-0008",
    titulo: "Departamento 3 ambientes con balcón",
    descripcion:
      "Departamento de tres ambientes en Bella Vista, a cinco cuadras de la estación. Dos dormitorios, living comedor con balcón terraza y cocina separada. Muy buen estado general, apto para dos personas que trabajan cerca o familia chica. Edificio con ascensor y baja expensa.",
    operacion: Operacion.ALQUILER,
    tipo: TipoPropiedad.DEPARTAMENTO,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.ARS,
    precio: 680000,
    expensas: 60000,
    aptoCredito: false,
    direccionExacta: "Independencia 1245, piso 3 depto C, Bella Vista",
    calle: "Independencia al 1200",
    barrio: "Centro",
    localidad: "Bella Vista",
    partido: "San Miguel",
    lat: -34.5989,
    lng: -58.6702,
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    plantas: 1,
    cocheras: 0,
    antiguedad: Antiguedad.ENTRE_10_20,
    condicion: Condicion.MUY_BUENO,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.NORTE,
    supCubierta: 65,
    supSemicubierta: 8,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad"],
    ambientesList: ["living-comedor", "cocina-separada", "balcon"],
    adicionales: ["luminoso"],
    cantidadFotos: 7,
    vistas: 121,
    diasDesdeCreacion: 15,
  },
  {
    codigo: "FP-0009",
    titulo: "Departamento 2 ambientes con cochera",
    descripcion:
      "Departamento de dos ambientes en planta baja con jardín propio, en un complejo cerrado de Tortuguitas. Dormitorio principal amplio, living comedor con salida directa al jardín y cochera cubierta. Complejo con seguridad las 24 horas y espacios verdes comunes.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.DEPARTAMENTO,
    estado: EstadoPropiedad.RESERVADA,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.USD,
    precio: 96000,
    expensas: 38000,
    aptoCredito: true,
    direccionExacta: "Complejo Los Robles, casa 14, Tortuguitas",
    calle: "Ruta 25 al 4500",
    barrio: "Villa de Mayo Norte",
    localidad: "Tortuguitas",
    partido: "Malvinas Argentinas",
    lat: -34.4321,
    lng: -58.7288,
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    plantas: 1,
    cocheras: 1,
    antiguedad: Antiguedad.HASTA_5,
    condicion: Condicion.EXCELENTE,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.ESTE,
    supCubierta: 55,
    supDescubierta: 20,
    servicios: ["agua-corriente", "electricidad", "gas-natural", "internet-fibra"],
    ambientesList: ["living-comedor", "jardin"],
    adicionales: ["seguridad-24hs", "barrio-privado", "cochera-fija", "zonas-verdes", "apto-mascotas"],
    cantidadFotos: 9,
    vistas: 175,
    diasDesdeCreacion: 30,
  },
  {
    codigo: "FP-0010",
    titulo: "PH 3 ambientes con patio",
    descripcion:
      "PH al fondo, independiente, en Muñiz. Dos dormitorios, baño completo, cocina comedor y patio propio con lavadero cubierto. Muy tranquilo por estar al fondo de un pasillo compartido con un solo vecino. A seis cuadras de la estación y del centro comercial.",
    operacion: Operacion.ALQUILER,
    tipo: TipoPropiedad.PH,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.ARS,
    precio: 560000,
    expensas: 0,
    aptoCredito: false,
    direccionExacta: "Sarmiento 1023, PH fondo, Muñiz",
    calle: "Sarmiento al 1000",
    barrio: "Centro",
    localidad: "Muñiz",
    partido: "San Miguel",
    lat: -34.5368,
    lng: -58.6618,
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    plantas: 1,
    cocheras: 0,
    antiguedad: Antiguedad.ENTRE_10_20,
    condicion: Condicion.BUENO,
    situacion: Situacion.VACIA,
    supCubierta: 68,
    supDescubierta: 18,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad", "pavimento"],
    ambientesList: ["cocina", "patio", "lavadero"],
    adicionales: ["ubicacion-tranquila"],
    cantidadFotos: 7,
    vistas: 88,
    diasDesdeCreacion: 11,
  },
  {
    codigo: "FP-0011",
    titulo: "PH 2 ambientes reciclado",
    descripcion:
      "PH totalmente reciclado a nuevo en San Miguel, a diez cuadras de la estación. Un dormitorio, baño completo con ducha de hidromasaje, cocina integrada al living comedor. Terminaciones modernas, pisos de porcelanato y aberturas nuevas. Ideal para pareja o inversión.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.PH,
    estado: EstadoPropiedad.VENDIDA,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.USD,
    precio: 88000,
    aptoCredito: true,
    direccionExacta: "Moreno 745, PH 2, San Miguel",
    calle: "Moreno al 700",
    barrio: "Centro",
    localidad: "San Miguel",
    partido: "San Miguel",
    lat: -34.5459,
    lng: -58.716,
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    plantas: 1,
    cocheras: 0,
    antiguedad: Antiguedad.MAS_20,
    condicion: Condicion.EXCELENTE,
    situacion: Situacion.VACIA,
    supCubierta: 42,
    servicios: ["agua-corriente", "cloacas", "gas-natural", "electricidad"],
    ambientesList: ["living-comedor", "cocina"],
    adicionales: ["estilo-moderno", "luminoso"],
    cantidadFotos: 6,
    vistas: 210,
    diasDesdeCreacion: 55,
  },
  {
    codigo: "FP-0012",
    titulo: "Lote de 300 m² en barrio residencial",
    descripcion:
      "Lote interno de 10x30 en zona residencial consolidada de Los Polvorines, apto para construir vivienda familiar. Cuenta con todos los servicios sobre la calle de acceso y pavimento. A ocho cuadras de la Ruta 197 y a cinco de un colegio y una posta sanitaria.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.LOTE,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: false,
    moneda: Moneda.USD,
    precio: 45000,
    aptoCredito: false,
    direccionExacta: "Los Ceibos 1180 (lote interno), Los Polvorines",
    calle: "Los Ceibos al 1100",
    barrio: "El Triángulo",
    localidad: "Los Polvorines",
    partido: "Malvinas Argentinas",
    lat: -34.4952,
    lng: -58.7189,
    supTerreno: 300,
    medidaFrente: 10,
    medidaFondo: 30,
    servicios: ["agua-corriente", "electricidad", "pavimento"],
    ambientesList: [],
    adicionales: ["lote-interno", "acceso-pavimentado", "ubicacion-tranquila"],
    cantidadFotos: 5,
    planoUrl: "https://picsum.photos/seed/fp-0012-plano/1000/700",
    vistas: 63,
    diasDesdeCreacion: 18,
  },
  {
    codigo: "FP-0013",
    titulo: "Local comercial sobre avenida",
    descripcion:
      "Local a la calle sobre una de las avenidas de mayor tránsito de San Miguel, con vidriera amplia y muy buena visibilidad. Un ambiente principal diáfano, baño y depósito al fondo. Apto cualquier rubro comercial o de servicios. Se entrega libre de gravámenes.",
    operacion: Operacion.ALQUILER,
    tipo: TipoPropiedad.LOCAL,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.BORRADOR,
    destacada: false,
    moneda: Moneda.ARS,
    precio: 900000,
    expensas: 0,
    aptoCredito: false,
    direccionExacta: "Av. Presidente Perón 2045, San Miguel",
    calle: "Av. Presidente Perón al 2000",
    barrio: "Centro",
    localidad: "San Miguel",
    partido: "San Miguel",
    lat: -34.5389,
    lng: -58.712,
    ambientes: 1,
    banos: 1,
    plantas: 1,
    supCubierta: 85,
    servicios: ["agua-corriente", "cloacas", "electricidad", "internet-fibra"],
    ambientesList: [],
    adicionales: ["apto-profesional"],
    cantidadFotos: 5,
    vistas: 29,
    diasDesdeCreacion: 3,
  },
  {
    codigo: "FP-0014",
    titulo: "Quinta con pileta y parque",
    descripcion:
      "Quinta de fin de semana en Del Viso, sobre un terreno parquizado de más de mil metros con árboles añejos. Casa principal de tres dormitorios, living con hogar a leña y galería cerrada con parrilla. Pileta grande con deck de madera y quincho independiente con baño propio. A quince minutos de la Panamericana por Ruta 25.",
    operacion: Operacion.VENTA,
    tipo: TipoPropiedad.QUINTA,
    estado: EstadoPropiedad.DISPONIBLE,
    publicacion: EstadoPub.PUBLICADA,
    destacada: true,
    moneda: Moneda.USD,
    precio: 380000,
    aptoCredito: false,
    direccionExacta: "Camino del Bosque 340, Del Viso",
    calle: "Camino del Bosque al 300",
    barrio: "Del Viso Golf",
    localidad: "Del Viso",
    partido: "Pilar",
    lat: -34.4056,
    lng: -58.7908,
    ambientes: 6,
    dormitorios: 3,
    banos: 2,
    toilettes: 1,
    plantas: 1,
    cocheras: 3,
    antiguedad: Antiguedad.ENTRE_10_20,
    condicion: Condicion.MUY_BUENO,
    situacion: Situacion.VACIA,
    orientacion: Orientacion.NORTE,
    supCubierta: 220,
    supSemicubierta: 45,
    supTerreno: 1150,
    servicios: ["agua-corriente", "electricidad", "energia-trifasica"],
    ambientesList: ["living", "galeria", "toilette", "dependencia-servicio"],
    adicionales: ["pileta", "parrilla", "quincho", "zonas-verdes", "seguridad-privada", "cochera-fija"],
    cantidadFotos: 12,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    planoUrl: "https://picsum.photos/seed/fp-0014-plano/1000/700",
    vistas: 298,
    diasDesdeCreacion: 42,
  },
];

// ============================================================================
// FAQs
// ============================================================================

const FAQS: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Cómo hago para vender mi propiedad con ustedes?",
    respuesta:
      "El primer paso es una tasación sin cargo: visitamos la propiedad, la evaluamos y te damos un valor de mercado fundamentado. Si decidís avanzar, firmamos una autorización de venta, armamos la publicación con fotos profesionales y coordinamos las visitas. Te mantenemos informado en cada etapa hasta la firma del boleto y la escritura.",
  },
  {
    pregunta: "¿Cómo se calcula el valor de tasación?",
    respuesta:
      "Comparamos tu propiedad con operaciones recientes de características similares en la misma zona, y ajustamos según superficie, antigüedad, estado de conservación, orientación y detalles particulares como cochera o pileta. El resultado es un rango de valor realista para vender en un plazo razonable, no una cifra optimista que después no se sostiene en el mercado.",
  },
  {
    pregunta: "¿Cuánto tarda en venderse una propiedad?",
    respuesta:
      "Depende mucho del precio de salida, la zona y el estado de la propiedad. En zona norte del GBA, una propiedad bien tasada y con buena presentación suele tener consultas concretas dentro del primer mes. El proceso completo, desde la publicación hasta la escritura, ronda entre dos y cuatro meses en un mercado normal.",
  },
  {
    pregunta: "¿Qué documentación necesito para vender?",
    respuesta:
      "Como mínimo: título de propiedad o escritura, últimas boletas de ABL/impuesto inmobiliario, DNI de todos los titulares y, si corresponde, reglamento de copropiedad y expensas al día. Si hay un crédito hipotecario vigente o una sucesión en trámite, lo vemos juntos porque cambia los pasos a seguir. Te acompañamos a juntar todo antes de salir a publicar.",
  },
  {
    pregunta: "¿Qué gastos tengo que tener en cuenta al comprar?",
    respuesta:
      "Además del precio de la propiedad, hay que prever la comisión inmobiliaria, los honorarios de escribanía, el sellado y, en caso de operar con crédito, los costos del banco (tasación, gastos administrativos y seguros). Como referencia, entre escritura y comisión suele rondar entre el 6% y el 8% adicional sobre el valor de la propiedad.",
  },
  {
    pregunta: "¿Cómo funciona el servicio de administración de propiedades?",
    respuesta:
      "Nos encargamos del cobro mensual del alquiler, el control de pagos de expensas y servicios, la gestión de reclamos y reparaciones, la rendición de cuentas al propietario y el seguimiento de las actualizaciones del contrato según el índice que corresponda. Vos recibís un informe claro cada mes, sin tener que ocuparte del día a día.",
  },
  {
    pregunta: "¿Se puede comprar con crédito hipotecario?",
    respuesta:
      "Sí. Varias de nuestras propiedades están marcadas como aptas para crédito. Te podemos orientar sobre qué bancos están ofreciendo mejores condiciones al momento de tu consulta, aunque la aprobación final y las condiciones del préstamo dependen de cada entidad y de tu situación particular.",
  },
  {
    pregunta: "¿Qué zonas cubren?",
    respuesta:
      "Trabajamos principalmente en San Miguel, Bella Vista, Muñiz, Los Polvorines, Del Viso y Tortuguitas, y alrededores de zona norte del GBA. Si tu propiedad está en una localidad cercana que no aparece en esta lista, escribinos igual: es muy probable que podamos ayudarte.",
  },
];

// ============================================================================
// CONSULTAS Y TASACIONES DE PRUEBA
// ============================================================================

interface ConsultaSeedInput {
  tipo: TipoConsulta;
  estado: EstadoConsulta;
  origen: OrigenConsulta;
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  propiedadCodigo?: string;
  notaInterna?: string;
  diasDesdeCreacion: number;
  // Tasación / administración
  direccionInmueble?: string;
  tipoInmueble?: string;
  ambientesInmueble?: string;
  antiguedadInmueble?: string;
  supCubiertaInm?: string;
  supTotalInm?: string;
  cantUnidades?: string;
  fotos?: string[];
}

const CONSULTAS: ConsultaSeedInput[] = [
  {
    tipo: TipoConsulta.PROPIEDAD,
    estado: EstadoConsulta.NUEVA,
    origen: OrigenConsulta.FICHA_PROPIEDAD,
    nombre: "Marcela Ibáñez",
    telefono: "11 6455-8821",
    email: "marcela.ibanez@example.com",
    mensaje:
      "Hola! Me interesa la propiedad FP-0001 — Casa 4 ambientes con jardín en San Miguel. ¿Podría coordinar una visita este fin de semana?",
    propiedadCodigo: "FP-0001",
    diasDesdeCreacion: 1,
  },
  {
    tipo: TipoConsulta.PROPIEDAD,
    estado: EstadoConsulta.CONTACTADA,
    origen: OrigenConsulta.FICHA_PROPIEDAD,
    nombre: "Diego Farías",
    telefono: "11 5522-0143",
    mensaje:
      "Buenas, quería consultar si el departamento de Perú al 1100 acepta parte de pago con un usado.",
    propiedadCodigo: "FP-0006",
    notaInterna:
      "Lo llamé el 24/08. No acepta usado como parte de pago, pero sigue interesado. Va a mandar la documentación para evaluar crédito.",
    diasDesdeCreacion: 4,
  },
  {
    tipo: TipoConsulta.PROPIEDAD,
    estado: EstadoConsulta.NUEVA,
    origen: OrigenConsulta.LISTADO,
    nombre: "Sol Ramírez",
    telefono: "11 3390-7712",
    email: "sol.ramirez@example.com",
    mensaje: "Hola, ¿la quinta de Del Viso admite algún tipo de financiación propia?",
    propiedadCodigo: "FP-0014",
    diasDesdeCreacion: 0,
  },
  {
    tipo: TipoConsulta.GENERAL,
    estado: EstadoConsulta.CERRADA,
    origen: OrigenConsulta.CONTACTO,
    nombre: "Roberto Nuñez",
    telefono: "11 4478-2290",
    mensaje: "¿Trabajan también en Grand Bourg o solo en las localidades que figuran en la web?",
    notaInterna:
      "Le confirmé que por ahora no cubrimos Grand Bourg de forma habitual, pero que le podemos dar una mano igual si tiene algo puntual. Consulta cerrada.",
    diasDesdeCreacion: 14,
  },
  {
    tipo: TipoConsulta.GENERAL,
    estado: EstadoConsulta.NUEVA,
    origen: OrigenConsulta.HOME,
    nombre: "Carolina Beltrán",
    telefono: "11 6690-4415",
    email: "caro.beltran@example.com",
    mensaje: "Hola, busco alquilar un depto de 2 ambientes en San Miguel o Bella Vista, hasta 500 mil. ¿Tienen algo así?",
    diasDesdeCreacion: 0,
  },
  {
    tipo: TipoConsulta.ADMINISTRACION,
    estado: EstadoConsulta.CONTACTADA,
    origen: OrigenConsulta.ADMINISTRACIONES,
    nombre: "Consorcio Edificio Rivadavia",
    telefono: "11 4432-9080",
    email: "consorcio.rivadavia@example.com",
    mensaje: "Somos un consorcio de 12 unidades en San Miguel, buscamos cambiar de administración. Quisiéramos una propuesta.",
    cantUnidades: "12",
    notaInterna: "Reunión pautada con el consejo de administración para el 2 de septiembre. Llevar propuesta de honorarios.",
    diasDesdeCreacion: 7,
  },
];

const TASACIONES: ConsultaSeedInput[] = [
  {
    tipo: TipoConsulta.TASACION,
    estado: EstadoConsulta.NUEVA,
    origen: OrigenConsulta.TASACIONES,
    nombre: "Julián Torres",
    telefono: "11 5567-3321",
    email: "julian.torres@example.com",
    mensaje: "Heredé la casa de mis padres y estoy evaluando venderla. Quisiera saber cuánto podría valer.",
    direccionInmueble: "Av. Balbín al 3100, Bella Vista",
    tipoInmueble: "Casa",
    ambientesInmueble: "4",
    antiguedadInmueble: "Entre 10 y 20 años",
    supCubiertaInm: "140",
    supTotalInm: "300",
    diasDesdeCreacion: 2,
  },
  {
    tipo: TipoConsulta.TASACION,
    estado: EstadoConsulta.CONTACTADA,
    origen: OrigenConsulta.TASACIONES,
    nombre: "Patricia Gómez",
    telefono: "11 4890-1156",
    email: "patricia.gomez@example.com",
    mensaje: "Quiero tasar mi departamento para ponerlo en venta el año que viene, prefiero ir adelantando.",
    direccionInmueble: "Av. Perú al 900, San Miguel",
    tipoInmueble: "Departamento",
    ambientesInmueble: "3",
    antiguedadInmueble: "Menos de 5 años",
    supCubiertaInm: "72",
    supTotalInm: "78",
    fotos: [
      "https://picsum.photos/seed/tasacion-patricia-1/900/600",
      "https://picsum.photos/seed/tasacion-patricia-2/900/600",
    ],
    notaInterna: "Visita de tasación coordinada para el 30/08 a las 10hs.",
    diasDesdeCreacion: 5,
  },
  {
    tipo: TipoConsulta.TASACION,
    estado: EstadoConsulta.CERRADA,
    origen: OrigenConsulta.TASACIONES,
    nombre: "Hugo Medina",
    telefono: "11 3345-8890",
    mensaje: "Necesito tasar un PH que estoy por vender, es urgente.",
    direccionInmueble: "Sarmiento al 1400, Muñiz",
    tipoInmueble: "PH",
    ambientesInmueble: "2",
    antiguedadInmueble: "Más de 20 años",
    supCubiertaInm: "50",
    supTotalInm: "60",
    notaInterna:
      "Tasado en USD 75.000. El propietario decidió esperar unos meses antes de publicar. Consulta cerrada.",
    diasDesdeCreacion: 20,
  },
];

// ============================================================================
// SEED PRINCIPAL
// ============================================================================

function fechaHaceNDias(dias: number): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}

async function limpiarDatosDeSeed(): Promise<void> {
  // El orden importa por las relaciones (Imagen y VistaPropiedad dependen
  // de Propiedad con onDelete: Cascade, así que alcanza con borrar Propiedad,
  // pero lo dejamos explícito para que sea a prueba de cambios de schema).
  await prisma.consulta.deleteMany({ where: { esDeSeed: true } });
  await prisma.propiedad.deleteMany({ where: { esDeSeed: true } });
  await prisma.faq.deleteMany({ where: { esDeSeed: true } });
}

async function seedUsuarioAdmin(): Promise<{ email: string; password: string }> {
  const email = "fuentespropiedades@login.com";
  const password = "12345678";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.usuario.upsert({
    where: { email },
    update: { password: passwordHash },
    create: {
      email,
      password: passwordHash,
      nombre: "Administrador",
    },
  });

  return { email, password };
}

async function seedConfiguracion(): Promise<void> {
  await prisma.configuracion.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      telefono: "11 3207-2307",
      whatsapp: "5491132072307",
      email: "marian.fuentes@hotmail.es",
      direccion: "Estudio Peluffo 1079, Muñiz",
      // Mariana confirmó el horario por WhatsApp (30/08); asumí "lunes a
      // viernes" porque no lo aclaró — avisale si algún día es distinto.
      horarios: "Lunes a viernes de 9 a 13 hs y de 15:30 a 20 hs",
      matricula: "C.S.M. 0000", // todavía no mandó el número de matrícula
      instagram: null,
      facebook: null,
      heroTitulo: "Encontrá tu próxima propiedad en zona norte del GBA",
      heroSubtitulo:
        "Venta, alquiler y administración de propiedades en San Miguel, Bella Vista, Muñiz, Los Polvorines y alrededores.",
      textoNosotros:
        "Soy Mariana Fuentes, martillera pública matriculada (C.S.M. 0000), especializada en zona norte del Gran Buenos Aires.\n\nEn Fuentes Propiedades brindamos un servicio inmobiliario personalizado, profesional y cercano. Acompañamos a nuestros clientes en cada etapa del proceso, ya sea para comprar, vender, alquilar o administrar una propiedad, ofreciendo asesoramiento claro y atención personalizada.\n\nNuestro objetivo es que cada operación se realice con seguridad, transparencia y confianza, cuidando los intereses de nuestros clientes y buscando siempre las mejores alternativas.\n\nCubro San Miguel, Bella Vista, Muñiz, Los Polvorines, Del Viso, Tortuguitas y alrededores. Conozco cada barrio, cada calle y cada tendencia del mercado local.",
      textoAdmin:
        "Administro tu propiedad de punta a punta: cobro de alquileres, control de pagos de expensas y servicios, gestión de reclamos, rendición mensual clara y seguimiento de las actualizaciones del contrato según el índice que corresponda. Vos recibís un informe cada mes sin tener que ocuparte del día a día.",
    },
  });
}

async function seedFaqs(): Promise<void> {
  for (const [i, faq] of FAQS.entries()) {
    await prisma.faq.create({
      data: {
        pregunta: faq.pregunta,
        respuesta: faq.respuesta,
        orden: i,
        activa: true,
        esDeSeed: true,
      },
    });
  }
}

async function seedPropiedades(): Promise<Map<string, string>> {
  const idsPorCodigo = new Map<string, string>();

  for (const p of PROPIEDADES) {
    const slug = generarSlugPropiedad(p.titulo, p.codigo);
    const imagenes = imagenesSeed(p.codigo.toLowerCase(), p.cantidadFotos);
    const creadaEl = fechaHaceNDias(p.diasDesdeCreacion);

    const propiedad = await prisma.propiedad.create({
      data: {
        codigo: p.codigo,
        slug,
        titulo: p.titulo,
        descripcion: p.descripcion,
        operacion: p.operacion,
        tipo: p.tipo,
        estado: p.estado,
        publicacion: p.publicacion,
        destacada: p.destacada,
        moneda: p.moneda,
        precio: p.precio,
        expensas: p.expensas,
        aptoCredito: p.aptoCredito,
        direccionExacta: p.direccionExacta,
        calle: p.calle,
        barrio: p.barrio,
        localidad: p.localidad,
        partido: p.partido,
        lat: p.lat,
        lng: p.lng,
        ambientes: p.ambientes,
        dormitorios: p.dormitorios,
        banos: p.banos,
        toilettes: p.toilettes,
        plantas: p.plantas,
        cocheras: p.cocheras,
        antiguedad: p.antiguedad,
        condicion: p.condicion,
        situacion: p.situacion,
        orientacion: p.orientacion,
        supCubierta: p.supCubierta,
        supSemicubierta: p.supSemicubierta,
        supDescubierta: p.supDescubierta,
        supTerreno: p.supTerreno,
        medidaFrente: p.medidaFrente,
        medidaFondo: p.medidaFondo,
        servicios: p.servicios,
        ambientesList: p.ambientesList,
        adicionales: p.adicionales,
        planoUrl: p.planoUrl,
        videoUrl: p.videoUrl,
        vistas: p.vistas,
        esDeSeed: true,
        createdAt: creadaEl,
        updatedAt: creadaEl,
        imagenes: {
          create: imagenes.map((img, i) => ({
            url: img.url,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            blurDataUrl: img.blurDataUrl,
            orden: i,
            esPortada: i === 0,
          })),
        },
      },
    });

    idsPorCodigo.set(p.codigo, propiedad.id);
  }

  return idsPorCodigo;
}

async function seedConsultas(idsPorCodigo: Map<string, string>): Promise<void> {
  for (const c of [...CONSULTAS, ...TASACIONES]) {
    const creadaEl = fechaHaceNDias(c.diasDesdeCreacion);
    await prisma.consulta.create({
      data: {
        tipo: c.tipo,
        estado: c.estado,
        origen: c.origen,
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email,
        mensaje: c.mensaje,
        propiedadId: c.propiedadCodigo ? idsPorCodigo.get(c.propiedadCodigo) : undefined,
        direccionInmueble: c.direccionInmueble,
        tipoInmueble: c.tipoInmueble,
        ambientesInmueble: c.ambientesInmueble,
        antiguedadInmueble: c.antiguedadInmueble,
        supCubiertaInm: c.supCubiertaInm,
        supTotalInm: c.supTotalInm,
        cantUnidades: c.cantUnidades,
        fotos: c.fotos ?? [],
        notaInterna: c.notaInterna,
        esDeSeed: true,
        createdAt: creadaEl,
        updatedAt: creadaEl,
      },
    });
  }
}

async function main(): Promise<void> {
  console.warn("Limpiando datos de prueba anteriores...");
  await limpiarDatosDeSeed();

  console.warn("Cargando usuario admin...");
  const credencialesAdmin = await seedUsuarioAdmin();

  console.warn("Cargando configuración inicial...");
  await seedConfiguracion();

  console.warn("Cargando FAQs...");
  await seedFaqs();

  console.warn(`Cargando ${PROPIEDADES.length} propiedades...`);
  const idsPorCodigo = await seedPropiedades();

  console.warn(`Cargando ${CONSULTAS.length + TASACIONES.length} consultas y tasaciones...`);
  await seedConsultas(idsPorCodigo);

  console.warn("\n✅ Seed completo.\n");
  console.warn("Credenciales del panel de administración:");
  console.warn(`  URL:      /admin/login`);
  console.warn(`  Email:    ${credencialesAdmin.email}`);
  console.warn(`  Password: ${credencialesAdmin.password}`);
  console.warn("\nCambiala desde el panel apenas entres por primera vez.\n");
}

main()
  .catch((error: unknown) => {
    console.error("Error al correr el seed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
