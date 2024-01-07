import { getEventById, getEventWithUserById } from "@/actions/event.actions";
import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";

const UpdateEventPage = async ({ params }: { params: { id: string } }) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  const event = await getEventById(params.id);
  //console.log(event);
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Edit Event</h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={userId} type="Update" event={event} />
      </div>
    </>
  );
};

export default UpdateEventPage;
