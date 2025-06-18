import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "../../../lib/prisma";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed.", errorMessage);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed for:", session.customer_email);
        // Optional: You can save the customerId or update user here if needed
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          // Update user's subscription status and hasPaid flag
          const isActive = subscription.status === "active";

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status, // 'active', 'past_due', 'canceled', etc.
              hasPaid: isActive,
            },
          });

          console.log(`Updated user ${user.email} subscription to ${subscription.status}, hasPaid: ${isActive}`);
        } else {
          console.warn(`No user found for Stripe customer ID: ${customerId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    res.status(500).send("Internal Server Error");
  }
}
