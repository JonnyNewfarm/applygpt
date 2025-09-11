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
import { AnimatePresence, motion } from "framer-motion";
import MagneticCompWide from "./MagneticCompWide";
import { FaExternalLinkAlt, FaFileAlt, FaBookmark } from "react-icons/fa";
import ExpandableText from "./ExpandableText";

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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // used by cover letter modal
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(-1);

  const [resume, setResume] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);
  const [query, setQuery] = useState("");

  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  const [jobsCache, setJobsCache] = useState<Record<number, Job[]>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [searching, setSearching] = useState(false);

  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [allCityOptions, setAllCityOptions] = useState<string[]>([]);

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

  const jobResultsRef = useRef<HTMLDivElement>(null);

  const [selectedJobForPanel, setSelectedJobForPanel] = useState<Job | null>(
    null
  );
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const detailPanelRef = useRef<HTMLDivElement>(null);

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
    const savedQuery = localStorage.getItem("jobQuery");
    const savedCity = localStorage.getItem("jobCity");

    if (savedQuery) setQuery(savedQuery);
    if (savedCity) setCity(savedCity);
  }, []);

  useEffect(() => {
    if (query) {
      localStorage.setItem("jobQuery", query);
    }
  }, [query]);

  useEffect(() => {
    if (city) {
      localStorage.setItem("jobCity", city);
    }
  }, [city]);

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
    const allCountries = Country.getAllCountries();
    const cityList: string[] = [];

    allCountries.forEach((country) => {
      const cities = City.getCitiesOfCountry(country.isoCode) || [];
      cities.forEach((c) => {
        cityList.push(`${c.name}, ${country.isoCode}`);
      });
    });

    setAllCityOptions(cityList);
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
        toast("Job saved.");
        setSavedJobs((prev) => new Set(prev).add(job.id));
      }
    } catch {
      toast.error("Failed to save job.");
    } finally {
      setSavingJobId(null);
    }
  }

  const fetchJobs = async (pageToLoad: number) => {
    if (!query || !city) {
      toast("Please fill in all fields.");
      return;
    }
    const [cityName, countryCode] = city.split(",").map((p) => p.trim());
    if (!cityName || !countryCode) {
      toast("Please use format: City, CountryCode (e.g. Oslo, NO)");
      return;
    }
    setSearching(true);
    setError("");
    try {
      const res = await fetch("/api/find-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          query,
          city: cityName,
          country: countryCode.toLowerCase(),
          page: pageToLoad,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to fetch jobs");
        setSearching(false);
        return;
      }
      const data = await res.json();
      setJobs(data.jobs || []);
      setJobsCache((prev) => ({ ...prev, [pageToLoad]: data.jobs }));
      setSearching(false);
      if (jobResultsRef.current) {
        const y =
          jobResultsRef.current.getBoundingClientRect().top +
          window.scrollY -
          80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setSearching(false);
    }
  };

  const handleFindJobs = async () => {
    if (jobsCache[1]) {
      setJobs(jobsCache[1]);
      setPage(1);
      setSelectedJobForPanel(jobsCache[1][0] ?? null);
    } else {
      await fetchJobs(1);
    }
    setShowDetailOnMobile(false);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1) return;
    if (jobsCache[newPage]) {
      setJobs(jobsCache[newPage]);
      setPage(newPage);
      setSelectedJobForPanel(jobsCache[newPage][0] ?? null);
    } else {
      await fetchJobs(newPage);
    }
    setShowDetailOnMobile(false);
  };

  const handleCityInput = (val: string) => {
    setCity(val);

    if (!val) {
      setCitySuggestions([]);
      return;
    }

    const filtered = allCityOptions
      .filter((c) => c.toLowerCase().startsWith(val.toLowerCase()))
      .slice(0, 50);

    setCitySuggestions(filtered);
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
        setSelectedJobForPanel((prev) =>
          prev && prev.id === job.id
            ? { ...prev, score: data.score, explanation: data.explanation }
            : prev
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

  const isCachedPage = !!jobsCache[page + 1];

  const onJobListItemClick = (job: Job) => {
    setSelectedJobForPanel(job);
    if (window.innerWidth < 1024) {
      setShowDetailOnMobile(true);

      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const backToListOnMobile = () => {
    setShowDetailOnMobile(false);
  };

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) {
        setShowDetailOnMobile(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <main className="w-full px-2 min-h-screen flex flex-col justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <div className="max-w-7xl relative h-full mx-auto flex justify-center flex-col w-full">
        <div className="flex justify-center items-center flex-col w-full">
          <div className="w-full max-w-3xl">
            <h1 className="text-[25px] md:mt-10 md:text-3xl h-full px-6 font-bold">
              Find Jobs With AI Tools
            </h1>
            <p className="px-6 w-full mt-0.5 text-lg md:text-lg mb-3 text-gray-200 dark:text-gray-700">
              Search jobs from top providers like <strong>LinkedIn</strong>,{" "}
              <strong>Indeed</strong>, and more — all in one place. <br />
            </p>

            <div ref={jobTitleRef} className="relative px-4">
              <label>
                <p className="mb-1 border-t-1 w-full border-t-white/40 dark:border-t-black/50 text-2xl pt-4 px-6">
                  Job Title
                </p>
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
                  className="w-full outline-none border-b-1 border-b-white/40 dark:border-b-black/50 relative border-[#f6f4ed] dark:border-[#2b2a27] text-white dark:text-black text-xl px-6 pt-1 pb-4 mb-3 bg-transparent"
                />
              </label>
              {jobTitleSuggestions.length > 0 && (
                <ul
                  id="custom-scrollbar"
                  className="text-[#f6f4f2] overflow-y-scroll bg-[#383833] absolute z-50 w-full border border-gray-100/20 rounded overflow-hidden mb-4 max-h-40"
                >
                  {jobTitleSuggestions.map((title, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setQuery(title);
                        setJobTitleSuggestions([]);
                        setHighlightedIndex(-1);
                      }}
                      className={`py-2.5 px-3 cursor-pointer hover:dark:text-black hover:bg-stone-600 border-b-white/5 border-b hover:dark:bg-stone-300  ${
                        highlightedIndex === idx
                          ? "bg-stone-600 dark:bg-stone-300"
                          : ""
                      }`}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative px-4">
              <p className="mb-1 px-4 text-2xl pt-4">City</p>

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
                className="w-full border-b-1 outline-none border-b-white/40 dark:border-b-black/50 relative border-[#f6f4ed] dark:border-[#2b2a27] text-white dark:text-black px-4 pb-4 text-xl mb-3 bg-transparent"
              />

              {citySuggestions.length > 0 && (
                <ul
                  id="custom-scrollbar"
                  className="text-[#f6f4f2] overflow-y-scroll bg-[#383833] absolute z-50 w-full border border-gray-100/20 rounded overflow-hidden mb-4 max-h-40"
                >
                  {citySuggestions.map((c, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setCity(c);
                        setCitySuggestions([]);
                        setHighlightedCityIndex(-1);
                      }}
                      className={`py-2.5 px-3 cursor-pointer hover:dark:text-black hover:bg-stone-600 border-b-white/5 border-b hover:dark:bg-stone-300 ${
                        highlightedCityIndex === idx
                          ? "bg-stone-600 dark:bg-stone-300"
                          : ""
                      }`}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full relative  mt-2">
              <div className="flex justify-between px-6 md:px-8">
                <button
                  onClick={() => setShowResumeModal((prev) => !prev)}
                  className="border sticky cursor-pointer px-4 py-2 mb-2 mt-1 rounded-[5px] text-md font-semibold dark:border-[#2b2a27] border-white/40 text-[#ebe9e2] dark:text-[#2b2a27] hover:scale-105 transform transition-transform duration-200"
                >
                  {showResumeModal ? "Close" : "Your Resume"}
                </button>
                <p className="text-sm mb-2 mt-3.5">
                  {usage.generationLimit === null
                    ? `Used ${usage.generationCount} generations (Unlimited plan)`
                    : `Usage: ${usage.generationCount} / ${usage.generationLimit}`}
                </p>
              </div>
              <AnimatePresence>
                {showResumeModal && (
                  <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowResumeModal(false)}
                    className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                  >
                    <motion.div
                      key="modal"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-1.5 relative ml-1.5 bg-[#1c1c1be8] text-[#f6f4ed]  md:px-2.5 px-1.5 py-3 rounded-[5px] max-w-6xl w-full "
                    >
                      <button
                        onClick={() => setShowResumeModal(false)}
                        className="absolute  hover:scale-103 top-3 transition-transform ease-in-out bg-[#eaeae584] rounded-full p-[3px] right-3.5 text-lg z-[99999] cursor-pointer text-stone-900 "
                      >
                        <IoMdClose />
                      </button>
                      <div className="relative h-full">
                        <div className="h-full">
                          <ResumeForm resume={resume} />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                <div className="p-4 border w-full max-w-2xl text-white rounded dark:text-stone-900">
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
                <div className="w-full px-4 mt-2.5">
                  <MagneticCompWide>
                    <motion.button
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFindJobs}
                      disabled={searching}
                      className="w-full cursor-pointer mt-2 py-3 mb-3 rounded-[5px] uppercase tracking-wide px-3 text-lg
     font-bold bg-gradient-to-tr from-[#f6f4ed] to-[#e2dfc7]
     dark:from-[#2c2c2c] dark:to-[#3a3a3a]
     text-black dark:text-white shadow-inner hover:shadow-lg
     transition-all duration-300 ease-in-out"
                    >
                      {searching ? "Searching..." : "Find Jobs"}
                    </motion.button>
                  </MagneticCompWide>
                </div>
              )}
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>

        <div
          ref={jobResultsRef}
          className="mt-5 md:mt-10 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
        >
          <aside
            id="custom-scrollbar"
            className={` bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] border-l border-t md:border-t-0 border-r md:border-r-0  border-white/20 dark:border-black/30 md:max-h-[80vh] mb-5 md:overflow-y-auto ${
              showDetailOnMobile ? "hidden md:block" : "block"
            }`}
          >
            {loading && jobs.length === 0 && (
              <div className="p-4 text-md opacity-90">Loading jobs…</div>
            )}

            {jobs.length === 0 && !loading ? (
              <div className="p-4 text-md opacity-90 ">
                No jobs yet. Search above.
              </div>
            ) : (
              <ul id="custom-scrollbar">
                {jobs.map((job) => {
                  const isActive = selectedJobForPanel?.id === job.id;
                  return (
                    <li
                      key={job.id}
                      className={`border-b border-white/10 dark:border-black/10 cursor-pointer ${
                        isActive ? "bg-black/20 dark:bg-stone-200" : ""
                      }`}
                      onClick={() => onJobListItemClick(job)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold leading-6">
                            {job.title.length > 64
                              ? job.title.slice(0, 64) + "…"
                              : job.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveJob(job);
                            }}
                            disabled={
                              savingJobId === job.id || savedJobs.has(job.id)
                            }
                            className="px-2 opacity-80 cursor-pointer font-semibold py-1 text-sm text-[#2b2a27] border border-[#2b2a27] dark:text-[#f6f4ed] dark:border-[#f6f4ed]"
                          >
                            {savingJobId === job.id ? (
                              <span className="text-white dark:text-black">
                                Saving…
                              </span>
                            ) : savedJobs.has(job.id) ? (
                              <span className="inline-flex text-white dark:text-black items-center gap-2">
                                Saved <FaCheck />
                              </span>
                            ) : (
                              <span className="inline-flex text-white dark:text-black items-center gap-2">
                                <FaBookmark /> Save
                              </span>
                            )}
                          </button>
                        </div>
                        <p className="text-sm mt-0.5 opacity-80">
                          {job.company} — {job.location}
                        </p>
                        <p className="text-xs mt-2 opacity-90 line-clamp-2 whitespace-pre-line">
                          {job.description}
                        </p>
                        <div className="mt-2 text-xs opacity-70">
                          Source: {job.source || getHostFromUrl(job.url)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {jobs.length > 0 && (
              <div className="p-4 flex items-center justify-between sticky bottom-0 bg-inherit">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border cursor-pointer rounded-[3px] text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">{page}</span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="px-3 cursor-pointer py-1 rounded-[3px]  border text-sm"
                >
                  {loading
                    ? "Loading…"
                    : isCachedPage
                    ? "Next"
                    : "Find more jobs"}
                </button>
              </div>
            )}
          </aside>
          {jobs.length > 0 && (
            <section
              ref={detailPanelRef}
              id="custom-scrollbar"
              className={`bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]
    border-r border-l border-b md:border-b-0 border-white/20 dark:border-black/30
    mb-8 rounded-[3px] h-screen 
    md:max-h-[80vh] overflow-y-auto
    ${showDetailOnMobile ? "block" : "hidden md:block"}`}
            >
              {!selectedJobForPanel ? (
                <div className="p-6 text-sm opacity-70">
                  Select a job to see details.
                </div>
              ) : (
                <div className="h-full w-full flex flex-col   justify-between">
                  <div>
                    <div
                      ref={detailPanelRef}
                      className="md:hidden p-3 border-b "
                    >
                      <button
                        className="text-sm underline cursor-pointer  font-semibold"
                        onClick={backToListOnMobile}
                      >
                        Back to results
                      </button>
                    </div>

                    <div className="p-5 ">
                      <div className="flex flex-row w-full justify-between gap-x-4 items-start">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            {selectedJobForPanel.title}
                          </h2>
                          <p className="text-md font-semibold text-gray-100 dark:text-stone-700 mt-1">
                            {selectedJobForPanel.company} —{" "}
                            {selectedJobForPanel.location}
                          </p>

                          <p className="text-sm mt-1 text-gray-200 dark:text-stone-900">
                            Source:{" "}
                            {selectedJobForPanel.source ||
                              getHostFromUrl(selectedJobForPanel.url)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveJob(selectedJobForPanel)}
                            disabled={
                              savingJobId === selectedJobForPanel.id ||
                              savedJobs.has(selectedJobForPanel.id)
                            }
                            className="px-3 cursor-pointer py-1.5 text-sm "
                          >
                            {savingJobId === selectedJobForPanel.id ? (
                              <span>Saving…</span>
                            ) : savedJobs.has(selectedJobForPanel.id) ? (
                              <span className="inline-flex items-center gap-2">
                                Saved <FaCheck />
                              </span>
                            ) : (
                              <span className="inline-flex  items-center gap-2">
                                <FaBookmark /> Save
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4  whitespace-pre-line leading-6 text-gray-100 dark:text-stone-800">
                        <ExpandableText
                          text={selectedJobForPanel.description}
                          limit={400}
                          className="text-base mt-2"
                        />
                      </div>

                      <div className="mt-5">
                        {typeof selectedJobForPanel.score !== "undefined" && (
                          <div className="p-3 border ">
                            <p className="font-semibold">
                              Match Score: {selectedJobForPanel.score} / 10
                            </p>
                            <p className="mt-2 text-sm text-gray-100 dark:text-stone-800 whitespace-pre-line">
                              {expandedExplanations[selectedJobForPanel.id]
                                ? selectedJobForPanel.explanation
                                : truncateText(
                                    selectedJobForPanel.explanation,
                                    300
                                  )}
                            </p>
                            {selectedJobForPanel.explanation?.length > 300 && (
                              <button
                                onClick={() =>
                                  toggleExpandExplanation(
                                    selectedJobForPanel.id
                                  )
                                }
                                className="underline cursor-pointer text-sm mt-1"
                              >
                                {expandedExplanations[selectedJobForPanel.id]
                                  ? "Show less"
                                  : "Read more"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <a
                      href={selectedJobForPanel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 text-lg border-b border-b-white/40 font-semibold cursor-pointer inline-flex items-center gap-2"
                    >
                      <FaExternalLinkAlt className="text-" /> Open
                    </a>
                    <button
                      onClick={() =>
                        handleCreateCoverLetter(selectedJobForPanel)
                      }
                      className="bg-gradient-to-tr from-[#f6f4ed] to-[#e2dfc7]
             dark:from-[#2c2c2c] dark:to-[#3a3a3a]
             text-black dark:text-white shadow-inner hover:shadow-lg hover:scale-103
             transition-all duration-300 ease-in-out px-4 py-2 cursor-pointer flex justify-center text-nowrap text-md  font-semibold items-center gap-2"
                    >
                      <FaFileAlt className="text-xs" /> AI Cover Letter
                    </button>
                    <button
                      disabled={matchingJobId === selectedJobForPanel.id}
                      onClick={() => matchJobToResume(selectedJobForPanel)}
                      className="px-4 py-2 font-semibold cursor-pointer text-nowrap text-md mt-1  border text-white border-white mb-5 dark:border-black dark:text-black hover:scale-103 ease-in-out transition-transform"
                    >
                      {matchingJobId === selectedJobForPanel.id
                        ? "Matching…"
                        : "Match to Resume"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {showApplyPopup && applyJob && (
          <div
            onClick={() => setShowApplyPopup(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white relative ml-3 mr-3 text-black p-6 max-w-md"
            >
              <h1 className="text-lg font-semibold">
                Create Cover Letter First
              </h1>
              <p className="mt-2">
                You need to create a cover letter before applying.
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setApplyJob(selectedJobForPanel);
                    setShowApplyPopup(true);
                  }}
                >
                  Apply
                </button>
                <button
                  onClick={() => handleCreateCoverLetter(applyJob)}
                  className="mt-2 cursor-pointer bg-[#38302c] py-1.5 font-semibold rounded-[3px] px-3 text-white flex items-center gap-2"
                >
                  <FaFileAlt className="text-sm" />
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

        {showCoverLetterModal && selectedJob && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCoverLetterModal(false)}
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          >
            <motion.div
              id="custom-scrollbar"
              key="modal"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
              className="mr-1.5 overflow-y-scroll h-[95%] ml-1.5 bg-[#1c1c1b] text-[#f6f4ed] md:px-2.5 px-1.5 py-4 rounded-[5px] max-w-8xl w-full relative"
            >
              <button
                className="absolute top-3 hover:scale-103 transition-transform ease-in-out bg-[#eaeae592]  rounded-full p-[3px] right-3.5 text-lg z-[99999] cursor-pointer text-stone-900 dark:text-gray-100 dark:bg-stone-700/90 "
                onClick={() => setShowCoverLetterModal(false)}
              >
                <IoMdClose />
              </button>
              <CoverLetterClientModal job={selectedJob} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
