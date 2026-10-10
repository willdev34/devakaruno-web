/**
 * Caminho: src/components/Admin/Posts/PostsTable.tsx
 * Arquivo: PostsTable.tsx
 * Descrição: Tabela de artigos do admin com seleção de vários itens e ações em lote (publicar agora, voltar para rascunho e excluir).
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PostStatus } from "@/lib/repositories/admin-stats";
import type { BulkAction } from "@/lib/posts/bulk";
import { bulkPostsAction, deletePostAction } from "@/app/admin/artigos/actions";
import DeleteButton from "./DeleteButton";
import StatusBadge from "./StatusBadge";
import { btnGhost } from "../styles";

export type PostRow = {
  id: string;
  title: string;
  featured: boolean;
  status: PostStatus;
  tags: string[];
  readingMinutes: number;
  // Data já formatada ("10/10/2026 09:00") ou "-" para rascunho
  publishedLabel: string;
};

const CONFIRM: Record<BulkAction, (count: number) => string> = {
  delete: (count) => `Excluir ${count} artigo(s)? Essa ação não pode ser desfeita.`,
  publish: (count) => `Publicar agora ${count} artigo(s)?`,
  unpublish: (count) => `Voltar ${count} artigo(s) para rascunho? Eles saem do blog.`,
};

export default function PostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const allSelected = posts.length > 0 && selected.length === posts.length;
  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const run = (action: BulkAction) => {
    if (!window.confirm(CONFIRM[action](selected.length))) return;
    setError("");
    start(async () => {
      const result = await bulkPostsAction({ action, ids: selected });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSelected([]);
      router.refresh();
    });
  };

  return (
    <>
      {selected.length > 0 && (
        <div role="region" aria-label="Ações em lote" className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <span className="font-medium">{selected.length} selecionado(s)</span>
          <button type="button" disabled={pending} onClick={() => run("publish")} className={btnGhost}>Publicar agora</button>
          <button type="button" disabled={pending} onClick={() => run("unpublish")} className={btnGhost}>Voltar para rascunho</button>
          <button type="button" disabled={pending} onClick={() => run("delete")} className="inline-flex items-center rounded-lg border border-error/30 bg-white px-5 py-2.5 text-sm font-semibold text-error transition hover:bg-error/5 disabled:opacity-60">
            Excluir selecionados
          </button>
          <button type="button" onClick={() => setSelected([])} className="ml-auto text-sm text-muted hover:text-midnight_text">Limpar seleção</button>
          {error && <p role="alert" className="w-full text-xs text-error">{error}</p>}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {posts.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum artigo por aqui ainda.</p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos os artigos"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? [] : posts.map((post) => post.id))}
                  />
                </th>
                <th className="px-3 py-3">Título</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Tags</th>
                <th className="px-3 py-3">Leitura</th>
                <th className="px-3 py-3">Publicação</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {posts.map((post) => (
                <tr key={post.id} className={selected.includes(post.id) ? "bg-primary/5" : undefined}>
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Selecionar ${post.title}`}
                      checked={selected.includes(post.id)}
                      onChange={() => toggle(post.id)}
                    />
                  </td>
                  <td className="max-w-xs px-3 py-4 font-medium">
                    {post.title}
                    {post.featured && <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warning">Destaque</span>}
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={post.status} /></td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4">{post.readingMinutes} min</td>
                  <td className="px-3 py-4 text-muted">{post.publishedLabel}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/artigos/${post.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                      <DeleteButton id={post.id} name={post.title} action={deletePostAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
