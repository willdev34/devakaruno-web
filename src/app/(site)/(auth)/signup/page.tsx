import SignUp from '@/components/Auth/SignUp'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar conta | Deva Karuno Terapias',
}

const SignupPage = () => {
  return (
    <>
      <div className='pt-32 sm:pt-56 pb-10 px-4 bg-grey dark:bg-darkmode'>
        <div className='container mx-auto max-w-25 overflow-hidden rounded-lg bg-white dark:bg-dark text-center px-8 py-14 sm:px-12 md:px-16'>
          <SignUp />
        </div>
      </div>
    </>
  )
}

export default SignupPage
