import { Eventdata } from "@/app/api/data";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

const FutureEvents = () => {
  return (
    <section className="lg:py-28 py-16 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-3">Top news summarized briefly</h2>
          <p className="text-base text-dustGray dark:text-white/60 mx-auto lg:max-w-60%">
            Join us at local events to make a difference! Connect, volunteer, and support our mission in your community.
          </p>
        </div>
        <div className="flex flex-col items-center gap-12">
          <div className="mt-20 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {Eventdata.slice(0, 3).map((item, index) => (
              <Link key={index} href={`/events/${item.slug}`} className="group" data-aos="fade-up" data-aos-delay={`${index * 250}`}>
                <div className="relative overflow-hidden mb-8" >
                  <div className="overflow-hidden h-[250px]">
                    <Image
                      src={item.image}
                      alt="image"
                      width={350}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-110 scale-[1.01] duration-300"
                    />
                  </div>
                  <div className="px-3 py-1 bg-white absolute z-1 top-3 right-3 rounded-md">
                    <p className="flex items-center text-black text-sm mb-0 text-center">
                      <span className="block text-base">
                        {format(new Date(item.date), "MMM")} {format(new Date(item.date), "dd")}, {format(new Date(item.date), "yyyy")}
                      </span>
                      <span className="block text-base">

                      </span>

                    </p>
                  </div>
                </div>
                <h4 className="text-lg font-medium mb-3.5 text-midnight_text dark:text-white group-hover:text-primary">{item.title}</h4>
                <p className="text-dustGray dark:text-white/60 text-base mb-6">{item.text}</p>
              </Link>
            ))}
          </div>
          <Link href="/blog" className="text-white text-base bg-primary px-7 py-4 border font-semibold border-primary hover:border-primary hover:bg-transparent hover:text-primary rounded-md cursor-pointer" >View All News</Link>
        </div>
      </div>
    </section>
  );
};

export default FutureEvents;
