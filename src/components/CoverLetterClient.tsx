"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterClient() {
  const router = useRouter();

  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);

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

  async function onGenerate() {
    setLoading(true);
    setCoverLetter("");

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobAd, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error generating");
      } else {
        setCoverLetter(data.coverLetter);
        // Refresh usage count after generation
        const usageRes = await fetch("/api/usage-info");
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage({
            generationLimit: usageData.generationLimit,
            generationCount: usageData.generationCount,
          });
        }
      }
    } catch {
      alert("Something went wrong");
    }

    setLoading(false);
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
        alert(data.error || "Error saving resume");
      } else {
        setResumeSaved(true);
      }
    } catch {
      alert("Failed to save resume");
    }
  }

  function onEditResume() {
    router.push("/profile");
  }

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  return (
    <main style={{ padding: 20 }}>
      <h1>Generate Cover Letter</h1>

      <label>
        Paste your Resume:
        <textarea
          rows={8}
          style={{ width: "100%", marginTop: 4 }}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume here..."
        />
      </label>

      {!resumeSaved ? (
        <button
          onClick={onSaveResume}
          style={{ marginTop: 10, padding: "8px 16px" }}
          disabled={!resume.trim()}
        >
          Save Resume
        </button>
      ) : (
        <button
          onClick={onEditResume}
          style={{ marginTop: 10, padding: "8px 16px" }}
        >
          Edit Resume
        </button>
      )}

      <label style={{ marginTop: 20, display: "block" }}>
        Paste Job Description:
        <textarea
          rows={8}
          style={{ width: "100%", marginTop: 4 }}
          value={jobAd}
          onChange={(e) => setJobAd(e.target.value)}
          placeholder="Paste job description here..."
        />
      </label>

      <label style={{ marginTop: 20, display: "block" }}>
        Tone:
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ marginTop: 4 }}
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="confident">Confident</option>
        </select>
      </label>

      <p style={{ marginTop: 15 }}>
        {usage.generationLimit === null
          ? `You have used ${usage.generationCount} generations. (Unlimited plan)`
          : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
      </p>

      <button
        onClick={onGenerate}
        disabled={loading || !resume || !jobAd || isAtLimit}
        style={{ marginTop: 20, padding: "10px 20px" }}
        title={
          isAtLimit ? "You have reached your generation limit." : undefined
        }
      >
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {coverLetter && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f5f5f5",
            padding: 15,
            marginTop: 20,
            borderRadius: 5,
          }}
        >
          {coverLetter}
        </pre>
      )}
    </main>
  );
}
