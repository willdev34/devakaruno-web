import SocialSignIn from "@/components/Auth/SocialSignIn"
import Logo from "@/components/Layout/Header/Logo"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"


export const Donation = () => {
  const [donationAmount , setDonationAmount] = useState(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function getDonationAmount(value:any){
    setDonationAmount(value)
  }
  useEffect(()=>{
    if(donationAmount!==null && inputRef.current){
    }
  },[donationAmount])
 
    return (
        <>
        <div className="mb-10 text-center mx-auto inline-block max-w-[170px]">
          <Logo />
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-[22px]">
            <input
              type="text"
              placeholder="First name"
              className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-[22px]">
            <input
              type="text"
              placeholder="Last name"
              className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-[22px]">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-2.5">
            <input
              type="text"
              ref={inputRef}
              placeholder="Choose donation amount"
              className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-2">
                        <div className="flex gap-4">
                            <div className="flex gap-2">
                                <input type="radio" name="donation" id="Test" onChange={(e:any) => getDonationAmount(e.target.value)} value={10} />
                                <label htmlFor="Test" className="text-muted dark:text-white/60">$10</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="donation" id="Offline" onChange={(e:any) => getDonationAmount(e.target.value)} value={50} />
                                <label htmlFor="Offline" className="text-muted dark:text-white/60">$50</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="donation" id="Offline2" onChange={(e:any) => getDonationAmount(e.target.value)} value={100} />
                                <label htmlFor="Offline2" className="text-muted dark:text-white/60">$100</label>
                            </div>
                        </div>
            </div>
            <div className="mb-[22px] flex items-center gap-6">
            <input
              type="number"
              onChange={(e:any) => {getDonationAmount(e.target.value)}}
              placeholder="$ Other value"
              className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="flex gap-2 items-center">
                                <input type="checkbox" id="account" name="account" />
                                <label htmlFor="account" className="text-muted dark:text-white/60 text-base">I would like to donate anonymously</label>
                            </div>
                    
          <div className="mb-0 mt-6">
            <button
              type="submit"
              className="text-white w-full text-base bg-linear-to-r from-primary to-secondary font-semibold border border-transparent py-4 px-7 rounded-md hover:text-primary hover:border-primary hover:from-transparent hover:to-transparent cursor-pointer"
            >
              Donate now
            </button>
          </div>
        </form>
      </>
    )
}