import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/database";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  //If the event is to create user
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;
    try {
      const user = await db.user.create({
        data: {
          email: email_addresses?.[0].email_address,
          clerkId: id,
          userName: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });

      if (user) {
        clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: user.id,
          },
        });
      }
      return NextResponse.json({ status: 200, message: "OK", user });
    } catch (error) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  if (eventType === "user.updated") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;
    try {
      const user = await db.user.update({
        data: {
          email: email_addresses?.[0].email_address,
          userName: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        where: {
          clerkId: id,
        },
      });

      if (user) {
        clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: user.id,
          },
        });
      }
      return NextResponse.json({ status: 200, message: "OK", user });
    } catch (error) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    try {
      const user = await db.user.delete({
        where: { clerkId: id },
      });

      if (user) {
        clerkClient.users.updateUserMetadata(id as string, {
          publicMetadata: {
            userId: user.id,
          },
        });
      }
      return NextResponse.json({ status: 200, message: "OK", user });
    } catch (error) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
