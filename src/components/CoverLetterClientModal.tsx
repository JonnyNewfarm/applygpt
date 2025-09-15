"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import BuyAccessButton from "../components/BuyAccessButton";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FontDropdown from "./FontDropdown";
import FontSizeDropdown from "./FontSizeDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Props {
  job: {
    description: string;
    company: string;
    url: string;
  };
}

export default function CoverLetterClientModal({ job }: Props) {
  const router = useRouter();
  const editableRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const description = job?.description;
  const company = job?.company;
  const url = job?.url;

  const resumeRef = useRef<HTMLTextAreaElement>(null);

  const [resume, setResume] = useState("");
  const [isBoldActive, setIsBoldActive] = useState(false);

  const [jobAd, setJobAd] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedResume, setIsExpandedResume] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(true);

  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });

  const [showOverlay, setShowOverlay] = useState(false);

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

  function onCopy() {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      toast("Copied to clipboard!");
    });
  }

  const onClearDescription = async () => {
    setLoadingDelete(true);
    await new Promise((res) => setTimeout(res, 500));
    setJobAd("");
    setLoadingDelete(false);
  };
  async function onDownload() {
    if (!printRef.current || !editableRef.current) return;

    const editedHTML = editableRef.current.innerHTML;
    printRef.current.innerHTML = editedHTML;

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

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  return (
    <div className="w-full min-h-screen  border-b-white/20  bg-[#1c1c1b]   text-[#f6f4ed] ">
      <main className="max-w-7xl  bg-light mx-auto p-2 md:p-8">
        <h1 className="text-2xl px-2 mt-3  text-wrap w-[80%] sm:w-[100%] text-left font-xl md:mt-0 font-bold mb-6 ">
          AI Cover Letter Generator
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="relative">
              <label className="block text-sm font-semibold mb-1">Resume</label>
              <motion.div
                animate={{ height: isExpandedResume ? 250 : 100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <textarea
                  id="custom-scrollbar"
                  ref={resumeRef}
                  className="w-full outline-none h-full p-3 border-stone-400/60 border rounded-[3px] resize-none max-h-[250px]"
                  value={resume}
                  onChange={(e) => {
                    setResume(e.target.value);
                    setResumeSaved(false);
                  }}
                  placeholder="Paste your resume here..."
                />
              </motion.div>
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
                    className="mt-1 mb-5 border-2 font-bold  px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
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
                    className=" mb-5 border-2 font-bold  px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    Edit Resume
                  </button>
                )}
                <button
                  onClick={() => setIsExpandedResume(!isExpandedResume)}
                  className="-mt-4 cursor-pointer"
                >
                  {isExpandedResume ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Job Description
              </label>
              <motion.div
                animate={{ height: isExpanded ? 250 : 100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <textarea
                  id="custom-scrollbar"
                  ref={contentRef}
                  className="w-full outline-none h-full p-3 border-stone-400/60 border rounded-[3px] resize-none"
                  value={jobAd}
                  onChange={(e) => setJobAd(e.target.value)}
                  placeholder="Paste job description here..."
                />
              </motion.div>
              <div className="flex justify-between items-center">
                <button
                  onClick={onClearDescription}
                  className="mt-2 border-2 font-semibold px-3 py-1.5 cursor-pointer rounded-[3px] text-sm border-[#f6f4ed]  text-[#f6f4ed]  transform transition-transform duration-300 ease-in-out hover:scale-105"
                  disabled={loadingDelete}
                >
                  {loadingDelete ? "Deleting..." : "Clear description"}
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 cursor-pointer"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black ">
                  <SelectItem
                    value="professional"
                    className="focus:bg-stone-100 "
                  >
                    Professional
                  </SelectItem>
                  <SelectItem value="casual" className="focus:bg-stone-100 ">
                    Casual
                  </SelectItem>
                  <SelectItem value="friendly" className="focus:bg-stone-100 ">
                    Friendly
                  </SelectItem>
                  <SelectItem value="confident" className="focus:bg-stone-100">
                    Confident
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm mb-2">
                {usage.generationLimit === null
                  ? `Used ${usage.generationCount} generations (Unlimited plan)`
                  : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
              </p>

              {isAtLimit ? (
                <div className="p-4 bg-[#faf7f1] text-stone-900 rounded ">
                  <p className="font-semibold mb-1">No more tokens</p>

                  <p className="mb-3">
                    You have used up all your cover letter generations.
                  </p>
                  {usage.generationLimit !== null ? (
                    <>
                      <h1 className="font-bold mb-1">No more tokens</h1>
                      <p className="mb-3">
                        Upgrade today to keep generating —{" "}
                        <strong>no commitment</strong> required, and enjoy our{" "}
                        <strong>limited-time sale</strong>:
                      </p>
                      <BuyAccessButton />
                    </>
                  ) : (
                    <ManageSubscriptionButton />
                  )}
                </div>
              ) : (
                <div className="sticky bottom-4 z-20   rounded">
                  <button
                    onClick={onGenerate}
                    disabled={loading || !resume || !jobAd}
                    className={`w-full mt-3 cursor-pointer py-3 rounded-[5px] uppercase tracking-wide px-3 text-lg
    bg-gradient-to-tr from-[#f5f4edd0] via-[#e2dfc7] to-[#f5f4edad]
    
    text-black  font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 ${
      loading ? "cursor-not-allowed" : "hover:opacity-90"
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
            <h2 className="text-xl font-semibold mb-1">
              Generated Cover Letter
            </h2>

            {!coverLetter && (
              <p> Your coverletter will apper here after you click generate.</p>
            )}

            {loading ? (
              <div className="mt-8 animate-pulse flex gap-x-4 items-center">
                <div className="h-2 w-2 rounded-full bg-white/80 "></div>
                <div className="h-2 w-2 rounded-full bg-white/80"></div>
                <div className="h-2 w-2 rounded-full bg-white/80"></div>
              </div>
            ) : coverLetter ? (
              <>
                <div className="flex flex-wrap gap-3">
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f6f4ed] flex text-[#2b2a27]  py-1 px-3 rounded-[3px] hover:opacity-90 mt-2 items-center gap-x-1 font-semibold"
                    >
                      <FaExternalLinkAlt /> Open
                    </a>
                  )}
                  <button
                    onClick={onCopy}
                    className="mt-2 border font-semibold cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed] "
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={onDownload}
                    className="mt-2 border font-semibold cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-sm text-[#f6f4ed]"
                  >
                    Download as PDF
                  </button>
                </div>
                <div className=" space-x-2 mt-2">
                  <button
                    onClick={onBoldSelection}
                    className={`mt-2 mr-2 border font-bold cursor-pointer px-3 py-1.5 rounded-[3px] text-sm transition-all duration-200 ${
                      isBoldActive
                        ? "bg-[#f6f4ed] text-[#2b2a27] border-stone-300/30 "
                        : "bg-transparent text-[#f6f4ed] border-stone-300/30 "
                    }`}
                  >
                    B
                  </button>
                  <FontDropdown editorRef={editableRef} />
                  <FontSizeDropdown editorRef={editableRef} />

                  <button
                    onClick={onMarkAll}
                    className="mt-2 border  font-semibold cursor-pointer px-3 py-1.5 rounded-[3px] border-stone-300/30 text-sm text-[#f6f4ed] "
                  >
                    Mark All
                  </button>
                </div>

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
