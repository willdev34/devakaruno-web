import DonationFormContext from "@/app/context/donationContext";
import Link from "next/link"
import { useContext } from "react";

const FormPart = () => {
    const donationInfo  = useContext(DonationFormContext);
    return (
        <>
            <div className="bg-grey dark:bg-darkmode py-5 px-8 rounded-sm border border-border dark:border-dark_border mb-8 ">
                <p className="mb-0 text-base text-muted dark:text-white/60">
                    <span className="text-midnight_text dark:text-white">Notice:</span> Test mode is enabled. While in test mode no live donations are processed.
                </p>
            </div>
            <div className="bg-grey dark:bg-darkmode px-8 py-14 rounded-sm border border-border dark:border-dark_border mb-8 ">
                <div className="border border-border dark:border-dark_border py-5 px-10 rounded-md mb-11">
                    <p className="text-sm text-muted dark:text-white/60">
                        The maximum custom donation amount for this form is $999,999.99
                    </p>
                </div>
                <form className="">
                    <div className="flex items-center mb-4">
                        <label htmlFor="amount2" className="rounded-s-lg bg-white border border-border dark:bg-darkmode dark:border-dark_border px-4 py-5 text-base ">
                            $
                        </label>
                        <input type="number" name="amount" id="amount2" placeholder="999,999.99" className="px-4 py-5 border rounded-e-lg dark:focus:border-primary focus:border-primary dark:bg-darkmode focus-visible:outline-hidden dark:border-dark_border text-base" />
                    </div>
                    <p className="text-base text-muted dark:text-white/60">
                        Custom amount
                    </p>
                    <div className="mb-7">
                        <h5 className="text-base font-medium mb-4 pb-3 border-b border-border dark:border-dark_border">
                            Select payment method
                        </h5>
                        <div className="flex gap-4">
                            <div className="flex gap-2">
                                <input type="radio" name="donation" id="Test" />
                                <label htmlFor="Test" className="text-muted dark:text-white/60">Test donation</label>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="donation" id="Offline" />
                                <label htmlFor="Offline" className="text-muted dark:text-white/60">Offline donation</label>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <h5 className="text-base font-medium mb-4 pb-3 border-b border-border dark:border-dark_border">
                            Personal info
                        </h5>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-7 mb-7">
                            <div className="flex flex-col">
                                <label htmlFor="Fname" className="text-base text-muted dark:text-white/60 mb-4">First name *</label>
                                <input type="text" id="Fname" placeholder="First name" className="py-5 px-4 border rounded-md border-border dark:focus:border-primary dark:bg-darkmode focus:border-primary focus-visible:outline-hidden dark:border-dark_border text-base" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="Lname" className="text-base text-muted dark:text-white/60 mb-4">Last name</label>
                                <input type="text" id="Lname" placeholder="Last name" className="py-5 px-4 border rounded-md border-border dark:focus:border-primary dark:bg-darkmode focus:border-primary focus-visible:outline-hidden dark:border-dark_border text-base" />
                            </div>
                        </div>
                        <div className="flex flex-col mb-7">
                            <label htmlFor="Email" className="text-base text-muted dark:text-white/60 mb-4">Email address *</label>
                            <input type="text" id="Email" placeholder="Email address" className="py-5 px-4 border rounded-md border-border dark:focus:border-primary dark:bg-darkmode focus:border-primary focus-visible:outline-hidden dark:border-dark_border text-base" />
                        </div>
                        <div className="flex justify-between items-center mb-7 lg:flex-nowrap flex-wrap">
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" id="account" name="account" />
                                <label htmlFor="account" className="text-muted dark:text-white/60 text-base"> Create an account</label>
                            </div>
                            <div className="">
                                <p className="text-base text-muted dark:text-white/60">
                                    Already have an account? <Link href="#" className="text-midnight_text dark:text-white hover:text-primary!">Login</Link>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center md:flex-nowrap flex-wrap mb-4 md:gap-0 gap-2">
                            <label htmlFor="amount" className="md:rounded-none md:rounded-s-lg rounded-lg  bg-white whitespace-nowrap dark:bg-darkmode dark:border-dark_border border border-border px-4 py-5 text-base ">
                                Donation total:
                            </label>
                            <input type="number" name="amount" id="amount" placeholder="$2,001,230.00" className="px-4 py-5 text-base border md:rounded-none md:rounded-e-lg rounded-lg dark:focus:border-primary focus:border-primary dark:bg-darkmode focus-visible:outline-hidden dark:border-dark_border placeholder:text-primary/30" />
                        </div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            donationInfo?.setIsDonationOpen(true)
                        } } className="text-white text-sm bg-linear-to-r from-primary to-secondary font-semibold border border-transparent py-4 px-7 rounded-md hover:text-primary hover:border-primary hover:from-transparent hover:to-transparent cursor-pointer">Donate now</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default FormPart;