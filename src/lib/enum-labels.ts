// Labels en español para los enums del schema — se usan en el admin y en
// el sitio público. Centralizados acá para no repetir el mismo `switch` en
// cada componente.

export const LABEL_OPERACION: Record<string, string> = {
  VENTA: "Venta",
  ALQUILER: "Alquiler",
};

export const LABEL_TIPO_PROPIEDAD: Record<string, string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  PH: "PH",
  LOTE: "Lote",
  LOCAL: "Local",
  OFICINA: "Oficina",
  QUINTA: "Quinta",
  GALPON: "Galpón",
  COCHERA: "Cochera",
  CAMPO: "Campo",
};

export const LABEL_ESTADO_PROPIEDAD: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVADA: "Reservada",
  VENDIDA: "Vendida",
  ALQUILADA: "Alquilada",
};

export const LABEL_PUBLICACION: Record<string, string> = {
  BORRADOR: "Borrador",
  PUBLICADA: "Publicada",
  ARCHIVADA: "Archivada",
};

export const LABEL_ANTIGUEDAD: Record<string, string> = {
  A_ESTRENAR: "A estrenar",
  EN_POZO: "En pozo",
  HASTA_5: "Hasta 5 años",
  ENTRE_5_10: "Entre 5 y 10 años",
  ENTRE_10_20: "Entre 10 y 20 años",
  MAS_20: "Más de 20 años",
};

export const LABEL_CONDICION: Record<string, string> = {
  EXCELENTE: "Excelente",
  MUY_BUENO: "Muy bueno",
  BUENO: "Bueno",
  A_REFACCIONAR: "A refaccionar",
};

export const LABEL_SITUACION: Record<string, string> = {
  VACIA: "Vacía",
  OCUPADA: "Ocupada",
  ALQUILADA: "Alquilada",
};

export const LABEL_ORIENTACION: Record<string, string> = {
  NORTE: "Norte",
  SUR: "Sur",
  ESTE: "Este",
  OESTE: "Oeste",
  NORESTE: "Noreste",
  NOROESTE: "Noroeste",
  SUDESTE: "Sudeste",
  SUDOESTE: "Sudoeste",
};

export const LABEL_TIPO_CONSULTA: Record<string, string> = {
  PROPIEDAD: "Propiedad",
  GENERAL: "General",
  TASACION: "Tasación",
  ADMINISTRACION: "Administración",
};

export const LABEL_ESTADO_CONSULTA: Record<string, string> = {
  NUEVA: "Nueva",
  CONTACTADA: "Contactada",
  CERRADA: "Cerrada",
};
