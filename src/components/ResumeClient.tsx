"use client";

import { useEffect, useRef, useState } from "react";
import BuyAccessButton from "../components/BuyAccessButton";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import toast from "react-hot-toast";

export default function ResumeClient() {
  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    country: "",
    city: "",
    address: "",
    experience: "",
    skills: "",
    phoneNumber: "",
    email: "",
    links: "",
  });

  const [generatedResume, setGeneratedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [usage, setUsage] = useState<{
    generationLimit: number | null;
    generationCount: number;
  }>({
    generationLimit: null,
    generationCount: 0,
  });

  const editableRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const isAtLimit =
    usage.generationLimit !== null &&
    usage.generationCount >= usage.generationLimit;

  useEffect(() => {
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
    fetchUsage();
  }, []);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onGenerate() {
    setIsGenerating(true);
    setGeneratedResume("");
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Error generating resume");
      } else {
        setGeneratedResume(data.resume);
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
    setIsGenerating(false);
  }

  function onCopy() {
    if (!editableRef.current) return;
    navigator.clipboard.writeText(editableRef.current.innerText).then(() => {
      toast("Copied to clipboard!");
    });
  }

  const handleSave = async () => {
    if (!editableRef.current) return;
    const content = editableRef.current.innerText.trim();
    if (!content) {
      toast("Resume is empty");
      return;
    }
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
    } catch {
      console.error("Failed to save resume");
      toast("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  async function onDownload() {
    if (!editableRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const tempDiv = document.createElement("div");
    tempDiv.style.width = "800px";
    tempDiv.style.padding = "24px";
    tempDiv.style.backgroundColor = "#ffffff";
    tempDiv.style.color = "black";
    tempDiv.style.fontSize = "14px";
    tempDiv.style.lineHeight = "1.6";
    tempDiv.style.whiteSpace = "pre-wrap";
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-9999px";
    tempDiv.style.left = "-9999px";
    tempDiv.innerText = editableRef.current.innerText;
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");

    document.body.removeChild(tempDiv);
  }

  return (
    <div className="w-full bg-[#2b2a27] text-[#f6f4ed] dark:bg-[#f6f4f2] dark:text-[#2b2a27] min-h-screen">
      <main className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="mb-2 text-lg  font-semibold">Or generate a resume:</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "Name", field: "name" },
            { label: "Job Title", field: "jobTitle" },
            { label: "Country", field: "country" },
            { label: "City", field: "city" },
            { label: "Address", field: "address" },
            { label: "Phone Number (optional)", field: "phoneNumber" },
            { label: "Email (optional)", field: "email" },
            { label: "Links (optional, e.g., LinkedIn)", field: "links" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-1">
                {label}
              </label>
              <input
                type="text"
                placeholder={label}
                value={form[field as keyof typeof form]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full p-2 border rounded-[3px] bg-white text-black"
              />
            </div>
          ))}

          {/* Full width fields below */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Work Experience & Education
            </label>
            <textarea
              placeholder="Work Experience & Education"
              rows={3}
              value={form.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              className="w-full p-2 border rounded-[3px] bg-white text-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Skills</label>
            <textarea
              placeholder="Skills"
              rows={3}
              value={form.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
              className="w-full p-2 border rounded-[3px] bg-white text-black"
            />
          </div>
        </div>

        <div className="mb-4 text-sm mt-4 text-[#f6f4ed] dark:text-[#2b2a27]">
          {usage.generationLimit === null
            ? `Used ${usage.generationCount} generations (Unlimited plan)`
            : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
        </div>

        {isAtLimit ? (
          <div className="p-4 border border-red-500 rounded bg-red-100 text-red-700">
            <p className="mb-3 font-semibold">
              You have used up all your resume generations.
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
            disabled={
              isGenerating || !form.name || !form.jobTitle || !form.experience
            }
            className={`mt-3 w-full cursor-pointer py-3 rounded-[3px] border-[3px] uppercase dark:bg-[#2b2a27] px-3 bg-[#fff7e9] text-lg text-black dark:text-[#f6f4ed] font-bold transform transition-transform duration-300 ease-in-out hover:scale-105  ${
              isGenerating ? "cursor-not-allowed" : "hover:opacity-80"
            }`}
          >
            {generatedResume
              ? isGenerating
                ? "Regenerating..."
                : "Regenerate"
              : isGenerating
              ? "Generating..."
              : "Generate Resume"}
          </button>
        )}

        {isGenerating && !generatedResume && (
          <div className="mt-8 animate-pulse flex gap-x-4 items-center ">
            <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
            <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
            <div className="h-2 w-2 bg-white/80 dark:bg-black/80 rounded-full"></div>
          </div>
        )}

        {generatedResume && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Generated Resume</h2>

            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={onCopy}
                className="px-4 py-2 border rounded-[3px] cursor-pointer hover:opacity-50"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={onDownload}
                className="px-4 py-2 border cursor-pointer rounded-[3px] hover:opacity-50"
              >
                Download as PDF
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border rounded-[3px] cursor-pointer bg-white/90 dark:bg-black/80 text-black dark:text-white hover:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save resume"}
              </button>
            </div>

            <h1 className="font-semibold mb-1">Customize if necessary:</h1>

            <div
              ref={editableRef}
              className="p-4 bg-white text-black border rounded-[3px] whitespace-pre-wrap text-sm min-h-[300px]"
              contentEditable
              suppressContentEditableWarning
            >
              {generatedResume}
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
              dangerouslySetInnerHTML={{
                __html: generatedResume
                  .split("\n")
                  .map((line) => `<p>${line}</p>`)
                  .join(""),
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
