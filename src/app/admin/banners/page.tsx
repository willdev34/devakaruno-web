/**
 * Caminho: src/app/admin/banners/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de banners do admin, agrupada por posição e na ordem de prioridade: imagem, situação, período e ações.
 */
import Link from "next/link";
import { listAdminAds } from "@/lib/repositories/admin-ads";
import { AD_POSITIONS } from "@/lib/ads/positions";
import { AD_STATUS_LABEL, adStatus, type AdStatus } from "@/lib/ads/status";
import { toDateInput } from "@/lib/ads/dates";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import MoveButtons from "@/components/Admin/MoveButtons";
import { btnPrimary } from "@/components/Admin/styles";
import { deleteAdAction, moveAdAction } from "./actions";

const STATUS_STYLE: Record<AdStatus, string> = {
  live: "bg-[#0f1c27] text-white",
  scheduled: "bg-primary/10 text-primary",
  expired: "bg-black/5 text-muted",
  inactive: "bg-black/5 text-muted",
};

// "10/10/2026" a partir do valor do campo de data
const formatDay = (value: string) => value.split("-").reverse().join("/");

function period(startsAt: Date | null, endsAt: Date | null): string {
  if (!startsAt && !endsAt) return "Sem prazo";
  const from = startsAt ? formatDay(toDateInput(startsAt)) : "início";
  const to = endsAt ? formatDay(toDateInput(endsAt)) : "sem fim";
  return `${from} a ${to}`;
}

export default async function AdminAdsPage() {
  const ads = await listAdminAds();
  const now = new Date();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Banners publicitários</h1>
          <p className="mt-1 text-sm text-muted">
            {ads.length} banner(s). Em cada posição aparece só um: o primeiro da fila que estiver no ar. Use as setas para mudar a prioridade.
          </p>
        </div>
        <Link href="/admin/banners/novo" className={btnPrimary}>+ Novo banner</Link>
      </div>

      {ads.length === 0 ? (
        <div className="mt-6 rounded-xl border border-black/5 bg-white shadow-sm">
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum banner cadastrado ainda.</p>
        </div>
      ) : (
        AD_POSITIONS.map((position) => {
          const items = ads.filter((ad) => ad.position === position.value);
          if (items.length === 0) return null;
          return (
            <section key={position.value} className="mt-6">
              <h2 className="mb-2 text-sm font-semibold">{position.label}</h2>
              <div className="overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-3">Ordem</th>
                      <th className="px-3 py-3">Banner</th>
                      <th className="px-3 py-3">Situação</th>
                      <th className="px-3 py-3">Período</th>
                      <th className="px-5 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {items.map((ad, index) => {
                      const status = adStatus(ad, now);
                      return (
                        <tr key={ad.id}>
                          <td className="px-5 py-4">
                            <MoveButtons
                              id={ad.id}
                              name={ad.name}
                              isFirst={index === 0}
                              isLast={index === items.length - 1}
                              action={moveAdAction}
                            />
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={ad.imageUrl} alt={ad.altText} className="h-10 w-24 rounded object-cover" />
                              <span className="font-medium">{ad.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${STATUS_STYLE[status]}`}>
                              {AD_STATUS_LABEL[status]}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-muted">{period(ad.startsAt, ad.endsAt)}</td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-4">
                              <Link href={`/admin/banners/${ad.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                              <DeleteButton id={ad.id} name={ad.name} action={deleteAdAction} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
