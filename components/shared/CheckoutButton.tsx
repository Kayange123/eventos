"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Event } from "@prisma/client";
import { Button } from "../ui/button";
import React from "react";
import Link from "next/link";
import Checkout from "./Checkout";

const CheckoutButton = ({ event }: { event: Event }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata?.userId as string;
  const hasEventEnded = new Date(event?.endDateTime) < new Date();
  return (
    <React.Fragment>
      {hasEventEnded ? (
        <p className="p-2 text-red-400">
          Sorry tickets are no longer available
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </React.Fragment>
  );
};

export default CheckoutButton;
