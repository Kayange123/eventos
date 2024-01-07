"use server";

import { db } from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { Event } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type CreateEventProps = {
  userId: string;
  event: Omit<Event, "id" | "createdAt" | "updatedAt" | "hostId">;
  path: string;
};

export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventProps) => {
  let newEvent;

  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  try {
    newEvent = await db.event.create({
      data: {
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        isFree: event.isFree,
        location: event.location,
        price: event.price,
        url: event.url,
        hostId: userId,
        categoryId: event.categoryId,
      },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }

  return newEvent;
};

export const getEventWithUserById = async (id: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });
    if (!event) throw new Error("Event Not Found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.log(error);
    //throw new Error("Internal server error");
  }
};

export const getEventById = async (id: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id },
    });
    if (!event) throw new Error("Event Not Found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.log(error);
    //throw new Error("Internal server error");
  }
};

export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) => {
  const skipAmount = (Number(page) - 1) * limit;
  const titleCondition = query
    ? { title: { contains: query, mode: "insensitive" } }
    : {};

  const categoryCondition = category
    ? { category: { some: { name: category } } }
    : {};

  const conditions = {
    AND: [titleCondition, categoryCondition],
  };

  const events = await db.event.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: true,
      category: true,
    },
    skip: skipAmount,
  });

  const eventsCount = await db.event.count({});

  return {
    data: events,
    totalPages: Math.ceil(eventsCount / limit),
  };
};

export const deleteEvent = async ({
  eventId,
  path,
}: {
  eventId: string;
  path: string;
}) => {
  try {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    if (!userId || eventId) {
      throw new Error("No ID provided");
    }
    const event = await db.event.delete({
      where: {
        id: eventId,
        user: {
          id: userId,
        },
      },
    });
    if (!event) {
      throw new Error("Failed to delete event");
    }
    revalidatePath(path);
  } catch (error) {
    throw new Error("Internal server error");
  }
};
