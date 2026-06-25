/**
 * Caminho: src/components/Layout/Footer/index.tsx
 * Arquivo: index.tsx
 * Descrição: Rodapé do site, com dados reais de contato, navegação e redes sociais da Deva Karuno Terapias.
 */
import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../Header/Logo";
import { Icon } from "@iconify/react/dist/iconify.js";

const WHATSAPP_LINK = "https://wa.me/5521984121612?text=Ol%C3%A1%21%20Vi%20o%20site%20da%20Deva%20Karuno%20Terapias%20e%20gostaria%20de%20agendar%20uma%20sess%C3%A3o.";

const Footer: FC = () => {
  return (
    <footer className="pt-16 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 pb-10">
          <div className="lg:col-span-4 col-span-12">
            <Logo />
            <p className="text-base font-normal text-dustGray dark:text-white/60 mt-6">
              Encontre-se. Conecte-se. Transforme-se.
            </p>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="flex items-start mb-6 gap-4">
              <Image src="/images/icons/icon-pin.svg" alt="icon" width={24} height={24} />
              <p className="text-base text-dustGray dark:text-white/60">
                Centro, Rio de Janeiro - RJ
              </p>
            </div>
            <div className="flex items-center mb-6 gap-4">
              <Image src="/images/icons/icon-phone.svg" alt="icon" width={24} height={24} />
              <Link href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-base text-dustGray dark:text-white/60 hover:text-primary">
                Agendar pelo WhatsApp
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/images/icons/icon-mail.svg" alt="icon" width={24} height={24} />
              <Link href="mailto:karunodeva@gmail.com" className="text-base text-dustGray dark:text-white/60 hover:text-primary">
                karunodeva@gmail.com
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 col-span-12">
            <h4 className="font-body text-sm font-semibold uppercase tracking-wide text-black dark:text-white mb-4">Navegação</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-base text-dustGray dark:text-white/60 hover:text-primary">Home</Link></li>
              <li><Link href="/#servicos" className="text-base text-dustGray dark:text-white/60 hover:text-primary">Serviços</Link></li>
              <li><Link href="/#cursos" className="text-base text-dustGray dark:text-white/60 hover:text-primary">Cursos e Vivências</Link></li>
              <li><Link href="/blog" className="text-base text-dustGray dark:text-white/60 hover:text-primary">Blog</Link></li>
              <li><Link href="/quem-e-o-karuno" className="text-base text-dustGray dark:text-white/60 hover:text-primary">Quem é o Karuno</Link></li>
              <li><Link href="/contato" className="text-base text-dustGray dark:text-white/60 hover:text-primary">Contato</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border dark:border-dark_border">
        <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4 flex items-center justify-between py-6 lg:flex-nowrap flex-wrap lg:gap-0 gap-4">
          <p className="text-base text-dustGray dark:text-white">
            © {new Date().getFullYear()} Deva Karuno Terapias. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="https://www.facebook.com/devakarunoterapias/" target="_blank" rel="noopener noreferrer">
              <Icon icon="ri:facebook-fill" className="text-xl text-midnight_text dark:text-white hover:text-primary! cursor-pointer" />
            </Link>
            <Link href="https://www.instagram.com/devakarunoterapias/" target="_blank" rel="noopener noreferrer">
              <Icon icon="mdi:instagram" className="text-xl text-midnight_text dark:text-white hover:text-primary! cursor-pointer" />
            </Link>
            <Link href="https://x.com/devakaruno" target="_blank" rel="noopener noreferrer">
              <Icon icon="line-md:twitter-x-alt" className="text-base text-midnight_text dark:text-white hover:text-primary! cursor-pointer" />
            </Link>
            <Link href="https://www.tiktok.com/@deva.karuno" target="_blank" rel="noopener noreferrer">
              <Icon icon="ri:tiktok-fill" className="text-xl text-midnight_text dark:text-white hover:text-primary! cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;