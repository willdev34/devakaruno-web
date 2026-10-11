/**
 * Caminho: src/components/Home/Testimonial/index.tsx
 * Arquivo: index.tsx
 * Descrição: Bloco de Depoimentos da Home (Server Component). Busca os destaques no banco e entrega ao carrossel. Sem depoimentos, a seção não aparece.
 */
import { getFeaturedTestimonials } from "@/lib/repositories/testimonials";
import TestimonialCarousel from "./TestimonialCarousel";

const Testimonial = async () => {
    const testimonials = await getFeaturedTestimonials();

    if (testimonials.length === 0) return null;

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
                    <TestimonialCarousel items={testimonials} />
                </div>
            </div>
        </section>
    )
}

export default Testimonial;
