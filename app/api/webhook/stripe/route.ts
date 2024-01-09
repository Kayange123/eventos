import stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endPointSecret);
  } catch (error) {
    return NextResponse.json({ message: "Webhook Error", error });
  }

  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;

    const order = {
      stripeId: id,
      eventId: metadata?.eventId ?? "",
      buyerId: metadata?.buyerId ?? "",
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      creatdAt: new Date(),
    };

    //const newOrder = await createOrder(order);
    //return NextResponse.json({message: "Ok", order: newOrder})
  }
  return new NextResponse("", { status: 200 });
}
