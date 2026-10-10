import React from 'react';
import BlogFilters from '@/components/Blog/BlogFilters';
import AdSlot from '@/components/Ads/AdSlot';
import { getPublishedPosts } from "@/lib/repositories/posts";

// Busca os artigos publicados e entrega aos filtros (página Blog)
const BlogList = async () => {
    const posts = await getPublishedPosts();

    if (posts.length === 0) {
        return (
            <section className="py-24 text-center dark:bg-dark" id="blog">
                <p className="text-dustGray dark:text-white/60">Os primeiros artigos estarão disponíveis em breve.</p>
            </section>
        );
    }

    return (
        <section className="flex flex-wrap justify-center lg:py-24 py-16 dark:bg-dark" id="blog">
            <AdSlot position="BLOG_LIST" />
            <div className="w-full pt-10 lg:pt-14">
                <BlogFilters posts={posts} />
            </div>
        </section>
    );
}

export default BlogList;