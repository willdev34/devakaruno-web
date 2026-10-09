import React from 'react';
import Link from 'next/link';
import { Icon } from "@iconify/react"
import BlogCard from './blogCard';
import { getPublishedPosts } from "@/lib/repositories/posts";

// Últimos 3 artigos publicados
const Blog = async () => {
    const posts = await getPublishedPosts(3);

    if (posts.length === 0) return null;

    return (
        <section className="flex flex-wrap justify-center py-24 dark:bg-darkmode" id="blog">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md)">
                <div className="flex items-baseline justify-between flex-wrap">
                    <h2 className="sm:mb-11 mb-3 text-4xl font-bold text-midnight_text dark:text-white" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000">Últimos artigos</h2>
                    <Link href="/blog" className="flex items-center gap-3 text-base text-midnight_text dark:text-white dark:hover:text-primary font-medium hover:text-primary sm:pb-0 pb-3" data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000">
                        Ver mais
                        <span>
                            <Icon
                                icon="solar:arrow-right-outline"
                                width="30"
                                height="30"
                            />
                        </span>
                    </Link>
                </div>
                <div className="grid grid-cols-12 gap-7">
                    {posts.map((blog, i) => (
                        <div key={i} className="w-full md:col-span-4 col-span-6" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                            <BlogCard blog={blog} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Blog;
