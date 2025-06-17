"use client";

import { useState } from "react";

export default function CoverLetterClient() {
  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  async function onGenerate() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobAd }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCoverLetter("");
        alert(data.error || "Error generating cover letter");
      } else {
        setCoverLetter(data.coverLetter);
      }
    } catch (err) {
      setCoverLetter("");
      alert("Failed to generate cover letter");
    }

    setLoading(false);
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
