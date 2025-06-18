"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function BuyAccessButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const [plan, setPlan] = useState("basic");

  async function handleClick() {
    if (!session?.user?.email) return;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();
    router.push(data.url);
  }

  return (
    <div>
      <label>
        Choose a plan:
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="basic">$5/month – 100 generations</option>
          <option value="pro">$10/month – 200 generations</option>
          <option value="unlimited">$20/month – Unlimited</option>
        </select>
      </label>
      <button onClick={handleClick} style={{ marginTop: 10 }}>
        Subscribe for Access
      </button>
    </div>
  );
}
