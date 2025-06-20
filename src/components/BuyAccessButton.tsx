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
    <div className="flex flex-col items-start">
      <label>
        <select
          className="border px-2 py-2"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option className="hover:bg-dark hover:text-white" value="basic">
            $5/month – 100 generations
          </option>
          <option value="pro">$10/month – 200 generations</option>
          <option value="unlimited">$20/month – Unlimited</option>
        </select>
      </label>
      <button
        className="cursor-pointer bg-dark text-white rounded-[3px] px-3 py-2"
        onClick={handleClick}
        style={{ marginTop: 10 }}
      >
        Subscribe for Access
      </button>
    </div>
  );
}
