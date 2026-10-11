/**
 * Caminho: src/lib/services/save-service.ts
 * Arquivo: save-service.ts
 * Descrição: Caso de uso de salvar um serviço: valida, monta o link do WhatsApp com a mensagem e cria ou atualiza. Sem Next nem sessão, para ser testável.
 */
import { serviceInputSchema } from "@/lib/services/schema";
import { whatsappLink } from "@/lib/whatsapp";
import { createService, updateService } from "@/lib/repositories/admin-services";

export type SaveServiceResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

export async function saveService(id: string | null, raw: unknown): Promise<SaveServiceResult> {
  const parsed = serviceInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revise os campos destacados.", fieldErrors };
  }

  const { whatsappMessage, ...rest } = parsed.data;
  const data = { ...rest, whatsappLink: whatsappLink(whatsappMessage) };

  const saved = id ? await updateService(id, data) : await createService(data);
  return { ok: true, id: saved.id };
}
