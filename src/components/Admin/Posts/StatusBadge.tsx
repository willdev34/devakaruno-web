/**
 * Caminho: src/components/Admin/Posts/StatusBadge.tsx
 * Arquivo: StatusBadge.tsx
 * Descrição: Selo de status do artigo (publicado, agendado ou rascunho), usado no dashboard e na listagem.
 */
import type { PostStatus } from "@/lib/repositories/admin-stats";

const LABEL: Record<PostStatus, string> = { published: "Publicado", scheduled: "Agendado", draft: "Rascunho" };
const STYLE: Record<PostStatus, string> = {
  published: "bg-[#0f1c27] text-white",
  scheduled: "bg-primary/10 text-primary",
  draft: "bg-black/5 text-muted",
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${STYLE[status]}`}>
      {LABEL[status]}
    </span>
  );
}
