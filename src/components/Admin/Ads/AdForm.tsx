/**
 * Caminho: src/components/Admin/Ads/AdForm.tsx
 * Arquivo: AdForm.tsx
 * Descrição: Formulário de banner publicitário (React Hook Form + Zod): nome interno, posição, imagem, link, texto alternativo, período opcional e ativo.
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AD_POSITIONS } from "@/lib/ads/positions";
import { adInputSchema, type AdInput } from "@/lib/ads/schema";
import { saveAdAction } from "@/app/admin/banners/actions";
import { uploadImageClient } from "@/lib/admin-upload-client";
import CoverUpload from "@/components/Admin/Posts/CoverUpload";
import { btnGhost, btnPrimary, card, cardTitle, errorText, input, label } from "../styles";

type Props = {
  // Id do banner ao editar; null ao criar
  adId: string | null;
  initial: AdInput;
};

const IMAGE_LABELS = {
  upload: "Enviar imagem do banner",
  file: "Arquivo do banner",
  url: "URL do banner",
  preview: "Prévia do banner",
};

const uploadBanner = (file: File) => uploadImageClient(file, "banners");

export default function AdForm({ adId, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, control, setError, watch, formState: { errors } } = useForm<AdInput>({
    defaultValues: initial,
    resolver: zodResolver(adInputSchema),
  });

  const position = watch("position");
  const hint = AD_POSITIONS.find((p) => p.value === position)?.hint;

  const submit = (values: AdInput) => {
    setFormError("");
    start(async () => {
      const result = await saveAdAction(adId, values);
      if (result.ok) {
        router.push("/admin/banners");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) => setError(field as keyof AdInput, { message }));
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="max-w-3xl space-y-6">
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>Banner</h2>

        <div>
          <label htmlFor="name" className={label}>Nome interno *</label>
          <input id="name" className={input} placeholder="Só para você identificar no painel" {...register("name")} />
          {errors.name && <p className={errorText}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="position" className={label}>Onde aparece *</label>
          <select id="position" className={input} {...register("position")}>
            {AD_POSITIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
          {errors.position && <p className={errorText}>{errors.position.message}</p>}
        </div>

        <div>
          <span className={label}>Imagem *</span>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <CoverUpload value={field.value} onChange={field.onChange} onUpload={uploadBanner} labels={IMAGE_LABELS} />
            )}
          />
          {errors.imageUrl && <p className={errorText}>{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label htmlFor="altText" className={label}>Texto alternativo *</label>
          <input id="altText" className={input} placeholder="Descreva o anúncio para quem usa leitor de tela" {...register("altText")} />
          {errors.altText && <p className={errorText}>{errors.altText.message}</p>}
        </div>

        <div>
          <label htmlFor="linkUrl" className={label}>Link do anunciante *</label>
          <input id="linkUrl" className={input} placeholder="https://..." {...register("linkUrl")} />
          {errors.linkUrl && <p className={errorText}>{errors.linkUrl.message}</p>}
        </div>
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>Período e situação</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startsAt" className={label}>Começa em</label>
            <input id="startsAt" type="date" className={input} {...register("startsAt")} />
            {errors.startsAt && <p className={errorText}>{errors.startsAt.message}</p>}
          </div>
          <div>
            <label htmlFor="endsAt" className={label}>Termina em</label>
            <input id="endsAt" type="date" className={input} {...register("endsAt")} />
            {errors.endsAt && <p className={errorText}>{errors.endsAt.message}</p>}
          </div>
        </div>
        <p className="-mt-2 text-xs text-muted">
          Deixe em branco para exibir sem prazo. O dia inicial e o final contam inteiros, no horário de Brasília.
        </p>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("active")} /> Banner ativo
        </label>
        <p className="-mt-3 text-xs text-muted">
          Se houver mais de um banner na mesma posição, aparece o primeiro da fila que estiver no ar.
        </p>
      </section>

      <div className="flex justify-end gap-3">
        <Link href="/admin/banners" className={btnGhost}>Cancelar</Link>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
