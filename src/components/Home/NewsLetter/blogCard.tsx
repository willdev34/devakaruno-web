/**
 * Caminho: src/components/Home/NewsLetter/blogCard.tsx
 * Arquivo: blogCard.tsx
 * Descrição: Card de preview de post do blog, usado no bloco Newsletter da Home. Mostra autor e data reais do post.
 */
import Image from "next/image";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const BlogCard = ({ blog }: { blog: Blog }) => {
    const { title, coverImage, excerpt, date, slug, author } = blog;
    const formattedDate = date ? format(new Date(date), "d 'de' MMMM, yyyy", { locale: ptBR }) : "";
    return (
        <Link href={`/blog/${slug}`} className="group flex items-start gap-8">
            <div className="h-[85px] w-48 overflow-hidden rounded-sm shrink-0">
                <Image
                    src={coverImage!}
                    alt="image"
                    width={150}
                    height={100}
                    className="h-full w-full object-cover group-hover:scale-110 duration-300"
                />
            </div>
            <div className="">
                <h4 className="font-medium text-lg text-midnight_text dark:text-white group-hover:text-primary mb-2">
                    {title}
                </h4>
                <p className="text-dustGray dark:text-white/60 text-sm mb-2">
                    {excerpt}
                </p>
                <p className="text-dustGray dark:text-white/50 text-sm">
                    {author} · {formattedDate}
                </p>
            </div>
        </Link>
    )
}

export default BlogCard;