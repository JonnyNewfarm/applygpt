"use client";

import { useRef, useState } from "react";

interface ResumeFormProps {
  resume: string;
}

export default function ResumeForm({ resume }: ResumeFormProps) {
  const [content, setContent] = useState(resume);
  const [loading, setLoading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      alert("Resume saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your resume?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await fetch("/api/resume", {
        method: "DELETE",
      });
      setContent("");
      alert("Resume deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 0.5,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(resumeRef.current).save();
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        className="w-full border border-gray-400 p-4 text-sm leading-relaxed"
        placeholder="Paste or write your resume here..."
      />

      <div className="mt-4 flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          className="bg-dark cursor-pointer text-white px-4 py-2 rounded-[3px]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleDelete}
          className="bg-[#852411] cursor-pointer text-white px-4 py-2 rounded-[3px]"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>

        <button
          onClick={handleDownload}
          className="bg-[#524644] cursor-pointer text-white px-4 py-2 rounded-[3px]"
        >
          Download as PDF
        </button>
      </div>

      {/* Hidden render of content for PDF */}
      <div
        ref={resumeRef}
        className="prose max-w-none absolute top-[-9999px] left-[-9999px] p-6 bg-white text-black w-[800px]"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
      />
    </div>
  );
}
