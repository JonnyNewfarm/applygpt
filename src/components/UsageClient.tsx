"use client";
import React, { useEffect, useState } from "react";

const UsageClient = () => {
  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });
  useEffect(() => {
    async function fetchUsage() {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setUsage({
          generationLimit: data.generationLimit,
          generationCount: data.generationCount,
        });
      }
    }

    fetchUsage();
  }, []);
  return (
    <div className="mb-4 text-sm mt-4 gap-y-1 flex flex-col  text-[#f6f4ed] dark:text-[#2b2a27]">
      <h1 className="font-semibold ">Usage:</h1>
      {usage.generationLimit === null
        ? `Used ${usage.generationCount} generations (Unlimited plan)`
        : `${usage.generationCount} / ${usage.generationLimit} generations`}
    </div>
  );
};

export default UsageClient;
