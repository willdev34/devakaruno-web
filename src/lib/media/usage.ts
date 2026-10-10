/**
 * Caminho: src/lib/media/usage.ts
 * Arquivo: usage.ts
 * Descrição: Descobre onde uma imagem está em uso (capa de artigo, texto de artigo, curso, banner) comparando o public_id com os textos do banco.
 */

export type ImageSource = {
  kind: "Artigo" | "Curso" | "Banner";
  id: string;
  title: string;
  // Tela do admin onde o item pode ser editado
  href: string;
  // Campos que podem conter a URL da imagem
  texts: string[];
};

export type ImageUsage = Pick<ImageSource, "kind" | "id" | "title" | "href">;

const ID_CHAR = /[A-Za-z0-9_-]/;

// O public_id precisa aparecer inteiro: "logo_ab" não conta dentro de "xlogo_abc"
export function mentions(text: string, publicId: string): boolean {
  if (!publicId) return false;
  let from = 0;
  for (;;) {
    const at = text.indexOf(publicId, from);
    if (at === -1) return false;
    const before = at === 0 ? "" : text[at - 1];
    const after = text[at + publicId.length] ?? "";
    if (!ID_CHAR.test(before) && !ID_CHAR.test(after)) return true;
    from = at + 1;
  }
}

export function findUsages(publicId: string, sources: ImageSource[]): ImageUsage[] {
  return sources
    .filter((source) => source.texts.some((text) => mentions(text, publicId)))
    .map(({ kind, id, title, href }) => ({ kind, id, title, href }));
}
