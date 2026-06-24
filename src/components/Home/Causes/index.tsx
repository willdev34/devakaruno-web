/**
 * Caminho: src/components/Home/Causes/index.tsx
 * Arquivo: index.tsx
 * Descrição: Bloco de Serviços da Home, com as 3 modalidades (Individual, Casais, Cursos), cada uma linkando direto para o WhatsApp.
 */
import { ServicesData } from '@/app/api/data'
import Image from 'next/image'

const Causes = () => {
  return (
    <section className='lg:py-28 py-16 bg-grey dark:bg-darkmode'>
      <div className='container mx-auto lg:max-w-(--breakpoint-xl) px-4'>
        <h2 className='text-center text-3xl font-semibold mb-3'>
          Como podemos trabalhar juntos
        </h2>
        <p className='text-dustGray dark:text-white/60 text-center'>
          Cada caminho terapêutico é único.<br className='lg:block hidden' /> Conheça as modalidades disponíveis e escolha a que faz mais sentido para o seu momento.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-20'>
          {ServicesData.map((item, index) => (
            <a
              href={item.whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              key={index}
            >
              <div
                className='bg-white group dark:bg-dark rounded-md h-full flex flex-col items-center text-center p-8 shadow-cause-shadow dark:shadow-darkmd'
                data-aos='fade-up'
                data-aos-delay={`${index * 250}`}>
                <Image src={item.icon} alt='icon' width={60} height={60} />
                <h4 className='text-midnight_text text-lg font-bold dark:text-white group-hover:text-primary mt-5 mb-3'>
                  {item.title}
                </h4>
                <p className='text-dustGray dark:text-white/60 text-base'>
                  {item.text}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Causes