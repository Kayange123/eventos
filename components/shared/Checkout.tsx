import { Event } from "@prisma/client";
import { Button } from "../ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { checkoutOrder } from "@/actions/order.actions";

interface CheckoutProps {
  event: Event;
  userId: string;
}

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Checkout = ({ event, userId }: CheckoutProps) => {
  const onCheckout = async () => {
    const order = {
      eventTitle: event?.title,
      eventId: event?.id,
      price: event?.price,
      isFree: event?.isFree,
      buyerId: userId,
    };

    await checkoutOrder(order);
  };
  return (
    <form action={onCheckout} method="post">
      <Button type="submit" size="lg" className="button sm:w-fit" role="link">
        {event?.isFree ? "Get Tickets" : "Buy Tickets"}
      </Button>
    </form>
  );
};

export default Checkout;
