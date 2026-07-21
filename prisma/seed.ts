/**
 * Caminho: prisma/seed.ts
 * Arquivo: seed.ts
 * Descrição: Popula o banco com o usuário admin e os posts do blog (lidos de markdown/blog/*.mdx), usando upsert para ser seguro rodar múltiplas vezes.
 */
import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const postsDirectory = join(process.cwd(), "markdown/blog");

const coursesData = [
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
      { question: "O curso fornece certificado profissional?", answer: "Não um certificado profissional, mas ofereço um certificado de curso livre, de participação. Pra atuação profissional, é necessária uma formação completa separada." },
    ],
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
      { question: "O curso fornece certificado profissional?", answer: "Não um certificado profissional, mas ofereço um certificado de curso livre, de participação. É voltado pra desenvolvimento pessoal e conexão do casal." },
    ],
  },
];

const testimonialsData = [
  { clientName: "Luciana", review: "Foi uma experiência excelente! O professor passou os conhecimentos de forma clara e objetiva e se disponibilizou a esclarecer todas as dúvidas. O modelo também foi cooperativo e tudo transcorreu respeitosamente e profissionalmente." },
  { clientName: "Kira", review: "Foi algo único, diferente de tudo que já vivenciei. O terapeuta Deva Karuno além de super profissional é maravilhoso e te leva a um estado libertador. Recomendo a todas as pessoas que, se ainda não fizeram, experimentem o tantra." },
  { clientName: "J.G.", review: "Fiz a massagem tântrica com Deva Karuno e foi um momento maravilhoso, onde me senti confortável, acolhida. Suas mãos pareciam uma pena, de tão leves e macias. Foi lindo o processo, só tenho a agradecer por tudo. Deva Karuno, terapeuta super zen, atencioso, ser humano incrível, super indico... namastê 🙏" },
  { clientName: "Pietro", review: "Uma grande experiência. Os suaves toques das mãos percorrem todo o corpo e dizem que é hora de despertar. Karuno é um terapeuta nato, acolhedor e profundo. Até breve!" },
  { clientName: "Marília R. V. Pires", review: "Experiência maravilhosa e uma sensação inigualável de bem-estar e felicidade. Seus toques me surpreenderam demais. Foi maravilhoso ter ele como terapeuta." },
  { clientName: "Rose", review: "Agradeço imensamente pela massagem que pude experimentar com você. Cada pequeno detalhe parecia certo em cada momento. Seja toda a gentileza (aliás nunca conheci homemmais gentil rs) durante todo o tempo, a forma variada dos toques, às vezes suavemente e depois com mais firmeza, ou a maneira como movia meu corpo com a maior sutileza. A música no volume certo, tudo se encaixava perfeitamente. A tensão e a energia que você trouxe para mim também foram ótimas. Uma intensidade que nunca experimentei antes. Sou muito grata." },
  { clientName: "Damião", review: "Hoje, mais uma sessão de Tantra. Já perdi as contas de quantas já fiz. Só sei que quanto mais eu faço, mais quero fazer! Como diz meu terapeuta Deva Karuno, cada sessão é única! Hoje, como todas as outras, também foi diferente! Senti profundamente o carisma, o aconchego, o bem querer... tudo isso durante a Massagem Sensitive! Foi espetacular! Sem contar a energia circulando pelo corpo! Não tenho mais palavras pra descrever essa maravilha! Só tenho a dizer: Namastê, meu terapeuta!" },
];

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "karunodeva@gmail.com" },
    update: {},
    create: {
      name: "Will",
      email: "karunodeva@gmail.com",
      role: "ADMIN",
    },
  });

  console.log("Usuário admin garantido:", admin.email);

  const slugs = fs.readdirSync(postsDirectory);

  for (const filename of slugs) {
    const slug = filename.replace(/\.mdx$/, "");
    const fullPath = join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title: data.title,
        excerpt: data.excerpt,
        content,
        coverImage: data.coverImage,
        publishedAt: new Date(data.date),
        authorId: admin.id,
      },
      create: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content,
        coverImage: data.coverImage,
        publishedAt: new Date(data.date),
        authorId: admin.id,
      },
    });

    console.log("Post garantido:", post.slug);
  }

  for (const courseData of coursesData) {
    const { faq, ...courseFields } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseFields,
      create: courseFields,
    });

    await prisma.courseFaq.deleteMany({ where: { courseId: course.id } });

    for (let i = 0; i < faq.length; i++) {
      await prisma.courseFaq.create({
        data: {
          question: faq[i].question,
          answer: faq[i].answer,
          order: i,
          courseId: course.id,
        },
      });
    }

    console.log("Curso garantido:", course.slug);
  }

  await prisma.testimonial.deleteMany();

  for (let i = 0; i < testimonialsData.length; i++) {
    await prisma.testimonial.create({
      data: {
        clientName: testimonialsData[i].clientName,
        review: testimonialsData[i].review,
        order: i,
      },
    });
  }

  console.log("Depoimentos garantidos:", testimonialsData.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });