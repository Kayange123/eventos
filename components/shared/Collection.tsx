import { Category, Event, User } from "@prisma/client";
import Card from "./Card";

export type EventWithCatUser = Event & {
  category: Category;
  user: User;
};

interface CollectionProps {
  data: EventWithCatUser[];
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType?: "All_Events" | "My_Tickets" | "Events_Organized";
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
}

const Collection = ({
  data,
  emptyStateSubtext,
  emptyTitle,
  collectionType,
  limit,
  page,
  totalPages,
}: CollectionProps) => {
  return (
    <>
      {data?.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              const hasOrderLink = collectionType === "Events_Organized";
              const hidePrice = collectionType === "My_Tickets";

              return (
                <li key={event.id} className="flex justify-center">
                  <Card
                    event={event}
                    hasOrderLink={hasOrderLink}
                    hidePrice={hidePrice}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex-center wrapper w-full flex-col gap-3 rounded-[14px] bg-grey-50 min-h-[200px] py-28 text-center text-muted-foreground">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
