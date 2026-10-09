/**
 * Caminho: src/lib/admin-upload-client.ts
 * Arquivo: admin-upload-client.ts
 * Descrição: Envia uma imagem do navegador para /api/admin/upload e devolve a URL. Lança erro com a mensagem do servidor.
 */
// folder escolhe a subpasta no Cloudinary (padrão: blog)
export async function uploadImageClient(file: File, folder?: "blog" | "cursos"): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  if (folder) body.set("folder", folder);

  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!response.ok || !data.url) throw new Error(data.error ?? "Não foi possível enviar a imagem.");
  return data.url;
}
