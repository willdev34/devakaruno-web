/**
 * Caminho: src/app/admin/artigos/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de artigos do admin com abas de status, busca por título, tags, tempo de leitura e ações de editar e excluir.
 */
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { listAdminPosts, type PostStatusFilter } from "@/lib/repositories/admin-posts";
import { getPostStatus } from "@/lib/repositories/admin-stats";
import { readingMinutes } from "@/lib/posts/utils";
import StatusBadge from "@/components/Admin/Posts/StatusBadge";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { btnPrimary, input } from "@/components/Admin/styles";
import { deletePostAction } from "./actions";

const TABS: { value: PostStatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "published", label: "Publicados" },
  { value: "scheduled", label: "Agendados" },
  { value: "draft", label: "Rascunhos" },
];

const isStatus = (value?: string): value is PostStatusFilter => TABS.some((tab) => tab.value === value);

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: rawStatus, q = "" } = await searchParams;
  const status = isStatus(rawStatus) ? rawStatus : "all";
  const posts = await listAdminPosts({ status, q });

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Artigos</h1>
          <p className="mt-1 text-sm text-muted">{posts.length} artigo(s) {q || status !== "all" ? "encontrado(s)" : "cadastrado(s)"}</p>
        </div>
        <Link href="/admin/artigos/novo" className={btnPrimary}>+ Novo artigo</Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filtrar por status" className="flex gap-1 rounded-lg bg-black/5 p-1">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/artigos?status=${tab.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-current={status === tab.value ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${status === tab.value ? "bg-white shadow-sm" : "text-muted hover:text-midnight_text"}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <form action="/admin/artigos" className="flex gap-2">
          <input type="hidden" name="status" value={status} />
          <input name="q" defaultValue={q} aria-label="Buscar artigo" placeholder="Buscar pelo título" className={`${input} w-64`} />
        </form>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {posts.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum artigo por aqui ainda.</p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Título</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Tags</th>
                <th className="px-3 py-3">Leitura</th>
                <th className="px-3 py-3">Publicação</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="max-w-xs px-5 py-4 font-medium">
                    {post.title}
                    {post.featured && <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warning">Destaque</span>}
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={getPostStatus(post)} /></td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4">{readingMinutes(post.content)} min</td>
                  <td className="px-3 py-4 text-muted">
                    {post.published ? format(post.publishedAt, "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                  </td>
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
