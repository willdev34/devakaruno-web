/**
 * Caminho: src/components/TerapiaTantrica/Beneficios/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção de Benefícios, separada por Mulheres e Homens.
 */
const beneficiosMulheres = [
  "Maior consciência da própria energia vital e bem-estar",
  "Equilíbrio hormonal e sensação de leveza emocional",
  "Dissolução de bloqueios emocionais que travam a expressão do prazer e da intimidade",
  "Nova relação com o próprio corpo, sem julgamento",
];

const beneficiosHomens = [
  "Apoio em dificuldades de desempenho e desejo sexual, com abordagem corporal e emocional",
  "Nova relação com a própria sexualidade, menos ligada à pressa e ao desempenho",
  "Maior consciência da própria energia vital e bem-estar",
  "Dissolução de bloqueios emocionais que travam a expressão do prazer e da intimidade",
];

const Beneficios = () => {
  return (
    <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Benefícios
          </p>
          <h2 className="text-3xl font-semibold">O que você pode ganhar</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-(--breakpoint-md) mx-auto">
          <div className="bg-white dark:bg-dark rounded-md p-8 border border-border dark:border-dark_border">
            <h3 className="text-xl font-medium mb-6 text-primary">Para Mulheres</h3>
            <ul className="space-y-4">
              {beneficiosMulheres.map((item, index) => (
                <li key={index} className="flex gap-3 text-dustGray dark:text-white/70 text-base">
                  <span className="text-primary font-semibold">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-dark rounded-md p-8 border border-border dark:border-dark_border">
            <h3 className="text-xl font-medium mb-6 text-primary">Para Homens</h3>
            <ul className="space-y-4">
              {beneficiosHomens.map((item, index) => (
                <li key={index} className="flex gap-3 text-dustGray dark:text-white/70 text-base">
                  <span className="text-primary font-semibold">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beneficios;