"use client"
import { useContext } from "react";
import { Test } from "./Test";
import DonationFormContext from "@/app/context/donationContext";
import { HerosectionData } from "./data";
import Slider from "react-slick";

const Hero = () => {
  const donationInfo = useContext(DonationFormContext);
  const settings = {
    autoplay: true,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          autoplay: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <>
      <section>
        <Slider {...settings}>
          {HerosectionData.map((value, index) => {
            return (
              <div
                key={index}
                className={`relative h-[700px] bg-cover text-white md:pt-40 md:pb-28 py-20 bg-no-repeat ${index == 0 ? 'bg-[url("/images/hero/banner-bg-2.jpg")]' : 'bg-[url("/images/hero/banner-bg-1.jpg")]'} lg:mt-40 sm:mt-44 mt-20`}>
                <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4 grid grid-cols-12">
                  <div className="bg-white rounded-md p-5 lg:col-span-4 md:col-span-7 sm:col-span-10 col-span-12 dark:bg-dark" data-aos="fade-right">
                    <div className="flex justify-between items-center mb-6">
                      <div className="px-4 py-2 bg-midnight_text rounded-full">
                        <p className=" text-white text-sm font-semibold">
                          {value?.tag_name}
                        </p>
                      </div>
                      <p className="text-black/70 dark:text-white/60 text-base font-medium">{value?.left_days} days left</p>
                    </div>
                    <h3 className="text-black dark:text-white text-4xl font-bold mb-6">
                      {value?.title}
                    </h3>
                    <p className="text-dustGray dark:text-white/60 text-sm font-normal mb-5">
                      {value?.descp}
                    </p>
                    <div className="grid grid-cols-2 rounded-md border border-border dark:border-dark_border mb-5">
                      <div className="col-span-1 border-r border-border dark:border-dark_border px-3 py-3">
                        <p className="text-base font-medium text-black dark:text-white/60 ">Raised</p>
                        <h4 className="text-2xl text-secondary">${value?.raised}</h4>
                      </div>
                      <div className="col-span-1 px-3 py-3">
                        <p className="text-base font-medium text-black dark:text-white/60">Goal</p>
                        <h4 className="text-2xl text-midnight_text dark:text-white">${value?.goal}</h4>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => donationInfo?.setIsDonationOpen(true)}
                        className="text-white text-base bg-error px-7 py-4 border font-semibold border-error hover:border-error hover:bg-transparent hover:text-error rounded-md cursor-pointer"
                      >
                        Donate now
                      </button>
                      <Test />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Slider>
      </section>

    </>

  );
};

export default Hero;
