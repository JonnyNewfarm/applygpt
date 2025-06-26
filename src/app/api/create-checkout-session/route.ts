import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { plan } = await req.json(); 

  if (!session || !session.user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });

    customerId = customer.id;
  }

  // ✅ Cancel existing active subscription (if any)
  const existingSubscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
  });

  if (existingSubscriptions.data.length > 0) {
    const existingSubscription = existingSubscriptions.data[0];
    await stripe.subscriptions.cancel(existingSubscription.id);
  }

  const priceMap: Record<string, string> = {
    basic: process.env.STRIPE_BASIC_PRICE_ID_NEW!,
    pro: process.env.STRIPE_PRO_PRICE_ID_NEW!,
    unlimited: process.env.STRIPE_UNLIMITED_PRICE_ID_NEW!,
  };

  const stripeSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceMap[plan],
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cover-letter?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cover-letter?canceled=1`,
  });

  return NextResponse.json({ url: stripeSession.url });
}
