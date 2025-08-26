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

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const topBottomPadding = 10;
    const usableHeight = pageHeight - topBottomPadding * 2;

    const canvasPageHeight = (canvas.width * usableHeight) / pageWidth;

    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(
        canvasPageHeight,
        canvas.height - renderedHeight
      );

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          renderedHeight,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );
      }

      const imgData = pageCanvas.toDataURL("image/jpeg", 1.0);

      if (pageIndex > 0) pdf.addPage();

      const pageImgHeight = (pageCanvas.height * pageWidth) / pageCanvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        topBottomPadding,
        pageWidth,
        pageImgHeight > usableHeight ? usableHeight : pageImgHeight
      );

      renderedHeight += canvasPageHeight;
      pageIndex++;
    }

    pdf.save("resume.pdf");
  };

  return (
    <div className="">
      <div className="px-5 sm:py-5">
        <div className="flex   flex-col-reverse md:items-end sm:flex-row sm:justify-between  text-[#f6f4ed] dark:text-black">
          <div>
            {resume ? (
              <h2 className="text-xl font-semibold hidden sm:block ">
                Edit Resume
              </h2>
            ) : (
              <h2 className="text-xl font-semibold hidden sm:block ">
                Upload & Edit
              </h2>
            )}

            <p className="text-md ">Select the text you want to modify.</p>
          </div>
          <div className=" relative -mb-8">
            <button
              onClick={onBoldSelection}
              className={`mt-1 mr-3 border  cursor-pointer px-3 py-1.5 rounded-[3px] text-xs sm:text-sm transition-all duration-200
    ${
      isBoldActive
        ? "bg-[#f6f4ed]  border-[#f6f4ed] text-black dark:text-black dark:bg-[#f6f4ed] dark:border-[#2b2a27]"
        : "bg-transparent font-semibold text-[#f6f4ed] border-[#f6f4ed] dark:border-[#2b2a27] dark:text-black"
    }`}
            >
              B
            </button>

            <FontDropdown />
            <FontSizeDropdown />
            <button
              onClick={markAllText}
              className="mt-1 border ml-3 font-bold cursor-pointer px-3 py-1.5 rounded-[3px] text-xs md:text-sm bg-transparent text-[#f6f4ed] dark:text-black  border-[#f6f4ed] dark:border-black  "
            >
              Mark All
            </button>
          </div>
        </div>
        <div
          style={{}}
          ref={resumeEditorRef}
          contentEditable
          suppressContentEditableWarning={true}
          className="w-full  h-100 overflow-y-scroll border bg-white text-black p-4 text-sm leading-relaxed min-h-[300px] whitespace-pre-wrap outline-none"
        ></div>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          <button
            onClick={handleDownload}
            className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2  font-bold   px-3 py-1.5 rounded-[3px]  text-[#2b2a27] bg-[#f6f4ed] dark:bg-[#2b2a27] dark:text-[#f6f4ed] text-xs  md:text-sm "
          >
            Download as PDF
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer mt-2 border-2 font-bold   px-3 py-1.5 rounded-[3px] border-[#f6f4ed] dark:border-black text-xs md:text-sm transform transition-transform duration-300 ease-in-out hover:scale-105"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleDelete}
            className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2 border-2 font-bold  px-3 py-1.5 rounded-[3px] border-red-700 text-red-700 dark:border-red-800 text-xs md:text-sm dark:text-red-800  "
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
    </div>
  );
}
