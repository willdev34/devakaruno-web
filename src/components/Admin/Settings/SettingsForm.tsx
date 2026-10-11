/**
 * Caminho: src/components/Admin/Settings/SettingsForm.tsx
 * Arquivo: SettingsForm.tsx
 * Descrição: Formulário das configurações gerais do site (React Hook Form + Zod): WhatsApp e contato, redes sociais e códigos de rastreamento.
 */
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettingsData } from "@/lib/settings/schema";
import { saveSettingsAction } from "@/app/admin/configuracoes/actions";
import { btnPrimary, card, cardTitle, errorText, input, label } from "../styles";

type FieldProps = {
  id: keyof SiteSettingsData;
  title: string;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
};

export default function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<SiteSettingsData>({
    defaultValues: initial,
    resolver: zodResolver(siteSettingsSchema),
  });

  const submit = (values: SiteSettingsData) => {
    setFormError("");
    setSaved(false);
    start(async () => {
      const result = await saveSettingsAction(values);
      if (result.ok) {
        setSaved(true);
        router.refresh();
        return;
      }
      setFormError(result.error);
      Object.entries(result.fieldErrors).forEach(([field, message]) =>
        setError(field as keyof SiteSettingsData, { message }),
      );
    });
  };

  // Campo de texto com rótulo, dica e erro
  const field = ({ id, title, hint, placeholder, multiline }: FieldProps) => (
    <div key={id}>
      <label htmlFor={id} className={label}>{title}</label>
      {multiline ? (
        <textarea id={id} rows={3} className={input} placeholder={placeholder} {...register(id)} />
      ) : (
        <input id={id} className={input} placeholder={placeholder} {...register(id)} />
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {errors[id] && <p className={errorText}>{errors[id]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="max-w-3xl space-y-6">
      {formError && <p role="alert" className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>}
      {saved && <p role="status" className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">Configurações salvas. O site atualiza em instantes.</p>}

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>WhatsApp e contato</h2>
        {field({ id: "whatsappNumber", title: "Número do WhatsApp *", placeholder: "5521999999999", hint: "Com DDI (55) e DDD, só números. Vale para todos os botões de WhatsApp do site, inclusive cursos, serviços e agenda." })}
        {field({ id: "whatsappMessage", title: "Mensagem inicial *", multiline: true, hint: "Texto que já vem preenchido nos botões gerais de agendamento (topo, rodapé e chamadas da Home)." })}
        {field({ id: "email", title: "E-mail de contato *" })}
        {field({ id: "address", title: "Endereço exibido no rodapé *" })}
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>Redes sociais</h2>
        <p className="-mt-2 text-xs text-muted">Deixe em branco para esconder o ícone da rede no rodapé.</p>
        {field({ id: "instagramUrl", title: "Instagram", placeholder: "https://www.instagram.com/..." })}
        {field({ id: "facebookUrl", title: "Facebook", placeholder: "https://www.facebook.com/..." })}
        {field({ id: "xUrl", title: "X (Twitter)", placeholder: "https://x.com/..." })}
        {field({ id: "tiktokUrl", title: "TikTok", placeholder: "https://www.tiktok.com/@..." })}
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className={cardTitle}>Rastreamento e verificação</h2>
        <p className="-mt-2 text-xs text-muted">
          Deixe em branco para não carregar. Só preencha quando for usar, e lembre de citar esses serviços na Política de Privacidade.
        </p>
        {field({ id: "gtmId", title: "Google Tag Manager", placeholder: "GTM-XXXXXXX" })}
        {field({ id: "gaId", title: "Google Analytics 4", placeholder: "G-XXXXXXXXXX", hint: "Se você já mede o GA4 pelo Tag Manager, deixe este vazio para não contar duas vezes." })}
        {field({ id: "metaPixelId", title: "Meta Pixel", placeholder: "Só números" })}
        {field({ id: "searchConsoleCode", title: "Search Console (verificação)", hint: "No método \"Tag HTML\" do Search Console, cole só o código que aparece depois de content=." })}
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
