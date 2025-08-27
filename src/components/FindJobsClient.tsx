"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Country, City } from "country-state-city";
import toast from "react-hot-toast";
import CoverLetterClientModal from "./CoverLetterClientModal";
import { IoMdClose } from "react-icons/io";
import { jobTitleList } from "../../lib/jobTitleSuggestions";
import { FaCheck } from "react-icons/fa6";
import ResumeForm from "./ResumeForm";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  explanation: string;
  score: number;
}

export default function FindJobsPage() {
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const [resume, setResume] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [countrySuggestions, setCountrySuggestions] = useState<
    { name: string; isoCode: string }[]
  >([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null
  );
  const [allCities, setAllCities] = useState<string[]>([]);

  const [jobsCache, setJobsCache] = useState<Record<number, Job[]>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [expandedExplanations, setExpandedExplanations] = useState<
    Record<string, boolean>
  >({});
  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });

  const [matchingJobId, setMatchingJobId] = useState<string | null>(null);
  const [showNoResumePopup, setShowNoResumePopup] = useState(false);

  const jobTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        jobTitleRef.current &&
        !jobTitleRef.current.contains(e.target as Node)
      ) {
        setJobTitleSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const res = await fetch("/api/saved-jobs");
        if (res.ok) {
          const data = await res.json();
          const savedJobIds = new Set(
            (data.jobs as Job[]).map((job) => job.id)
          );
          setSavedJobs(savedJobIds);
        }
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      }
    }

    async function fetchResume() {
      try {
        setLoading(true);

        const res = await fetch("/api/resume", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Failed to fetch resume");
          return;
        }

        const data = await res.json();

        if (data?.content) {
          setResume(data.content);
          setResumeSaved(true);
        } else {
          setResume("");
          toast("No resume found. Please create one.");
          setResumeSaved(false);
        }
      } catch {
        toast.error("Something went wrong while fetching resume");
      } finally {
        setLoading(false);
      }
    }

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

    fetchResume();
    fetchSavedJobs();
    fetchUsage();
  }, []);

  async function saveJob(job: Job) {
    try {
      setSavingJobId(job.id);
      const res = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save job.");
      } else {
        toast.success("Job saved!");
        setSavedJobs((prev) => new Set(prev).add(job.id)); // ✅ Add job to saved
      }
    } catch {
      toast.error("Failed to save job.");
    } finally {
      setSavingJobId(null);
    }
  }

  const fetchJobs = async (pageToLoad: number) => {
    if (!query || !city || !selectedCountryCode) {
      toast("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/find-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          query,
          city,
          country: selectedCountryCode.toLowerCase(),
          page: pageToLoad,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        return;
      }

      if (data.message) {
        setError(data.message);
        return;
      }

      setJobsCache((prev) => ({
        ...prev,
        [pageToLoad]: data.jobs,
      }));

      setJobs(data.jobs);
      setPage(pageToLoad);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFindJobs = async () => {
    if (jobsCache[1]) {
      setJobs(jobsCache[1]);
      setPage(1);
    } else {
      await fetchJobs(1);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (jobsCache[newPage]) {
      setJobs(jobsCache[newPage]);
      setPage(newPage);
    } else {
      await fetchJobs(newPage);
    }
  };

  const handleCountryInput = (val: string) => {
    setCountry(val);
    const filtered = Country.getAllCountries().filter((c) =>
      c.name.toLowerCase().startsWith(val.toLowerCase())
    );
    setCountrySuggestions(filtered);
  };

  const handleCityInput = (val: string) => {
    setCity(val);
    if (allCities.length > 0) {
      setCitySuggestions(
        allCities.filter((c) => c.toLowerCase().startsWith(val.toLowerCase()))
      );
    }
  };

  const handleSelectCountry = (countryObj: {
    name: string;
    isoCode: string;
  }) => {
    setCountry(countryObj.name);
    setSelectedCountryCode(countryObj.isoCode);
    setCountrySuggestions([]);

    const cities = City.getCitiesOfCountry(countryObj.isoCode) || [];
    const cityNames = Array.from(new Set(cities.map((c) => c.name))).sort();
    setAllCities(cityNames);
    setCity("");
    setCitySuggestions([]);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const toggleExpandDescription = (jobId: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const toggleExpandExplanation = (jobId: string) => {
    setExpandedExplanations((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleCreateCoverLetter = (job: Job) => {
    setSelectedJob(job);
    setShowCoverLetterModal(true);
  };

  const isCachedPage = !!jobsCache[page + 1];

  const SkeletonCard = () => (
    <div className=" absolute left-4  -mt-8 w-full">
      <div className="w-full flex gap-x-3 animate-pulse">
        <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
        <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
        <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
      </div>
    </div>
  );

  async function matchJobToResume(job: Job) {
    if (!resumeSaved) {
      setShowNoResumePopup(true);
      return;
    }
    setMatchingJobId(job.id);
    try {
      const res = await fetch("/api/match-to-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: job.description,
          resume,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to match");
      } else {
        setJobs((jobs) =>
          jobs.map((j) =>
            j.id === job.id
              ? { ...j, score: data.score, explanation: data.explanation }
              : j
          )
        );
        setUsage((u) => ({
          ...u,
          generationCount: u.generationCount + 1,
        }));
      }
    } catch {
      toast.error("Error during matching");
    } finally {
      setMatchingJobId(null);
    }
  }

  return (
    <main className="w-full px-2  min-h-screen flex flex-col justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-5xl relative h-full items-center mx-auto flex justify-center flex-col  py-10">
        <div className="flex justify-center items-center flex-col w-full">
          <div className="max-w-4xl">
            <h1 className="text-3xl  h-full px-3 font-bold mb-6">
              Find Jobs That Match Your Resume
            </h1>

            <div ref={jobTitleRef} className="relative  px-2">
              <label>
                <p className="mb-1 font-bold">Job Title</p>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);

                    if (val.length > 0) {
                      const filtered = jobTitleList.filter((title) =>
                        title.toLowerCase().includes(val.toLowerCase())
                      );
                      setJobTitleSuggestions(filtered);
                    } else {
                      setJobTitleSuggestions([]);
                    }
                  }}
                  placeholder="Job title (e.g. frontend developer)"
                  className="w-full   dark:shadow-stone-900/5 border-2 shadow-md relative   border-[#f6f4ed] dark:border-[#2b2a27] bg-white/95 text-black rounded p-2 mb-3"
                />
              </label>
              {jobTitleSuggestions.length > 0 && (
                <ul className="bg-white absolute z-50 w-full  text-black border border-gray-500 rounded overflow-hidden mb-4 max-h-40 ">
                  {jobTitleSuggestions.map((title, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setQuery(title);
                        setJobTitleSuggestions([]);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative m-0 px-2">
              <label>
                {" "}
                <p className="mb-1 font-bold">Country</p>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => handleCountryInput(e.target.value)}
                  placeholder="Country"
                  className="w-full   dark:shadow-stone-900/5 border-2 shadow-md relative   border-[#f6f4ed] dark:border-[#2b2a27] bg-white/95 text-black rounded p-2 mb-3"
                />
              </label>
              {countrySuggestions.length > 0 && (
                <ul className="bg-white top-19 z-50 absolute w-full text-black border border-gray-500 rounded mb-3 max-h-40 overflow-y-auto">
                  {countrySuggestions.map((c) => (
                    <li
                      key={c.isoCode}
                      onClick={() => handleSelectCountry(c)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative px-2">
              <label>
                <p className="mb-1 font-bold">City</p>

                <input
                  type="text"
                  value={city}
                  onChange={(e) => handleCityInput(e.target.value)}
                  placeholder="City"
                  className="w-full   dark:shadow-stone-900/5 border-2 shadow-md relative   border-[#f6f4ed] dark:border-[#2b2a27] bg-white text-black rounded p-2 mb-3"
                />
              </label>
              {citySuggestions.length > 0 && (
                <ul className="bg-white absolute w-full z-50 text-black border border-gray-500 rounded mb-4 max-h-40 overflow-y-auto">
                  {citySuggestions.map((c, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setCity(c);
                        setCitySuggestions([]);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="w-full relative ">
              <div className="flex justify-between  px-3">
                <button
                  onClick={() => setShowResumeModal((prev) => !prev)}
                  className="border-2 sticky cursor-pointer px-4 py-2 mb-2  rounded-[3px] text-sm font-semibold dark:border-[#2b2a27] border-[#f6f4ed] text-[#f6f4ed] dark:text-[#2b2a27] hover:scale-105 transform transition-transform duration-200"
                >
                  {showResumeModal ? "Close" : "Your Resume"}
                </button>
                <p className="text-sm mb-2 mt-2">
                  {usage.generationLimit === null
                    ? `Used ${usage.generationCount} generations (Unlimited plan)`
                    : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
                </p>
              </div>

              {showResumeModal && (
                <div
                  onClick={() => setShowResumeModal(false)}
                  className="fixed  inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-[95%] max-w-5xl bg-[#2b2a27] text-[#f6f4ed] mb-10 dark:bg-[#f6f4f2] dark:text-[#2b2a27]  sm:px-5 py-4"
                  >
                    <div className="relative">
                      <div className="flex justify-between px-1">
                        <button
                          onClick={() => setShowResumeModal(false)}
                          className="mb-4 absolute right-2.5 text-2xl  sm:text-3xl cursor-pointer font-semibold"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      <div className="relative w-full mt-4">
                        <ResumeForm resume={resume} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showNoResumePopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                  <div className="bg-white ml-2  mr-2 z-50  relative transform  text-black p-6 rounded  max-w-md py-10">
                    <div className="flex ml-2 justify-between items-center">
                      <div>
                        <h1 className="font-semibold">No Resume Found</h1>
                        <p className="  max-w-[80%] mt-0.5">
                          You need to create or upload a resume first.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowNoResumePopup(false)}
                        className="cursor-pointer absolute right-2 top-2  text-black  text-3xl rounded"
                      >
                        <IoMdClose />
                      </button>
                    </div>
                    <Link
                      href="/resume-generator"
                      className="inline-block z-50 mt-4 bg-stone-900 text-white px-4 py-2 rounded mr-3"
                    >
                      Create Resume
                    </Link>
                    <button
                      onClick={() => {
                        setShowResumeModal(true);
                      }}
                      className="inline-block z-50 bg-stone-600 text-white px-4 py-2 rounded mr-3"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-3">
              <button
                onClick={handleFindJobs}
                disabled={loading}
                className="mt-3 w-full  cursor-pointer py-3 rounded-[3px]  uppercase tracking-wide  px-3 text-lg text-[#f6f4ed] dark:text-black border-[#f6f4ed] shadow-md shadow-white/15 dark:shadow-black/10 border-2 dark:border-black font-bold transform transition-transform duration-300 ease-in-out hover:scale-105"
              >
                {loading ? "Searching..." : "Find Jobs"}
              </button>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>

        <div className="mt-16 gap-y-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && jobs.length === 0 ? <SkeletonCard /> : null}

          {jobs.map((job) => (
            <div
              key={job.id}
              className="border relative h-full w-full bg-white text-black flex flex-col justify-start items-start border-gray-300 rounded-[3px] p-4"
            >
              <div className="h-full w-full">
                <div className="flex w-full justify-between gap-x-4 items-start">
                  <h2 className="text-xl font-semibold">
                    {job.title.length > 45
                      ? job.title.slice(0, 45) + "..."
                      : job.title}
                  </h2>
                  <button
                    onClick={() => saveJob(job)}
                    disabled={savingJobId === job.id || savedJobs.has(job.id)}
                    className=" px-2 opacity-80 cursor-pointer font-semibold py-1.5 rounded-[3px] text-sm text-[#2b2a27] border-[#2b2a27] transform transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    {savingJobId === job.id ? (
                      <p>Saving..</p>
                    ) : savedJobs.has(job.id) ? (
                      <p className="flex items-center gap-x-2">
                        Saved <FaCheck />{" "}
                      </p>
                    ) : (
                      <p>Save</p>
                    )}
                  </button>
                </div>
                <p className="text-gray-700">
                  {job.company} — {job.location}
                </p>

                <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                  {expandedDescriptions[job.id]
                    ? job.description
                    : truncateText(job.description, 200)}
                </p>

                {job.description.length > 200 && (
                  <button
                    onClick={() => toggleExpandDescription(job.id)}
                    className="dark underline text-sm font-semibold cursor-pointer hover:opacity-90 mt-1"
                  >
                    {expandedDescriptions[job.id] ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              <div className="w-full relative  bottom-2 mt-5">
                {job.score === undefined ? (
                  <div className="">
                    <button
                      disabled={matchingJobId === job.id}
                      onClick={() => matchJobToResume(job)}
                      className="mt-2 mb-2 bg-stone-600 text-white px-3  cursor-pointer font-semibold py-1.5 rounded-[3px] text-sm    transform transition-transform duration-300 ease-in-out hover:scale-105"
                    >
                      {matchingJobId === job.id
                        ? "Matching..."
                        : "Match to Resume"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-2   p-2 rounded">
                    {job.score !== undefined && (
                      <div className="mt-3 text-sm">
                        <p className="font-semibold">
                          Match Score: {job.score} / 10
                        </p>
                        <p className="mt-2 text-gray-600 whitespace-pre-line">
                          {expandedExplanations[job.id]
                            ? job.explanation
                            : truncateText(job.explanation, 200)}
                        </p>
                        {job.explanation.length > 200 && (
                          <button
                            onClick={() => toggleExpandExplanation(job.id)}
                            className="underline font-semibold text-sm cursor-pointer hover:opacity-90 mt-1"
                          >
                            {expandedExplanations[job.id]
                              ? "Show less"
                              : "Read more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-row-reverse items-center justify-between w-full relative left-auto right-auto bottom-6 mt-5">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 border-2 px-3 font-semibold opacity-80 cursor-pointer  py-1.5 rounded-[3px] text-md text-[#2b2a27]border-[#2b2a27]  transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Apply
                </a>
                <button
                  onClick={() => handleCreateCoverLetter(job)}
                  className="mt-2   bg-[#38302c] border-2 px-3 cursor-pointer font-semibold py-1.5 rounded-[3px] text-md text-white/95 border-[#2b2a27]  transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Create Cover Letter
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length > 0 && (
          <div className="mt-8 w-full flex justify-between">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 cursor-pointer border-[#f6f4ed] text-[#f6f4ed] dark:border-[#2b2a27] dark:text-[#2b2a27] rounded border-2 font-semibold border-[] text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center text-sm">{page}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 cursor-pointer rounded border-2 font-semibold  text-sm"
            >
              {loading
                ? "Loading..."
                : isCachedPage
                ? "Next"
                : "Find more jobs"}
            </button>
          </div>
        )}
      </div>

      {showCoverLetterModal && selectedJob && (
        <div className="fixed inset-0 p-5 md:p-10 bg-black/80 z-50 flex items-center justify-center">
          <div
            style={{ scrollbarWidth: "none" }}
            className="w-full h-full rounded-[6px] bg-white overflow-auto relative"
          >
            <button
              className="absolute  text-white  text-3xl md:text-5xl cursor-pointer dark:text-black top-4 right-4   z-50"
              onClick={() => setShowCoverLetterModal(false)}
            >
              <IoMdClose strokeWidth={16} />
            </button>
            <CoverLetterClientModal job={selectedJob} />
          </div>
        </div>
      )}
    </main>
  );
}
