"use client";
import { useEffect, useState } from "react";
import FindJobsClient from "./FindJobsClient";

function ResumeClientWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 1000); // simulate delay, or set to 0 if not needed
    return () => clearTimeout(timeout);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-[200px] gap-x-4 sticky left-20">
        <div className="h-2 w-2 bg-white/70 dark:bg-black/70 animate-pulse rounded-full"></div>
        <div className="h-2 w-2 bg-white/70 dark:bg-black/70 animate-pulse rounded-full"></div>
        <div className="h-2 w-2 bg-white/70 dark:bg-black/70 animate-pulse rounded-full"></div>
      </div>
    );
  }

  return <FindJobsClient />;
}

export default ResumeClientWrapper;
