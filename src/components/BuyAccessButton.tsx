"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BuyAccessButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const [plan, setPlan] = useState("sale");

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
    <div className="flex flex-col items-start space-y-4 w-full max-w-sm">
      <Select value={plan} onValueChange={setPlan}>
        <SelectTrigger className="w-full border-2 font-semibold">
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              value="sale"
              className="bg-white  cursor-pointer text-black hover:bg-black hover:text-white"
            >
              $9.99/month – SALE | 100 generations
            </SelectItem>

            <SelectItem
              value="pro"
              className="bg-white w-full cursor-pointer text-black hover:bg-black hover:text-white"
            >
              $25/month – pro | 200 generations
            </SelectItem>
            <SelectItem
              value="unlimited"
              className="bg-white cursor-pointer text-black hover:bg-black hover:text-white"
            >
              $40/month – Unlimited
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <button
        className="border-2 font-semibold px-3 py-1.5 rounded-[3px] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 w-full"
        onClick={handleSubscribe}
      >
        Subscribe for Access
      </button>
    </div>
  );
}
