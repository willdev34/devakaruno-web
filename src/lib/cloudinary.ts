/**
 * Caminho: src/lib/cloudinary.ts
 * Arquivo: cloudinary.ts
 * Descrição: Monta URLs do Cloudinary com otimização automática de formato, qualidade e largura.
 */
const UPLOAD_SEGMENT = "/upload/";

// Insere as transformações logo após "/upload/" (f_auto: melhor formato, q_auto: melhor qualidade/peso)
export function cloudinaryUrl(url: string, width: number): string {
  if (!url.includes(UPLOAD_SEGMENT)) return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}f_auto,q_auto,w_${width}/`);
}

// Gera o atributo srcSet (ex: "url-1280 1280w, url-2000 2000w") para as larguras informadas
export function cloudinarySrcSet(url: string, widths: number[]): string {
  return widths.map((width) => `${cloudinaryUrl(url, width)} ${width}w`).join(", ");
}
