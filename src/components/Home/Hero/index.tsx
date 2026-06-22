"use client"
import Link from "next/link";
import Slider from "react-slick";
import { HerosectionData } from "./data";

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
        {HerosectionData.map((value) => (
          <div key={value.id} className="relative h-screen min-h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${value.image})` }}
            />
            <div className="absolute inset-0 flex items-center pt-20">
              <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <div className="max-w-xl" data-aos="fade-up">
                  <p className="text-secondary text-sm font-semibold tracking-widest uppercase mb-4">
                    Deva Karuno Terapias
                  </p>
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