/**
 * Caminho: src/components/Admin/Posts/PostForm.tsx
 * Arquivo: PostForm.tsx
 * Descrição: Formulário de artigo do admin (React Hook Form + Zod): título, subtítulo, slug, resumo, editor, capa, tags, SEO e publicação (agora, agendar ou rascunho).
 */
"use client";
import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { postInputSchema, type PostInput } from "@/lib/posts/schema";
import { slugify } from "@/lib/posts/utils";
import { uploadImageClient } from "@/lib/admin-upload-client";
import { savePostAction } from "@/app/admin/artigos/actions";
import RichEditor from "../Editor/RichEditor";
import CoverUpload from "./CoverUpload";
import SeoFields from "./SeoFields";
import TagsInput from "./TagsInput";
import { btnGhost, btnOutline, btnPrimary, card, cardTitle, errorText, input, label } from "../styles";

type FormValues = z.input<typeof postInputSchema>;

type Props = {
  // Id do artigo ao editar; null ao criar
  postId: string | null;
  initial: FormValues;
  // Categorias disponíveis para o seletor
  categories: { id: string; name: string }[];
};

// "2026-11-01T10:00" (hora local do campo) -> ISO com fuso, e o inverso
const toIso = (local: string) => (local ? new Date(local).toISOString() : "");
const toLocalInput = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function PostForm({ postId, initial, categories }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");
  // Slug acompanha o título até a pessoa editar o slug (ou se o artigo já existe)
  const [slugTouched, setSlugTouched] = useState(postId !== null);
  // "draft" valida só o básico; "publish" exige tudo conforme o modo escolhido
  const intent = useRef<"draft" | "publish">("publish");

  const form = useForm<FormValues, unknown, PostInput>({
    defaultValues: initial,
    resolver: ((values, context, options) =>
      zodResolver(postInputSchema)(
        intent.current === "draft" ? { ...values, mode: "draft" } : values,
        context,
        options,
      )) as Resolver<FormValues, unknown, PostInput>,
  });
  const { register, control, handleSubmit, setValue, setError, formState: { errors } } = form;
  const mode = useWatch({ control, name: "mode" });
  const excerptLength = (useWatch({ control, name: "excerpt" }) ?? "").length;

  const submit = (values: PostInput) => {
    const payload = intent.current === "draft" ? { ...values, mode: "draft" as const } : values;
    start(async () => {
      const result = await savePostAction(postId, payload);
      if (result.ok) {
        router.push("/admin/artigos");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors ?? {}).forEach(([field, message]) =>
        setError(field as keyof FormValues, { message }),
      );
    });
  };

  const send = (kind: "draft" | "publish") => {
    intent.current = kind;
    setFormError("");
    return handleSubmit(submit)();
  };

  const submitLabel = mode === "schedule" ? "Agendar artigo" : "Publicar artigo";

  return (
    <form onSubmit={(event) => { event.preventDefault(); send("publish"); }} noValidate className="space-y-6">
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${card} lg:col-span-3`}>
          <h2 className={cardTitle}>Informações principais</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className={label}>Título *</label>
              <input
                id="title"
                className={input}
                placeholder="Título do artigo"
                {...register("title", {
                  onChange: (event) => {
                    if (!slugTouched) setValue("slug", slugify(event.target.value));
                  },
                })}
              />
              {errors.title && <p className={errorText}>{errors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="subtitle" className={label}>Subtítulo</label>
              <input id="subtitle" className={input} placeholder="Uma frase que complementa o título" {...register("subtitle")} />
              {errors.subtitle && <p className={errorText}>{errors.subtitle.message}</p>}
            </div>
            <div>
              <label htmlFor="slug" className={label}>Slug *</label>
              <input
                id="slug"
                className={input}
                placeholder="url-do-artigo"
                {...register("slug", { onChange: () => setSlugTouched(true) })}
              />
              {errors.slug && <p className={errorText}>{errors.slug.message}</p>}
            </div>
            <div>
              <label htmlFor="excerpt" className={label}>Resumo * <span className="normal-case">({excerptLength}/300)</span></label>
              <textarea id="excerpt" rows={3} className={input} placeholder="Resumo que aparece na listagem e no Google" {...register("excerpt")} />
              {errors.excerpt && <p className={errorText}>{errors.excerpt.message}</p>}
            </div>
            <div>
              <span className={label}>Conteúdo *</span>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <RichEditor value={field.value} onChange={field.onChange} onUploadImage={uploadImageClient} />
                )}
              />
              {errors.content && <p className={errorText}>{errors.content.message}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("featured")} /> Artigo em destaque (aparece primeiro no blog)
            </label>
          </div>
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className={card}>
            <h2 className={cardTitle}>Publicação</h2>
            <div className="space-y-3">
              <label className={`block cursor-pointer rounded-lg border p-3 text-sm ${mode !== "schedule" ? "border-primary bg-primary/5" : "border-black/10"}`}>
                <input type="radio" value="now" className="mr-2" {...register("mode")} />
                <strong>Publicar agora</strong>
                <span className="mt-1 block text-xs text-muted">O artigo fica visível em /blog assim que for salvo.</span>
              </label>
              <label className={`block cursor-pointer rounded-lg border p-3 text-sm ${mode === "schedule" ? "border-primary bg-primary/5" : "border-black/10"}`}>
                <input type="radio" value="schedule" className="mr-2" {...register("mode")} />
                <strong>Agendar</strong>
                <span className="mt-1 block text-xs text-muted">Publicado automaticamente na data e hora escolhidas.</span>
              </label>
              {mode === "schedule" && (
                <div>
                  <label htmlFor="scheduledAt" className={label}>Data e hora</label>
                  <Controller
                    control={control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <input
                        id="scheduledAt"
                        type="datetime-local"
                        className={input}
                        value={toLocalInput(field.value)}
                        onChange={(event) => field.onChange(toIso(event.target.value))}
                      />
                    )}
                  />
                  {errors.scheduledAt && <p className={errorText}>{errors.scheduledAt.message}</p>}
                </div>
              )}
            </div>
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Categoria</h2>
            <label htmlFor="categoryId" className={label}>Categoria do artigo</label>
            <select id="categoryId" className={input} {...register("categoryId")}>
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className={errorText}>{errors.categoryId.message}</p>}
            {categories.length === 0 && (
              <p className="mt-2 text-xs text-muted">
                Nenhuma categoria ainda. <Link href="/admin/categorias/novo" className="text-primary hover:underline">Criar categoria</Link>
              </p>
            )}
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Mídia e tags</h2>
            <span className={label}>Imagem de capa *</span>
            <Controller
              control={control}
              name="coverImage"
              render={({ field }) => <CoverUpload value={field.value} onChange={field.onChange} onUpload={uploadImageClient} />}
            />
            {errors.coverImage && <p className={errorText}>{errors.coverImage.message}</p>}
            <span className={`${label} mt-6`}>Tags</span>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => <TagsInput value={field.value} onChange={field.onChange} />}
            />
            {errors.tags && <p className={errorText}>{errors.tags.message as string}</p>}
          </section>

          <SeoFields register={register} control={control} errors={errors} />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Link href="/admin/artigos" className={btnGhost}>Cancelar</Link>
        <button type="button" disabled={pending} onClick={() => send("draft")} className={btnOutline}>Salvar rascunho</button>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : submitLabel}</button>
      </div>
    </form>
  );
}
