"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import BuyAccessButton from "../components/BuyAccessButton";
import toast from "react-hot-toast";

export default function CoverLetterClient() {
  const router = useRouter();
  const editableRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const description = localStorage.getItem("jobDescription") as string;
  const company = localStorage.getItem("company") as string;
  const url = localStorage.getItem("url") as string;

  const resumeRef = useRef<HTMLTextAreaElement>(null);

  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);
  const [textAreaSize, setTextAreaSize] = useState("150px");
  const [textAreaState, setTextAreaSizeState] = useState(false);
  const [textAreaTitle, setTextAreaSizeTitle] = useState("Show More");
  const [resumeLoading, setResumeLoading] = useState(true);

  const [textAreaSizeDescription, setTextAreaSizeDescription] =
    useState("150px");
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

  const handleClearStorage = async () => {
    setLoadingDelete(true);
    try {
      localStorage.removeItem("company");
      localStorage.removeItem("jobDescription");
      localStorage.removeItem("url");
      window.location.reload();
    } catch {
      toast("Something went wrong. Please try again.");
    }
    setLoadingDelete(false);
  };

  useEffect(() => {
    if (!description) {
      setJobAd("");
    } else {
      setJobAd(`${company} \n${description}`);
    }
  }, [description, company]);

  useEffect(() => {
    async function fetchResume() {
      setResumeLoading(true); // start loading
      try {
        const res = await fetch("/api/resume");
        if (res.ok) {
          const data = await res.json();
          setResume(data.content || "");
          if (data.content) {
            setResumeSaved(true);
            setShowOverlay(false);
          } else {
            setShowOverlay(true);
          }
        } else {
          setShowOverlay(true);
        }
      } finally {
        setResumeLoading(false); // finish loading
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
        toast(data.error || "Error generating");
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
      toast("Something went wrong");
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
      setTextAreaSize("150px");
      setTextAreaSizeTitle("show more");
    } else {
      setTextAreaSize("650px");
      setTextAreaSizeTitle("Show Less");
    }
  }, [textAreaState]);

  const handleTextAreaState = () => {
    setTextAreaSizeState(!textAreaState);
  };

  useEffect(() => {
    if (textAreaStateDescription === false) {
      setTextAreaSizeDescription("150px");
      setTextAreaSizeTitleDescription("show more");
    } else {
      setTextAreaSizeDescription("650px");
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

    const editedText = editableRef.current.innerText;
    printRef.current.innerHTML = editedText
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("");

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
    <div className="w-full min-h-screen border-b-white/20 dark:border-b-black/20 bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <main className="max-w-7xl bg-light mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
          Cover Letter Generator
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="relative">
              <label className="block text-sm font-semibold mb-1">Resume</label>
              <textarea
                ref={resumeRef}
                style={{ height: textAreaSize }}
                rows={6}
                className="w-full p-3 border bg-white text-black relative"
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  setResumeSaved(false);
                }}
                placeholder="Paste your resume here..."
              />
              {!resumeLoading && showOverlay && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-stone-200 text-black/90   z-10">
                  <div className="p-5 md:p-20 flex flex-col justify-center items-c">
                    <p className=" font-semibold mb-4">
                      Create or upload your resume to start generating a
                      tailored cover letter.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => router.push("/resume-generator")}
                        className="inline-block font-bold cursor-pointer bg-stone-900 text-white px-4 py-2 rounded mr-3"
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
                        className=" cursor-pointer font-semibold text-lg border-2 py-1 px-3 rounded-[4px]"
                      >
                        Paste
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                {!resumeSaved ? (
                  <button
                    onClick={onSaveResume}
                    className="mt-1 mb-5 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                    disabled={!resume.trim()}
                  >
                    Save Resume
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        resumeRef.current?.focus();
                      }, 0);
                    }}
                    className="mt-1 mb-5 border-2 font-bold dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                  >
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

            <div>
              <label className="block text-sm font-semibold mb-1">
                Job Description
              </label>
              <textarea
                style={{ height: textAreaSizeDescription }}
                rows={6}
                className="w-full p-3 border rounded-[3px] bg-white text-black"
                value={jobAd}
                onChange={(e) => setJobAd(e.target.value)}
                placeholder="Paste job description here..."
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={handleClearStorage}
                  className="mt-2 border-2 font-semibold px-3 py-1.5 cursor-pointer rounded-[3px] text-sm border-[#f6f4ed] dark:border-[#2b2a27] text-[#f6f4ed] dark:text-[#2b2a27] transform transition-transform duration-300 ease-in-out hover:scale-105"
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Deleting..." : "Clear description"}
                </button>
                <button
                  className="cursor-pointer"
                  onClick={handleTextAreaStateDescription}
                >
                  {textAreaTitleDescription}
                </button>
              </div>
            </div>

            {/* Tone */}
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

            {/* Usage and Generate */}
            <div>
              <p className="text-sm mb-2">
                {usage.generationLimit === null
                  ? `Used ${usage.generationCount} generations (Unlimited plan)`
                  : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
              </p>

              {isAtLimit ? (
                <div className="p-4 border border-red-500 rounded bg-red-100 text-red-700">
                  <p className="mb-3 font-semibold">
                    You have used up all your cover letter generations.
                  </p>
                  {usage.generationLimit !== null ? (
                    <>
                      <p className="mb-3">Upgrade to continue generating:</p>
                      <BuyAccessButton />
                    </>
                  ) : (
                    <ManageSubscriptionButton />
                  )}
                </div>
              ) : (
                <button
                  onClick={onGenerate}
                  disabled={loading || !resume || !jobAd}
                  className={`mt-3 w-full cursor-pointer py-3 rounded-[3px] border-[3px] uppercase dark:border-[#2b2a27] px-3 border-[#f6f4ed] text-lg text-[#f6f4ed] dark:text-[#2b2a27] font-bold  transform transition-transform duration-300 ease-in-out hover:scale-105 ${
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
              )}
            </div>
          </div>

          {/* Generated Cover Letter */}
          <div className="w-full md:w-1/2 mb-10">
            <h2 className="text-xl font-semibold mb-2">
              Generated Cover Letter
            </h2>
            <p>Your coverletter will apper here after you click generate.</p>

            {loading ? (
              <div className="mt-8 animate-pulse flex gap-x-4 items-center">
                <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
                <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
                <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
              </div>
            ) : coverLetter ? (
              <>
                <div className="flex flex-wrap gap-3 mt-4">
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f6f4ed] text-[#2b2a27] dark:bg-[#2b2a27] dark:text-[#f6f4ed] py-1 px-3 rounded-[3px] hover:opacity-90 mt-2 inline-block"
                    >
                      Apply
                    </a>
                  )}
                  <button
                    onClick={onCopy}
                    className="mt-2 border cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={onDownload}
                    className="mt-2 border cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] dark:text-[#2b2a27]"
                  >
                    Download as PDF
                  </button>
                </div>
                <h1 className="font-bold mt-2">Edit if necessary</h1>
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
