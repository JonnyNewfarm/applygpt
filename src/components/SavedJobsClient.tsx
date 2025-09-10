"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CoverLetterClientModal from "./CoverLetterClientModal";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

type SavedJob = {
  id: string;
  jobId?: string;
  title?: string;
  company: string;
  location?: string;
  url: string;
  description: string;
};

export default function ProfilePage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);

  useEffect(() => {
    async function fetchSavedJobs() {
      const res = await fetch("/api/saved-jobs");
      if (res.ok) {
        setSavedJobs(await res.json());
      } else {
        toast.error("Failed to load saved jobs");
      }
    }
    fetchSavedJobs();
  }, []);

  function toggleDescription(id: string) {
    setExpandedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function deleteSavedJob(id: string) {
    setDeletingJobId(id);
    try {
      const res = await fetch(`/api/saved-jobs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSavedJobs((prev) => prev.filter((job) => job.id !== id));
        toast.success("Job deleted successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete job");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingJobId(null);
    }
  }

  return (
    <div className=" mt-3">
      {savedJobs.length === 0 && <p>No saved jobs yet.</p>}

      <ul className="space-y-4">
        {savedJobs.map((job) => {
          const isExpanded = expandedJobs[job.id];
          const shortDescription =
            job.description.length > 200
              ? job.description.slice(0, 200) + "..."
              : job.description;

          return (
            <div key={job.id}>
              <li key={job.id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p>
                  {job.company} — {job.location}
                </p>

                <div className="mt-2 text-sm  ">
                  {isExpanded ? job.description : shortDescription}
                </div>
                {job.description.length > 200 && (
                  <button
                    onClick={() => toggleDescription(job.id)}
                    className=" hover:underline cursor-pointer mt-2 opacity-90 text-sm"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}

                <div className="flex flex-col gap-y-2 mt-6 w-[175px] text-center">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowCoverLetterModal(true);
                    }}
                    className="w-full  cursor-pointer mt-2 px-3 py-1.5  rounded-[3px] uppercase tracking-wide text-nowrap text-sm
             font-bold bg-gradient-to-tr from-[#f6f4ed] to-[#e2dfc7]
             dark:from-[#2c2c2c] dark:to-[#3a3a3a]
             text-black dark:text-white shadow-inner hover:shadow-lg
             transition-all duration-300 ease-in-out"
                  >
                    AI Cover Letter
                  </button>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer transform flex items-center justify-center gap-x-2 transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
                  >
                    <FaExternalLinkAlt className="text-" /> Open
                  </a>
                  <button
                    onClick={() => deleteSavedJob(job.id)}
                    disabled={deletingJobId === job.id}
                    className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold px-3 py-1.5 rounded-[3px] border-red-600 dark:border-red-700 text-sm text-red-600 dark:text-red-700"
                  >
                    {deletingJobId === job.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
              <AnimatePresence>
                {showCoverLetterModal && (
                  <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowCoverLetterModal(false)}
                    className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
                  >
                    <motion.div
                      id="custom-scrollbar"
                      key="modal"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-1.5  ml-1.5 overflow-y-scroll  h-[95%] w-[98%] bg-[#1c1c1b] text-[#f6f4ed]  md:px-2.5 px-1.5 py-4 rounded-[5px]  relative"
                    >
                      <button
                        className="absolute top-3 hover:scale-103 transition-transform ease-in-out bg-[#eaeae592]  rounded-full p-[3px] right-3.5 text-xl z-[99999] cursor-pointer text-stone-900 dark:text-gray-100 dark:bg-stone-700/90 "
                        onClick={() => setShowCoverLetterModal(false)}
                      >
                        <IoMdClose />
                      </button>
                      <CoverLetterClientModal job={selectedJob!} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
