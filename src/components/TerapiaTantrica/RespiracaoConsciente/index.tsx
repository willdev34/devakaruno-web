/**
 * Caminho: src/components/TerapiaTantrica/RespiracaoConsciente/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção sobre Respiração Consciente como prática dentro da Terapia Tântrica.
 */
import Image from "next/image";

const RespiracaoConsciente = () => {
  return (
    <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <div className="rounded-md overflow-hidden mb-10 h-64">
          <Image
            src="/images/background/respiracao-consciente.jpg"
            alt="Prática de respiração consciente"
            width={1920}
            height={640}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
          Práticas
        </p>
        <h2 className="text-3xl font-semibold mb-6">Respiração Consciente</h2>
        <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
          A respiração é a ferramenta mais simples, e mais subestimada, pra regular o sistema nervoso. Técnicas de respiração consciente, como o pranayama, ajudam a aumentar a presença no corpo, reduzir a ansiedade, e preparar o terreno emocional pras outras práticas, incluindo a massagem tântrica. É uma ferramenta que você aprende na sessão e leva pra vida, não só pra ali.
        </p>
      </div>
    </section>
  );
};

export default RespiracaoConsciente;