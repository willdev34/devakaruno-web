/**
 * Caminho: src/components/QuemEOKaruno/Bio/index.tsx
 * Arquivo: index.tsx
 * Descrição: Seção de biografia da página Quem é o Karuno, com a trajetória pessoal e a foto do Sannyas.
 */
import Image from "next/image";

const Bio = () => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-3">Quem é o Karuno</h2>
          <p className="text-dustGray dark:text-white/60 text-base">
            A trajetória por trás da prática.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-grey dark:border-dark_border shadow-lg">
            <Image
              src="/images/sobre/perfil-deva-karuno.jpg"
              alt="Deva Karuno"
              width={400}
              height={400}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-medium mb-4">Um caminho que eu não esperava</h3>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-4">
              Sou natural do Rio de Janeiro, e por muito tempo fui extremamente cético em relação a espiritualidade, energia e qualquer coisa que soasse "alternativa". Não por mente fechada, mas porque vinha de uma área completamente diferente: passei boa parte da minha vida profissional em tecnologia, e não me imaginava trabalhando com outra coisa.
            </p>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Isso mudou depois de um período pessoal difícil, num momento sem trabalho em que cheguei perto de um quadro depressivo. Foi nessa fase que assisti a um filme sobre uma mulher que descobria, durante um processo terapêutico, um trauma de infância que ela nem sabia que carregava. Aquela história despertou em mim uma pergunta simples: que tipo de terapia tem essa força de revelar e curar uma dor tão antiga?
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-medium mb-4">A descoberta do Tantra</h3>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Pesquisei bastante até chegar à terapia tântrica, e de lá até a Rede Metamorfose, referência na formação de terapeutas nessa área. Na época, não tinha como pagar a formação completa, então comecei por um curso livre, só pra entender melhor o processo. Foi muito além do que eu esperava: ali percebi que tinha vocação para aquilo, e que a experiência de uma vivência tântrica tinha uma força que eu nunca tinha sentido antes.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-medium mb-4">A formação</h3>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-4">
              Quando finalmente reuni o valor pra formação completa, reencontrei uma pessoa que eu conhecia de um trabalho antigo, que já atuava como terapeuta formada pela Rede Metamorfose. Nos aproximamos, e ela se tornou uma grande amiga e mentora ao longo desse processo: a Thais Devamani.
            </p>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              A formação foram 4 módulos, um por mês, e cada um deles me marcou de um jeito diferente. Conheci pessoas incríveis e vivi experiências que carrego até hoje. Na primeira meditação ativa que fiz, vivi algo que não esperava: uma experiência intensa de entrega e conexão, que me emocionou profundamente, de um jeito que eu não sentia desde criança. Ali, o ceticismo que eu carregava começou a dar lugar a uma abertura genuína. A cada módulo seguinte, vieram experiências cada vez mais intensas, e crenças e preconceitos que eu nem sabia que carregava foram caindo um a um.
            </p>
          </div>

          <figure className="my-10">
            <div className="rounded-md overflow-hidden">
              <Image
                src="/images/sobre/sannyas-deva-karuno.jpg"
                alt="Momento da entrega do Sannyas, o nome espiritual Deva Karuno"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
            <figcaption className="text-center text-sm text-dustGray dark:text-white/50 mt-3">
              O momento em que recebi meu nome espiritual, Deva Karuno, que significa Divina Compaixão.
            </figcaption>
          </figure>

          <div>
            <h3 className="text-2xl font-medium mb-4">Hoje</h3>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Durante a formação, comecei a curar dores que eu nem sabia que tinha, e essa cura nunca parou. Já são quase 400 sessões realizadas até hoje, e cada uma delas continua sendo, de alguma forma, parte da minha própria cura também. Hoje, dedico minha prática a oferecer pra outras pessoas o mesmo espaço de segurança e transformação que encontrei nesse caminho.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bio;