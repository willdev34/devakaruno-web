import HeroSub from "@/components/SharedComponent/HeroSub";
import EventList from "@/components/Events/EventList";
import Volunteer from "@/components/SharedComponent/Volunteer";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Event List | Endeavor",
};

const Page = () => {
    return (
        <>
            <HeroSub
                title="Event List"
            />
            <EventList />
            <Volunteer />
        </>
    )
}

export default Page;