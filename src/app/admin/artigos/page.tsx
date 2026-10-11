/**
 * Caminho: src/app/admin/artigos/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de artigos do admin com abas de status, busca por título, tags, tempo de leitura, ações de editar e excluir e ações em lote.
 */
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { listAdminPosts, type PostStatusFilter } from "@/lib/repositories/admin-posts";
import { getPostStatus } from "@/lib/repositories/admin-stats";
import { readingMinutes } from "@/lib/posts/utils";
import PostsTable from "@/components/Admin/Posts/PostsTable";
import { btnPrimary, input } from "@/components/Admin/styles";

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

      <div className="mt-4">
        <PostsTable
          posts={posts.map((post) => ({
            id: post.id,
            title: post.title,
            featured: post.featured,
            status: getPostStatus(post),
            tags: post.tags,
            readingMinutes: readingMinutes(post.content),
            publishedLabel: post.published ? format(post.publishedAt, "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-",
          }))}
        />
      </div>
    </>
  );
}
