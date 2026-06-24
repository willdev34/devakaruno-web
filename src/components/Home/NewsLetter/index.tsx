/**
 * Caminho: src/components/Home/NewsLetter/index.tsx
 * Arquivo: index.tsx
 * Descrição: Bloco de Newsletter da Home, com formulário de inscrição (visual, sem captura real ainda) e preview dos últimos posts do blog.
 */
import Link from "next/link";
import { getAllPosts } from "@/utils/markdown";
import BlogCard from "./blogCard";

const Newsletter = () => {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug", "author"]);
    return (
        <section className="lg:py-28 py-16 dark:bg-dark">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-44" >
                    <div className="" data-aos="fade-left">
                        <div className="mb-8">
                            <p className="text-base text-primary mb-3">
                                Newsletter
                            </p>
                            <h2 className="text-3xl font-semibold mb-6">
                                Receba conteúdo sobre terapia e desenvolvimento pessoal
                            </h2>
                            <p className="text-base text-dustGray dark:text-white/60">
                            Inscreva-se para receber reflexões sobre autoconhecimento, relacionamentos e bem-estar direto no seu e-mail.
                            </p>
                        </div>
                        <form>
                            <div className="mb-6">
                                <input type="text" placeholder="Seu nome" className="w-full p-4 border border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark rounded-sm focus-visible:outline-hidden" />
                            </div>
                            <div className="mb-6">
                                <input type="email" placeholder="Seu e-mail" className="w-full p-4 border border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark rounded-sm focus-visible:outline-hidden" />
                            </div>
                            <div className="flex justify-center mb-6">
                                <button type="submit" className="text-white  bg-linear-to-r from-primary to-secondary px-7 py-4 dark:hover:from-dark hover:from-white hover:to-white dark:hover:to-dark border border-transparent hover:border-primary hover:text-primary rounded-sm w-full cursor-pointer">
                                    Inscrever-se
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:mt-0 mt-8">
                        <div className="flex justify-between items-center border-b border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark pb-6 mb-8 focus-visible:outline-none-10">
                            <h2 className="text-3xl font-semibold">
                                Últimos artigos do blog
                            </h2>
                            <Link href="/blog" className="text-primary hover:text-secondary text-base">
                                Ver todos
                            </Link>
                        </div>
                        {posts.slice(0, 3).map((blog, i) => (
                            <div key={i} className="lg:mb-10 mb-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                                <BlogCard blog={blog} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Newsletter;