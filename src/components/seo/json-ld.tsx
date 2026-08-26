interface JsonLdInmobiliariaProps {
  nombre?: string;
  url?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export function JsonLdInmobiliaria({
  nombre = "Fuentes Propiedades",
  url = "https://inmbobilariafuentes.vercel.app",
  telefono = "+54 9 11 1234-5678",
  email = "info@fuentespropiedades.com.ar",
}: JsonLdInmobiliariaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: nombre,
    url,
    telephone: telefono,
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Belgrano 1487",
      addressLocality: "San Miguel",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -34.5441,
        longitude: -58.7096,
      },
      geoRadius: "20000",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface JsonLdPropiedadProps {
  titulo: string;
  descripcion: string;
  url: string;
  imagen?: string;
  precio: number;
  moneda: string;
  operacion: string;
  tipo: string;
  direccion?: string;
  localidad?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  supCubierta?: number;
}

export function JsonLdPropiedad({
  titulo,
  descripcion,
  url,
  imagen,
  precio,
  moneda,
  operacion,
  tipo,
  direccion,
  localidad,
  ambientes,
  dormitorios,
  banos,
  supCubierta,
}: JsonLdPropiedadProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: titulo,
    description: descripcion.slice(0, 500),
    url,
    image: imagen,
    offers: {
      "@type": "Offer",
      price: precio,
      priceCurrency: moneda === "USD" ? "USD" : "ARS",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    additionalProperty: [
      ...(tipo ? [{ "@type": "PropertyValue", name: "Tipo", value: tipo }] : []),
      ...(operacion ? [{ "@type": "PropertyValue", name: "Operación", value: operacion }] : []),
      ...(direccion ? [{ "@type": "PropertyValue", name: "Dirección", value: direccion }] : []),
      ...(localidad ? [{ "@type": "PropertyValue", name: "Localidad", value: localidad }] : []),
      ...(ambientes != null ? [{ "@type": "PropertyValue", name: "Ambientes", value: String(ambientes) }] : []),
      ...(dormitorios != null ? [{ "@type": "PropertyValue", name: "Dormitorios", value: String(dormitorios) }] : []),
      ...(banos != null ? [{ "@type": "PropertyValue", name: "Baños", value: String(banos) }] : []),
      ...(supCubierta != null ? [{ "@type": "PropertyValue", name: "Superficie cubierta", value: `${supCubierta} m²` }] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
