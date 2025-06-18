// src/app/api/stripe-webhook/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";
import prisma from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook signature verification failed.", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.customer && session.customer_email) {
          const user = await prisma.user.findUnique({
            where: { email: session.customer_email },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                stripeCustomerId: session.customer.toString(),
              },
            });

            console.log("✅ Saved Stripe customer ID for:", user.email);
          }
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          const isActive = subscription.status === "active";

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
              hasPaid: isActive,
            },
          });

          console.log(`✅ Updated user ${user.email} with hasPaid: ${isActive}`);
        } else {
          console.warn(`⚠️ No user found for Stripe customer ID: ${customerId}`);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error handling Stripe webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
