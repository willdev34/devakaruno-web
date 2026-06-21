"use client";
import React from "react";
import { CauseData } from "@/app/api/data";
import { useParams } from "next/navigation";
import FormPart from "@/components/Cause/CauseDetails/formPart";
import TextPart from "@/components/Cause/CauseDetails/textPart";
import Volunteer from "@/components/SharedComponent/Volunteer";
import Image from "next/image";
import Link from "next/link";

const CauseDetail = () => {

    const { slug } = useParams();

    const item = CauseData.find((item) => item.slug === slug);
    if (!item) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <section className="dark:bg-dark lg:pt-44 sm:pt-52 pt-32 py-24">
                <div className="container mx-auto lg:max-w-(--breakpoint-xl) md:max-w-(--breakpoint-md) px-4">
                    <div className="flex flex-col items-center">
                        <div className="max-w-3xl">
                            <Link href={"/cause"}>
                                <div className="w-fit flex items-center mb-6 gap-1.5 text-base bg-primary hover:bg-primary/80 text-white py-1.5 px-2 leading-none rounded-lg font-medium text-nowrap">
                                    <div className="w-6 h-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" color="var(--token-791e7a5e-b1ee-4e3a-80ff-69f4a953e776, rgb(255, 255, 255))" ><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd"></path></svg>
                                    </div>
                                    Go Back
                                </div>
                            </Link>
                            <div className="rounded-lg overflow-hidden mb-8 h-[500px]">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={870}
                                    height={750}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h1 className="text-[40px] leading-tight font-semibold mb-8">
                                {item.title}
                            </h1>
                            <div className="flex items-center justify-between">
                                <div className="bg-black px-3 py-1 w-fit rounded-full"><span className="text-white font-normal">{item.tag}</span></div>
                                <p className="text-base font-normal text-dustGray">{item.date}</p>
                            </div>
                            <div className='grid grid-cols-2 max-w-96 mt-7 border dark:border-dark_border rounded-md'>
                                <div className='border-r dark:border-dark_border p-3'>
                                    <h4 className='text-dustGray dark:text-white/60 text-base font-medium'>
                                        Raised
                                    </h4>
                                    <h5 className='text-2xl font-medium text-primary'>{item.raised}</h5>
                                </div>
                                <div className='p-3'>
                                    <h4 className='text-dustGray dark:text-white/60 text-base font-medium'>
                                        Goal
                                    </h4>
                                    <h5 className='text-2xl font-medium'>{item.goal}</h5>
                                </div>
                            </div>
                            <TextPart />
                        </div>
                    </div>
                </div>
            </section>
            <Volunteer />
        </>
    );
};

export default CauseDetail;