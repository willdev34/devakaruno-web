import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Eventdata } from "@/app/api/data";
import { format } from "date-fns";

const EventList = () => {
  return (
    <section className="lg:py-28 py-16 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {Eventdata.map((item, index) => (
            <Link key={index} href={`/events/${item.slug}`} className="group" data-aos="fade-up" data-aos-delay={`${index * 120}`}>
              <div className="relative overflow-hidden mb-8">
                <div className="h-[250px]">
                  <Image
                    src={item.image}
                    alt="image"
                    width={350}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 duration-300 scale-[1.01]"
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
              <h4 className="text-lg font-medium mb-3.5 group-hover:text-primary">
                {item.title}
              </h4>
              <p className="text-muted dark:text-white/60 text-base mb-6">{item.text}</p>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventList;
