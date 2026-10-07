/**
 * Caminho: src/components/TerapiaTantrica/AnamneseCTA/index.tsx
 * Arquivo: index.tsx
 * Descrição: CTA final da página Terapia Tântrica. Abre o modal com a ficha de anamnese.
 */
"use client";
import { useState } from "react";
import AnamneseModal from "../AnamneseModal";

const AnamneseCTA = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-dark py-20 lg:py-28">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-5">
          Inicie seu atendimento
        </h2>
        <p className="text-white/70 text-base lg:max-w-60% mx-auto mb-8">
          Preencha a ficha de anamnese para que o atendimento seja pensado para o seu momento.
          Se preferir, fale direto no WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-block text-white text-base font-semibold bg-linear-to-r from-primary to-secondary px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-300"
        >
          Iniciar atendimento
        </button>
      </div>
      <AnamneseModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default AnamneseCTA;
