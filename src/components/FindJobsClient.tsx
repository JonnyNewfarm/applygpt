"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CITIES = [
  "Oslo",
  "Bergen",
  "Stockholm",
  "Berlin",
  "Chicago",
  "New York",
  "London",
];
const COUNTRIES = [
  { name: "Norway", code: "no" },
  { name: "Sweden", code: "se" },
  { name: "Germany", code: "de" },
  { name: "USA", code: "us" },
  { name: "UK", code: "gb" },
];

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
  const [resumeSaved, setResumeSaved] = useState(false); // NEW: track if saved
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [countrySuggestions, setCountrySuggestions] = useState<
    typeof COUNTRIES
  >([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Load resume on mount
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch("/api/resume");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.content) {
          setResume(data.content);
          setResumeSaved(true); // Mark saved if resume exists
        }
      } catch (err) {
        console.error("Resume fetch error", err);
      }
    };
    fetchResume();
  }, []);

  // Save resume to API
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
    if (!resume || !query || !city || !country) {
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
          country,
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

  const handleCityInput = (val: string) => {
    setCity(val);
    setCitySuggestions(
      CITIES.filter((c) => c.toLowerCase().startsWith(val.toLowerCase()))
    );
  };

  const handleCountryInput = (val: string) => {
    setCountry(val);
    setCountrySuggestions(
      COUNTRIES.filter((c) =>
        c.name.toLowerCase().startsWith(val.toLowerCase())
      )
    );
  };

  function truncateText(text: string, maxLength: number) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Find Jobs That Match Your Resume
      </h1>

      {/* Resume textarea + Save button like in CoverLetterClient */}
      <textarea
        value={resume}
        onChange={(e) => {
          setResume(e.target.value);
          setResumeSaved(false); // Mark unsaved if changed
        }}
        placeholder="Paste your resume here..."
        rows={8}
        className="w-full border border-gray-300 rounded p-2 mb-2"
      />
      {!resumeSaved ? (
        <button
          onClick={onSaveResume}
          disabled={!resume.trim()}
          className="mb-4 px-3 py-1.5 bg-black text-white rounded"
        >
          Save Resume
        </button>
      ) : (
        <div className="mb-4">
          <Link
            className="bg-dark text-sm rounded-[3px] hover:opacity-90 text-white py-1.5 px-3"
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
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />

      <div className="mb-4 relative">
        <input
          type="text"
          value={city}
          onChange={(e) => handleCityInput(e.target.value)}
          placeholder="City (e.g. Chicago)"
          className="w-full border border-gray-300 rounded p-2"
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

      <div className="mb-4 relative">
        <input
          type="text"
          value={country}
          onChange={(e) => handleCountryInput(e.target.value)}
          placeholder="Country (e.g. us)"
          className="w-full border border-gray-300 rounded p-2"
        />
        {countrySuggestions.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 rounded z-10">
            {countrySuggestions.map((c) => (
              <li
                key={c.code}
                onClick={() => {
                  setCountry(c.code);
                  setCountrySuggestions([]);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {c.name} ({c.code})
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => onFindJobs(1, false)}
        disabled={loading}
        className="bg-black text-white px-4 py-2 cursor-pointer rounded-[3px]"
      >
        {loading ? "Searching..." : "Find Jobs"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8 space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-300 rounded p-4">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">
              {job.company} — {job.location}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {truncateText(job.description, 200) || "No description"}
            </p>
            <p className="mt-2 text-green-600 font-medium">
              Match score: {job.score}/10
            </p>
            <p className="mt-1 text-sm text-gray-500 italic">
              GPT: {job.explanation}
            </p>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Apply
            </a>
          </div>
        ))}
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
