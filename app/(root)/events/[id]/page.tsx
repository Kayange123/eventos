import {
  getEventWithUserById,
  getRelatedEventsByCategory,
} from "@/actions/event.actions";
import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import { SearchParamProps, formatDateTime } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { Category, Event, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type EventWithUser = Event & {
  user: User;
  category: Category;
};

const EventPage = async ({ params, searchParams }: SearchParamProps) => {
  if (!params.id) redirect("/");

  const { sessionClaims } = auth();

  const event = (await getEventWithUserById(params.id)) as EventWithUser;
  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.categoryId,
    eventId: event.id,
    limit: 3,
    page: searchParams.page as string,
  });
  if (!event) {
    return redirect("/");
  }

  const isCreator = (sessionClaims?.userId as string) === event?.user?.id;
  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="event banner"
            height={1000}
            width={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6 justify-start items-start">
              <h2 className="h2-bold">{event.title}</h2>
              <div className="flex flex-col gap-3 sm:flex-row items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-md bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? "Free" : `$${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-md bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-primary-500">
                    {event.user.firstName} {event.user.lastName}
                  </span>
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            {<CheckoutButton event={event} />}

            <div className="flex flex-col gap-7">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-col flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} {" - "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} {" - "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-reguler-20 flex items-center gap-5 text-muted-foreground">
                <Image
                  src="/assets/icons/location.svg"
                  alt="Location marker"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">What you will learn: </p>
              <p className="p-medium-16 lg:p-regular-18 text-muted-foreground">
                {event.description}
              </p>
              {event.url && (
                <div className="flex gap-2">
                  <Image
                    src="/assets/icons/link.svg"
                    alt="link"
                    height={25}
                    width={25}
                  />
                  <Link
                    href={event.url}
                    target="_blank"
                    className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline"
                  >
                    {event.url}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection
          collectionType="Events_Organized"
          emptyStateSubtext="Check Again Later"
          page={1}
          data={relatedEvents?.data}
          limit={6}
          emptyTitle="No Related Events for this Host"
          totalPages={2}
        />
      </section>
    </>
  );
};

export default EventPage;
