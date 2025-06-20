"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Country, City } from "country-state-city";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import BuyAccessButton from "./BuyAccessButton";

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

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
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

  async function onSaveResume() {
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: resume }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error saving resume");
      } else {
        setResumeSaved(true);
        alert("Resume saved!");
      }
    } catch {
      alert("Failed to save resume");
    }
  }

  const onFindJobs = async (newPage = 1, append = false) => {
    if (!resume || !query || !city || !selectedCountryCode) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    if (!append) setJobs([]);

    try {
      const res = await fetch("/api/find-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          query,
          city,
          country: selectedCountryCode.toLowerCase(),
          page: newPage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        return;
      }

      if (data.message) {
        setError(data.message);
        setJobs([]);
        return;
      }

      setJobs((prev) => (append ? [...prev, ...data.jobs] : data.jobs));
      setPage(newPage);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
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

    window.open("/cover-letter", "_blank");
  };

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Find Jobs That Match Your Resume
      </h1>

      <textarea
        value={resume}
        onChange={(e) => {
          setResume(e.target.value);
          setResumeSaved(false);
        }}
        placeholder="Paste your resume here..."
        rows={8}
        className="w-full border bg-[#ffffff] border-gray-500 rounded p-2 mb-2"
      />
      {!resumeSaved ? (
        <button
          onClick={onSaveResume}
          disabled={!resume.trim()}
          className="mb-4 px-3 py-1.5 bg-dark text-white rounded-[3px]"
        >
          Save Resume
        </button>
      ) : (
        <div className="mb-4">
          <Link
            className="bg-[#48413f] border border-stone-400 text-sm rounded-[3px] hover:opacity-90 text-white py-1.5 px-3"
            href={"/profile"}
          >
            Edit Resume
          </Link>
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Job title (e.g. frontend developer)"
        className="w-full border border-gray-500 bg-white rounded p-2 mb-4"
      />

      {/* Country input */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={country}
          onChange={(e) => handleCountryInput(e.target.value)}
          placeholder="Country (e.g. United States)"
          className="w-full border border-gray-500 bg-white rounded p-2"
        />
        {countrySuggestions.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 rounded z-10">
            {countrySuggestions.map((c) => (
              <li
                key={c.isoCode}
                onClick={() => handleSelectCountry(c)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {c.name} ({c.isoCode.toLowerCase()})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* City input */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={city}
          onChange={(e) => handleCityInput(e.target.value)}
          placeholder="City (e.g. Chicago)"
          className="w-full border border-gray-500 bg-white rounded p-2"
        />
        {citySuggestions.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 rounded z-10">
            {citySuggestions.map((c) => (
              <li
                key={c}
                onClick={() => {
                  setCity(c);
                  setCitySuggestions([]);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">
          {usage.generationLimit === null
            ? `Used ${usage.generationCount} generations (Unlimited plan)`
            : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
        </p>

        {isAtLimit ? (
          <div className="p-4 border border-red-500 rounded bg-red-100 text-red-700">
            <p className="mb-3 font-semibold">
              You have used up all your cover letter generations.
            </p>
            {usage.generationLimit !== null ? (
              <>
                <p className="mb-3">Upgrade to continue generating:</p>
                <BuyAccessButton />
              </>
            ) : (
              <ManageSubscriptionButton />
            )}
          </div>
        ) : (
          <button
            onClick={() => onFindJobs(1, false)}
            disabled={loading}
            className="bg-black text-white px-4 py-2 cursor-pointer rounded-[3px]"
          >
            {loading ? "Searching..." : "Find Jobs"}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const isDescriptionExpanded = expandedDescriptions[job.id];
          const isExplanationExpanded = expandedExplanations[job.id];
          const description = isDescriptionExpanded
            ? job.description
            : truncateText(job.description, 200);
          const explanation = isExplanationExpanded
            ? job.explanation
            : truncateText(job.explanation, 160);

          return (
            <div
              key={job.id}
              className="border relative h-full bg-white flex flex-col justify-start items-start border-gray-300 rounded-[3px] p-4"
            >
              <div className="h-full w-full">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-700">
                  {job.company} — {job.location}
                </p>

                <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                  {description || "No description"}
                </p>
                {job.description.length > 200 && (
                  <button
                    onClick={() => toggleExpandDescription(job.id)}
                    className="dark underline text-sm cursor-pointer hover:opacity-90 mt-1"
                  >
                    {isDescriptionExpanded ? "Show less" : "Read more"}
                  </button>
                )}

                <p className="mt-2 text-green-700 font-medium">
                  Match score: {job.score}/10
                </p>

                <p className="mt-1 text-sm text-gray-500 italic whitespace-pre-line">
                  GPT: {explanation || "No explanation"}
                </p>
                {job.explanation.length > 160 && (
                  <button
                    onClick={() => toggleExpandExplanation(job.id)}
                    className="dark underline cursor-pointer hover:opacity-90 text-sm mt-1"
                  >
                    {isExplanationExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
              <div className="flex flex-row-reverse items-center justify-between w-full relative  left-auto right-auto bottom-6 mt-10">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-dark text-white py-1 px-3 rounded-[3px] hover:opacity-90 mt-2 inline-block"
                >
                  Apply
                </a>

                <button
                  rel="noopener noreferrer"
                  onClick={() => handleCreateCoverLetter(job)}
                  className="bg-[#403938] cursor-pointer text-white mt-2 py-1 px-3 rounded-[3px] hover:opacity-90"
                >
                  Create Cover Letter
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length > 0 && (
        <button
          onClick={() => onFindJobs(page + 1, true)}
          disabled={loading}
          className="mt-6 bg-gray-800 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
}
