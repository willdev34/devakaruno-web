import EventDetail from "@/components/Events/EventDetail/EventDetail";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Event Detail | Endeavor",
};

const Page = () => {
    return (
        <>
            <EventDetail/>
        </>
    )
}

export default Page;