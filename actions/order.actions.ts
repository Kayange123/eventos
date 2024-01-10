"use server";

import { db } from "@/lib/database";
import { CreateOrderParams } from "@/lib/types";
import { redirect } from "next/navigation";
import Stripe from "stripe";

interface CheckoutOrderParam {
  eventTitle: string;
  eventId: string;
  price: string | null;
  isFree: boolean;
  buyerId: string;
}

export const checkoutOrder = async (order: CheckoutOrderParam) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const price = order.isFree ? 0 : Number(order?.price) * 100;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order?.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order?.eventId,
        buyerId: order?.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    const url = session?.url as string;

    redirect(url);
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    const newOrder = await db.order.create({
      data: { ...order, buyerId: order.buyerId, eventId: order.eventId },
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};

export const getOrdersByUser = async ({
  userId,
  page,
  limit = 4,
}: {
  userId: string;
  page: number;
  limit?: number;
}) => {
  try {
    const skipAmount = (Number(page) - 1) * limit;
    const orders = await db.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: limit,
      include: { event: { include: { user: true } } },
    });
    const ordersCount = await db.order.count({ where: { buyerId: userId } });
    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    throw error;
  }
};
export const getOrdersByEvent = async ({
  eventId,
  searchString,
}: {
  eventId: string;
  searchString: string;
}) => {
  try {
    const orders = db.order.findMany({
      where: { eventId },
      include: { buyer: true, event: true },
    });

    return orders;
  } catch (error) {}
};
