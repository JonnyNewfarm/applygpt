"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import BuyAccessButton from "../components/BuyAccessButton";
import toast from "react-hot-toast";
import FontDropdown from "./FontDropdown";
import FontSizeDropdown from "./FontSizeDropdown";

export default function CoverLetterClient() {
  const router = useRouter();
  const editableRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const [company, setCompany] = useState("");
  const [isBoldActive, setIsBoldActive] = useState(false);

  const [description, setDescription] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [errors, setErrors] = useState<{
    company?: string;
    description?: string;
    resume?: string;
  }>({});

  const resumeRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);
  const [textAreaSize, setTextAreaSize] = useState("350px");
  const [textAreaState, setTextAreaSizeState] = useState(false);
  const [textAreaTitle, setTextAreaSizeTitle] = useState("Show More");
  const [resumeLoading, setResumeLoading] = useState(true);

  const [textAreaSizeDescription, setTextAreaSizeDescription] =
    useState("100px");
  const [textAreaStateDescription, setTextAreaSizeStateDescription] =
    useState(false);
  const [textAreaTitleDescription, setTextAreaSizeTitleDescription] =
    useState("Show More");

  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });

  const [showOverlay, setShowOverlay] = useState(false);

  const onMarkAll = () => {
    if (!editableRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(editableRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const onBoldSelection = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText) return;

    const commonAncestor = range.commonAncestorContainer;
    let parentElement: HTMLElement | null = null;

    if (commonAncestor.nodeType === Node.TEXT_NODE) {
      parentElement = commonAncestor.parentElement;
    } else if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
      parentElement = commonAncestor as HTMLElement;
    }

    if (
      parentElement &&
      (parentElement.tagName === "B" || parentElement.tagName === "STRONG")
    ) {
      const unwrapped = document.createTextNode(selectedText);
      const parent = parentElement.parentNode;
      if (parent) {
        parent.replaceChild(unwrapped, parentElement);
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(unwrapped);
        selection.addRange(newRange);
      }
      setIsBoldActive(false);
      return;
    }

    const boldNode = document.createElement("b");
    boldNode.appendChild(range.extractContents());
    range.insertNode(boldNode);

    setIsBoldActive(true);
  };

  useEffect(() => {
    if (!description) {
      setJobAd("");
    } else {
      setJobAd(`${company} \n${description}`);
    }
  }, [description, company]);

  useEffect(() => {
    function stripHtml(html: string) {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    }

    async function fetchResume() {
      setResumeLoading(true);
      try {
        const res = await fetch("/api/resume");
        if (res.ok) {
          const data = await res.json();
          const cleanResume = stripHtml(data.content || "");
          setResume(cleanResume);
          if (cleanResume.trim()) {
            setResumeSaved(true);
            setShowOverlay(false);
          } else {
            setShowOverlay(true);
          }
        } else {
          setShowOverlay(true);
        }
      } finally {
        setResumeLoading(false);
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
    const newErrors: {
      company?: string;
      description?: string;
      resume?: string;
    } = {};

    if (!company.trim()) {
      newErrors.company = "Company name is required.";
    }
    if (!description.trim()) {
      newErrors.description = "Job description is required.";
    }
    if (!resume.trim()) {
      newErrors.resume = "Resume is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
        setErrors({
          description: data.error || "Error generating cover letter",
        });
      } else {
        setCoverLetter(data.coverLetter);

        const usageRes = await fetch("/api/usage");
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage({
            generationLimit: usageData.generationLimit,
            generationCount: usageData.generationCount,
          });
        }
      }
    } catch {
      setErrors({ description: "Something went wrong" });
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
        toast(data.error || "Error saving resume");
      } else {
        setResumeSaved(true);
        setShowOverlay(false);
        toast("Resume Saved");
      }
    } catch {
      toast("Failed to save resume");
    }
  }

  useEffect(() => {
    if (!resume.trim()) {
      setShowOverlay(true);
    }
  }, [resume]);

  useEffect(() => {
    if (textAreaState === false) {
      setTextAreaSize("350px");
      setTextAreaSizeTitle("show more");
    } else {
      setTextAreaSize("500px");
      setTextAreaSizeTitle("Show Less");
    }
  }, [textAreaState]);

  const handleTextAreaState = () => {
    setTextAreaSizeState(!textAreaState);
  };

  useEffect(() => {
    if (textAreaStateDescription === false) {
      setTextAreaSizeDescription("100px");
      setTextAreaSizeTitleDescription("show more");
    } else {
      setTextAreaSizeDescription("500px");
      setTextAreaSizeTitleDescription("Show Less");
    }
  }, [textAreaStateDescription]);

  const handleTextAreaStateDescription = () => {
    setTextAreaSizeStateDescription(!textAreaStateDescription);
  };

  function onCopy() {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      toast("Copied to clipboard!");
    });
  }

  async function onDownload() {
    if (!printRef.current || !editableRef.current) return;

    printRef.current.innerHTML = editableRef.current.innerHTML;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("cover_letter.pdf");
  }

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  return (
    <div className="w-full -mt-4 min-h-screen border-b-white/20 dark:border-b-black/20 bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <main className="max-w-7xl bg-light mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-2 text-center md:text-left">
          AI Cover Letter Generator
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 ">
            <div className="flex flex-col gap-y-2">
              <label className="block text-sm font-semibold mb-1">
                Company
              </label>

              <input
                className="w-full p-1.5 border rounded-[3px] bg-white text-black"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name.."
              />
              {errors.company && (
                <p className="text-red-500 dark:text-red-700 text-sm">
                  {errors.company}
                </p>
              )}

              <label className="block text-sm font-semibold mb-1">
                Job Description
              </label>
              <div className="relative">
                <textarea
                  ref={descriptionRef}
                  style={{ height: textAreaSizeDescription }}
                  rows={6}
                  className="w-full p-3 border rounded-[3px] bg-white text-black"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste job description here..."
                />
                {errors.description && (
                  <p className="text-red-500 dark:text-red-700 text-sm mt-1">
                    {errors.description}
                  </p>
                )}

                {!description && (
                  <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-stone-200 text-black/90 z-10">
                    <div className="px-5 md:px-5 flex flex-col justify-center items-center text-center">
                      <p className="  text-left text-xs sm:text-sm mb-1  font-semibold">
                        Upload job description or find jobs with our job search.
                      </p>
                      <div className="flex flex-row gap-x-4">
                        <button
                          onClick={() => router.push("/jobs")}
                          className="inline-block text-xs sm:text-sm font-bold cursor-pointer bg-stone-800 text-white px-4 py-2 rounded"
                        >
                          Find Jobs
                        </button>
                        <button
                          onClick={() => {
                            if (!description.trim()) {
                              setDescription(" ");
                            }
                            setTimeout(() => {
                              descriptionRef.current?.focus();
                            }, 0);
                          }}
                          className="cursor-pointer font-semibold text-xs sm:text-sm border-2 py-1 px-3 rounded-[4px]"
                        >
                          Paste
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setDescription("")}
                  className="mt-1 mb-4 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Delete Description
                </button>
                <button
                  className="cursor-pointer"
                  onClick={handleTextAreaStateDescription}
                >
                  {textAreaTitleDescription}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select
                className="w-full p-2 border rounded-[3px] bg-white text-black"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="confident">Confident</option>
              </select>
            </div>

            <div className="w-full">
              <div className="">
                <div className="flex flex-col w-full">
                  {" "}
                  <button
                    onClick={() => setShowResumeModal((prev) => !prev)}
                    className="border-2 sticky max-w-36 mt-4 cursor-pointer px-4 py-2 mb-2  rounded-[3px] text-sm font-semibold dark:border-[#2b2a27] border-[#f6f4ed] text-[#f6f4ed] dark:text-[#2b2a27] hover:scale-105 transform transition-transform duration-200"
                  >
                    {showResumeModal ? "Close" : "Your Resume"}
                  </button>
                  {errors.resume && (
                    <p className="text-red-500 dark:text-red-700 text-sm mt-1">
                      {errors.resume}
                    </p>
                  )}
                  {showResumeModal && (
                    <div
                      onClick={() => setShowResumeModal(false)}
                      className="fixed  inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="p-4 w-[95%] max-w-6xl bg-stone-800 dark:bg-stone-50"
                      >
                        <div className="flex justify-between items-center">
                          <label className="block text-xl font-semibold mb-1">
                            Resume
                          </label>
                          <button
                            onClick={() => setShowResumeModal(false)}
                            className="mb-4 text-2xl cursor-pointer font-semibold"
                          >
                            ✕
                          </button>
                        </div>
                        <div
                          style={{ height: textAreaSize }}
                          className="relative"
                        >
                          <textarea
                            ref={resumeRef}
                            className="w-full h-full p-3 border bg-white text-black"
                            value={resume}
                            onChange={(e) => {
                              setResume(e.target.value);
                              setResumeSaved(false);
                            }}
                            placeholder="Paste your resume here..."
                          />

                          {!resumeLoading && showOverlay && (
                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-stone-800 dark:bg-stone-50 text-black/90 z-10">
                              <div className="px-5 md:px-26 text-md text-white dark:text-black md:text-lg flex flex-col gap-y-2  justify-center items-center w-full">
                                <div className="text-left ">
                                  <h1 className="font-semibold text-lg md:text-xl">
                                    Resume Missing
                                  </h1>
                                  <p className="m-0">
                                    Create a new resume or upload your existing
                                    one to get started.{" "}
                                  </p>
                                  <p className="m-0">
                                    Once it’s ready, you can generate a
                                    personalized cover letter tailored to the
                                    job you’re applying for.
                                  </p>
                                  <div className="flex  w-full mt-2 gap-4">
                                    <button
                                      onClick={() =>
                                        router.push("/resume-generator")
                                      }
                                      className="inline-block font-bold cursor-pointer bg-stone-200 text-black dark:bg-stone-900 dark:text-white px-4 py-2 rounded mr-3 text-sm"
                                    >
                                      Create Resume
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowOverlay(false);
                                        setTimeout(() => {
                                          resumeRef.current?.focus();
                                        }, 0);
                                      }}
                                      className="cursor-pointer text-xs sm:text-sm font-semibold  border-2 py-1 px-3 rounded-[4px]"
                                    >
                                      Paste
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex mt-2 justify-between items-center">
                          {!resumeSaved ? (
                            <button
                              onClick={onSaveResume}
                              className="mb-5 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                              disabled={loading}
                            >
                              Save Resume
                            </button>
                          ) : (
                            <button className="mt-1 mb-5 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105">
                              Edit Resume
                            </button>
                          )}
                          <button
                            className="cursor-pointer"
                            onClick={handleTextAreaState}
                          >
                            {textAreaTitle}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm mb-2 mt-2">
                    {usage.generationLimit === null
                      ? `Used ${usage.generationCount} generations (Unlimited plan)`
                      : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
                  </p>
                </div>
              </div>

              {isAtLimit ? (
                <div className="p-4 border  rounded bg-[#faf7f1] text-stone-900">
                  <p className="font-semibold mb-1">No more tokens</p>

                  <p className="mb-3">
                    You have used up all your cover letter generations.
                  </p>
                  {usage.generationLimit !== null ? (
                    <>
                      <h1 className="font-semibold">Upgrade plan:</h1>
                      <p className="mb-3">
                        Upgrade today to keep generating —{" "}
                        <strong>no commitment</strong>
                        required, and enjoy our{" "}
                        <strong>limited-time sale</strong>:
                      </p>
                      <BuyAccessButton />
                    </>
                  ) : (
                    <ManageSubscriptionButton />
                  )}
                </div>
              ) : (
                <div className="">
                  <button
                    onClick={onGenerate}
                    disabled={loading}
                    className={`mt-3 w-full  cursor-pointer py-3 rounded-[3px]  uppercase tracking-wide  px-3 text-lg text-[#f6f4ed] dark:text-black border-[#f6f4ed] shadow-md shadow-white/35 dark:shadow-black/25 border-2 dark:border-black font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 ${
                      loading
                        ? "cursor-not-allowed"
                        : "hover:opacity-80 cursor-pointer"
                    }`}
                  >
                    {coverLetter
                      ? loading
                        ? "Regenerating..."
                        : "Regenerate"
                      : loading
                      ? "Generating..."
                      : "Generate Cover Letter"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 mb-10">
            <h2 className="text-xl font-semibold mb-2">
              Generated Cover Letter
            </h2>
            {!coverLetter && (
              <p>Your coverletter will apper here after you click generate.</p>
            )}

            {loading ? (
              <div className="mt-8 animate-pulse flex gap-x-4 items-center">
                <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
                <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
                <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
              </div>
            ) : coverLetter ? (
              <>
                <div className="flex flex-wrap gap-3 mt-1">
                  <button
                    onClick={onCopy}
                    className="mt-1 border cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={onDownload}
                    className="mt-1 border cursor-pointer px-3 py-1.5 rounded-[3px] bg-[#f6f4ed] text-sm text-[#2b2a27] dark:text-[#f6f4ed] dark:bg-[#2b2a27]"
                  >
                    Download as PDF
                  </button>
                </div>
                <h1 className="font-bold mt-2">Edit:</h1>
                <button
                  onClick={onBoldSelection}
                  className={`mt-2 mr-2 border font-bold cursor-pointer px-3 py-1.5 rounded-[3px] text-sm transition-all duration-200 ${
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
                  onClick={onMarkAll}
                  className="mt-2 border ml-2 font-semibold cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
                >
                  Mark All
                </button>
                <div
                  ref={editableRef}
                  className="p-4 bg-white mt-2 border text-black border-gray-300 rounded-[3px] whitespace-pre-wrap text-sm min-h-[300px]"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {coverLetter}
                </div>

                <div
                  ref={printRef}
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
                />
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
