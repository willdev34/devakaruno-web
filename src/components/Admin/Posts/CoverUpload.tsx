/**
 * Caminho: src/components/Admin/Posts/CoverUpload.tsx
 * Arquivo: CoverUpload.tsx
 * Descrição: Campo de imagem de capa: clique ou arraste para enviar, ou cole uma URL. Mostra a prévia da imagem.
 */
"use client";
import { useRef, useState } from "react";
import { input } from "../styles";

type Props = {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
};

export default function CoverUpload({ value, onChange, onUpload }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
        aria-label="Enviar imagem de capa"
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
          <img src={value} alt="Prévia da capa" className="mx-auto mb-3 max-h-40 rounded-md object-cover" />
        ) : null}
        <p className="font-semibold">{busy ? "Enviando..." : "Clique ou arraste uma imagem"}</p>
        <p className="mt-1 text-xs text-muted">PNG, JPG, WebP até 10MB</p>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label="Arquivo da capa"
          onChange={(event) => send(event.target.files?.[0])}
        />
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-error">{error}</p>}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-muted">ou cole a URL</span>
        <input
          aria-label="URL da capa"
          value={value}
          placeholder="https://..."
          className={input}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
