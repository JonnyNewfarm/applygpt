"use client";
import { useEffect, useState } from "react";
import ResumeClient from "./ResumeClient";
import ResumeUploadPopUp from "./ResumeUploadPopUp";
import ResumeForm from "./ResumeForm";

interface Props {
  resume: string;
}

function ResumeClientWrapper({ resume }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 500); // reduce delay to make UX smoother
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
      <ResumeUploadPopUp>
        <ResumeForm resume={resume} />
      </ResumeUploadPopUp>
      <ResumeClient />
    </>
  );
}

export default ResumeClientWrapper;
