/**
 * Caminho: src/app/(site)/blog/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de listagem do blog, com CTA de WhatsApp no final no lugar do banner de doação morto.
 */
import JsonLd from "@/components/Seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";
import React from "react";
import BlogList from "@/components/Blog/BlogList";
import HeroSub from "@/components/SharedComponent/HeroSub";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Blog de Terapia Tântrica e Autoconhecimento",
  description: "Artigos sobre Terapia Tântrica, autoconhecimento, relacionamentos e bem-estar, escritos por Deva Karuno. Busque por tema, categoria ou tag.",
  path: "/blog",
});

const BlogPage = () => {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />
      <HeroSub title="Blog" bgImage="/images/background/hero-blog.jpg" />
      <BlogList />
      <WhatsAppCTA />
    </>
  );
};

export default BlogPage;