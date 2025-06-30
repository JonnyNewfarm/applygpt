"use client";

import { useEffect, useState } from "react";
import BuyAccessButton from "@/components/BuyAccessButton";

export default function FreeTierNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("freeTierNoticeShown");
    if (!alreadyShown) {
      setShow(true);
      sessionStorage.setItem("freeTierNoticeShown", "true");
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform w-[85%] -translate-x-1/2 border-[#2b2a27]  border dark:border-[#f6f4ed]  bg-[#f6f4ed] text-[#2b2a27] px-4 py-12 dark:bg-[#2b2a27] dark:text-[#f6f4ed]  rounded-[3px] shadow-lg z-50 max-w-3xl ">
      <p className="mb-2 font-semibold">
        You’re on the free tier with only 6 generation tokens. Upgrade to unlock
        more generations.
      </p>
      <button
        onClick={() => setShow(false)}
        aria-label="Close notice"
        className=" border-2 bg-black/80 text-white dark:bg-white dark:text-black/80 py-1 px-4 font-bold rounded-[3px] text-sm cursor-pointer absolute bottom-3"
      >
        Continue on free tier
      </button>
      <div className="mb-3.5">
        <BuyAccessButton />
      </div>
    </div>
  );
}
