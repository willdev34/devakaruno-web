"use client";
import Volunteer from "@/components/SharedComponent/Volunteer";
import EventDetails from "@/components/Events/EventDetail";
import { useParams } from "next/navigation";
import { Eventdata } from "@/app/api/data";

const EventDetail = () => {
  const { slug } = useParams();

  const item = Eventdata.find((item) => item.slug === slug);
  return (
    <>
      <EventDetails
        title={item?.title}
        detail={item?.detail}
        category={item?.category}
        location={item?.location}
        eventdate={item?.date}
        duration={item?.duration}
        type={item?.type}
        entrants={item?.entrants}
        image={item?.image}
      />
      <Volunteer />
    </>
  );
};

export default EventDetail;
