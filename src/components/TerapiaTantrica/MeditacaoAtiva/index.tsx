/**
 * Caminho: src/components/TerapiaTantrica/MeditacaoAtiva/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção sobre Meditação Ativa, com contexto histórico de Osho.
 */
import Image from "next/image";

const MeditacaoAtiva = () => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <div className="rounded-md overflow-hidden mb-10 h-64">
          <Image
            src="/images/background/meditacao-ativa.jpg"
            alt="Prática de meditação ativa"
            width={1920}
            height={640}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
          Práticas
        </p>
        <h2 className="text-3xl font-semibold mb-6">Meditação Ativa</h2>
        <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
          As meditações ativas foram criadas por Osho, no século 20, pensadas especialmente pra quem vive no mundo ocidental. Osho percebeu que a mente ocidental, acostumada à pressa e ao excesso de estímulo, tinha dificuldade em simplesmente sentar e silenciar, como pede a meditação tradicional. A solução foi criar práticas que usam movimento intenso, som e respiração como primeira etapa, pra descarregar tensão física e mental antes de chegar a um momento de quietude. É uma meditação que começa pelo corpo, não pela mente, mais acessível pra quem nunca conseguiu "ficar parado" meditando do jeito tradicional.
        </p>
      </div>
    </section>
  );
};

export default MeditacaoAtiva;