/**
 * Caminho: src/app/opengraph-image.tsx
 * Arquivo: opengraph-image.tsx
 * Descrição: Imagem padrão de compartilhamento (1200x630) usada nas páginas sem imagem própria: nome da marca e o que ela oferece.
 */
import { ImageResponse } from "next/og";
import { OG_SIZE, PERSON_NAME } from "@/lib/seo/site";

export const alt = "Deva Karuno Terapias";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          color: "white",
          background: "linear-gradient(135deg, #1B4B62 0%, #1C6B78 55%, #26A88C 100%)",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.85 }}>Terapias</div>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, marginTop: 12 }}>{PERSON_NAME}</div>
        <div style={{ fontSize: 40, marginTop: 28, opacity: 0.95 }}>Terapia Tântrica, cursos e vivências</div>
        <div style={{ fontSize: 30, marginTop: 14, opacity: 0.8 }}>Autoconhecimento e bem-estar no Rio de Janeiro</div>
      </div>
    ),
    { ...size },
  );
}
