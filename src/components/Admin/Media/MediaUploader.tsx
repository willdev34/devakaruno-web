/**
 * Caminho: src/components/Admin/Media/MediaUploader.tsx
 * Arquivo: MediaUploader.tsx
 * Descrição: Envio de várias imagens de uma vez para a biblioteca (pasta "biblioteca"). Mostra o andamento e os erros por arquivo.
 */
"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImageClient } from "@/lib/admin-upload-client";

export default function MediaUploader() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const send = async (files: File[]) => {
    if (files.length === 0) return;
    setBusy(true);
    setErrors([]);
    const failed: string[] = [];
    // Um por vez: respeita o limite do Cloudinary e dá para mostrar qual falhou
    for (const [index, file] of files.entries()) {
      setStatus(`Enviando ${index + 1} de ${files.length}...`);
      try {
        await uploadImageClient(file, "biblioteca");
      } catch (error) {
        failed.push(`${file.name}: ${error instanceof Error ? error.message : "falhou"}`);
      }
    }
    setBusy(false);
    setErrors(failed);
    setStatus(failed.length < files.length ? `${files.length - failed.length} imagem(ns) enviada(s).` : "");
    if (fileInput.current) fileInput.current.value = "";
    // A listagem do Cloudinary pode levar um instante; o refresh traz o que já estiver disponível
    router.refresh();
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Enviar imagens"
        onClick={() => fileInput.current?.click()}
        onKeyDown={(event) => event.key === "Enter" && fileInput.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          send(Array.from(event.dataTransfer.files));
        }}
        className="cursor-pointer rounded-lg border border-dashed border-black/20 bg-white p-6 text-center text-sm hover:border-primary"
      >
        <p className="font-semibold">{busy ? status : "Clique ou arraste imagens para enviar"}</p>
        <p className="mt-1 text-xs text-muted">PNG, JPG, WebP até 10MB cada. Pode escolher várias.</p>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label="Arquivos de imagem"
          onChange={(event) => send(Array.from(event.target.files ?? []))}
        />
      </div>
      {!busy && status && <p role="status" className="mt-2 text-sm text-primary">{status}</p>}
      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-1 text-xs text-error">
          {errors.map((message) => <li key={message}>{message}</li>)}
        </ul>
      )}
    </div>
  );
}
