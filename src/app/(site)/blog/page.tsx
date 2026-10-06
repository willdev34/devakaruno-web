/**
 * Caminho: src/app/(site)/blog/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de listagem do blog, com CTA de WhatsApp no final no lugar do banner de doação morto.
 */
import React from "react";
import BlogList from "@/components/Blog/BlogList";
import HeroSub from "@/components/SharedComponent/HeroSub";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Deva Karuno Terapias",
};

const BlogPage = () => {
  return (
    <>
      <HeroSub title="Blog" bgImage="/images/background/hero-blog.jpg" />
      <BlogList />
      <WhatsAppCTA />
    </>
  );
};

export default BlogPage;