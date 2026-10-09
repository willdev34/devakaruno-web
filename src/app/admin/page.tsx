/**
 * Caminho: src/app/admin/page.tsx
 * Arquivo: page.tsx
 * Descrição: Dashboard do painel admin: números do site e últimos artigos mexidos.
 */
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getDashboardStats, type PostStatus } from "@/lib/repositories/admin-stats";

const STATUS_LABEL: Record<PostStatus, string> = {
  published: "Publicado",
  scheduled: "Agendado",
  draft: "Rascunho",
};

const STATUS_STYLE: Record<PostStatus, string> = {
  published: "bg-[#0f1c27] text-white",
  scheduled: "bg-primary/10 text-primary",
  draft: "bg-black/5 text-muted",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Visão geral do conteúdo do site.</p>

      <section aria-label="Resumo" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Artigos no ar" value={stats.posts.published} />
        <StatCard label="Agendados" value={stats.posts.scheduled} />
        <StatCard label="Rascunhos" value={stats.posts.drafts} />
        <StatCard label="Depoimentos" value={stats.testimonials} />
        <StatCard label="Cursos" value={stats.courses} />
      </section>

      <section aria-label="Artigos recentes" className="mt-10 rounded-xl border border-black/5 bg-white shadow-sm">
        <h2 className="border-b border-black/5 px-5 py-4 text-sm font-semibold">Últimos artigos</h2>
        {stats.recent.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">Nenhum artigo ainda.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {stats.recent.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted">
                    Atualizado em {format(post.updatedAt, "d 'de' MMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${STATUS_STYLE[post.status]}`}>
                  {STATUS_LABEL[post.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 text-sm text-muted">
        <Link href="/" className="text-primary hover:underline">Ver o site</Link>
      </p>
    </>
  );
}
