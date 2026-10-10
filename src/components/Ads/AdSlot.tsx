/**
 * Caminho: src/components/Ads/AdSlot.tsx
 * Arquivo: AdSlot.tsx
 * Descrição: Espaço de banner publicitário numa posição do site. Mostra o banner no ar com o aviso "Publicidade" e não renderiza nada se não houver. Uma falha ao buscar o banner nunca derruba a página.
 */
import { getActiveAd, type PublicAd } from "@/lib/repositories/ads";
import type { AdPosition } from "@/lib/ads/positions";

const AdSlot = async ({ position }: { position: AdPosition }) => {
  let ad: PublicAd | null = null;
  try {
    ad = await getActiveAd(position);
  } catch (error) {
    // Banner é secundário: registra o erro e segue sem ele
    console.error(`AdSlot ${position}:`, error);
  }
  if (!ad) return null;

  return (
    <aside aria-label="Publicidade" className="container mx-auto w-full basis-full px-4 pt-10 lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md)">
      <p className="mb-2 text-center text-[11px] uppercase tracking-widest text-dustGray dark:text-white/50">Publicidade</p>
      <a href={ad.linkUrl} target="_blank" rel="sponsored noopener noreferrer" className="block overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.imageUrl} alt={ad.altText} loading="lazy" className="mx-auto h-auto w-full" />
      </a>
    </aside>
  );
};

export default AdSlot;
