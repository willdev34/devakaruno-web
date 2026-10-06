'use client'
import Logo from '@/components/Layout/Header/Logo'
import SocialSignIn from '../SocialSignIn'

const Signin = () => {
  return (
    <div>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <SocialSignIn />
    </div>
  )
}

export default Signin