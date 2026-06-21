'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SocialSignIn from '../SocialSignIn'
import Logo from '@/components/Layout/Header/Logo'
import Loader from '@/components/Common/Loader'

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let errors = { email: "", password: "" };
    let isValid = true;

    if (!loginData.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!loginData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.setItem("user", JSON.stringify({ user: loginData.email }));
      router.push("/");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <SocialSignIn />

      <span className='z-1 relative my-8 block text-center'>
        <span className='-z-1 absolute left-0 top-1/2 block h-px w-full bg-border dark:bg-dark_border'></span>
        <span className='text-muted dark:text-white/60 relative z-10 inline-block bg-white px-3 text-base dark:bg-dark'>
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className='mb-[22px]'>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className='w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className='w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary'
          />
        </div>
        <div className='mb-9'>
          <button
            type='submit'
            className='flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-primary/75 dark:hover:bg-darkprimary! px-5 py-3 text-base text-white font-medium transition duration-300 ease-in-out'>
            Sign In
           {loading && <Loader />}
          </button>
        </div>
      </form>
      <div className='flex flex-col items-center justify-center'>
        <Link
          href='/forgot-password'
          className='mb-2 inline-block text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary'>
          Forget Password?
        </Link>
        <p className='text-body-secondary text-base'>
          Not a member yet?{' '}
          <Link href={'./signup'} className='text-dark dark:text-white hover:text-primary dark:hover:text-primary'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signin
