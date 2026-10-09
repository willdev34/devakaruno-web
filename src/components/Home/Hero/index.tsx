/**
 * Caminho: src/components/Home/Hero/index.tsx
 * Arquivo: index.tsx
 * Descrição: Hero da Home com carrossel de imagens do Cloudinary. No mobile a foto percorre da esquerda para a direita enquanto o slide está ativo.
 */
"use client"
import Link from "next/link";
import type { CSSProperties } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cloudinarySrcSet, cloudinaryUrl } from "@/lib/cloudinary";
import { HerosectionData } from "./data";

// Larguras geradas no Cloudinary; no mobile a foto é mostrada bem mais larga que a tela (recorte lateral)
const IMAGE_WIDTHS = [1280, 2000, 2800];

const Hero = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 6000,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  }

  return (
    <section className="relative">
      <Slider {...settings}>
        {HerosectionData.map((value, index) => (
          <div key={value.id} className="relative h-screen min-h-[600px]">
            {/* <img> comum: o Cloudinary já entrega a imagem otimizada e o object-position precisa ser animado */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cloudinaryUrl(value.image, 2000)}
              srcSet={cloudinarySrcSet(value.image, IMAGE_WIDTHS)}
              sizes="(max-width: 767px) 200vw, 100vw"
              alt={value.alt}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="hero-image absolute inset-0 h-full w-full object-cover md:object-center"
              style={
                {
                  "--pan-from": value.panFrom ?? "0%",
                  "--pan-to": value.panTo ?? "100%",
                } as CSSProperties
              }
            />
            <div className="absolute inset-0 flex items-center pt-20">
              <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <div className="max-w-xl" data-aos="fade-up">
                  <h1 className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
                    Encontre-se. Conecte-se. Transforme-se.
                  </h1>
                  <p className="text-white/80 text-lg mb-8">
                    Terapia Tântrica e Desenvolvimento Pessoal para quem busca profundidade real.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="https://wa.me/5521984121612"
                      target="_blank"
                      className="bg-primary text-white px-7 py-4 rounded-md font-semibold hover:bg-secondary transition-colors duration-300"
                    >
                      Agendar Sessão
                    </Link>
                    <Link
                      href="#sobre"
                      className="border border-white text-white px-7 py-4 rounded-md font-semibold hover:bg-white hover:text-midnight_text transition-colors duration-300"
                    >
                      Conhecer Mais
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;