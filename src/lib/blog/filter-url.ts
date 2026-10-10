/**
 * Caminho: src/lib/blog/filter-url.ts
 * Arquivo: filter-url.ts
 * Descrição: Converte os filtros do blog de e para a query string (?q=...&categoria=...&tag=...), para o link poder ser compartilhado.
 */
import { EMPTY_FILTER, type BlogFilter } from "./filter-posts";

// "?q=paz&categoria=autoconhecimento" -> filtro
export function parseFilter(search: string): BlogFilter {
  const params = new URLSearchParams(search);
  return {
    query: params.get("q") ?? EMPTY_FILTER.query,
    category: params.get("categoria") ?? EMPTY_FILTER.category,
    tag: params.get("tag") ?? EMPTY_FILTER.tag,
  };
}

// Filtro -> query string sem o "?" (vazia quando não há filtro)
export function filterToSearch(filter: BlogFilter): string {
  const params = new URLSearchParams();
  if (filter.query.trim()) params.set("q", filter.query.trim());
  if (filter.category) params.set("categoria", filter.category);
  if (filter.tag) params.set("tag", filter.tag);
  return params.toString();
}
