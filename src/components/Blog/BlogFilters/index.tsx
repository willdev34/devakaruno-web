"use client";
/**
 * Caminho: src/components/Blog/BlogFilters/index.tsx
 * Arquivo: index.tsx
 * Descrição: Busca, chips de categoria e de tag e a grade de artigos da página Blog. Filtra na própria página e guarda o filtro na URL.
 */
import React, { useMemo, useState, useSyncExternalStore } from "react";
import BlogCard from "@/components/SharedComponent/Blog/blogCard";
import {
  EMPTY_FILTER,
  filterPosts,
  hasActiveFilter,
  listCategories,
  listTags,
  normalizeText,
  type BlogFilter,
} from "@/lib/blog/filter-posts";
import { filterToSearch, parseFilter } from "@/lib/blog/filter-url";
import type { Blog } from "@/types/blog";

// Quantidade de tags exibidas antes do botão "Ver todas"
const MAX_VISIBLE_TAGS = 10;

// A URL é a fonte do filtro: o servidor renderiza a lista completa e o navegador aplica o filtro do link
const FILTER_EVENT = "blog-filter-change";

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
    >
      {children}
    </button>
  );
}

const BlogFilters = ({ posts }: { posts: Blog[] }) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const search = useSyncExternalStore(subscribeToUrl, getSearch, getServerSearch);
  const filter = useMemo(() => parseFilter(search), [search]);

  // Grava o filtro na URL sem criar nova entrada no histórico
  function update(next: BlogFilter) {
    const query = filterToSearch(next);
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    window.dispatchEvent(new Event(FILTER_EVENT));
  }

  const categories = useMemo(() => listCategories(posts), [posts]);
  const tags = useMemo(() => listTags(posts), [posts]);
  const results = useMemo(() => filterPosts(posts, filter), [posts, filter]);

  // Com muitas tags, mostra as mais usadas e mantém a escolhida sempre visível
  const visibleTags = useMemo(() => {
    if (showAllTags || tags.length <= MAX_VISIBLE_TAGS) return tags;
    const top = tags.slice(0, MAX_VISIBLE_TAGS);
    const selected = tags.find((t) => filter.tag && normalizeText(t.tag) === normalizeText(filter.tag));
    return selected && !top.includes(selected) ? [...top, selected] : top;
  }, [tags, showAllTags, filter.tag]);

  const isTagActive = (tag: string) => Boolean(filter.tag) && normalizeText(tag) === normalizeText(filter.tag);

  return (
    <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
      <div className="mb-10 flex flex-col gap-5">
        <input
          type="search"
          value={filter.query}
          onChange={(e) => update({ ...filter, query: e.target.value })}
          placeholder="Buscar artigos"
          aria-label="Buscar artigos"
          className="w-full rounded-lg border border-black/10 bg-transparent px-4 py-3 text-base outline-none focus:border-primary dark:border-white/20"
        />

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Categorias">
            <Chip active={!filter.category} onClick={() => update({ ...filter, category: "" })}>Todas</Chip>
            {categories.map((c) => (
              <Chip
                key={c.slug}
                active={filter.category === c.slug}
                onClick={() => update({ ...filter, category: filter.category === c.slug ? "" : c.slug })}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Tags">
            {visibleTags.map((t) => (
              <Chip
                key={t.tag}
                active={isTagActive(t.tag)}
                onClick={() => update({ ...filter, tag: isTagActive(t.tag) ? "" : t.tag })}
              >
                #{t.tag}
              </Chip>
            ))}
            {tags.length > MAX_VISIBLE_TAGS && (
              <button
                type="button"
                onClick={() => setShowAllTags((v) => !v)}
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                {showAllTags ? "Ver menos tags" : "Ver todas as tags"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-dustGray dark:text-white/60" role="status" aria-live="polite">
          <span>{results.length === 1 ? "1 artigo" : `${results.length} artigos`}</span>
          {hasActiveFilter(filter) && (
            <button type="button" onClick={() => update(EMPTY_FILTER)} className="font-medium text-primary hover:underline">
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-12 text-center text-dustGray dark:text-white/60">
          Nenhum artigo encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
          {results.map((blog) => (
            <div key={blog.slug} className="w-full">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogFilters;
