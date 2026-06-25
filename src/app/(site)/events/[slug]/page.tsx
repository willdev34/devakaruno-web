import EventDetail from "@/components/Events/EventDetail/EventDetail";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Curso | Deva Karuno Terapias",
};

const Page = () => {
    return (
        <>
            <EventDetail/>
        </>
    )
}

export default Page;