"use client";

import { useState } from "react";
import UsageClient from "./UsageClient";
import BuyAccessButton from "./BuyAccessButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { User } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

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

  const dropIn = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Subscription</h2>

      <div className="mb-4 border rounded md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <button
          onClick={() => setOpenDetails(!openDetails)}
          className={buttonClasses}
        >
          <span>Subscription Details</span>
          {openDetails ? (
            <BsChevronCompactUp size={30} />
          ) : (
            <BsChevronCompactDown size={30} />
          )}
        </button>
        <AnimatePresence>
          {openDetails && (
            <motion.div
              key="details"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropIn}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <UsageClient />
                <p>
                  <span className="font-semibold">Your Plan:</span>{" "}
                  {getPlanName()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-4 border rounded md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <button
          onClick={() => setOpenUpgrade(!openUpgrade)}
          className={buttonClasses}
        >
          <span>
            {user.subscriptionStatus === "free"
              ? "Upgrade Plan"
              : "Change Plan"}
          </span>
          {openUpgrade ? (
            <BsChevronCompactUp size={30} />
          ) : (
            <BsChevronCompactDown size={30} />
          )}
        </button>
        <AnimatePresence>
          {openUpgrade && (
            <motion.div
              key="upgrade"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropIn}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-0.5">
                <h1 className="font-semibold">Upgrade Plan</h1>
                <p className="mb-3">
                  Upgrade today to keep generating —{" "}
                  <strong>no commitment</strong> required, and enjoy our{" "}
                  <strong>limited-time sale</strong>:
                </p>
                <BuyAccessButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border rounded md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <button
          onClick={() => setOpenManage(!openManage)}
          className={buttonClasses}
        >
          <span>Manage Subscription</span>
          {openManage ? (
            <BsChevronCompactUp size={30} />
          ) : (
            <BsChevronCompactDown size={30} />
          )}
        </button>
        <AnimatePresence>
          {openManage && (
            <motion.div
              key="manage"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dropIn}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <ManageSubscriptionButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
