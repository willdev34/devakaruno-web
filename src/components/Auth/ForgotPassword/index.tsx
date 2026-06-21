"use client";
import { useState } from "react";
import Image from "next/image";
import Loader from "@/components/Common/Loader";
import Logo from "@/components/Layout/Header/Logo";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loader, setLoader] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Function to validate email
    const validateEmail = (value: string) => {
        if (!value) {
            setEmailError("Email is required.");
            return false;
        }
        if (!emailRegex.test(value)) {
            setEmailError("Invalid email format.");
            return false;
        }
        const domain = value.split("@")[1];
        setEmailError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) return;

        setLoader(true);
        setTimeout(() => {
            setLoader(false);
            setIsEmailSent(true);
        }, 2000);
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
                <div className="">
                    <div className='mb-10 text-center mx-auto inline-block'>
                        <Logo />
                    </div>

                    {isEmailSent ? (
                        <div className="flex flex-col items-center gap-5">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-dark dark:text-white text-center text-3xl font-semibold mb-1">
                                    Forgot Your Password?
                                </h2>
                                <p className="text-base text-muted dark:text-white/60 text-center">
                                    Please check your inbox for the new password.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5 text-left">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        validateEmail(e.target.value);
                                    }}
                                    required
                                    className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
                                />
                                {emailError && (
                                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                                )}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-primary/75 dark:hover:bg-darkprimary! px-5 py-3 text-base text-white font-medium transition duration-300 ease-in-out"
                                    disabled={loader}
                                >
                                    {loader ? <Loader /> : "Send Email"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
