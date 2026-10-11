/**
 * Caminho: src/components/Admin/Posts/CoverUpload.tsx
 * Arquivo: CoverUpload.tsx
 * Descrição: Campo de imagem de capa: clique ou arraste para enviar, escolha da biblioteca ou cole uma URL. Mostra a prévia da imagem.
 */
"use client";
import { useRef, useState } from "react";
import MediaPicker from "../Media/MediaPicker";
import { input } from "../styles";

// Textos de acessibilidade; por padrão falam de "capa", e outros usos (ex.: banner) podem trocar
type Labels = { upload: string; file: string; url: string; preview: string };
const COVER_LABELS: Labels = {
  upload: "Enviar imagem de capa",
  file: "Arquivo da capa",
  url: "URL da capa",
  preview: "Prévia da capa",
};

type Props = {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  labels?: Partial<Labels>;
};

export default function CoverUpload({ value, onChange, onUpload, labels }: Props) {
  const text = { ...COVER_LABELS, ...labels };
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(false);

  const send = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await onUpload(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={text.upload}
        onClick={() => fileInput.current?.click()}
        onKeyDown={(event) => event.key === "Enter" && fileInput.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          send(event.dataTransfer.files[0]);
        }}
        className="cursor-pointer rounded-lg border border-dashed border-black/20 p-6 text-center text-sm hover:border-primary"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={text.preview} className="mx-auto mb-3 max-h-40 rounded-md object-cover" />
        ) : null}
        <p className="font-semibold">{busy ? "Enviando..." : "Clique ou arraste uma imagem"}</p>
        <p className="mt-1 text-xs text-muted">PNG, JPG, WebP até 10MB</p>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label={text.file}
          onChange={(event) => send(event.target.files?.[0])}
        />
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-error">{error}</p>}
      <button type="button" onClick={() => setPicking(true)} className="mt-3 text-sm font-medium text-primary hover:underline">
        Escolher da biblioteca
      </button>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onSelect={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-muted">ou cole a URL</span>
        <input
          aria-label={text.url}
          value={value}
          placeholder="https://..."
          className={input}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
