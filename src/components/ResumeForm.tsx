"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import FontDropdown from "./FontDropdown";
import FontSizeDropdown from "./FontSizeDropdown";

interface ResumeFormProps {
  resume: string;
}

export default function ResumeForm({ resume }: ResumeFormProps) {
  const [content, setContent] = useState(resume);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBoldActive, setIsBoldActive] = useState(false);

  const resumeEditorRef = useRef<HTMLDivElement>(null);
  const resumePdfRef = useRef<HTMLDivElement>(null);

  const markAllText = () => {
    if (!resumeEditorRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(resumeEditorRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };
  const onBoldSelection = () => {
    document.execCommand("bold");
    setTimeout(syncContent, 0);
  };

  useEffect(() => {
    if (resumeEditorRef.current) {
      resumeEditorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleSave = async () => {
    if (!resumeEditorRef.current) return;
    const currentContent = resumeEditorRef.current.innerHTML;
    setIsSaving(true);
    try {
      await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentContent }),
      });
      toast("Resume saved!");
    } catch {
      toast("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      setIsBoldActive(document.queryCommandState("bold"));
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

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

  const syncContent = () => {
    if (resumeEditorRef.current) {
      setContent(resumeEditorRef.current.innerHTML);
    }
  };

  const handleDownload = async () => {
    syncContent();

    if (!resumePdfRef.current) return;

    const canvas = await html2canvas(resumePdfRef.current, {
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
    <div className="">
      <div className=" relative">
        <p className="text-md  text-white dark:text-black  mb-2">
          Select the text you want to modify.
        </p>
        <button
          onClick={onBoldSelection}
          className={`mt-1 mr-3 mb-2 border font-bold cursor-pointer px-3 py-1.5 rounded-[3px] text-sm transition-all duration-200 ${
            isBoldActive
              ? "bg-[#f6f4ed] text-[#2b2a27] border-[#f6f4ed] dark:bg-[#2b2a27] dark:text-[#f6f4ed] dark:border-[#2b2a27]"
              : "bg-transparent text-[#f6f4ed] border-[#f6f4ed] dark:text-[#2b2a27] dark:border-[#2b2a27]"
          }`}
        >
          B
        </button>
        <FontDropdown />
        <FontSizeDropdown />
        <button
          onClick={markAllText}
          className="mt-1 border ml-3 font-bold cursor-pointer px-3 py-1.5 rounded-[3px] text-sm bg-transparent text-[#f6f4ed] border-[#f6f4ed] dark:text-[#2b2a27] dark:border-[#2b2a27]"
        >
          Mark All
        </button>
      </div>

      <div
        ref={resumeEditorRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="w-full h-80 overflow-scroll border bg-white text-black p-4 text-sm leading-relaxed min-h-[300px] whitespace-pre-wrap outline-none"
      ></div>

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
        ref={resumePdfRef}
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
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
