// components/FreeTierNotice.tsx
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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2  bg-[#2b2a27] text-[#f6f4ed] px-4 py-12 dark:bg-[#f6f4ed] dark:text-[#2b2a27]  rounded-[3px] shadow-lg z-50 max-w-md ">
      <p className="mb-2">
        You’re on the free tier with only 6 generation tokens. Upgrade to unlock
        more generations.
      </p>
      <button
        onClick={() => setShow(false)}
        aria-label="Close notice"
        className=" border py-1 px-4 rounded-[3px] cursor-pointer absolute bottom-3"
      >
        Continue on free tier
      </button>
      <div className="mb-3.5">
        <BuyAccessButton />
      </div>
    </div>
  );
}
