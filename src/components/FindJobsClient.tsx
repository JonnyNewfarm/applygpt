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
import BuyAccessButton from "./BuyAccessButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  explanation: string;
  score: number;
  source?: string;
}

export default function FindJobsPage() {
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(-1);

  const [resume, setResume] = useState("");
  const [activeJob, setActiveJob] = useState<Job | null>(null);
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

  const [showApplyPopup, setShowApplyPopup] = useState(false);

  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

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

  function getHostFromUrl(url: string): string {
    try {
      const host = new URL(url).hostname;
      if (host.includes("linkedin")) return "LinkedIn";
      if (host.includes("indeed")) return "Indeed";
      if (host.includes("glassdoor")) return "Glassdoor";
      return host.replace("www.", "");
    } catch {
      return "Unknown";
    }
  }

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

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  return (
    <main className="w-full px-2  min-h-screen flex flex-col justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-5xl relative h-full items-center mx-auto flex justify-center flex-col  py-10">
        <div className="flex justify-center items-center flex-col w-full">
          <div className="max-w-4xl">
            <h1 className="text-3xl  h-full px-3 font-bold">
              Find Jobs With AI Tools
            </h1>
            <p className="px-3 max-w-lg mt-0.5 text-md md:text-lg mb-3 text-gray-200 dark:text-gray-700">
              Search jobs from top providers like <strong>LinkedIn</strong>,{" "}
              <strong>Indeed</strong>, and more — all in one place. <br />
            </p>

            <div ref={jobTitleRef} className="relative  px-2">
              <label>
                <p className="mb-1 font-bold">Job Title</p>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    setHighlightedIndex(-1);

                    if (val.length > 0) {
                      const filtered = jobTitleList.filter((title) =>
                        title.toLowerCase().includes(val.toLowerCase())
                      );
                      setJobTitleSuggestions(filtered);
                    } else {
                      setJobTitleSuggestions([]);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (jobTitleSuggestions.length > 0) {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightedIndex((prev) =>
                          prev < jobTitleSuggestions.length - 1 ? prev + 1 : 0
                        );
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightedIndex((prev) =>
                          prev > 0 ? prev - 1 : jobTitleSuggestions.length - 1
                        );
                      } else if (e.key === "Enter" && highlightedIndex >= 0) {
                        e.preventDefault();
                        setQuery(jobTitleSuggestions[highlightedIndex]);
                        setJobTitleSuggestions([]);
                        setHighlightedIndex(-1);
                      }
                    }
                  }}
                  placeholder="Job title (e.g. frontend developer)"
                  className="w-full   dark:shadow-stone-900/5 border-2 shadow-md relative   border-[#f6f4ed] dark:border-[#2b2a27] bg-white/95 text-black rounded p-2 mb-3"
                />
              </label>
              {jobTitleSuggestions.length > 0 && (
                <ul className="bg-white absolute z-50 w-full text-black border border-gray-500 rounded overflow-hidden mb-4 max-h-40">
                  {jobTitleSuggestions.map((title, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setQuery(title);
                        setJobTitleSuggestions([]);
                        setHighlightedIndex(-1);
                      }}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        highlightedIndex === idx ? "bg-gray-200" : ""
                      }`}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative m-0 px-2">
              {" "}
              <p className="mb-1 font-bold">Country</p>
              <input
                type="text"
                value={country}
                onChange={(e) => {
                  handleCountryInput(e.target.value);
                  setHighlightedCountryIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (countrySuggestions.length > 0) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightedCountryIndex((prev) =>
                        prev < countrySuggestions.length - 1 ? prev + 1 : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedCountryIndex((prev) =>
                        prev > 0 ? prev - 1 : countrySuggestions.length - 1
                      );
                    } else if (
                      e.key === "Enter" &&
                      highlightedCountryIndex >= 0
                    ) {
                      e.preventDefault();
                      handleSelectCountry(
                        countrySuggestions[highlightedCountryIndex]
                      );
                      setHighlightedCountryIndex(-1);
                    }
                  }
                }}
                placeholder="Country"
                className="w-full border-2 shadow-md relative border-[#f6f4ed] dark:border-[#2b2a27] bg-white/95 text-black rounded p-2 mb-3"
              />
              {countrySuggestions.length > 0 && (
                <ul className="bg-white top-19 z-50 absolute w-full text-black border border-gray-500 rounded mb-3 max-h-40 overflow-y-auto">
                  {countrySuggestions.map((c, idx) => (
                    <li
                      key={c.isoCode}
                      onClick={() => handleSelectCountry(c)}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        highlightedCountryIndex === idx ? "bg-gray-200" : ""
                      }`}
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative px-2">
              <p className="mb-1 font-bold">City</p>

              <input
                type="text"
                value={city}
                onChange={(e) => {
                  handleCityInput(e.target.value);
                  setHighlightedCityIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (citySuggestions.length > 0) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightedCityIndex((prev) =>
                        prev < citySuggestions.length - 1 ? prev + 1 : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedCityIndex((prev) =>
                        prev > 0 ? prev - 1 : citySuggestions.length - 1
                      );
                    } else if (e.key === "Enter" && highlightedCityIndex >= 0) {
                      e.preventDefault();
                      setCity(citySuggestions[highlightedCityIndex]);
                      setCitySuggestions([]);
                      setHighlightedCityIndex(-1);
                    }
                  }
                }}
                placeholder="City"
                className="w-full border-2 shadow-md relative border-[#f6f4ed] dark:border-[#2b2a27] bg-white text-black rounded p-2 mb-3"
              />

              {citySuggestions.length > 0 && (
                <ul className="bg-white absolute w-full z-50 text-black border border-gray-500 rounded mb-4 max-h-40 overflow-y-auto">
                  {citySuggestions.map((c, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setCity(c);
                        setCitySuggestions([]);
                        setHighlightedCityIndex(-1);
                      }}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        highlightedCityIndex === idx ? "bg-gray-200" : ""
                      }`}
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
                  className="fixed h-screen w-full inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-[96%] h-[92vh]  max-w-6xl bg-[#2b2a27] text-[#f6f4ed] 
               dark:bg-[#f6f4f2] dark:text-[#2b2a27] sm:px-2 py-4 flex flex-col"
                  >
                    <div className="relative h-full">
                      <button
                        onClick={() => setShowResumeModal(false)}
                        className="absolute right-2 -top-1 z-50 text-3xl cursor-pointer font-semibold"
                      >
                        <IoMdClose />
                      </button>
                      <div className="h-full">
                        <ResumeForm resume={resume} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showNoResumePopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                  <div className="bg-white ml-3  mr-3 z-50  relative transform  text-black p-6 rounded  max-w-md py-10">
                    <div className="flex ml-2 justify-between items-center">
                      <div>
                        <h1 className="font-semibold">No Resume Found</h1>
                        <p className="  max-w-[80%] ">
                          You need to create or upload a resume first.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowNoResumePopup(false)}
                        className="cursor-pointer absolute  right-3 top-3  text-black  text-3xl rounded"
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
                      className="inline-block z-50 cursor-pointer border-black text-black border-2 font-semibold px-4 py-2 rounded mr-3"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-3">
              {isAtLimit ? (
                <div className="p-4 border max-w-xl text-white  rounded dark:text-stone-900">
                  <p className="font-semibold mb-1">No more tokens</p>

                  <p className="mb-3">
                    You have used up all your cover letter generations.
                  </p>
                  {usage.generationLimit !== null ? (
                    <>
                      <h1 className="font-semibold text-xl">Upgrade plan:</h1>
                      <p className="mb-3">
                        Upgrade today to keep generating —{" "}
                        <strong className="text-lg">no commitment</strong>{" "}
                        required, and enjoy our{" "}
                        <strong className="text-lg">limited-time sale</strong>:
                      </p>
                      <BuyAccessButton />
                    </>
                  ) : (
                    <ManageSubscriptionButton />
                  )}
                </div>
              ) : (
                <div className="">
                  <button
                    onClick={handleFindJobs}
                    disabled={loading}
                    className="mt-3 w-full cursor-pointer py-3 rounded-[5px] uppercase tracking-wide px-3 text-lg bg-[#f6f4ed] text-black dark:bg-stone-700 dark:text-white border-2 font-bold transform transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    {loading ? "Searching..." : "Find Jobs"}
                  </button>
                </div>
              )}
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
                <p className="text-md flex  gap-x-1 font-semibold text-gray-800 mt-1">
                  <p>Source:</p> {job.source || getHostFromUrl(job.url)}
                </p>
                <p className="text-gray-700 font-semibold">
                  {job.company} — {job.location}
                </p>

                <p className="mt-2 text-sm text-gray-600 whitespace-pre-line transition-all duration-300line-clamp-3 max-h-20 overflow-hidden">
                  {job.description}
                </p>

                {job.description.length > 200 && (
                  <button
                    onClick={() => setActiveJob(job)}
                    className="underline text-sm font-semibold cursor-pointer hover:opacity-90 mt-1"
                  >
                    Read more
                  </button>
                )}

                {activeJob && (
                  <div
                    onClick={() => setActiveJob(null)}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white ml-1.5 mr-1.5  p-6 rounded-[3px] max-w-2xl max-h-[80vh] overflow-y-auto"
                    >
                      <h2 className="text-lg font-bold">{activeJob.title}</h2>
                      <p className="mt-4 whitespace-pre-line text-md text-gray-900 ">
                        {activeJob.description}
                      </p>
                      <button
                        onClick={() => setActiveJob(null)}
                        className="mt-4 px-4 py-2 font-semibold bg-[#2b2a27] text-white cursor-pointer hover:scale-105 transition-transform ease-in-out rounded-[3px]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
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
                <button
                  onClick={() => {
                    setApplyJob(job);
                    setShowApplyPopup(true);
                  }}
                  className="mt-2 border-2 px-3 font-semibold py-1.5 rounded-[3px] cursor-pointer"
                >
                  Apply
                </button>

                {showApplyPopup && applyJob && (
                  <div
                    onClick={() => setShowApplyPopup(false)}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white relative ml-3 mr-3 text-black p-6 rounded max-w-md"
                    >
                      <h1 className="text-lg font-semibold">
                        Create Cover Letter First
                      </h1>
                      <p className="mt-2">
                        You need to create a cover letter before applying.
                      </p>

                      <div className="flex gap-3 mt-4">
                        <a
                          href={applyJob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 border-2 px-3 font-semibold py-1.5 rounded-[3px]"
                        >
                          Apply
                        </a>
                        <button
                          onClick={() => handleCreateCoverLetter(applyJob)}
                          className="mt-2 cursor-pointer bg-[#38302c] py-1.5 font-semibold rounded-[3px]  px-3 text-white"
                        >
                          Create Cover Letter
                        </button>

                        <button
                          className="text-2xl cursor-pointer text-black absolute top-3 right-3"
                          onClick={() => setShowApplyPopup(false)}
                        >
                          <IoMdClose />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
              className="absolute  text-white  text-2xl md:text-4xl cursor-pointer dark:text-black top-4 right-4   z-50"
              onClick={() => setShowCoverLetterModal(false)}
            >
              <IoMdClose />
            </button>
            <CoverLetterClientModal job={selectedJob} />
          </div>
        </div>
      )}
    </main>
  );
}
