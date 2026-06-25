import HeroSub from "@/components/SharedComponent/HeroSub";
import CauseList from "@/components/Cause/CauseList";
import Volunteer from "@/components/SharedComponent/Volunteer";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Terapia Tântrica | Deva Karuno Terapias",
};

const Page = () => {
    return (
        <>
            <HeroSub
                title="Cause List"
            />
            <CauseList />
            <Volunteer />
        </>
    )
}

export default Page;