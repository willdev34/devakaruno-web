import Link from "next/link";
import { getAllPosts } from "@/utils/markdown";
import BlogCard from "./blogCard";

const Newsletter = () => {
    const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);
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
                                Stay informed about new and upcoming causes
                            </h2>
                            <p className="text-base text-dustGray dark:text-white/60">
                            Subscribe to our updates and stay connected with the latest causes and initiatives. Be among the first to learn how you can make a difference in urgent and upcoming projects!
                            </p>
                        </div>
                        <form>
                            <div className="mb-6">
                                <input type="text" placeholder="Your name" className="w-full p-4 border border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark rounded-sm focus-visible:outline-hidden" />
                            </div>
                            <div className="mb-6">
                                <input type="email" placeholder="Your email address" className="w-full p-4 border border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark rounded-sm focus-visible:outline-hidden" />
                            </div>
                            <div className="flex justify-center mb-6">
                                <button type="submit" className="text-white  bg-linear-to-r from-error to-warning px-7 py-4 dark:hover:from-dark hover:from-white hover:to-white dark:hover:to-dark border border-transparent hover:border-error hover:text-error rounded-sm w-full cursor-pointer">
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:mt-0 mt-8">
                        <div className="flex justify-between items-center border-b border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark pb-6 mb-8 focus-visible:outline-none-10">
                            <h2 className="text-3xl font-semibold">
                                Latest news at endeavor
                            </h2>
                            <Link href="/blog" className="text-error hover:text-primary text-base">
                                View all
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