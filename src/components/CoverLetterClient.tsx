"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import BuyAccessButton from "../components/BuyAccessButton";
import toast from "react-hot-toast";
import FontDropdownWithDarkmode from "./FontDropdownWithDarkmode";
import FontSizeDropdownWithDarkmode from "./FontSizeDropdownWithDarkmode";
import ResumeForm from "./ResumeForm";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import MagneticCompWide from "./MagneticCompWide";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function CoverLetterClient() {
  const router = useRouter();
  const editableRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isCoverExpanded, setIsCoverExpanded] = useState(false);

  const [company, setCompany] = useState("");
  const [isBoldActive, setIsBoldActive] = useState(false);

  const [description, setDescription] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [errors, setErrors] = useState<{
    company?: string;
    description?: string;
    resume?: string;
  }>({});

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });

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
    if (!selection || selection.isCollapsed) return;

    document.execCommand("bold");

    const isActive =
      document.queryCommandState && document.queryCommandState("bold");
    setIsBoldActive(isActive);
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
      try {
        setLoading(true);

        const res = await fetch("/api/resume", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Failed to fetch resume");
          return;
        }

        const data = await res.json();

        if (data?.content) {
          setResume(data.content);
        } else {
          setResume("");
          toast("No resume found. Please create one.");
        }
      } catch {
        toast.error("Something went wrong while fetching resume");
      } finally {
        setLoading(false);
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

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const padding = 10;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgWidth = pdfWidth - 2 * padding;
    let positionY = 0;

    while (positionY < canvas.height) {
      const remainingHeight = canvas.height - positionY;

      const pageHeightPx = Math.min(
        (pdfHeight - 2 * padding) * (canvas.width / imgWidth),
        remainingHeight
      );

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightPx;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          positionY,
          canvas.width,
          pageHeightPx,
          0,
          0,
          canvas.width,
          pageHeightPx
        );
      }

      const imgData = pageCanvas.toDataURL("image/jpeg", 1.0);
      const imgPageHeight = (pageHeightPx * imgWidth) / canvas.width;

      if (positionY > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", padding, padding, imgWidth, imgPageHeight);

      positionY += pageHeightPx;
    }

    pdf.save("cover_letter.pdf");
  }

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  return (
    <div className="w-full  min-h-screen border-b-white/20 dark:border-b-black/20 bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      <main className="max-w-7xl bg-light mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-2 text-left">
          AI Cover Letter Generator
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 ">
            <div className="flex flex-col gap-y-2">
              <label className="block text-sm font-semibold mb-1">
                Company
              </label>

              <input
                className="w-full p-3.5 text-lg outline-none focus:outline-none dark:border-stone-900/80    dark:text-stone-800 border border-stone-400/80 rounded-[3px] stone-300/80  text-[#f6f4ed]  "
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name.."
              />
              {errors.company && (
                <p className="text-red-500 dark:text-red-700 text-sm">
                  {errors.company}
                </p>
              )}

              <label className="block text-sm font-semibold mb-1 mt-3">
                Job Description
              </label>
              <div className="relative">
                <motion.div
                  animate={{ height: isExpanded ? 250 : 100 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <textarea
                    id="custom-scrollbar"
                    ref={descriptionRef}
                    rows={6}
                    className="w-full h-full p-3 outline-none border-stone-400/60 dark:border-stone-700 border rounded-[3px] resize-none max-h-[250px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Paste job description here..."
                  />
                </motion.div>
                {errors.description && (
                  <p className="text-red-500 dark:text-red-700 text-sm mt-1">
                    {errors.description}
                  </p>
                )}

                {!description && (
                  <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[#2b2a27] text-[#f6f4ed] border-stone-500 border rounded-[3px] dark:bg-[#f6f4ed] dark:text-stone-800 z-10">
                    <div className="px-5 md:px-5 flex flex-col justify-center items-center text-center">
                      <p className="  text-left text-xs sm:text-sm mb-1  font-semibold">
                        Upload job description or find jobs with our job search.
                      </p>
                      <div className="flex flex-row gap-x-4">
                        <button
                          onClick={() => router.push("/jobs")}
                          className="inline-block text-xs sm:text-sm font-bold cursor-pointer bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 px-4 py-2 rounded"
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
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="-mt-2.5 cursor-pointer"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 mt-2 text-stone-100 dark:text-stone-800">
                Tone
              </label>
              <Select value={tone} onValueChange={(val) => setTone(val)}>
                <SelectTrigger className="w-full cursor-pointer  border-stone-300 dark:border-stone-700  bg-[#2b2a27] dark:bg-[#f6f4ed] dark:text-stone-900 text-stone-100 p-3 rounded-none">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>

                <SelectContent className="bg-stone-600  text-stone-100 border-stone-400/30">
                  <SelectItem
                    className="hover:bg-stone-700 cursor-pointer"
                    value="professional"
                  >
                    Professional
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-stone-700 cursor-pointer"
                    value="casual"
                  >
                    Casual
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-stone-700 cursor-pointer"
                    value="friendly"
                  >
                    Friendly
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-stone-700 cursor-pointer"
                    value="confident"
                  >
                    Confident
                  </SelectItem>
                </SelectContent>
              </Select>
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
                  <AnimatePresence>
                    {showResumeModal && (
                      <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowResumeModal(false)}
                        className="fixed h-[100dvh]  inset-0 flex items-center justify-center bg-black/80 z-50"
                      >
                        <motion.div
                          key="modal"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-1.5 ml-1.5 bg-[#1c1c1b] text-[#f6f4ed] md:px-2.5 px-1.5 py-6 rounded-[5px] max-w-6xl w-full relative"
                        >
                          <button
                            onClick={() => setShowResumeModal(false)}
                            className="absolute top-3 hover:scale-103 transition-transform ease-in-out bg-stone-500/30 text-stone-200  rounded-full p-[3px] right-3.5 text-lg z-[99999] cursor-pointer  "
                          >
                            <IoMdClose />
                          </button>
                          <ResumeForm resume={resume} />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                <div className="p-4 border max-w-xl text-white  rounded dark:text-stone-900">
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
                  <MagneticCompWide>
                    <button
                      onClick={onGenerate}
                      disabled={loading}
                      className={`w-full cursor-pointer py-3 rounded-[5px] uppercase tracking-wide px-3 text-lg
    bg-gradient-to-tr from-[#f5f4edd0] via-[#e2dfc7] to-[#f5f4edad]
    dark:from-[#2c2c2cd2] dark:via-[#3a3a3a] dark:to-[#2c2c2cc2]
    text-black dark:text-white font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 ${
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
                  </MagneticCompWide>
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
                <div className="flex  w-full  justify-between flex-col gap-y-2 mt-1 ">
                  <div className="flex flex-row w-full gap-x-2 items-center">
                    <button
                      onClick={onCopy}
                      className="mt-1 border cursor-pointer px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-xs md:text-sm text-[#f6f4ed] dark:text-[#2b2a27] dark:border-stone-700"
                    >
                      Copy
                    </button>
                    <button
                      onClick={onDownload}
                      className="mt-1 border cursor-pointer font-semibold px-3 py-1.5 rounded-[3px] md:text-sm bg-[#f6f4ed] text-xs text-[#2b2a27] dark:text-[#f6f4ed] dark:bg-[#2b2a27]"
                    >
                      Download as PDF
                    </button>
                  </div>
                  <div className="flex flex-row py-1 items-center ">
                    <button
                      onClick={onBoldSelection}
                      className={`mr-2 border font-bold cursor-pointer px-3 py-1.5 rounded-[3px]  text-sm transition-all duration-200 ${
                        isBoldActive
                          ? "bg-[#f6f4ed] text-[#2b2a27] border-stone-300/30 dark:bg-[#2b2a27] dark:text-[#f6f4ed] dark:border-[#2b2a27]"
                          : "bg-transparent text-[#f6f4ed] border-stone-300/30 dark:text-[#2b2a27] dark:border-[#2b2a27]"
                      }`}
                    >
                      B
                    </button>
                    <FontDropdownWithDarkmode />
                    <div>
                      <FontSizeDropdownWithDarkmode />
                    </div>
                    <button
                      onClick={onMarkAll}
                      className=" border ml-2 font-semibold cursor-pointer px-3 py-1.5 rounded-[3px] border-stone-300/30 text-sm text-[#f6f4ed] dark:text-[#2b2a27] dark:border-stone-600"
                    >
                      Mark All
                    </button>
                  </div>
                </div>

                <motion.div
                  style={{ scrollbarWidth: "thin" }}
                  animate={{ maxHeight: isCoverExpanded ? 9999 : 350 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-y-scroll relative border rounded bg-white"
                >
                  <div
                    ref={editableRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="p-4 text-black whitespace-pre-wrap"
                  >
                    {coverLetter}
                  </div>
                </motion.div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setIsCoverExpanded(!isCoverExpanded)}
                    className="text-sm font-semibold cursor-pointer"
                  >
                    {isCoverExpanded ? "Collapse" : "Expand"}
                  </button>
                </div>
                <div
                  ref={printRef}
                  className=" max-w-[800px]  w-full bg-white text-black"
                  style={{
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
