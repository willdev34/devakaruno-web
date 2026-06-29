/**
 * Caminho: src/components/Cursos/CursosDetail/index.tsx
 * Arquivo: index.tsx
 * Descrição: Conteúdo da página de detalhe de um curso, com informações completas, FAQ e CTA de WhatsApp.
 */
import Image from "next/image";
import Link from "next/link";

interface Curso {
  icon: string;
  title: string;
  detail: string;
  modalidade: string;
  duracao: string;
  local: string;
  price: string;
  whatsappLink: string;
  faq: { question: string; answer: string }[];
}

const CursosDetail = ({ curso }: { curso: Curso }) => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <div className="flex justify-center mb-8">
          <Image src={curso.icon} alt="icon" width={72} height={72} />
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12 text-center">
          <div className="bg-grey dark:bg-darkmode rounded-md p-5">
            <p className="text-dustGray dark:text-white/60 text-sm mb-1">Modalidade</p>
            <p className="font-medium">{curso.modalidade}</p>
          </div>
          <div className="bg-grey dark:bg-darkmode rounded-md p-5">
            <p className="text-dustGray dark:text-white/60 text-sm mb-1">Duração</p>
            <p className="font-medium">{curso.duracao}</p>
          </div>
          <div className="bg-grey dark:bg-darkmode rounded-md p-5">
            <p className="text-dustGray dark:text-white/60 text-sm mb-1">Investimento</p>
            <p className="font-medium text-primary">{curso.price}</p>
          </div>
        </div>

        <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-4">
          {curso.detail}
        </p>
        <p className="text-dustGray dark:text-white/60 text-sm mb-12">
          Local: {curso.local}
        </p>

        <div className="flex justify-center mb-16">
          <Link
            href={curso.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white text-base font-semibold bg-linear-to-r from-primary to-secondary px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-300"
          >
            Agendar pelo WhatsApp
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-medium mb-6 text-center">Perguntas frequentes</h2>
          <div className="space-y-6">
            {curso.faq.map((item, index) => (
              <div key={index} className="border-b border-border dark:border-dark_border pb-6">
                <h4 className="font-medium mb-2">{item.question}</h4>
                <p className="text-dustGray dark:text-white/60 text-base leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CursosDetail;