/**
 * Caminho: src/components/Home/FutureEvents/index.tsx
 * Arquivo: index.tsx
 * Descrição: Bloco de Cursos e Vivências da Home, com os cursos privativos disponíveis, cada um linkando direto para o WhatsApp.
 */
import { CursosData } from '@/app/api/data'
import Image from 'next/image'

const FutureEvents = () => {
  return (
    <section id="cursos" className="lg:py-28 py-16 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-3">Cursos e Vivências</h2>
          <p className="text-base text-dustGray dark:text-white/60 mx-auto lg:max-w-60%">
            Encontros presenciais para quem deseja se dedicar mais a fundo, com teoria, prática guiada e atenção próxima do início ao fim.
          </p>
        </div>
        <div className="mt-20 grid sm:grid-cols-2 grid-cols-1 gap-8 max-w-(--breakpoint-md) mx-auto">
          {CursosData.map((item, index) => (
            <a href={item.whatsappLink} target="_blank" rel="noopener noreferrer" key={index}>
              <div
                className="bg-white group dark:bg-darkmode border border-border dark:border-dark_border rounded-md h-full flex flex-col items-center text-center p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={`${index * 250}`}>
                <Image src={item.icon} alt="icon" width={60} height={60} />
                <h4 className="text-lg font-medium mt-5 mb-3 group-hover:text-primary">
                  {item.title}
                </h4>
                <p className="text-dustGray dark:text-white/60 text-base mb-6">
                  {item.text}
                </p>
                <p className="text-2xl font-medium text-primary mt-auto">
                  {item.price}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FutureEvents;