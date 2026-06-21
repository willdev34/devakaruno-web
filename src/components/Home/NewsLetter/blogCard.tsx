import Image from "next/image";
import { Blog } from "@/types/blog";
import Link from "next/link";

const BlogCard = ({ blog }: { blog: Blog }) => {
    const { title, coverImage, excerpt, date, slug } = blog;
    return (
        <>
            <Link href={`/blog/${slug}`} className="group flex items-center gap-8">
                <div className="h-[85px] w-48 overflow-hidden rounded-sm">
                    <Image
                        src={coverImage!}
                        alt="image"
                        width={150}
                        height={100}
                        className="h-full w-full object-cover group-hover:scale-110 duration-300"
                    />
                </div>
                <div className="">
                    <h4 className="font-medium text-lg text-midnight_text dark:text-white group-hover:text-primary mb-3">
                        {title}
                    </h4>
                    <p className="text-dustGray dark:text-white/60 text-base">
                        Mark Freeman - May 1, 2025
                    </p>
                </div>
            </Link>
        </>
    )
}

export default BlogCard;