/**
 * Caminho: src/components/Layout/Header/Navigation/menuData.tsx
 * Arquivo: menuData.tsx
 * Descrição: Itens do menu principal. Servicos e Cursos apontam para ancoras na Home (paginas dedicadas ainda nao existem). Contato removido por enquanto, substituido por Quem e o Karuno.
 */
import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Cursos e Vivências", href: "/#cursos" },
  { label: "Blog", href: "/blog" },
  { label: "Quem é o Karuno", href: "/quem-e-o-karuno" },
];