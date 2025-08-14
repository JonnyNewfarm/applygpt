"use client";

import { useState } from "react";
import SavedJobsClient from "./SavedJobsClient";
import CoverLetterList from "./CoverLetterList";

type CoverLetter = {
  id: string;
  userId: string;
  content: string;
  tone: string;
  jobAd: string;
  createdAt: string; // ✅ serialized as string
};

export default function ProfileTabs({
  serializedCoverLetters,
}: {
  serializedCoverLetters: CoverLetter[];
}) {
  const [selectedTab, setSelectedTab] = useState<"jobs" | "coverletters">(
    "jobs"
  );

  return (
    <div className="mt-20">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedTab("jobs")}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer border-2 rounded-[3px] font-semibold transition-all ${
            selectedTab === "jobs"
              ? "bg-[#f6f4f2] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed]"
              : "border-[#f6f4ed] text-[#f6f4ed] dark:border-[#2b2a27] dark:text-[#2b2a27]"
          }`}
        >
          Saved Jobs
        </button>
        <button
          onClick={() => setSelectedTab("coverletters")}
          className={`px-4 py-2 whitespace-nowrap cursor-pointer border-2 rounded-[3px] font-semibold transition-all ${
            selectedTab === "coverletters"
              ? "bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed]"
              : "border-[#f6f4ed] text-[#f6f4ed] dark:border-[#2b2a27] dark:text-[#2b2a27]"
          }`}
        >
          Recent Letters
        </button>
      </div>

      {selectedTab === "jobs" && <SavedJobsClient />}
      {selectedTab === "coverletters" && (
        <CoverLetterList initialCoverLetters={serializedCoverLetters} />
      )}
    </div>
  );
}
