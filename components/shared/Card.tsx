import Link from "next/link";
import { EventWithCatUser } from "./Collection";
import { formatDateTime } from "@/lib/types";
import Image from "next/image";
import { auth } from "@clerk/nextjs";
import DeleteConfirmation from "./DeleteConfirmation";

interface CardProps {
  event: EventWithCatUser;
  hasOrderLink: boolean;
  hidePrice: boolean;
}
const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth();

  const isCreator = (sessionClaims?.userId as string) === event?.user?.id;
  return (
    <div className="group relative flex w-full max-w-[400px] min-h-[380px] overflow-hidden flex-col bg-white rounded-xl shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event.id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
      {isCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col rounded-xl gap-4 bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event.id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit icon"
              width={20}
              height={20}
            />
          </Link>

          <DeleteConfirmation eventId={event.id} />
        </div>
      )}
      <Link
        href={`/events/${event.id}`}
        className="flex  min-h-[230px] flex-col gap-3 p-5 md:gap-4"
      >
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-md px-4 py-1 text-green-600">
              {event.isFree ? "Free" : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-md bg-grey-500/10 px-4 py-1.5 text-grey-500">
              {event.category.name}
            </p>
          </div>
        )}
        <p className="p-medium-16 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>
        <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
          {event?.title}
        </p>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-gray-600">
            <span className="text-muted-foreground">{"Host | "}</span>
            {event.user.firstName} {event.user.lastName}
          </p>
          {hasOrderLink && (
            <Link href={`/events/${event.id}`} className="flex gap-2">
              <p className="text-primary-500">Order details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="arrow icon"
                height={10}
                width={10}
              />
            </Link>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card;
