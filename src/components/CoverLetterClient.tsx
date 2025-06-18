"use client";

import { useEffect, useState } from "react";

export default function CoverLetterClient() {
  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);

  useEffect(() => {
    async function fetchResume() {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setResume(data.content || "");
      }
    }
    fetchResume();
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
        setTimeout(() => setResumeSaved(false), 2000);
      }
    } catch {
      alert("Failed to save resume");
    }
  }

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

      <button
        onClick={onSaveResume}
        style={{ marginTop: 10, padding: "8px 16px" }}
      >
        Save Resume
      </button>
      {resumeSaved && (
        <span style={{ marginLeft: 10, color: "green" }}>Saved!</span>
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

      <button
        onClick={onGenerate}
        disabled={loading || !resume || !jobAd}
        style={{ marginTop: 20, padding: "10px 20px" }}
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
