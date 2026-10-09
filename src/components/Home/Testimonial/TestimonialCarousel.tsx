/**
 * Caminho: src/components/Home/Testimonial/TestimonialCarousel.tsx
 * Arquivo: TestimonialCarousel.tsx
 * Descrição: Carrossel (react-slick) dos depoimentos em destaque da Home. Recebe os dados por props, a busca no banco fica no componente pai.
 */
"use client"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface TestimonialItem {
    clientName: string;
    review: string;
}

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

const TestimonialCarousel = ({ items }: { items: TestimonialItem[] }) => {
    return (
        // Trilho em flex e slides esticados: todos os cards ficam com a altura do maior.
        // O ! é necessário: o CSS do slick não usa camada e vence classes utilitárias comuns do Tailwind 4
        <Slider
            {...settings}
            className="[&_.slick-track]:!flex [&_.slick-slide]:!h-auto [&_.slick-slide>div]:!h-full"
        >
            {items.map((item, index) => (
                <div key={index} className="px-3 h-full" data-aos="fade-up" data-aos-delay={`${index * 180}`}>
                    <div className="bg-white dark:bg-dark p-10 rounded-md h-full flex flex-col justify-between min-h-[260px]">
                        <p className="font-heading italic text-lg text-dustGray dark:text-white/70 leading-relaxed">
                            &quot;{item.review}&quot;
                        </p>
                        <h5 className="text-base font-medium mt-8 pt-5 relative before:content-[''] before:absolute before:w-12 before:h-px before:bg-border dark:before:bg-dark_border before:top-0 before:left-0">
                            {item.clientName}
                        </h5>
                    </div>
                </div>
            ))}
        </Slider>
    );
};

export default TestimonialCarousel;
