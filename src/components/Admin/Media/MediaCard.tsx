/**
 * Caminho: src/components/Admin/Media/MediaCard.tsx
 * Arquivo: MediaCard.tsx
 * Descrição: Cartão de uma imagem da biblioteca: prévia, medidas, onde está em uso, copiar URL e excluir (bloqueado quando em uso ou fora das pastas do site).
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { formatBytes, formatDate } from "@/lib/media/format";
import type { ImageUsage } from "@/lib/media/usage";
import { deleteMediaAction } from "@/app/admin/imagens/actions";

export type MediaCardItem = {
  publicId: string;
  url: string;
  folder: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: string;
  managed: boolean;
  usages: ImageUsage[];
};

export default function MediaCard({ item }: { item: MediaCardItem }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const inUse = item.usages.length > 0;
  const name = item.publicId.split("/").pop() ?? item.publicId;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar. Copie a URL pelo navegador.");
    }
  };

  const remove = () => {
    if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
    setError("");
    start(async () => {
      const result = await deleteMediaAction(item.publicId);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  };

  return (
    <li className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cloudinaryUrl(item.url, 480)} alt={name} loading="lazy" className="h-40 w-full bg-black/5 object-cover" />
      <div className="space-y-2 p-4 text-sm">
        <p className="truncate font-medium" title={item.publicId}>{name}</p>
        <p className="text-xs text-muted">
          {item.width}x{item.height} · {formatBytes(item.bytes)} · {item.format.toUpperCase()} · {formatDate(item.createdAt)}
        </p>
        <p className="text-xs text-muted">{item.folder ? `Pasta: ${item.folder}` : "Sem pasta"}</p>

        {inUse ? (
          <ul className="space-y-1 text-xs">
            {item.usages.map((usage) => (
              <li key={`${usage.kind}-${usage.id}`}>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">{usage.kind}</span>{" "}
                <Link href={usage.href} className="hover:underline">{usage.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted">Sem uso nos artigos, cursos e banners.</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={copy} className="text-sm font-medium text-primary hover:underline">
            {copied ? "URL copiada" : "Copiar URL"}
          </button>
          {item.managed && !inUse ? (
            <button type="button" onClick={remove} disabled={pending} className="text-sm font-medium text-error hover:underline disabled:opacity-60">
              {pending ? "Excluindo..." : "Excluir"}
            </button>
          ) : (
            <span className="text-xs text-muted">{inUse ? "Em uso" : "Só pelo Cloudinary"}</span>
          )}
        </div>
        {error && <p role="alert" className="text-xs text-error">{error}</p>}
      </div>
    </li>
  );
}
