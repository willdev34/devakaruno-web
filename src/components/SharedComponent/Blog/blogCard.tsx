import React, { FC } from "react";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import Link from "next/link";

const BlogCard = ({ blog }: { blog: Blog }) => {
    const { title, coverImage, excerpt, date, slug } = blog;
    return (
        <>
            <Link href={`/blog/${slug}`} className="group mb-0 grid grid-cols-12 lg:gap-9 gap-6">
                <div className="overflow-hidden rounded-lg lg:col-span-5 col-span-12 h-[180px]">
                    <Image
                        src={coverImage}
                        alt="image"
                        width={300}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-110 duration-300 "
                    />
                </div>
                <div className="flex flex-col gap-3 justify-center lg:col-span-7 col-span-12">
                    <span className="text-base text-gray-400">
                        {format(new Date(date), "MMM dd yyyy")}
                    </span>
                    <h5 className="text-[22px] leading-tight font-medium group-hover:text-primary">
                        {title}
                    </h5>
                    <div className="flex items-center gap-2.5 text-primary text-base font-medium ">
                        <span>Read More</span>
                        <div className="w-5 h-5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" color="var(--token-211fe1df-3c56-44aa-baeb-d51b3e9f19ae, rgb(29, 200, 204))" ><path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default BlogCard;