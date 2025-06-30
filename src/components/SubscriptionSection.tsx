"use client";

import { useState } from "react";
import UsageClient from "./UsageClient";
import BuyAccessButton from "./BuyAccessButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { User } from "@prisma/client";

export default function SubscriptionSection({ user }: { user: User }) {
  const [openDetails, setOpenDetails] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [openManage, setOpenManage] = useState(false);

  const getPlanName = () => {
    if (user.generationLimit === 6) return "Free";
    if (user.generationLimit === 100) return "Basic";
    if (user.generationLimit === 200) return "Pro";
    if (user.generationLimit === null) return "Unlimited";
    return "Unknown";
  };

  const buttonClasses =
    "w-full text-left p-3 cursor-pointer flex justify-between items-center font-semibold border-b-white/20 dark:border-b-black/20 bg-[#f6f4ed] text-[#2b2a27] dark:bg-black/75 dark:text-[#f6f4ed] transition ease-in";

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Subscription</h2>

      {/* Subscription Details */}
      <div className="mb-4 border rounded md:w-[60%]">
        <button
          onClick={() => setOpenDetails(!openDetails)}
          className={buttonClasses}
        >
          <span>Subscription Details</span>
          {openDetails ? <BsChevronCompactUp /> : <BsChevronCompactDown />}
        </button>
        {openDetails && (
          <div className="p-4">
            <UsageClient />
            <p>
              <span className="font-semibold">Your Plan:</span> {getPlanName()}
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Plan */}
      <div className="mb-4 border rounded md:w-[60%]">
        <button
          onClick={() => setOpenUpgrade(!openUpgrade)}
          className={buttonClasses}
        >
          <span>
            {user.subscriptionStatus === "free"
              ? "Upgrade Plan"
              : "Change Plan"}
          </span>
          {openUpgrade ? <BsChevronCompactUp /> : <BsChevronCompactDown />}
        </button>
        {openUpgrade && (
          <div className="p-4">
            <BuyAccessButton />
          </div>
        )}
      </div>

      {/* Manage Subscription */}
      <div className="border rounded md:w-[60%]">
        <button
          onClick={() => setOpenManage(!openManage)}
          className={buttonClasses}
        >
          <span>Manage Subscription</span>
          {openManage ? <BsChevronCompactUp /> : <BsChevronCompactDown />}
        </button>
        {openManage && (
          <div className="p-4">
            <ManageSubscriptionButton />
          </div>
        )}
      </div>
    </section>
  );
}
