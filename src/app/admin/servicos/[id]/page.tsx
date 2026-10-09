/**
 * Caminho: src/app/admin/servicos/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de um serviço, com botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceForm from "@/components/Admin/Services/ServiceForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getService } from "@/lib/repositories/admin-services";
import { messageFromLink } from "@/lib/whatsapp";
import { deleteServiceAction } from "../actions";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getService(id);
  if (!item) notFound();

  return (
    <>
      <Link href="/admin/servicos" className="text-sm text-muted hover:text-primary">← Serviços</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar serviço</h1>
        <DeleteButton id={item.id} name={item.title} action={deleteServiceAction} redirectTo="/admin/servicos" />
      </div>
      <ServiceForm
        serviceId={item.id}
        initial={{
          title: item.title,
          text: item.text,
          icon: item.icon,
          // O link guardado traz a mensagem no parâmetro text
          whatsappMessage: messageFromLink(item.whatsappLink),
        }}
      />
    </>
  );
}
