/**
 * Caminho: src/lib/ordering.ts
 * Arquivo: ordering.ts
 * Descrição: Regra de subir/descer um item numa fila ordenada. Compartilhada por depoimentos, serviços e demais listas com campo "order".
 */
export type MoveDirection = "up" | "down";

// Nova fila de ids com o item trocado de lugar com o vizinho; null se não há o que mover (ponta da fila ou id desconhecido)
export function moveInList(ids: string[], id: string, direction: MoveDirection): string[] | null {
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= ids.length) return null;

  const next = [...ids];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
