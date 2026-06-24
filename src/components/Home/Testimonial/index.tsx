/**
 * Caminho: src/components/Home/Testimonial/index.tsx
 * Arquivo: index.tsx
 * Descrição: Bloco de Depoimentos da Home, com avaliações reais de clientes (sem foto, sem cargo fictício).
 */
"use client"
import { Reviews } from "@/app/api/data";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonial = () => {
    const settings = {
        autoplay: true,
        dots: true,
        arrows: false,
        infinite: true,
        speed: 100,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <h2 className="text-3xl font-medium mb-3 text-center">
                    O que dizem as pessoas que já passaram por aqui
                </h2>
                <p className="text-base text-center text-dustGray dark:text-white/60 lg:max-w-60% mx-auto">
                Depoimentos reais de quem viveu o processo terapêutico de perto.
                </p>
                <div className="mt-20">
                    <Slider {...settings}>
                        {Reviews.map((item, index) => (
                            <div key={index} className="px-3" data-aos="fade-up" data-aos-delay={`${index * 180}`}>
                                <div className="bg-white dark:bg-dark p-10 rounded-md h-full flex flex-col justify-between min-h-[260px]">
                                    <p className="font-heading italic text-lg text-dustGray dark:text-white/70 leading-relaxed">
                                        "{item.review}"
                                    </p>
                                    <h5 className="text-base font-medium mt-8 pt-5 relative before:content-[''] before:absolute before:w-12 before:h-px before:bg-border dark:before:bg-dark_border before:top-0 before:left-0">
                                        {item.clientName}
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    )
}

export default Testimonial;