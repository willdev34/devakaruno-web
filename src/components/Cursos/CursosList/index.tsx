/**
 * Caminho: src/components/Cursos/CursosList/index.tsx
 * Arquivo: index.tsx
 * Descrição: Listagem completa de Cursos e Vivências, cada card linkando para a página de detalhe.
 */
import Image from "next/image";
import Link from "next/link";
import { CursosData } from "@/app/api/data";

const CursosList = () => {
  return (
    <section className="lg:py-28 py-16 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
          {CursosData.map((item, index) => (
            <Link href={`/cursos-e-vivencias/${item.slug}`} key={index}>
              <div className="bg-white group dark:bg-darkmode border border-border dark:border-dark_border rounded-md h-full flex flex-col items-center text-center p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <Image src={item.icon} alt="icon" width={60} height={60} />
                <h4 className="text-lg font-medium mt-5 mb-3 group-hover:text-primary">
                  {item.title}
                </h4>
                <p className="text-dustGray dark:text-white/60 text-base mb-6">
                  {item.text}
                </p>
                <p className="text-primary font-semibold mt-auto group-hover:text-secondary">
                  Saiba mais →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CursosList;