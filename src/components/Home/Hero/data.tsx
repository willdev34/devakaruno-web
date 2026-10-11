/**
 * Caminho: src/components/Home/Hero/data.tsx
 * Arquivo: data.tsx
 * Descrição: Imagens do Hero da Home, hospedadas no Cloudinary. panFrom e panTo (opcionais) definem onde a imagem começa e termina o movimento no mobile, de 0% (esquerda) a 100% (direita).
 */
export interface HeroSlide {
    id: number;
    image: string;
    alt: string;
    panFrom?: string;
    panTo?: string;
}

export const HerosectionData: HeroSlide[] = [
    {
        id: 1,
        image: "https://res.cloudinary.com/do0uq7w4n/image/upload/v1791330506/hero-deva-karuno-3_cnfr0z.jpg",
        alt: "Deva Karuno Terapias",
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/do0uq7w4n/image/upload/v1791330504/hero-deva-karuno_yakg13.jpg",
        alt: "Deva Karuno Terapias",
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/do0uq7w4n/image/upload/v1791330464/Retoque_sutil_na_pele_do_rosto_vo7yrz.png",
        alt: "Deva Karuno Terapias",
    },
]
