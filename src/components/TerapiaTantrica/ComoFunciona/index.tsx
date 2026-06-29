/**
 * Caminho: src/components/TerapiaTantrica/ComoFunciona/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção de Como Funciona da página Terapia Tântrica, com informações práticas de duração, investimento e pacotes.
 */
const ComoFunciona = () => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <h2 className="text-3xl font-semibold mb-6">Como funciona</h2>
        <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-10">
          Antes de qualquer sessão, conversamos sobre o que você busca e definimos juntos seus limites: o tipo de toque que faz sentido pra você, e os lugares que prefere não serem tocados. Esses limites são respeitados durante toda a sessão, sem espaço para surpresa. Podem surgir sensações variadas durante o processo (calma, leveza, até desconforto passageiro), o que é natural, mas se algum limite não for respeitado, a sessão para no mesmo instante, sempre. Ao final, reservamos um tempo de integração, pra você voltar com calma pro seu dia, sem pressa.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white dark:bg-dark rounded-md p-5">
            <p className="text-dustGray dark:text-white/60 text-sm mb-1">Duração</p>
            <p className="font-medium">2 horas</p>
          </div>
          <div className="bg-white dark:bg-dark rounded-md p-5">
            <p className="text-dustGray dark:text-white/60 text-sm mb-1">Investimento</p>
            <p className="font-medium text-primary">R$ 480</p>
          </div>
          <div className="bg-white dark:bg-dark rounded-md p-5">
            <p className="text-dustGray dark:text-white/60 text-sm mb-1">Pacotes</p>
            <p className="font-medium">A consultar</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;