"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Country, City } from "country-state-city";
import toast from "react-hot-toast";

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
  const [textAreaSize, setTextAreaSize] = useState("250px");
  const [textAreaState, setTextAreaSizeState] = useState(false);
  const [textAreaTitle, setTextAreaSizeTitle] = useState("Show More");

  useEffect(() => {
    async function fetchResume() {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setResume(data.content || "");
        if (data.content) setResumeSaved(true);
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
      }
    } catch {
      toast.error("Failed to save job.");
    } finally {
      setSavingJobId(null);
    }
  }

  async function onSaveResume() {
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: resume }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Error saving resume");
      } else {
        setResumeSaved(true);
        toast("Resume saved!");
      }
    } catch {
      toast("Failed to save resume");
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
    localStorage.setItem("jobDescription", job.description);
    localStorage.setItem("company", job.company);
    localStorage.setItem("url", job.url);
    window.open("/cover-letter", "_blank");
  };

  const isCachedPage = !!jobsCache[page + 1];

  const SkeletonCard = () => (
    <div className="mt-8 animate-pulse flex gap-x-4 items-center ">
      <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
      <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
      <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
    </div>
  );

  async function matchJobToResume(job: Job) {
    if (!resumeSaved) {
      toast.error("Please save your resume before matching.");
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

  useEffect(() => {
    if (textAreaState === false) {
      setTextAreaSize("250px");
      setTextAreaSizeTitle("show more");
    } else {
      setTextAreaSize("650px");
      setTextAreaSizeTitle("Show Less");
    }
  }, [textAreaState]);

  const handleTextAreaState = () => {
    if (textAreaState === false) {
      setTextAreaSizeState(true);
    } else {
      setTextAreaSizeState(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <div className="max-w-4xl h-full mx-auto px-4 py-10">
        <h1 className="text-3xl h-full font-bold mb-6">
          Find Jobs That Match Your Resume
        </h1>

        <textarea
          style={{ scrollbarWidth: "thin", height: textAreaSize }}
          value={resume}
          onChange={(e) => {
            setResume(e.target.value);
            setResumeSaved(false);
          }}
          placeholder="Paste your resume here..."
          rows={8}
          className={`w-full  border bg-[#ffffff] text-black border-gray-500 rounded p-2 mb-2`}
        />
        <div className="w-full flex justify-between items-center">
          {!resumeSaved ? (
            <button
              onClick={onSaveResume}
              disabled={!resume.trim()}
              className="mt-1 mb-5 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Save Resume
            </button>
          ) : (
            <div className="mb-5 p-2">
              <Link
                className="mt-2 border-2 font-semibold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                href={"/profile"}
              >
                Edit Resume
              </Link>
            </div>
          )}

          <button className="mb-5 cursor-pointer" onClick={handleTextAreaState}>
            {textAreaTitle}
          </button>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title (e.g. frontend developer)"
          className="w-full border border-gray-500 bg-white text-black rounded p-2 mb-2"
        />

        <div className="relative">
          <input
            type="text"
            value={country}
            onChange={(e) => handleCountryInput(e.target.value)}
            placeholder="Country"
            className="w-full border border-gray-500 bg-white text-black rounded p-2 mb-2"
            style={{ height: "40px" }}
          />
          {countrySuggestions.length > 0 && (
            <ul className="absolute w-full bg-white text-black border border-gray-500 rounded mt-1 max-h-40 overflow-y-auto">
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

        <input
          type="text"
          value={city}
          onChange={(e) => handleCityInput(e.target.value)}
          placeholder="City"
          className="w-full border border-gray-500 bg-white text-black rounded p-2 mb-4"
        />
        {citySuggestions.length > 0 && (
          <ul className="bg-white text-black border border-gray-500 rounded mb-4 max-h-40 overflow-y-auto">
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

        <div>
          <p className="text-sm mb-2">
            {usage.generationLimit === null
              ? `Used ${usage.generationCount} generations (Unlimited plan)`
              : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
          </p>

          <button
            onClick={handleFindJobs}
            disabled={loading}
            className="mt-4 w-full cursor-pointer py-3 rounded-[3px] border-2 dark:border-[#2b2a27] px-3 border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] font-bold transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            {loading ? "Searching..." : "Find Jobs"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && jobs.length === 0 ? <SkeletonCard /> : null}

          {jobs.map((job) => (
            <div
              key={job.id}
              className="border relative h-full bg-white text-black flex flex-col justify-start items-start border-gray-300 rounded-[3px] p-4"
            >
              <div className="h-full w-full">
                <h2 className="text-xl font-semibold">{job.title}</h2>
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
                    className="dark underline text-sm cursor-pointer hover:opacity-90 mt-1"
                  >
                    {expandedDescriptions[job.id] ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
              <div className="w-full relative  bottom-2 mt-5">
                {job.score === undefined ? (
                  <div className="flex w-full justify-between flex-row-reverse">
                    <button
                      onClick={() => saveJob(job)}
                      disabled={savingJobId === job.id}
                      className="mt-2 cursor-pointer  text-sm px-3 py-1.5 rounded-[3px] border border-gray-400 text-black hover:bg-gray-100 transition"
                    >
                      {savingJobId === job.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      disabled={matchingJobId === job.id}
                      onClick={() => matchJobToResume(job)}
                      className="mt-2  border-2 px-3 opacity-80 cursor-pointer font-semibold py-1.5 rounded-[3px] text-sm text-[#2b2a27]border-[#2b2a27]  transform transition-transform duration-300 ease-in-out hover:scale-105"
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
                            className="underline text-sm cursor-pointer hover:opacity-90 mt-1"
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
                  className="mt-2 border-2 px-3 opacity-80 cursor-pointer font-semibold py-1.5 rounded-[3px] text-sm text-[#2b2a27]border-[#2b2a27]  transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Apply
                </a>
                <button
                  onClick={() => handleCreateCoverLetter(job)}
                  className="mt-2   bg-[#38302c] border-2 px-3 cursor-pointer font-semibold py-1.5 rounded-[3px] text-sm text-white/95 border-[#2b2a27]  transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Create Cover Letter
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length > 0 && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 cursor-pointer border-[#f6f4ed] text-[#f6f4ed] dark:border-[#2b2a27] dark:text-[#2b2a27] rounded border-2 font-semibold border-[] text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center text-sm">Page {page}</span>
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
    </div>
  );
}
