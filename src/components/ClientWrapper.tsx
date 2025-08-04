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
      <div className="flex w-full justify-center flex-col">
        <div className="">
          <ResumeUploadPopUp>
            <ResumeForm resume={resume} />
          </ResumeUploadPopUp>
          <ResumeClient />
        </div>
      </div>
    </>
  );
}

export default ResumeClientWrapper;
