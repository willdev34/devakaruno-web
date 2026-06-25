/**
 * Caminho: src/components/NotFound/index.tsx
 * Arquivo: index.tsx
 * Descrição: Conteúdo da página 404, com silhueta em meditação animada (respiração) e texto em português.
 */
import Link from "next/link";

const NotFound = () => {
  return (
    <section className="bg-white pt-8 pb-20 dark:bg-darkmode">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap items-center justify-center">
          <div className="w-full px-4 md:w-5/12 lg:w-5/12">
            <div style={{ display: "grid", placeItems: "center", width: 220, height: 220, margin: "0 auto" }}>
              <div
                style={{ gridArea: "1 / 1", width: 190, height: 190, borderRadius: "50%", background: "#26A88C", animation: "breathe-outer 6s ease-in-out infinite" }}
              />
              <div
                style={{ gridArea: "1 / 1", width: 140, height: 140, borderRadius: "50%", background: "#1C6B78", animation: "breathe-inner 6s ease-in-out infinite" }}
              />
              <svg style={{ gridArea: "1 / 1" }} width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="Silhueta em meditação">
                <g style={{ animation: "breathe-rise 6s ease-in-out infinite" }}>
                  <path d="M100,35 C75,35 60,55 62,85 C63,105 70,120 78,130 L86,128 C80,115 76,100 78,82 C80,62 88,45 100,42 C112,45 120,62 122,82 C124,100 120,115 114,128 L122,130 C130,120 137,105 138,85 C140,55 125,35 100,35 Z" fill="#2B1A5C" />
                  <path d="M75,78 C55,90 35,110 25,150 C20,165 30,175 50,175 L150,175 C170,175 180,165 175,150 C165,110 145,90 125,78 C115,70 85,70 75,78 Z" fill="#1C6B78" />
                  <circle cx="100" cy="58" r="23" fill="#2B1A5C" />
                </g>
              </svg>
            </div>
          </div>
          <div className="w-full px-4 md:w-7/12 lg:w-6/12 xl:w-5/12 text-center md:text-left">
            <p className="text-label text-stone uppercase tracking-wide mb-4 dark:text-white/50">
              Erro 404
            </p>
            <h3 className="mb-5 font-heading italic text-3xl text-dark dark:text-white">
              Essa página não existe.
            </h3>
            <p className="mb-8 text-base text-body-color dark:text-dark-6">
              Mas a calma pode continuar com você. Volte para o início e encontre o caminho certo.
            </p>
            <Link
              href="/"
              className="rounded-md px-7 py-3 text-base font-medium text-white transition hover:bg-darkprimary bg-primary"
            >
              Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;