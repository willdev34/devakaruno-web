/**
 * Caminho: src/components/Admin/Agenda/AgendaForm.tsx
 * Arquivo: AgendaForm.tsx
 * Descrição: Formulário de atendimento em outra cidade (React Hook Form + Zod): cidade, UF, local, endereço, período, observação e visibilidade no site.
 */
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agendaInputSchema, type AgendaInput } from "@/lib/agenda/schema";
import { saveAgendaAction } from "@/app/admin/agenda/actions";
import { btnGhost, btnPrimary, card, errorText, input, label } from "../styles";

type Props = {
  // Id do atendimento ao editar; null ao criar
  eventId: string | null;
  initial: AgendaInput;
};

export default function AgendaForm({ eventId, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, setError, getValues, setValue, formState: { errors } } = useForm<AgendaInput>({
    defaultValues: initial,
    resolver: zodResolver(agendaInputSchema),
  });

  const submit = (values: AgendaInput) => {
    setFormError("");
    start(async () => {
      const result = await saveAgendaAction(eventId, values);
      if (result.ok) {
        router.push("/admin/agenda");
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) => setError(field as keyof AgendaInput, { message }));
    });
  };

  // Ao escolher o início, o fim acompanha se ainda estiver vazio ou antes do início
  const syncEndDate = (start: string) => {
    const end = getValues("endDate");
    if (!end || end < start) setValue("endDate", start);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className={`${card} max-w-3xl space-y-5`}>
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}

      <div className="grid gap-5 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <label htmlFor="city" className={label}>Cidade *</label>
          <input id="city" className={input} placeholder="Ex: São Paulo" {...register("city")} />
          {errors.city && <p className={errorText}>{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor="state" className={label}>UF</label>
          <input id="state" maxLength={2} className={`${input} uppercase`} placeholder="SP" {...register("state")} />
          {errors.state && <p className={errorText}>{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className={label}>Data inicial *</label>
          <input
            id="startDate"
            type="date"
            className={input}
            {...register("startDate", { onChange: (event) => syncEndDate(event.target.value) })}
          />
          {errors.startDate && <p className={errorText}>{errors.startDate.message}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className={label}>Data final *</label>
          <input id="endDate" type="date" className={input} {...register("endDate")} />
          {errors.endDate && <p className={errorText}>{errors.endDate.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="venue" className={label}>Local de atendimento *</label>
        <input id="venue" className={input} placeholder="Nome do espaço ou clínica" {...register("venue")} />
        {errors.venue && <p className={errorText}>{errors.venue.message}</p>}
      </div>

      <div>
        <label htmlFor="address" className={label}>Endereço</label>
        <input id="address" className={input} placeholder="Rua, número, bairro" {...register("address")} />
        {errors.address && <p className={errorText}>{errors.address.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className={label}>Observação para quem visita a agenda</label>
        <textarea id="description" rows={3} className={input} placeholder="Ex: horários disponíveis, formato do atendimento..." {...register("description")} />
        {errors.description && <p className={errorText}>{errors.description.message}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("published")} /> Visível na página Agenda do site
      </label>

      <div className="flex justify-end gap-3">
        <Link href="/admin/agenda" className={btnGhost}>Cancelar</Link>
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
