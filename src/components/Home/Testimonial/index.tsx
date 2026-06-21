"use client"
import { Reviews } from "@/app/api/data";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonial = () => {
    const settings = {
        autoplay: true,
        dots: true,
        arrows: false,
        infinite: true,
        speed: 100,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <section className="lg:py-28 py-16 bg-grey dark:bg-darkmode">
            <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4">
                <h2 className="text-3xl font-medium mb-3 text-center">
                    Check what our donators are saying
                </h2>
                <p className="text-base text-center text-dustGray dark:text-white/60 lg:max-w-60% mx-auto">
                Discover heartfelt stories from our supporters who are helping us make a difference. See how their contributions are changing lives and inspiring hope!
                </p>
                <div className="mt-20">
                    <Slider {...settings}>
                        {Reviews.map((item, index) => (
                            <div key={index} className="px-3" data-aos="fade-up" data-aos-delay={`${index * 180}`}>
                                <div className="bg-white dark:bg-dark pt-12 pb-6 pr-16 pl-10 rounded-md relative">
                                    <div className="absolute bg-linear-to-r from-primary to-secondary py-2 pr-6 pl-24 top-11 left-0 flex">
                                        <div className="relative">
                                            <Image
                                                src={item.clientImg}
                                                alt={item.clientName}
                                                width={60}
                                                height={60}
                                                className="w-3.75 h-3.75 object-cover rounded-full absolute -top-4 -left-20"
                                            />
                                            <p className="text-white text-lg ">
                                                {item.clientName}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-base text-dustGray dark:text-white/60 mt-16">
                                        {item.review}
                                    </p>
                                    <h5 className="text-base pt-5 mt-5 relative before:content-[''] before:absolute before:w-28 before:h-px before:bg-border dark:before:bg-dark_border before:top-0 before:left-0">
                                        {item.post}
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    )
}

export default Testimonial;