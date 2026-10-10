/**
 * Caminho: src/components/TerapiaTantrica/AnamneseModal/index.tsx
 * Arquivo: index.tsx
 * Descrição: Modal com a ficha de anamnese (Google Forms embutido), aviso de consentimento e atalho para o WhatsApp.
 */
"use client";
import { useEffect, useRef } from "react";
import { ANAMNESE_FORM_URL, ANAMNESE_WHATSAPP_MESSAGE } from "@/lib/anamnese";
import { whatsappLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/components/Providers/SiteSettingsProvider";

interface AnamneseModalProps {
  open: boolean;
  onClose: () => void;
}

const AnamneseModal = ({ open, onClose }: AnamneseModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const settings = useSiteSettings();

  // Sincroniza o estado "open" com o <dialog> nativo (Esc e foco ficam por conta do navegador)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Trava a rolagem da página enquanto o modal está aberto
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="anamnese-titulo"
      onClose={onClose}
      // Clique no fundo escurece o <dialog> em si: fecha apenas se o alvo for ele
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto h-[90dvh] w-[min(94vw,720px)] flex-col overflow-hidden rounded-xl bg-white p-0 text-midnight_text open:flex dark:bg-darkmode dark:text-white backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
        <h2 id="anamnese-titulo" className="text-xl font-semibold">
          Ficha de anamnese
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-md px-3 py-1 text-2xl leading-none hover:text-secondary"
        >
          ×
        </button>
      </div>

      <p className="bg-primary/10 px-5 py-3 text-sm text-dustGray dark:text-white/70">
        Esta ficha reúne informações de saúde e bem-estar. O preenchimento é voluntário e as
        respostas são usadas apenas para preparar o seu atendimento. Saiba mais na{" "}
        <a href="/politica-de-privacidade" className="text-primary underline hover:text-secondary">
          Política de Privacidade
        </a>
        .
      </p>

      {/* O formulário só carrega com o modal aberto */}
      {open && (
        <iframe
          src={ANAMNESE_FORM_URL}
          title="Ficha de anamnese"
          className="min-h-0 w-full flex-1 border-0"
        >
          Carregando…
        </iframe>
      )}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-black/10 px-5 py-3 text-sm sm:flex-row dark:border-white/10">
        <span className="text-dustGray dark:text-white/60">Prefere conversar antes de preencher?</span>
        <a
          href={whatsappLink(ANAMNESE_WHATSAPP_MESSAGE, settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:text-secondary"
        >
          Falar no WhatsApp
        </a>
      </div>
    </dialog>
  );
};

export default AnamneseModal;
