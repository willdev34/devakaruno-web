/**
 * Caminho: src/app/(site)/blog/[slug]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de post individual do blog, lendo do banco. Slug inexistente ou fora do ar retorna 404. Traz metadados (descrição e Open Graph), autor, data e outros artigos no final.
 */
import AdSlot from "@/components/Ads/AdSlot";
import LatestBlog from "@/components/Blog/LatestBlog";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import { getPostBySlug } from "@/lib/repositories/posts";
import markdownToHtml from "@/utils/markdownToHtml";
import { readingMinutes } from "@/lib/posts/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

// Metadados do artigo (título, descrição e imagem de compartilhamento)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artigo não encontrado | Deva Karuno Terapias",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${post.title} | Deva Karuno Terapias`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [post.coverImage],
    },
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Slug inexistente ou artigo ainda não publicado
  if (!post) notFound();

  const content = await markdownToHtml(post.content);

  return (
    <>
      <section className="pt-[calc(var(--header-h,12rem)+2rem)] lg:pb-20 pb-10 dark:bg-dark px-4">
        <div className="container lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) mx-auto">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 max-w-3xl">
              <Link href={"/blog"}>
                <div className="w-fit flex items-center mb-6 gap-1.5 text-base bg-primary hover:bg-primary/80 text-white py-1.5 px-2 leading-none rounded-lg font-medium text-nowrap">
                  <div className="w-6 h-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  Voltar
                </div>
              </Link>
              <div className="z-20 h-[500px] overflow-hidden rounded-md">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1170}
                  height={766}
                  quality={100}
                  className="h-full w-full object-cover object-center rounded-md"
                />
              </div>
              {post.category && (
                <span className="mt-7 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                  {post.category.name}
                </span>
              )}
              <h1 className="text-black dark:text-white text-[40px] leading-tight font-bold pt-7 pb-3">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="text-xl text-dustGray dark:text-white/70 pb-6">{post.subtitle}</p>
              )}

              <div className="flex items-center gap-3 mb-8 text-base text-dustGray dark:text-white/60">
                <span>{post.author}</span>
                <span>·</span>
                <span>{format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
                <span>·</span>
                <span>{readingMinutes(post.content)} min de leitura</span>
              </div>
              {post.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4">
                  <div className="blog-details markdown xl:pr-10">
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-SnowySky dark:bg-darklight">
        <AdSlot position="POST_END" />
        <LatestBlog excludeSlug={post.slug} />
        <WhatsAppCTA />
      </div>
    </>
  );
}