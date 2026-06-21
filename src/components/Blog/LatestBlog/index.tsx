import React from 'react';
import BlogCard from '@/components/SharedComponent/Blog/blogCard';
import { getAllPosts } from "@/utils/markdown";
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';

const LatestBlog: React.FC = () => {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

    return (
        <section className="flex flex-wrap justify-center lg:py-24 py-16 dark:bg-darkmode bg-grey" id="blog">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
                <div className="flex items-center md:flex-nowrap flex-wrap justify-between mb-11">
                    <h4 className="text-[40px] leading-tight font-semibold">Latest blog & news</h4>
                    <Link href={"/blog"} className='flex items-center gap-2 hover:text-primary dark:hover:text-primary text-midnight_text dark:text-white'>
                      <p className='e text-lg font-medium' >View More</p>
                      <Icon icon="line-md:arrow-right" className='text-xl' />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-7">
                    {posts.slice(0,2).map((blog, i) => (
                        <div key={i} className="w-full" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                            <BlogCard blog={blog} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LatestBlog;