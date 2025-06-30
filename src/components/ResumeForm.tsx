"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

interface ResumeFormProps {
  resume: string;
}

export default function ResumeForm({ resume }: ResumeFormProps) {
  const [content, setContent] = useState(resume);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      toast("Resume saved!");
    } catch (err) {
      console.error(err);
      toast("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your resume?");
    if (!confirmed) return;

    setIsDeleting(true);
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
      setIsDeleting(false);
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
        className="w-full border bg-white text-black border-gray-400 p-4 text-sm leading-relaxed"
        placeholder="Paste or write your resume here..."
      />

      <div className="mt-4 flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          className="cursor-pointer mt-2 border-2 font-bold dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27] transform transition-transform duration-300 ease-in-out hover:scale-105"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleDownload}
          className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
        >
          Download as PDF
        </button>

        <button
          onClick={handleDelete}
          className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold  px-3 py-1.5 rounded-[3px] border-red-600  text-sm text-red-600  "
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

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
