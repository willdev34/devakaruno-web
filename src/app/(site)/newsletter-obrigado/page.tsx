/**
 * Caminho: src/app/(site)/newsletter-obrigado/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de confirmação exibida após a inscrição na Newsletter via formsubmit.co.
 */
import Link from "next/link";
import Logo from "@/components/Layout/Header/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscrição confirmada | Deva Karuno Terapias",
};

const NewsletterObrigadoPage = () => {
  return (
    <div className="pt-32 sm:pt-56 pb-20 px-4 bg-grey dark:bg-darkmode min-h-screen">
      <div className="container mx-auto max-w-25 overflow-hidden rounded-lg bg-white dark:bg-dark text-center px-8 py-14 sm:px-12 md:px-16">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-3xl font-semibold mb-4 text-midnight_text dark:text-white">
          Inscrição confirmada!
        </h1>
        <p className="text-dustGray dark:text-white/60 text-base mb-8">
          Obrigado por se inscrever na newsletter de Deva Karuno Terapias.
          Você vai receber um e-mail de boas-vindas em instantes, e em breve,
          conteúdos sobre autoconhecimento, relacionamentos e bem-estar.
        </p>
        <Link
          href="/"
          className="inline-block text-white bg-linear-to-r from-primary to-secondary px-7 py-4 rounded-sm hover:opacity-90 transition-opacity"
        >
          Voltar para o site
        </Link>
      </div>
    </div>
  );
};

export default NewsletterObrigadoPage;