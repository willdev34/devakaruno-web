/**
 * Caminho: src/components/Admin/Media/MediaPicker.tsx
 * Arquivo: MediaPicker.tsx
 * Descrição: Janela para escolher uma imagem já enviada ao Cloudinary, usada nos formulários de artigo, curso e banner. Carrega as imagens por página.
 */
"use client";
import { useEffect, useState } from "react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import type { MediaItem, MediaPage } from "@/lib/media/cloudinary-admin";
import { btnGhost } from "../styles";

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

// Busca uma página da biblioteca; lança erro com a mensagem do servidor
async function fetchPage(cursor?: string): Promise<MediaPage> {
  const response = await fetch(`/api/admin/media${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`);
  const data = (await response.json().catch(() => ({}))) as Partial<MediaPage> & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar as imagens.");
  return { items: data.items ?? [], nextCursor: data.nextCursor ?? null };
}

export default function MediaPicker({ onSelect, onClose }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyPage = (page: MediaPage) => {
    setItems((current) => [...current, ...page.items]);
    setNextCursor(page.nextCursor);
    setLoading(false);
  };
  const applyError = (err: unknown) => {
    setError(err instanceof Error ? err.message : "Não foi possível carregar as imagens.");
    setLoading(false);
  };

  // Primeira página ao abrir a janela (o estado inicial já é "carregando")
  useEffect(() => {
    let active = true;
    fetchPage().then(
      (page) => active && applyPage(page),
      (err) => active && applyError(err),
    );
    return () => {
      active = false;
    };
  }, []);

  const loadMore = (cursor: string) => {
    setLoading(true);
    setError("");
    fetchPage(cursor).then(applyPage, applyError);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Escolher imagem da biblioteca" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 className="text-base font-semibold">Biblioteca de imagens</h2>
          <button type="button" onClick={onClose} className="text-sm font-medium text-muted hover:text-midnight_text">Fechar</button>
        </div>

        <div className="overflow-y-auto p-5">
          {error && <p role="alert" className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

          {!loading && !error && items.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">Nenhuma imagem enviada ainda.</p>
          )}

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => {
              const name = item.publicId.split("/").pop() ?? item.publicId;
              return (
                <li key={item.publicId}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.url)}
                    aria-label={`Usar ${name}`}
                    className="block w-full overflow-hidden rounded-lg border border-black/10 hover:border-primary focus:border-primary focus:outline-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cloudinaryUrl(item.url, 240)} alt="" loading="lazy" className="h-28 w-full bg-black/5 object-cover" />
                    <span className="block truncate px-2 py-1.5 text-left text-xs text-muted">{name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {loading && <p role="status" className="py-4 text-center text-sm text-muted">Carregando...</p>}
          {!loading && nextCursor && (
            <div className="mt-4 text-center">
              <button type="button" onClick={() => loadMore(nextCursor)} className={btnGhost}>Carregar mais</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
