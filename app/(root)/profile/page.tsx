import { getEventsByUser } from "@/actions/event.actions";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const organizedEvents = await getEventsByUser({ userId, page: 1 });
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
          data={[]}
          emptyTitle="No events Tickets purchased"
          emptyStateSubtext="Worry not - Plenty of events to explore!"
          collectionType="My_Tickets"
          urlParamName="ordersPage"
          limit={6}
          page={1}
          totalPages={2}
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
          data={organizedEvents}
          emptyTitle="No events have been recorded"
          emptyStateSubtext="Create yours today"
          collectionType="Events_Organized"
          urlParamName="ordersPage"
          limit={6}
          page={1}
          totalPages={2}
        />
      </section>
    </>
  );
};

export default ProfilePage;
