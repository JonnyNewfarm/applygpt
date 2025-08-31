"use client";
import { useEffect, useState } from "react";
import ResumeClient from "./ResumeClient";

interface Props {
  resume: string;
}

function ResumeClientWrapper({ resume }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 500);
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

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <ResumeClient resume={resume} />
      </div>
    </>
  );
}

export default ResumeClientWrapper;
