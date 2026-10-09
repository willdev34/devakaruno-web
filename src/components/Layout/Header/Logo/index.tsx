import Image from 'next/image';
import Link from 'next/link';

/**
 * Caminho: src/components/Layout/Header/Logo/index.tsx
 * Arquivo: index.tsx
 * Descrição: Logo da marca (versão clara/escura ou sempre branca). A altura é configurável, com 88px como padrão.
 */
interface LogoProps {
  forceWhite?: boolean;
  // Altura em px; a largura acompanha a proporção
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ forceWhite = false, height = 88 }) => {

  if (forceWhite) {
    return (
      <Link href="/">
        <Image
          src="/images/logo/logo-full-white.svg"
          alt="Deva Karuno Terapias"
          width={180}
          height={45}
          style={{ width: 'auto', height: `${height}px` }}
          quality={100}
        />
      </Link>
    );
  }

  return (
    <Link href="/">
      <Image
        src="/images/logo/logo.svg"
        alt="Deva Karuno Terapias"
        width={180}
        height={45}
        style={{ width: 'auto', height: `${height}px` }}
        quality={100}
        className="dark:hidden"
      />
      <Image
        src="/images/logo/logoWhite.svg"
        alt="Deva Karuno Terapias"
        width={180}
        height={45}
        style={{ width: 'auto', height: `${height}px` }}
        quality={100}
        className="dark:block hidden"
      />
    </Link>
  );
};

export default Logo;