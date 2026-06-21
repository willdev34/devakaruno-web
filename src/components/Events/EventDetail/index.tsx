import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface EventProps {
  title?: string;
  detail?: string;
  category?: string;
  location?: string;
  eventdate?: string;
  duration?: string;
  type?: string;
  entrants?: string;
  image?: any;
}

const EventDetails: FC<EventProps> = ({
  title,
  detail,
  category,
  location,
  eventdate,
  duration,
  type,
  entrants,
  image
}) => {
  const formattedDate = eventdate
    ? format(new Date(eventdate), "MMM dd, yyyy")
    : "Date not available";
  return (
    <section className="sm:mt-28 pt-32 sm:pb-28 pb-12 dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
        <div className="grid grid-cols-12 gap-8">
          <div className="lg:col-span-9 col-span-12">
            <div className="flex  gap-6 col-span-4 pt-4 md:pt-0">
              <div className="h-[500px] w-full mb-10">
                <Image
                  src={image}
                  alt="image"
                  className="w-full h-full object-cover rounded-lg"
                  width={1170}
                  height={766}
                  quality={100}
                />
              </div>
            </div>
            <h2 className="text-4xl font-medium text-darktext">{title}</h2>
            <p className="text-dustGray dark:text-white/60 text-base my-8">{detail}</p>
          </div>
          <div className="lg:col-span-3 md:col-span-5 sm:col-span-6 col-span-12 lg:mt-0 mt-8">
            <h4 className="text-darktext text-lg font-medium mb-6">Info</h4>
            <div className="pb-6 border-b border-border mb-6 dark:border-dark_border">
              <table>
                <tbody>
                  <tr className="">
                    <td>
                      <h5 className="text-black dark:text-white/60 text-base pb-4">Category:</h5>
                    </td>
                    <td>
                      <p className="text-dustGray dark:text-white/60 text-base pb-4 pl-4">{category}</p>
                    </td>
                  </tr>
                  <tr className="">
                    <td>
                      <h5 className="text-black dark:text-white/60 text-base pb-4">Location:</h5>
                    </td>
                    <td>
                      <p className="text-dustGray dark:text-white/60 text-base pb-4 pl-4">{location}</p>
                    </td>
                  </tr>
                  <tr className="">
                    <td>
                      <h5 className="text-black dark:text-white/60 text-base pb-4">Date:</h5>
                    </td>
                    <td>
                      <p className="text-dustGray dark:text-white/60 text-base pb-4 pl-4">
                        {formattedDate}
                      </p>
                    </td>
                  </tr>
                  <tr className="">
                    <td>
                      <h5 className="text-black dark:text-white/60 text-base pb-4">Duration:</h5>
                    </td>
                    <td>
                      <p className="text-dustGray dark:text-white/60 text-base pb-4 pl-4">{duration}</p>
                    </td>
                  </tr>
                  <tr className="">
                    <td>
                      <h5 className="text-black dark:text-white/60 text-base pb-4">Type:</h5>
                    </td>
                    <td>
                      <p className="text-dustGray dark:text-white/60 text-base pb-4 pl-4">{type}</p>
                    </td>
                  </tr>
                  <tr className="">
                    <td>
                      <h5 className="text-black dark:text-white/60 text-base pb-4">Entrants:</h5>
                    </td>
                    <td>
                      <p className="text-dustGray dark:text-white/60 text-base pb-4 pl-4">{entrants}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium text-darktext">Share</h5>
              <div className="flex items-center gap-4">
                <Link href="#">
                  <Image
                    src="/images/icons/icon-facebook.svg"
                    alt="icon"
                    width={16}
                    height={16}
                    className="h-4 w-4 hover:opacity-70"
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="/images/icons/icon-instagram.svg"
                    alt="icon"
                    width={16}
                    height={16}
                    className="h-4 w-4 hover:opacity-70"
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="/images/icons/icon-linkedin.svg"
                    alt="icon"
                    width={16}
                    height={16}
                    className="h-4 w-4 hover:opacity-70"
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="/images/icons/icon-twitter.svg"
                    alt="icon"
                    width={16}
                    height={16}
                    className="h-4 w-4 hover:opacity-70"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
