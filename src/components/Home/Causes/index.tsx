'use client'
import { CauseData } from '@/app/api/data'
import Image from 'next/image'
import Link from 'next/link'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Causes = () => {
  const settings = {
    autoplay: false,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 100,
    slidesToShow: 3,
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
    <section className='lg:py-28 py-16 bg-grey dark:bg-darkmode'>
      <div className='container mx-auto lg:max-w-(--breakpoint-xl) px-4 '>
        <h2
          className='text-center text-3xl font-semibold mb-3'>
          Causes where need your help
        </h2>
        <p className='text-dustGray dark:text-white/60 text-center'>
          Support essential causes like healthcare, education, hunger relief,
          and empowering <br className='lg:block hidden' /> vulnerable
          communities. Together, we can create lasting change!
        </p>
        <div className='flex flex-col items-center gap-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-20'>
            {CauseData.slice(0, 3).map((item, index) => (
              <Link href={`/cause/${item.slug}`} key={index} className='px-4'>
                <div
                  className='bg-white group dark:bg-dark rounded-md overflow-hidden '
                  data-aos='fade-up'
                  data-aos-delay={`${index * 250}`}>
                  <div className='overflow-hidden h-[250px]'>
                    <Image
                      src={item.image}
                      alt='image'
                      width={350}
                      height={250}
                      className='w-full h-full object-cover group-hover:scale-110 duration-300'
                    />
                  </div>
                  <div className='p-8 shadow-cause-shadow dark:shadow-darkmd'>
                    <h4 className='text-midnight_text text-lg font-bold dark:text-white group-hover:text-primary mb-4'>
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
          <Link href={"/cause"} className="text-white text-base bg-primary px-7 py-4 border font-semibold border-primary hover:border-primary hover:bg-transparent hover:text-primary rounded-md cursor-pointer">
            View All Causes</Link>
        </div>
      </div>
    </section>
  )
}

export default Causes
