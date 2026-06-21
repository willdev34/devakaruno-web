import { helpdata } from "@/app/api/data";
import Image from 'next/image';

const Help = () => {
    return (
        <section className="lg:py-28 py-16 bg-white dark:bg-dark">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <div className="text-center">
                    <h2 className="text-3xl mb-3 font-semibold">
                        How can you help us?
                    </h2>
                    <p className="text-dustGray dark:text-white/60 text-base">
                        You can support us by donating, volunteering your time, or providing food supplies.<br className="lg:block hidden" /> Every effort makes a difference!
                    </p>
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-8">
                        {helpdata.map((item, index) => (
                            <div key={index} className="flex flex-col gap-5 items-center xl:px-3">
                                <div>
                                    <Image src={item?.icon} alt="icon" width={60} height={60} />
                                </div>
                                <div className="flex flex-col gap-3.5">
                                    <h4 className="text-2xl font-medium">
                                        {item.title}
                                    </h4>
                                    <p className="text-dustGray dark:text-white/60 text-base">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Help;