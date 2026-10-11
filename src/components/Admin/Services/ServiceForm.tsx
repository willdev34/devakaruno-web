/**
 * Caminho: src/components/Admin/Services/ServiceForm.tsx
 * Arquivo: ServiceForm.tsx
 * Descrição: Formulário de serviço da Home (React Hook Form + Zod): título, texto do card, ícone e mensagem do WhatsApp.
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceInputSchema, type ServiceInput } from "@/lib/services/schema";
import { ICON_OPTIONS } from "@/lib/courses/icons";
import { saveServiceAction } from "@/app/admin/servicos/actions";
import { btnGhost, btnPrimary, card, errorText, input, label } from "../styles";

type Props = {
  // Id do serviço ao editar; null ao criar
  serviceId: string | null;
  initial: ServiceInput;
};

export default function ServiceForm({ serviceId, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ServiceInput>({
    defaultValues: initial,
    resolver: zodResolver(serviceInputSchema),
  });

  // Ícone atual entra na lista mesmo que não seja um dos padrões
  const icons = ICON_OPTIONS.some((option) => option.value === initial.icon) || !initial.icon
    ? [...ICON_OPTIONS]
    : [...ICON_OPTIONS, { value: initial.icon, label: "Atual" }];

  const submit = (values: ServiceInput) => {
    setFormError("");
    start(async () => {
      const result = await saveServiceAction(serviceId, values);
      if (result.ok) {
        router.push("/admin/servicos");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) => setError(field as keyof ServiceInput, { message }));
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className={`${card} max-w-3xl space-y-5`}>
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <div>
        <label htmlFor="title" className={label}>Título *</label>
        <input id="title" className={input} {...register("title")} />
        {errors.title && <p className={errorText}>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="text" className={label}>Texto do card *</label>
        <textarea id="text" rows={4} className={input} {...register("text")} />
        {errors.text && <p className={errorText}>{errors.text.message}</p>}
      </div>

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
        <label htmlFor="whatsappMessage" className={label}>Mensagem do WhatsApp *</label>
        <textarea id="whatsappMessage" rows={3} className={input} {...register("whatsappMessage")} />
        <p className="mt-1 text-xs text-muted">Ao clicar no card, o WhatsApp abre com esta mensagem pronta.</p>
        {errors.whatsappMessage && <p className={errorText}>{errors.whatsappMessage.message}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/admin/servicos" className={btnGhost}>Cancelar</Link>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
