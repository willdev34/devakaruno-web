/**
 * Caminho: src/components/Admin/Categories/CategoryForm.tsx
 * Arquivo: CategoryForm.tsx
 * Descrição: Formulário de categoria do blog (React Hook Form + Zod): nome, slug e descrição. O slug acompanha o nome ao criar e fica travado na edição.
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryInputSchema, type CategoryInput } from "@/lib/categories/schema";
import { slugify } from "@/lib/posts/utils";
import { saveCategoryAction } from "@/app/admin/categorias/actions";
import { btnGhost, btnPrimary, card, errorText, input, label } from "../styles";

type Props = {
  // Id da categoria ao editar; null ao criar
  categoryId: string | null;
  initial: CategoryInput;
};

export default function CategoryForm({ categoryId, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");
  const editing = categoryId !== null;
  // Ao criar, o slug acompanha o nome até a pessoa editar o slug
  const [slugTouched, setSlugTouched] = useState(editing);

  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<CategoryInput>({
    defaultValues: initial,
    resolver: zodResolver(categoryInputSchema),
  });

  const submit = (values: CategoryInput) => {
    setFormError("");
    start(async () => {
      const result = await saveCategoryAction(categoryId, values);
      if (result.ok) {
        router.push("/admin/categorias");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) => setError(field as keyof CategoryInput, { message }));
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className={`${card} max-w-2xl space-y-5`}>
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <div>
        <label htmlFor="name" className={label}>Nome *</label>
        <input
          id="name"
          className={input}
          placeholder="Ex: Autoconhecimento"
          {...register("name", {
            onChange: (event) => {
              if (!slugTouched) setValue("slug", slugify(event.target.value));
            },
          })}
        />
        {errors.name && <p className={errorText}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="slug" className={label}>Slug *</label>
        <input
          id="slug"
          readOnly={editing}
          className={`${input} ${editing ? "cursor-not-allowed opacity-70" : ""}`}
          {...register("slug", { onChange: () => setSlugTouched(true) })}
        />
        <p className="mt-1 text-xs text-muted">
          {editing ? "O endereço da categoria não muda depois de criada." : "Identificador da categoria, só letras minúsculas, números e hífen."}
        </p>
        {errors.slug && <p className={errorText}>{errors.slug.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className={label}>Descrição</label>
        <textarea id="description" rows={3} className={input} placeholder="Uma frase sobre os assuntos desta categoria (opcional)" {...register("description")} />
        {errors.description && <p className={errorText}>{errors.description.message}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/admin/categorias" className={btnGhost}>Cancelar</Link>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
