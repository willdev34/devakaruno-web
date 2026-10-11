/**
 * Caminho: src/components/Admin/Posts/SeoFields.tsx
 * Arquivo: SeoFields.tsx
 * Descrição: Bloco de SEO do formulário de artigo: título e descrição para o Google (opcionais), contadores e prévia do resultado de busca.
 */
"use client";
import { useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import type { postInputSchema } from "@/lib/posts/schema";
import { SITE_URL } from "@/lib/seo/site";
import { DESCRIPTION_IDEAL, TITLE_IDEAL, toMetaDescription, truncateText } from "@/lib/seo/text";
import { card, cardTitle, errorText, input, label } from "../styles";

type FormValues = z.input<typeof postInputSchema>;

type Props = {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues, unknown, z.output<typeof postInputSchema>>;
  errors: FieldErrors<FormValues>;
};

// Contador que fica vermelho quando passa do tamanho que o Google costuma mostrar
function Counter({ length, ideal }: { length: number; ideal: number }) {
  return (
    <span className={`normal-case ${length > ideal ? "text-error" : ""}`}>
      ({length}/{ideal})
    </span>
  );
}

export default function SeoFields({ register, control, errors }: Props) {
  const [title, slug, excerpt, seoTitle, seoDescription] = useWatch({
    control,
    name: ["title", "slug", "excerpt", "seoTitle", "seoDescription"],
  });

  const shownTitle = truncateText(seoTitle || title || "Título do artigo", TITLE_IDEAL + 10);
  const shownDescription = seoDescription ? truncateText(seoDescription, DESCRIPTION_IDEAL + 10) : toMetaDescription(excerpt || "");
  const host = new URL(SITE_URL).host;

  return (
    <section className={card}>
      <h2 className={cardTitle}>SEO (Google)</h2>
      <p className="mb-4 text-xs text-muted">Opcional. Se deixar em branco, o Google usa o título e o resumo do artigo.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="seoTitle" className={label}>
            Título para o Google <Counter length={(seoTitle ?? "").length} ideal={TITLE_IDEAL} />
          </label>
          <input id="seoTitle" className={input} placeholder="Ideal: até 60 caracteres, com a palavra-chave no começo" {...register("seoTitle")} />
          {errors.seoTitle && <p className={errorText}>{errors.seoTitle.message}</p>}
        </div>
        <div>
          <label htmlFor="seoDescription" className={label}>
            Descrição para o Google <Counter length={(seoDescription ?? "").length} ideal={DESCRIPTION_IDEAL} />
          </label>
          <textarea id="seoDescription" rows={3} className={input} placeholder="Ideal: até 160 caracteres, convidando a pessoa a clicar" {...register("seoDescription")} />
          {errors.seoDescription && <p className={errorText}>{errors.seoDescription.message}</p>}
        </div>

        <div aria-label="Prévia no Google" className="rounded-lg border border-black/10 bg-white p-4">
          <p className="truncate text-xs text-[#4d5156]">{host} › blog › {slug || "url-do-artigo"}</p>
          <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{shownTitle} | Deva Karuno Terapias</p>
          <p className="mt-1 text-sm leading-snug text-[#4d5156]">{shownDescription || "O resumo do artigo aparece aqui."}</p>
        </div>
      </div>
    </section>
  );
}
