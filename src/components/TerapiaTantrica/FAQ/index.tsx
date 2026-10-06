/**
 * Caminho: src/components/TerapiaTantrica/FAQ/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção de Perguntas Frequentes da página Terapia Tântrica.
 */
const faqData = [
  {
    question: "A sessão envolve algum tipo de prática sexual?",
    answer: "A sessão pode incluir toque consciente em diferentes partes do corpo, incluindo áreas íntimas, sempre dentro de limites combinados com você antes de começar. Os detalhes completos da metodologia são explicados na conversa pelo WhatsApp.",
  },
  {
    question: "Existe \"final feliz\" na massagem tântrica?",
    answer: "Não. Isso é um mito comum, usado por quem confunde (ou usa de propósito errado) o termo Tantra pra vender massagem erótica. O foco aqui é outro: presença, respiração e conexão com a própria energia.",
  },
  {
    question: "Existe diferença entre Massagem Tântrica e Massagem Erótica?",
    answer: "Sim, e a diferença é importante. Os dois termos às vezes aparecem associados ao toque e à sexualidade, mas o objetivo, os limites e a condução são bem diferentes. Na Terapia Tântrica, a proposta é um espaço de escuta, presença e autoconhecimento corporal, e não substitui acompanhamento médico ou psicológico quando necessário. Já a massagem erótica é voltada ao entretenimento adulto, com foco em excitação e fantasia, sem propósito terapêutico.",
  },
  {
    question: "Posso definir meus próprios limites antes da sessão?",
    answer: "Sim, conversamos antes sobre o que faz sentido pra você, e esses limites são respeitados o tempo todo.",
  },
  {
    question: "Para quem é indicada a Terapia Tântrica?",
    answer: "Para qualquer pessoa maior de 18 anos que queira se desenvolver com mais presença no próprio corpo, não só quem tem alguma queixa específica. Costuma ajudar especialmente quem lida com dificuldades de desempenho ou desejo sexual, bloqueios emocionais, dificuldade de aceitação do próprio corpo, casais que querem resgatar intimidade e comunicação, ou quem busca reduzir o estresse do dia a dia.",
  },
  {
    question: "Preciso ter alguma crença espiritual específica?",
    answer: "Não. O trabalho é terapêutico, baseado em corpo e energia, não depende de nenhuma crença religiosa.",
  },
  {
    question: "Atende casais?",
    answer: "Sim, há modalidade específica pra isso.",
  },
];

const FAQ = () => {
  return (
    <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <h2 className="text-3xl font-semibold mb-10 text-center">Perguntas frequentes</h2>
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-border dark:border-dark_border pb-6">
              <h4 className="font-medium text-lg mb-2">{item.question}</h4>
              <p className="text-dustGray dark:text-white/60 text-base leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;