/**
 * Caminho: src/components/Admin/Testimonials/TestimonialForm.tsx
 * Arquivo: TestimonialForm.tsx
 * Descrição: Formulário de depoimento (React Hook Form + Zod): nome do cliente, texto e destaque no carrossel da Home.
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialInputSchema, type TestimonialInput } from "@/lib/testimonials/schema";
import { saveTestimonialAction } from "@/app/admin/depoimentos/actions";
import { btnGhost, btnPrimary, card, errorText, input, label } from "../styles";

type Props = {
  // Id do depoimento ao editar; null ao criar
  testimonialId: string | null;
  initial: TestimonialInput;
};

export default function TestimonialForm({ testimonialId, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, setError, formState: { errors } } = useForm<TestimonialInput>({
    defaultValues: initial,
    resolver: zodResolver(testimonialInputSchema),
  });

  const submit = (values: TestimonialInput) => {
    setFormError("");
    start(async () => {
      const result = await saveTestimonialAction(testimonialId, values);
      if (result.ok) {
        router.push("/admin/depoimentos");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) =>
        setError(field as keyof TestimonialInput, { message }),
      );
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className={`${card} max-w-3xl space-y-5`}>
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <div>
        <label htmlFor="clientName" className={label}>Nome do cliente *</label>
        <input id="clientName" className={input} placeholder="Como aparece no site (pode ser só o primeiro nome)" {...register("clientName")} />
        {errors.clientName && <p className={errorText}>{errors.clientName.message}</p>}
      </div>

      <div>
        <label htmlFor="review" className={label}>Depoimento *</label>
        <textarea id="review" rows={7} className={input} {...register("review")} />
        {errors.review && <p className={errorText}>{errors.review.message}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("featured")} /> Destaque no carrossel da Home
      </label>
      <p className="-mt-3 text-xs text-muted">Sem destaque, o depoimento aparece na página Quem é o Karuno.</p>

      <div className="flex justify-end gap-3">
        <Link href="/admin/depoimentos" className={btnGhost}>Cancelar</Link>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
