import HeroSub from "@/components/SharedComponent/HeroSub";
import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page | Venus ",
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
