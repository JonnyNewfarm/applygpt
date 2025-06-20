"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
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

      {/* Hidden render for PDF */}
      <div
        ref={resumeRef}
        style={{
          width: "800px",
          padding: "24px",
          backgroundColor: "white",
          color: "black",
          fontSize: "14px",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
        dangerouslySetInnerHTML={{
          __html: content
            .split("\n")
            .map((line) => `<p>${line}</p>`)
            .join(""),
        }}
      />
    </div>
  );
}
