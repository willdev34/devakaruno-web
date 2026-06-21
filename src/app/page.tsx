import React from 'react'
import { Metadata } from "next";
import Hero from '@/components/Home/Hero';
import Help from '@/components/Home/Help';
import Causes from '@/components/Home/Causes';
import FutureEvents from '@/components/Home/FutureEvents';
import UrgentDonation from '@/components/Home/UrgentDonation';
import Newsletter from '@/components/Home/NewsLetter';
import Testimonial from '@/components/Home/Testimonial';
import Volunteer from '@/components/SharedComponent/Volunteer';
export const metadata: Metadata = {
  title: "Endeavor",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Help />
      <Causes />
      <FutureEvents />
      <UrgentDonation />
      <Newsletter />
      <Testimonial />
      <Volunteer />
    </main>
  )
}
