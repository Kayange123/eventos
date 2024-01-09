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
export type UpdateEventProps = {
  userId: string;
  event: Omit<Event, "id" | "createdAt" | "updatedAt" | "hostId">;
  path: string;
  eventId: string;
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

export const updateEvent = async ({
  event,
  userId,
  path,
  eventId,
}: UpdateEventProps) => {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }
  let updatedEvent;
  try {
    updatedEvent = await db.event.update({
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
        categoryId: event.categoryId,
      },
      where: {
        id: eventId,
        hostId: userId,
      },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
  return updatedEvent;
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
    throw new Error("Internal server error");
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
    throw new Error("Internal server error");
  }
};

export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) => {
  const skipAmount = (Number(page) - 1) * limit;

  const events = await db.event.findMany({
    where: {
      AND: [
        query ? { title: { contains: query, mode: "insensitive" } } : {},
        category ? { category: { name: category } } : {},
      ],
    },
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
    if (!userId || !eventId) {
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
    console.log(error);
    throw new Error("Internal server error");
  }
};

export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      AND: [
        {
          categoryId,
        },
        {
          id: { not: eventId },
        },
      ],
    };

    const eventsQuery = await db.event.findMany({
      where: conditions,
      skip: skipAmount,
      take: limit,
      include: { category: true, user: true },
      orderBy: { createdAt: "desc" },
    });

    const eventsCount = await db.event.count({
      where: conditions,
    });

    return {
      data: JSON.parse(JSON.stringify(eventsQuery)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    throw new Error("Internal server error");
  }
}
export async function getEventsByUser({
  userId,
  page = 1,
  limit = 4,
}: {
  userId: string;
  page: number | string;
  limit?: number;
}) {
  let events;
  let totalPages;

  const skipAmount = (Number(page) - 1) * limit;
  try {
    events = await db.event.findMany({
      where: { hostId: userId },
      take: limit,
      skip: skipAmount,
      include: { user: true, category: true },
    });
    const count = await db.event.count({
      where: { hostId: userId },
    });
    totalPages = Math.ceil(count / limit);
  } catch (error) {
    throw new Error("Internal server error");
  }
  return {
    data: events,
    totalPages,
  };
}
