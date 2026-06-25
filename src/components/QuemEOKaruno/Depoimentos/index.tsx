/**
 * Caminho: src/components/QuemEOKaruno/Depoimentos/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção de depoimentos da página Quem é o Karuno, em grid estático (sem carrossel).
 */
import { SobreTestimonials } from "@/app/api/data";

const Depoimentos = () => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-3">Mais depoimentos</h2>
          <p className="text-dustGray dark:text-white/60 text-base">
            Outras experiências reais de quem já passou por aqui.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-start">
          {SobreTestimonials.map((item, index) => (
            <div
              key={index}
              className="bg-grey dark:bg-darkmode p-10 rounded-md h-full"
            >
              <p className="font-heading italic text-lg text-dustGray dark:text-white/70 leading-relaxed">
                "{item.review}"
              </p>
              <h5 className="text-base font-medium mt-6 pt-5 relative before:content-[''] before:absolute before:w-12 before:h-px before:bg-border dark:before:bg-dark_border before:top-0 before:left-0">
                {item.clientName}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Depoimentos;