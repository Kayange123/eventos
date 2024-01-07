import { getAllEvents } from "@/actions/event.actions";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const events = await getAllEvents({
    query: "",
    category: "",
    page: 1,
    limit: 6,
  });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-4">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, connect and collaborate: Your events keep us connected!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              {`Let's build the community and learn from 10,000+ mentors around the world. 
              Enventos - Home of events`}
            </p>
            <Button asChild className="button w-full sm:w-fit group transition">
              <Link href="#events">
                Explore more
                <ArrowRight className="ml-3 h-5 w-5 group-hover:rotate-90 duration-200 transition-transform group-active:rotate-90" />
              </Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero2.png"
            alt="hero image"
            width={1000}
            height={1000}
            className="object-contain max-h-[70vh] 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">Meet thousands of users and events</h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          Search CategoryFilter
        </div>
        <Collection
          data={events?.data}
          emptyTitle="No events Found"
          emptyStateSubtext="Try again later"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={2}
        />
      </section>
    </>
  );
}
