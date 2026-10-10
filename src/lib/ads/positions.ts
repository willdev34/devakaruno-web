/**
 * Caminho: src/lib/ads/positions.ts
 * Arquivo: positions.ts
 * Descrição: Posições onde um banner publicitário pode aparecer no site. Para criar uma posição nova, basta incluí-la aqui e usar o AdSlot no lugar desejado.
 */
export const AD_POSITIONS = [
  {
    value: "BLOG_LIST",
    label: "Topo da listagem do blog",
    hint: "Faixa larga acima da busca e dos artigos. Tamanho sugerido: 1200 x 300.",
  },
  {
    value: "POST_END",
    label: "Fim do artigo",
    hint: "Faixa depois do texto, antes dos outros artigos. Tamanho sugerido: 1200 x 300.",
  },
] as const;

export type AdPosition = (typeof AD_POSITIONS)[number]["value"];

export const AD_POSITION_VALUES = AD_POSITIONS.map((p) => p.value) as [AdPosition, ...AdPosition[]];

export function adPositionLabel(value: string): string {
  return AD_POSITIONS.find((p) => p.value === value)?.label ?? value;
}
