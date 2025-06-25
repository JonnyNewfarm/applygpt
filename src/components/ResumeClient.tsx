"use client";

import { useEffect, useRef, useState } from "react";
import BuyAccessButton from "../components/BuyAccessButton";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import Link from "next/link";

export default function ResumeClient() {
  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    country: "",
    city: "",
    address: "",
    experience: "",
    skills: "",
  });

  const [generatedResume, setGeneratedResume] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setGeneratedResume("");

    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error generating resume");
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
      alert("Something went wrong");
    }

    setLoading(false);
  }

  function onCopy() {
    if (!editableRef.current) return;
    navigator.clipboard.writeText(editableRef.current.innerText).then(() => {
      alert("Copied to clipboard!");
    });
  }

  const handleSave = async () => {
    if (!editableRef.current) return;

    const content = editableRef.current.innerText.trim();

    if (!content) {
      alert("Resume is empty");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      alert("Resume saved!");
    } catch {
      console.error("Failed to save resume");
      alert("Failed to save resume.");
    } finally {
      setLoading(false);
    }
  };

  async function onDownload() {
    if (!editableRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    // Create a temporary hidden div with the current edited content
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

    document.body.removeChild(tempDiv); // Clean up
  }

  return (
    <div className="w-full bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4ed] dark:text-[#2b2a27] min-h-screen bg-light">
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
          Resume Generator
        </h1>

        <p className="mb-2">
          Already have a resume? Save it in your profile page.
        </p>
        <div className="mb-5">
          <Link
            className="bg-white/80 rounded-[3px] text-black px-4 py-2"
            href={"/profile"}
          >
            Profile
          </Link>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { label: "Name", field: "name" },
            { label: "Job Title", field: "jobTitle" },
            { label: "Country", field: "country" },
            { label: "City", field: "city" },
            { label: "Address", field: "address" },
            { label: "Work Experience & Education", field: "experience" },
            { label: "Skills", field: "skills" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <textarea
                placeholder={label}
                rows={field === "experience" || field === "skills" ? 3 : 1}
                value={form[field as keyof typeof form]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full p-2 border rounded-[3px] bg-white text-black"
              />
            </div>
          ))}
        </div>

        <div className="mb-4 text-sm mt-4    text-[#f6f4ed]   dark:text-[#2b2a27]">
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
              loading || !form.name || !form.jobTitle || !form.experience
            }
            className={`mt-4 w-full py-3 cursor-pointer rounded-[3px] border dark:border-[#2b2a27]  px-3  border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27]  font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : " hover:opacity-80"
            }`}
          >
            {generatedResume
              ? loading
                ? "Regenerating..."
                : "Regenerate"
              : loading
              ? "Generating..."
              : "Generate Resume"}
          </button>
        )}

        {generatedResume && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Generated Resume</h2>

            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={onCopy}
                className="px-4 py-2 border rounded-[3px] hover:opacity-50"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-dark text-white rounded-[3px] hover:opacity-80"
              >
                Download as PDF
              </button>
              <button
                onClick={handleSave}
                className="bg-dark cursor-pointer text-white px-4 py-2 rounded-[3px]"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save resume"}
              </button>
            </div>

            <h1 className="font-semibold mb-1">Customize if necessary:</h1>

            <div
              ref={editableRef}
              className="p-4 bg-white border rounded-[3px] whitespace-pre-wrap text-sm min-h-[300px]"
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
