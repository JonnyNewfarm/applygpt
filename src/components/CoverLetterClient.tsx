"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import BuyAccessButton from "../components/BuyAccessButton";

export default function CoverLetterClient() {
  const router = useRouter();
  const editableRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const description = localStorage.getItem("jobDescription") as string;
  const company = localStorage.getItem("company") as string;

  const [resume, setResume] = useState("");
  const [jobAd, setJobAd] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeSaved, setResumeSaved] = useState(false);

  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });

  const handleClearStorage = async () => {
    localStorage.removeItem("company");
    localStorage.removeItem("jobDescription");
    window.location.reload();
  };

  useEffect(() => {
    if (!description) {
      setJobAd("");
    } else {
      setJobAd(`${company} 
        ${description}
        `);
    }
  }, [description, company]);

  useEffect(() => {
    async function fetchResume() {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setResume(data.content || "");
        if (data.content) setResumeSaved(true);
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
        alert(data.error || "Error generating");
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
      alert("Something went wrong");
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
        alert(data.error || "Error saving resume");
      } else {
        setResumeSaved(true);
      }
    } catch {
      alert("Failed to save resume");
    }
  }

  function onEditResume() {
    router.push("/profile");
  }

  function onCopy() {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  }

  async function onDownload() {
    if (!printRef.current) return;

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
    <div className="w-full min-h-screen  bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27]">
      <main className="max-w-7xl bg-light mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
          Cover Letter Generator
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Resume</label>
              <textarea
                style={{ scrollbarWidth: "thin" }}
                rows={6}
                className="w-full p-3 border bg-white text-black"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume here..."
              />
              {!resumeSaved ? (
                <button
                  onClick={onSaveResume}
                  className="mt-2 px-3 py-1.5 border  rounded-[3px] bg-dark text-sm  dark:border-[#2b2a27]   border-[#f6f4ed]   text-[#f6f4ed]   dark:text-[#2b2a27]"
                  disabled={!resume.trim()}
                >
                  Save Resume
                </button>
              ) : (
                <button
                  onClick={onEditResume}
                  className="mt-2 border dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
                >
                  Edit Resume
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                style={{ scrollbarWidth: "thin" }}
                rows={6}
                className="w-full p-3 border rounded-[3px] bg-white text-black"
                value={jobAd}
                onChange={(e) => setJobAd(e.target.value)}
                placeholder="Paste job description here..."
              />
              <button
                onClick={handleClearStorage}
                className="mt-2 border dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Clear description"}
              </button>{" "}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select
                className="w-full p-2 border-[#f6f4ed] dark:border-black border rounded-[3px]  bg-white text-black"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="confident">Confident</option>
              </select>
            </div>

            <div>
              <p className="text-sm  text-[#f6f4ed]   dark:text-[#2b2a27] mb-2">
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
                  className={`mt-4 w-full py-3 rounded-[3px] border dark:border-[#2b2a27]  px-3  border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]  font-semibold ${
                    loading
                      ? " cursor-not-allowed"
                      : " hover:opacity-80 cursor-pointer"
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

          {/* Right Column */}
          <div className="w-full md:w-1/2 mb-10">
            <h2 className="text-xl font-semibold mb-2">
              Generated Cover Letter
            </h2>

            {coverLetter ? (
              <>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={onCopy}
                    className="px-4 py-2 cursor-pointer bg-transparent dark border rounded-[3px] hover:opacity-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={onDownload}
                    className="px-4 py-2 cursor-pointer bg-dark hover:opacity-80 text-white rounded-[3px]"
                  >
                    Download as PDF
                  </button>
                </div>
                <h1 className="font-bold -mb-2">Edit if necessary</h1>
                <div
                  ref={editableRef}
                  className="p-4 bg-white mt-5 border text-black border-gray-300 rounded-[3px] whitespace-pre-wrap text-sm min-h-[300px]"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {coverLetter}
                </div>

                {/* Hidden printable version */}
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
                  dangerouslySetInnerHTML={{
                    __html: coverLetter
                      .split("\n")
                      .map((line) => `<p>${line}</p>`)
                      .join(""),
                  }}
                />
              </>
            ) : (
              <p className="text-[#f6f4ed]   dark:text-[#2b2a27] text-sm">
                Your cover letter will appear here once generated.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
