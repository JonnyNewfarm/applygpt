"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BuyAccessButton() {
  const router = useRouter();
  const { data: session } = useSession();

  async function handleClick() {
    if (!session?.user?.email) return;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: session.user.email }),
    });

    const data = await res.json();
    router.push(data.url);
  }

  return <button onClick={handleClick}>Subscribe for Access</button>;
}
