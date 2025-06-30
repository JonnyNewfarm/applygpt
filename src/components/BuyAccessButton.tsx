"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function BuyAccessButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const [plan, setPlan] = useState("basic");
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubscribe() {
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
          className="border px-2 py-2 cursor-pointer w-full"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option className="bg-white text-black" value="basic">
            $15/month – basic | 100 generations
          </option>
          <option className="bg-white text-black" value="pro">
            $25/month – pro | 200 generations
          </option>
          <option className="bg-white text-black" value="unlimited">
            $40/month – Unlimited
          </option>
        </select>
      </label>

      <button
        className="mt-4 border-2 font-semibold  px-3 py-1.5 rounded-[3px] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={() => setShowConfirm(true)}
      >
        Subscribe for Access
      </button>

      {showConfirm && (
        <div className="mt-3 border border-gray-300 bg-white text-black p-4 max-w-sm">
          <p className="mb-3">
            ⚠️ By continuing, your current subscription will be automatically
            canceled and replaced with the new one.
          </p>
          <div className="flex gap-3">
            <button
              className="bg-dark cursor-pointer text-white px-3 py-2 rounded-[3px]"
              onClick={handleSubscribe}
            >
              Continue
            </button>
            <button
              className="bg-gray-200 cursor-pointer px-3 py-2 rounded-[3px]"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
