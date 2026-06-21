import React, { FC } from 'react'

interface HeroSubProps {
  title: string
  bgImage?: string
}

const HeroSub: FC<HeroSubProps> = ({ title, bgImage }) => {
  const backgroundImage = bgImage || "/images/background/hero-sub-banner.avif"

  return (
    <section
      className="relative py-10 sm:py-20 bg-no-repeat bg-center bg-cover lg:mt-40 sm:mt-44 mt-20"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-[var(--breakpoint-xl)] px-4">
        <h2
          className="text-white md:text-5xl sm:text-4xl text-3xl font-medium"
          data-aos="fade-right"
        >
          {title}
        </h2>
      </div>
    </section>
  )
}

export default HeroSub
