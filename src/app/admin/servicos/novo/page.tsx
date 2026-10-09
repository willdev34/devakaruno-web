/**
 * Caminho: src/app/admin/servicos/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de novo serviço do admin, com ícone padrão e mensagem de WhatsApp inicial.
 */
import Link from "next/link";
import ServiceForm from "@/components/Admin/Services/ServiceForm";
import { ICON_OPTIONS } from "@/lib/courses/icons";

export default function NewServicePage() {
  return (
    <>
      <Link href="/admin/servicos" className="text-sm text-muted hover:text-primary">← Serviços</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Novo serviço</h1>
      <ServiceForm
        serviceId={null}
        initial={{
          title: "",
          text: "",
          icon: ICON_OPTIONS[0].value,
          whatsappMessage: "Olá! Vi o site da Deva Karuno Terapias e gostaria de saber mais sobre ",
        }}
      />
    </>
  );
}
