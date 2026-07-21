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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });