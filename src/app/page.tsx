import { pageMetadata } from "@/lib/seo/metadata";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo/site";
import React from 'react'
import { Metadata } from "next";
import Hero from '@/components/Home/Hero';
import Help from '@/components/Home/Help';
import Causes from '@/components/Home/Causes';
import FutureEvents from '@/components/Home/FutureEvents';
import Newsletter from '@/components/Home/NewsLetter';
import Testimonial from '@/components/Home/Testimonial';
import WhatsAppCTA from '@/components/Home/WhatsAppCTA';

// Home estática com revalidação a cada 60s, pois lê os serviços do banco via Prisma
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});
export default function Home() {
  return (
    <main>
      <Hero />
      <Help />
      <Causes />
      <FutureEvents />
      <Newsletter />
      <Testimonial />
      <WhatsAppCTA />
    </main>
  )
}