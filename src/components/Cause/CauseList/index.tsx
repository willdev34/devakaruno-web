import Link from "next/link";
import { CauseData } from "@/app/api/data";
import Image from "next/image";

const CauseList = () => {
    return (
        <section className="lg:py-28 py-16 dark:bg-dark">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                    {CauseData.map((item, index) => (
                        <Link href={`/cause/${item.slug}`} key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                            <div className="bg-white dark:bg-darkmode border dark:border-dark_border group h-full flex flex-col rounded-md">
                                <div className="overflow-hidden h-[250px] rounded-t-md">
                                    <Image
                                        src={item.image}
                                        alt="image"
                                        width={350}
                                        height={250}
                                        className="w-full h-full object-cover group-hover:scale-110 duration-300 rounded-t-md"
                                    />
                                </div>
                                <div className="p-8 shadow-cause-shadow flex-1 flex flex-col justify-between rounded-b-md">
                                    <h4 className="text-midnight_text text-lg font-bold dark:text-white group-hover:text-primary mb-4">
                                        {item.title}
                                    </h4>
                                    <div className='grid grid-cols-2 mt-4 border dark:border-dark_border rounded-md'>
                                        <div className='border-r dark:border-dark_border p-3'>
                                            <h4 className=' text-black dark:text-white/60 text-base font-medium'>
                                                Raised
                                            </h4>
                                            <h5 className='text-2xl font-medium text-primary'>{item.raised}</h5>
                                        </div>
                                        <div className='p-3'>
                                            <h4 className=' text-black dark:text-white/60 text-base font-medium'>
                                                Goal
                                            </h4>
                                            <h5 className='text-2xl font-medium'>{item.goal}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CauseList;