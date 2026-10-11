/**
 * Caminho: src/components/Admin/Courses/CourseForm.tsx
 * Arquivo: CourseForm.tsx
 * Descrição: Formulário de curso (React Hook Form + Zod): dados do curso, ícone, imagem de fundo, mensagem do WhatsApp e FAQs. O slug só é editável ao criar.
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseInputSchema, type CourseInput } from "@/lib/courses/schema";
import { ICON_OPTIONS } from "@/lib/courses/icons";
import { slugify } from "@/lib/posts/utils";
import { uploadImageClient } from "@/lib/admin-upload-client";
import { saveCourseAction } from "@/app/admin/cursos/actions";
import CoverUpload from "../Posts/CoverUpload";
import FaqFields from "./FaqFields";
import { btnGhost, btnPrimary, card, cardTitle, errorText, input, label } from "../styles";

type Props = {
  // Id do curso ao editar; null ao criar
  courseId: string | null;
  initial: CourseInput;
};

// Imagem de fundo vai para a subpasta "cursos" do Cloudinary
const uploadBackground = (file: File) => uploadImageClient(file, "cursos");

export default function CourseForm({ courseId, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");
  const editing = courseId !== null;
  // Ao criar, o slug acompanha o título até a pessoa editar o slug
  const [slugTouched, setSlugTouched] = useState(editing);

  const { register, control, handleSubmit, setValue, setError, formState: { errors } } = useForm<CourseInput>({
    defaultValues: initial,
    resolver: zodResolver(courseInputSchema),
  });

  // Ícone atual entra na lista mesmo que não seja um dos padrões
  const icons = ICON_OPTIONS.some((option) => option.value === initial.icon) || !initial.icon
    ? [...ICON_OPTIONS]
    : [...ICON_OPTIONS, { value: initial.icon, label: "Atual" }];

  const submit = (values: CourseInput) => {
    setFormError("");
    start(async () => {
      const result = await saveCourseAction(courseId, values);
      if (result.ok) {
        router.push("/admin/cursos");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) => setError(field as keyof CourseInput, { message }));
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="max-w-3xl space-y-6">
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>Dados do curso</h2>

        <div>
          <label htmlFor="title" className={label}>Título *</label>
          <input
            id="title"
            className={input}
            {...register("title", {
              onChange: (event) => {
                if (!slugTouched) setValue("slug", slugify(event.target.value));
              },
            })}
          />
          {errors.title && <p className={errorText}>{errors.title.message}</p>}
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
            {editing ? "O endereço do curso não muda depois de criado." : "Endereço do curso no site: /cursos-e-vivencias/slug"}
          </p>
          {errors.slug && <p className={errorText}>{errors.slug.message}</p>}
        </div>

        <div>
          <label htmlFor="text" className={label}>Texto do card *</label>
          <textarea id="text" rows={3} className={input} {...register("text")} />
          {errors.text && <p className={errorText}>{errors.text.message}</p>}
        </div>

        <div>
          <label htmlFor="detail" className={label}>Descrição completa *</label>
          <textarea id="detail" rows={7} className={input} {...register("detail")} />
          {errors.detail && <p className={errorText}>{errors.detail.message}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="modalidade" className={label}>Modalidade *</label>
            <input id="modalidade" className={input} placeholder="Individual, Casal, Grupo" {...register("modalidade")} />
            {errors.modalidade && <p className={errorText}>{errors.modalidade.message}</p>}
          </div>
          <div>
            <label htmlFor="duracao" className={label}>Duração *</label>
            <input id="duracao" className={input} placeholder="Até 4 horas" {...register("duracao")} />
            {errors.duracao && <p className={errorText}>{errors.duracao.message}</p>}
          </div>
          <div>
            <label htmlFor="price" className={label}>Investimento *</label>
            <input id="price" className={input} placeholder="R$ 1.100" {...register("price")} />
            {errors.price && <p className={errorText}>{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="local" className={label}>Local *</label>
          <input id="local" className={input} {...register("local")} />
          {errors.local && <p className={errorText}>{errors.local.message}</p>}
        </div>
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>Aparência e contato</h2>

        <div>
          <label htmlFor="icon" className={label}>Ícone *</label>
          <select id="icon" className={input} {...register("icon")}>
            {icons.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.icon && <p className={errorText}>{errors.icon.message}</p>}
        </div>

        <div>
          <span className={label}>Imagem de fundo *</span>
          <Controller
            name="bgImage"
            control={control}
            render={({ field }) => <CoverUpload value={field.value} onChange={field.onChange} onUpload={uploadBackground} />}
          />
          {errors.bgImage && <p className={errorText}>{errors.bgImage.message}</p>}
        </div>

        <div>
          <label htmlFor="whatsappMessage" className={label}>Mensagem do WhatsApp *</label>
          <textarea id="whatsappMessage" rows={3} className={input} {...register("whatsappMessage")} />
          <p className="mt-1 text-xs text-muted">O botão do curso abre o WhatsApp com esta mensagem pronta.</p>
          {errors.whatsappMessage && <p className={errorText}>{errors.whatsappMessage.message}</p>}
        </div>
      </section>

      <section className={card}>
        <h2 className={cardTitle}>Perguntas frequentes</h2>
        <FaqFields control={control} register={register} errors={errors} />
      </section>

      <div className="flex justify-end gap-3">
        <Link href="/admin/cursos" className={btnGhost}>Cancelar</Link>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
