"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type SavedJob = {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
};

export default function ProfilePage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>

      {savedJobs.length === 0 && <p>No saved jobs yet.</p>}

      <ul className="space-y-4">
        {savedJobs.map((job) => {
          const isExpanded = expandedJobs[job.id];
          const shortDescription =
            job.description.length > 200
              ? job.description.slice(0, 200) + "..."
              : job.description;

          return (
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

              <div className="flex flex-col gap-y-2 mt-6 w-[150px] text-center">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
                >
                  View Job
                </a>
                <button
                  onClick={() => deleteSavedJob(job.id)}
                  disabled={deletingJobId === job.id}
                  className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold px-3 py-1.5 rounded-[3px] border-red-600 text-sm text-red-600"
                >
                  {deletingJobId === job.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
