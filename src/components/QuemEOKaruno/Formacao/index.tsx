/**
 * Caminho: src/components/QuemEOKaruno/Formacao/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção de formação e credenciais da página Quem é o Karuno, com lista de certificações e fotos da formação.
 */
import Image from "next/image";
import Link from "next/link";
import { FormacaoData } from "@/app/api/data";

const Formacao = () => {
  return (
    <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-3">Formação e Credenciais</h2>
          <p className="text-dustGray dark:text-white/60 text-base">
            Base técnica e ética por trás da prática.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {FormacaoData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark rounded-md p-6 border border-border dark:border-dark_border"
              >
                <h4 className="text-lg font-medium mb-1">{item.course}</h4>
                <p className="text-dustGray dark:text-white/60 text-base mb-1">
                  {item.institution} · {item.year}
                </p>
                {item.link && (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary text-sm"
                  >
                    Ver certificação
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md overflow-hidden h-[280px]">
              <Image
                src="/images/sobre/certificado-formacao.jpg"
                alt="Certificado de formação em Terapêutica Tântrica"
                width={400}
                height={560}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-md overflow-hidden h-[280px]">
              <Image
                src="/images/sobre/formacao-turma.jpg"
                alt="Turma de formação da Rede Metamorfose"
                width={400}
                height={560}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formacao;