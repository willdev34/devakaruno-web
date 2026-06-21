import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {

  return (
    <Link href="/">
      <Image
        src="/images/logo/logo.svg"
        alt="Deva Karuno Terapias"
        width={180}
        height={45}
        style={{ width: 'auto', height: '88px' }}
        quality={100}
        className='dark:hidden'
      />
      <Image
        src="/images/logo/logoWhite.svg"
        alt="Deva Karuno Terapias"
        width={180}
        height={45}
        style={{ width: 'auto', height: '88px' }}
        quality={100}
        className='dark:block hidden'
      />
    </Link>
  );
};

export default Logo;