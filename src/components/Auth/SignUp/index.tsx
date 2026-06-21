'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SocialSignUp from '../SocialSignUp'
import Logo from '@/components/Layout/Header/Logo'
import { useState } from 'react'
import Loader from '@/components/Common/Loader'

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (!/^[a-zA-Z\s]{3,}$/.test(name)) return "Name must be at least 3 characters and contain only letters";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: name === "name"
        ? validateName(value)
        : name === "email"
          ? validateEmail(value)
          : validatePassword(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ name: nameError, email: emailError, password: passwordError });
    if (nameError || emailError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.setItem("user", JSON.stringify({ user: formData.name }));
      router.push("/");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <SocialSignUp />

      <span className='z-1 relative my-8 block text-center'>
        <span className='-z-1 absolute left-0 top-1/2 block h-px w-full bg-border dark:bg-dark_border'></span>
        <span className='text-muted dark:text-white/60 relative z-10 inline-block bg-white px-3 text-base dark:bg-dark'>
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className='mb-[22px]'>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
          />
          {errors.name && <p className="text-red-500 dark:text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className='mb-[22px]'>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary'
          />
          {errors.email && <p className="text-red-500 dark:text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className='mb-[22px]'>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary'
          />
          {errors.password && <p className="text-red-500 dark:text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className='mb-9'>
          <button
            type='submit'
            className='flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-primary/75 dark:hover:bg-darkprimary! px-5 py-3 text-base text-white font-medium transition duration-300 ease-in-out'>
            Sign Up {loading && <Loader />}
          </button>
        </div>
      </form>

      <p className='text-body-secondary mb-4 text-base'>
        By creating an account you are agree with our{' '}
        <a href='/#' className='text-dark dark:text-white hover:text-primary dark:hover:text-primary'>
          Privacy
        </a>{' '}
        and{' '}
        <a href='/#' className='text-dark dark:text-white hover:text-primary dark:hover:text-primary'>
          Policy
        </a>
      </p>

      <p className='text-body-secondary text-base'>
        Already have an account?
        <Link href={'./signin'} className='pl-2 text-dark dark:text-white hover:text-primary dark:hover:text-primary'>
          Sign In
        </Link>
      </p>
    </>
  )
}

export default SignUp
