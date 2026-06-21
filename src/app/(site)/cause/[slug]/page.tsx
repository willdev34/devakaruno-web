import CauseDetail from "@/components/Home/Causes/CauseDetail";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Cause Detail | Endeavor",
};

const Page = () => {
    return (
        <>
            <CauseDetail/>
        </>
    )
}

export default Page;