"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import FontDropdown from "./FontDropdown";
import FontSizeDropdown from "./FontSizeDropdown";
import Link from "next/link";

interface ResumeFormProps {
  resume: string | null;
}

export default function ResumeForm({ resume }: ResumeFormProps) {
  const [content, setContent] = useState(resume);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showEmptyModal, setShowEmptyModal] = useState(false);

  const [isBoldActive, setIsBoldActive] = useState(false);

  const resumeEditorRef = useRef<HTMLDivElement>(null);
  const resumePdfRef = useRef<HTMLDivElement>(null);

  let savedSelection: Range | null = null;

  const markAllText = () => {
    if (!resumeEditorRef.current) return;

    const range = document.createRange();
    range.selectNodeContents(resumeEditorRef.current);

    const selection = window.getSelection();
    if (!selection) return;

    // Save current scroll position
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    selection.removeAllRanges();
    selection.addRange(range);

    // Restore scroll so the page doesn't jump down
    window.scrollTo(scrollX, scrollY);

    savedSelection = range.cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };

  const onBoldSelection = (e?: React.MouseEvent) => {
    e?.preventDefault();
    restoreSelection();
    document.execCommand("bold");
    setTimeout(syncContent, 0);
  };

  useEffect(() => {
    if (resumeEditorRef.current) {
      resumeEditorRef.current.innerHTML = content!;
    }
  }, [content]);

  useEffect(() => {
    if (!resume || resume.trim() === "") {
      setShowEmptyModal(true);
    }
  }, [resume]);

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

      setContent(currentContent);
      toast("Resume saved.");
    } catch {
      toast.error("Failed to save resume.");
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
    setIsDeleting(true);
    try {
      await fetch("/api/resume", {
        method: "DELETE",
      });
      setContent("");
      toast("Resume deleted!");
    } catch (err) {
      console.error(err);
      toast("Failed to delete resume.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
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
    <div className="relative h-full pt-2">
      <div className="px-2 sm:px-3 sm:py-5 h-full">
        <div className="flex  flex-col-reverse md:items-end sm:flex-row sm:justify-between  text-[#f6f4ed] ">
          <div className="h-full">
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

          <div className=" relative -mb-8 h-full">
            {resume ? (
              <h2 className="text-lg mb- font-semibold sm:hidden ">
                Edit Resume
              </h2>
            ) : (
              <h2 className="text-lg font-semibold  sm:hidden ">
                Upload & Edit
              </h2>
            )}
            <button
              onClick={onBoldSelection}
              className={`mt-1 mr-3 border  cursor-pointer px-4 py-[9px] rounded-[3px]  text-xs md:text-sm transition-all duration-200
    ${
      isBoldActive
        ? "bg-[#f6f4ed]  border-white/40 text-black "
        : "bg-transparent font-semibold text-[#f6f4ed] border-white/20 "
    }`}
            >
              B
            </button>

            <FontDropdown />
            <FontSizeDropdown />
            <button
              onClick={markAllText}
              className="mt-1  ml-3   cursor-pointer px-3 py-[9px] rounded-[3px] text-xs md:text-sm bg-transparent text-[#f6f4ed]  border border-white/20    "
            >
              Mark All
            </button>
          </div>
        </div>
        <div
          id="custom-scrollbar"
          ref={resumeEditorRef}
          contentEditable
          suppressContentEditableWarning={true}
          className="h-[calc(100vh-240px)] w-full overflow-y-auto border bg-white text-black p-2  leading-snug text-[16px] md:text-[14px]   sm:leading-relaxed whitespace-pre-wrap outline-none"
        />
        {showEmptyModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white text-black p-6 rounded-lg w-80">
              <h2 className="text-lg font-semibold mb-4">No Resume Found</h2>
              <p className="mb-6 text-gray-600">
                You don’t have a resume yet. Start with using AI to generate a
                Resume or upload one.
              </p>
              <div className="flex  gap-x-2 justify-center items-center">
                <Link
                  className="bg-black text-white px-4 py-2 font-bold rounded-[3px]"
                  href={"/resume-generator"}
                >
                  Create Resume
                </Link>
                <button
                  onClick={() => setShowEmptyModal(false)}
                  className="px-4 py-2 border-2 font-semibold cursor-pointer rounded-[3px]re"
                >
                  Paste
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          <button
            onClick={handleDownload}
            className="cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 mt-2  font-bold   px-3 py-1.5 rounded-[3px]  text-[#2b2a27] bg-[#f6f4ed]  text-xs  md:text-sm "
          >
            Download as PDF
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer mt-2 border-2 font-bold   px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-xs md:text-sm transform transition-transform duration-300 ease-in-out hover:scale-105"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="border-red-600 border-2 text-red-600 cursor-pointer dark:border-red-700 dark:text-red-700 font-semibold  rounded-[4px] text-sm px-4 py-1.5 mt-2"
            >
              Delete
            </button>

            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="bg-white text-black p-6 rounded-lg w-80">
                  <h2 className="text-lg font-semibold mb-4">Delete Resume?</h2>
                  <p className="mb-6 text-gray-600">
                    Are you sure you want to delete your resume? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border-2 font-semibold cursor-pointer rounded"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 border-1 cursor-pointer font-semibold bg-red-800 text-white rounded"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
          dangerouslySetInnerHTML={{ __html: content! }}
        />
      </div>
    </div>
  );
}
