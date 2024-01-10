import { getEventsByUser } from "@/actions/event.actions";
import { getOrdersByUser } from "@/actions/order.actions";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { OrderWithUserAndEvent, SearchParamProps } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  let orders, organizedEvents;
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;
  try {
    orders = await getOrdersByUser({ userId, page: ordersPage });
    organizedEvents = await getEventsByUser({ userId, page: eventsPage });
  } catch (error) {}

  const orderedEvents =
    orders?.data?.map((order: OrderWithUserAndEvent) => order?.event) || [];
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No events Tickets purchased"
          emptyStateSubtext="Worry not - Plenty of events to explore!"
          collectionType="My_Tickets"
          urlParamName="ordersPage"
          limit={6}
          page={ordersPage}
          totalPages={orders?.totalPages}
        />
      </section>

      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data!}
          emptyTitle="No events have been recorded"
          emptyStateSubtext="Create yours today"
          collectionType="Events_Organized"
          urlParamName="ordersPage"
          limit={6}
          page={eventsPage}
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
