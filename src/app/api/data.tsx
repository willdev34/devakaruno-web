
export const helpdata: { icon: string; title: string; text: string }[] = [
  {
    icon: "/images/help/icon-autoconhecimento.svg",
    title: "Autoconhecimento emocional",
    text: "Entenda padrões emocionais e construa uma relação mais consciente com seus sentimentos e desejos.",
  },
  {
    icon: "/images/help/icon-conexao.svg",
    title: "Comunicação e conexão genuína",
    text: "Desenvolva ferramentas pra se expressar com clareza e fortalecer vínculos mais verdadeiros nos seus relacionamentos.",
  },
  {
    icon: "/images/help/icon-presenca-corpo.svg",
    title: "Presença no próprio corpo",
    text: "Reconecte-se com o corpo e amplie sua capacidade de viver o presente com mais leveza.",
  },
];

export const FormacaoData: {
  course: string;
  institution: string;
  year: string;
  link?: string;
}[] = [
  {
    course: "Capacitação em Terapêutica Tântrica",
    institution: "Comunna Metamorfose",
    year: "2019",
    link: "https://redemetamorfose.org/capacitacao-para-terapeutas-tantricos",
  },
  {
    course: "ThetaHealing DNA Básico",
    institution: "Instituto THINK",
    year: "2019",
  },
];

export const CursosData: {
  slug: string;
  icon: string;
  bgImage: string;
  title: string;
  text: string;
  detail: string;
  modalidade: string;
  duracao: string;
  local: string;
  price: string;
  whatsappLink: string;
  faq: { question: string; answer: string }[];
}[] = [
  {
    slug: "curso-privativo-individual-massagem-tantrica",
    icon: "/images/services/icon-individual.svg",
    bgImage: "/images/background/hero-curso-individual.jpg",
    title: "Curso Privativo Individual: Massagem Tântrica",
    text: "Curso individual e privativo, totalmente prático, com minha orientação direta, duração de até 4 horas. Indicado para quem busca aprofundar o autoconhecimento corporal. Aos sábados, por agendamento.",
    detail: "Esse curso é uma imersão individual e privativa no Método Deva Nishok de massagem tântrica consciente, totalmente prático, com minha orientação direta durante toda a sessão, com duração de até 4 horas. Indicado para quem busca aprofundar o autoconhecimento corporal com privacidade, ou que não dispõe de um fim de semana livre para participar de uma vivência em grupo. É um curso de desenvolvimento pessoal, não profissionalizante.",
    modalidade: "Individual",
    duracao: "Até 4 horas",
    local: "Avenida Rio Branco, 185 - Centro, Rio de Janeiro",
    price: "R$ 1.100",
    whatsappLink: "https://wa.me/5521984121612?text=Ol%C3%A1%21%20Vi%20o%20site%20da%20Deva%20Karuno%20Terapias%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20Curso%20Privativo%20Individual%20de%20Massagem%20T%C3%A2ntrica.",
    faq: [
      { question: "Preciso ter um parceiro pra fazer o curso?", answer: "Não necessariamente. Eu posso indicar uma pessoa com experiência na técnica pra servir de referência durante a prática." },
      { question: "Como funciona a parte prática?", answer: "A pessoa que recebe a massagem fica sem roupa durante a aplicação; eu permaneço vestido o tempo todo, conduzindo tudo com respeito e profissionalismo." },
      { question: "O curso tem caráter erótico ou sexual?", answer: "Não. É estritamente educacional e terapêutico." },
      { question: "O curso fornece certificado profissional?", answer: "Não um certificado profissional, mas ofereço um certificado de curso livre, de participação. Pra atuação profissional, é necessária uma formação completa separada." }
    ]
  },
  {
    slug: "curso-privativo-casais-massagem-tantrica",
    icon: "/images/services/icon-casais.svg",
    bgImage: "/images/background/hero-curso-casais.jpg",
    title: "Curso Privativo para Casais: Massagem Tântrica",
    text: "Curso privativo para casais, totalmente prático, com minha orientação direta, duração de até 4 horas. Indicado para quem busca fortalecer a conexão com o parceiro. Aos sábados, por agendamento.",
    detail: "Esse curso é uma imersão privativa para casais no Método Deva Nishok de massagem tântrica consciente, totalmente prático, com minha orientação direta durante toda a sessão, com duração de até 4 horas. Indicado para casais que querem aprender uma nova forma de cuidado mútuo e levar técnicas reais pra própria relação. É um curso de desenvolvimento pessoal, não profissionalizante.",
    modalidade: "Casal",
    duracao: "Até 4 horas",
    local: "Avenida Rio Branco, 185 - Centro, Rio de Janeiro",
    price: "R$ 1.600",
    whatsappLink: "https://wa.me/5521984121612?text=Ol%C3%A1%21%20Vi%20o%20site%20da%20Deva%20Karuno%20Terapias%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20Curso%20Privativo%20para%20Casais%20de%20Massagem%20T%C3%A2ntrica.",
    faq: [
      { question: "Qual a diferença entre o curso individual e o de casal?", answer: "No de casal, o próprio parceiro serve de referência durante a prática. No individual, essa referência é indicada por mim." },
      { question: "Como funciona a parte prática?", answer: "A pessoa que recebe a massagem fica sem roupa durante a aplicação; eu permaneço vestido o tempo todo." },
      { question: "O curso tem caráter erótico ou sexual?", answer: "Não. É estritamente educacional e terapêutico." },
      { question: "O curso fornece certificado profissional?", answer: "Não um certificado profissional, mas ofereço um certificado de curso livre, de participação. É voltado pra desenvolvimento pessoal e conexão do casal." }
    ]
  }
];
