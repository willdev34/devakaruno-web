export type Blog = {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage: string;
  date: string;
  author?: string;
  // Nome da categoria, quando o artigo tem uma
  category?: string;
  // Slug da categoria, usado nos filtros e nos artigos relacionados
  categorySlug?: string;
  // Tags do artigo, usadas nos filtros e nos artigos relacionados
  tags?: string[];
};
