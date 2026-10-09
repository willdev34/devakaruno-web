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
};