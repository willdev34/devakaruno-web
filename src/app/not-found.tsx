import HeroSub from "@/components/SharedComponent/HeroSub";
import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

const ErrorPage = () => {
  return (
    <>
      <HeroSub
        title="404"
        bgImage="/images/background/hero-maos.jpg"
      />
      <NotFound />
    </>
  );
};

export default ErrorPage;
