/**
 * Caminho: src/components/Seo/JsonLd.tsx
 * Arquivo: JsonLd.tsx
 * Descrição: Coloca um ou mais blocos de dados estruturados (JSON-LD) na página, para os buscadores entenderem do que ela trata.
 */
import { serializeJsonLd, type JsonLdNode } from "@/lib/seo/schema";

export default function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }} />
      ))}
    </>
  );
}
