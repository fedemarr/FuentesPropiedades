import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/** Cloudinary está configurado con valores reales (no los placeholders del
 * seed). Se usa para dar un error humano en vez de que la subida falle
 * críptico contra la API de Cloudinary. */
export function cloudinaryConfigurado(): boolean {
  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      cloudName !== "{{PENDIENTE}}" &&
      apiKey !== "{{PENDIENTE}}" &&
      apiSecret !== "{{PENDIENTE}}",
  );
}

export { cloudinary };
