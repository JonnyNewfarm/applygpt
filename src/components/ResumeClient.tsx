"use client";

import { useEffect, useRef, useState } from "react";
import BuyAccessButton from "../components/BuyAccessButton";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import toast from "react-hot-toast";
import ResumeUploadPopUp from "./ResumeUploadPopUp";
import ResumeForm from "./ResumeForm";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

interface ResumeClientProps {
  resume: string;
}

export default function ResumeClient({ resume }: ResumeClientProps) {
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
    other: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    jobTitle?: string;
    country?: string;
    city?: string;
    address?: string;
    experience?: string;
    skills?: string;
    other?: string;
  }>({});

  const [generatedResume, setGeneratedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showGeneralInfoModal, setShowGeneralInfoModal] = useState(false);
  const [isResumeSaved, setIsResumeSaved] = useState(false);
  const [showEditResumeModal, setShowEditResumeModal] = useState(false);
  const [latestResume, setLatestResume] = useState(resume);
  const [showJobsBtn, setShowJobsBtn] = useState(false);

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
    if (field === "name") {
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleEditResume = async () => {
    try {
      const res = await fetch("/api/resume", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setShowEditResumeModal(true);
        setLatestResume(data.content || "");
      } else {
        toast.error("Failed to fetch latest resume");
      }
    } catch {
      toast.error("Error fetching latest resume");
    }
  };

  function validateForm() {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.jobTitle.trim()) newErrors.jobTitle = "Job title is required.";
    if (!form.experience.trim())
      newErrors.experience = "Work experience is required.";
    if (!form.country.trim()) newErrors.country = "Country is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.skills.trim()) newErrors.skills = "Skills are required.";

    return newErrors;
  }

  async function onGenerate() {
    if (isAtLimit) {
      toast.error("You have reached your generation limit.");
      return;
    }

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setErrors({});
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

  const handleSave = async () => {
    if (!editableRef.current) return;
    const content = editableRef.current.innerText.trim();
    if (!content) {
      toast("Resume is empty");
      return;
    }
    setIsSaving(true);
    setShowJobsBtn(true);
    try {
      await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      toast("Resume saved!");
      setIsResumeSaved(true);
    } catch {
      console.error("Failed to save resume");
      toast("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-[#2b2a27] text-[#f6f4ed] mb-10 dark:bg-[#f6f4f2] dark:text-[#2b2a27] min-h-screen">
      <ResumeUploadPopUp
        title={resume ? "Edit Your Resume:" : "Already have a resume?"}
        buttonTitle={resume ? "Edit " : "Upload"}
      >
        <ResumeForm resume={resume} />
      </ResumeUploadPopUp>
      <main className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="font-semibold text-xl">
          Build a Professional Resume with AI
        </h1>
        <h1 className="mb-2 text-xl">
          Craft a resume instantly and start discovering jobs that fit you.{" "}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">
              General Info
            </label>
            <button
              onClick={() => setShowGeneralInfoModal(true)}
              className="w-full cursor-pointer py-3 rounded-[3px] uppercase tracking-wide px-3 text-sm text-[#f6f4ed] dark:text-black border-[#f6f4ed] border-2 dark:border-black font-bold hover:scale-105"
            >
              {form.name ||
              form.jobTitle ||
              form.phoneNumber ||
              form.email ||
              form.links
                ? "Edit General Info"
                : "Add General Info"}
            </button>
            {(errors.name || errors.jobTitle) && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-700">
                Please fill in required fields.
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Address</label>
            <button
              onClick={() => setShowAddressModal(true)}
              className="w-full cursor-pointer py-3 rounded-[3px] uppercase tracking-wide px-3 text-sm text-[#f6f4ed] dark:text-black border-[#f6f4ed] border-2 dark:border-black font-bold hover:scale-105"
            >
              {form.country || form.city || form.address
                ? "Edit Address"
                : "Add Address"}
            </button>
            {(errors.address || errors.country || errors.city) && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-700">
                Please fill in required fields.
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">
              Work Experience & Education
            </label>
            <button
              onClick={() => setShowExperienceModal(true)}
              className="w-full cursor-pointer py-3 rounded-[3px] uppercase tracking-wide px-3 text-sm text-[#f6f4ed] dark:text-black border-[#f6f4ed] border-2 dark:border-black font-bold hover:scale-105"
            >
              {form.experience
                ? "Edit Experience / Education"
                : "Add Experience / Education"}
            </button>
            {errors.experience && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-700">
                {errors.experience}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Skills</label>
            <button
              onClick={() => setShowSkillsModal(true)}
              className="w-full cursor-pointer py-3 rounded-[3px] uppercase tracking-wide px-3 text-sm text-[#f6f4ed] dark:text-black border-[#f6f4ed] border-2 dark:border-black font-bold hover:scale-105"
            >
              {form.skills ? "Edit Skills / Other" : "Add Skills / Other"}
            </button>
            {errors.skills && (
              <div>
                <p className="mt-1 text-sm text-red-500 dark:text-red-700">
                  {errors.skills}
                </p>
              </div>
            )}
          </div>
        </div>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white text-black p-6 rounded-[3px] w-[90%] max-w-xl">
              <h2 className="text-lg font-semibold mb-2">Address Details</h2>
              <div className="space-y-2">
                <div>
                  <label>
                    <h1 className="font-semibold">Country</h1>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="w-full p-2 border rounded-[3px] text-sm"
                      placeholder="Country.."
                    />
                  </label>
                </div>

                <div>
                  <label>
                    <h1 className="font-semibold">City</h1>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full p-2 border rounded-[3px] text-sm"
                      placeholder="City.."
                    />
                  </label>
                </div>

                <div>
                  <label>
                    <h1 className="font-semibold">Address</h1>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full p-2 border rounded-[3px] text-sm"
                      placeholder="Address.."
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 cursor-pointer bg-gray-200 text-black rounded-[3px] hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 cursor-pointer bg-black text-white rounded-[3px] hover:bg-black/80"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showGeneralInfoModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white text-black p-6 rounded-[3px] w-[90%] max-w-xl">
              <h2 className="text-lg font-semibold mb-4">
                General Information
              </h2>
              {[
                { label: "Name", field: "name", placeholder: "Name.." },
                {
                  label: "Your Profession ",
                  field: "jobTitle",
                  placeholder: "Profession..",
                },

                {
                  label: "Phone Number(Optional)",
                  field: "phoneNumber",
                  placeholder: "Phone Number..",
                },
                {
                  label: "Email(Optional)",
                  field: "email",
                  placeholder: "Email..",
                },
                {
                  label: "Links(Optional)",
                  field: "links",
                  placeholder: "Links..",
                },
              ].map(({ label, field, placeholder }) => (
                <div key={field} className="mb-3">
                  <label className="block text-sm font-semibold">{label}</label>
                  <input
                    type="text"
                    value={form[field as keyof typeof form]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full p-2 border rounded-[3px] text-sm"
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowGeneralInfoModal(false)}
                  className="px-4 py-2 cursor-pointer bg-gray-200 text-black rounded-[3px] hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowGeneralInfoModal(false)}
                  className="px-4 py-2 cursor-pointer bg-black text-white rounded-[3px] hover:bg-black/80"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showExperienceModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white text-black px-2.5 py-4 md:p-6 rounded-[3px] w-[90%] max-w-xl">
              <h2 className="text-lg font-semibold mb-2">
                Work Experience & Education
              </h2>
              <textarea
                rows={20}
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                className="w-full p-2 border rounded-[3px] text-sm"
                placeholder="Add your experience and education"
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowExperienceModal(false)}
                  className="px-4 py-2 cursor-pointer bg-gray-200 text-black rounded-[3px] hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowExperienceModal(false)}
                  className="px-4 py-2 cursor-pointer bg-black text-white rounded-[3px] hover:bg-black/80"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showSkillsModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white text-black p-6 rounded-[3px] w-[90%] max-w-xl">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <textarea
                rows={12}
                value={form.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
                className="w-full p-2 border rounded-[3px] text-sm"
                placeholder="Add your skills"
              />
              <h1 className="text-lg font-semibold mb-2 mt-4">
                {"Other(Optional)"}
              </h1>
              <textarea
                rows={9}
                value={form.other}
                onChange={(e) => handleChange("other", e.target.value)}
                className="w-full p-2 border rounded-[3px] text-sm"
                placeholder="Add other information."
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowSkillsModal(false)}
                  className="px-4 py-2 cursor-pointer bg-gray-200 text-black rounded-[3px] hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSkillsModal(false)}
                  className="px-4 py-2 cursor-pointer bg-black text-white rounded-[3px] hover:bg-black/80"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-3 text-sm mt-2 text-[#f6f4ed] dark:text-[#2b2a27]">
          {usage.generationLimit === null
            ? `Used ${usage.generationCount} generations (Unlimited plan)`
            : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
        </div>

        {isAtLimit ? (
          <div className="p-4 border w-full text-white  rounded dark:text-stone-900">
            <p className="font-semibold">No more tokens</p>
            <p className="mb-3 ">
              You have used up all your resume generations.
            </p>
            {usage.generationLimit !== null ? (
              <>
                <p className="mb-3">
                  <h1 className="font-semibold">Upgrade Plan</h1>
                  <p className="mb-3">
                    Upgrade today to keep generating —{" "}
                    <strong>no commitment</strong> required, and enjoy our{" "}
                    <strong>limited-time sale</strong>:
                  </p>
                </p>
                <BuyAccessButton />
              </>
            ) : (
              <ManageSubscriptionButton />
            )}
          </div>
        ) : (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`w-full cursor-pointer py-3 rounded-[3px] uppercase tracking-wide px-3 text-lg text-[#f6f4ed] dark:text-black border-[#f6f4ed] shadow-md shadow-white/15 dark:shadow-black/10 border-2 dark:border-black font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 ${
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

        {showEditResumeModal && (
          <div
            onClick={() => setShowEditResumeModal(false)}
            className="fixed inset-0 z-50 bg-stone-900/60  flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2b2a27] relative py-6 border-white/20 dark:border-black/20 border dark:bg-white  rounded-[3px] w-[90%] max-w-6xl"
            >
              <button
                onClick={() => setShowEditResumeModal(false)}
                className="absolute top-3  right-3 text-2xl cursor-pointer text-gray-200 dark:text-gray-600 hover:text-gray-200 transition-colors"
              >
                <IoMdClose />
              </button>

              <ResumeForm resume={latestResume} />
            </div>
          </div>
        )}

        {generatedResume && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Generated Resume</h2>

            <div className="flex flex-wrap gap-3 mb-4">
              {isResumeSaved ? (
                <button
                  onClick={handleEditResume}
                  className="px-4 py-2 border-2 font-semibold rounded-[3px] cursor-pointer hover:opacity-50"
                >
                  Edit Resume
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 border-2 font-bold rounded-[3px] cursor-pointer hover:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & Edit"}
                </button>
              )}

              {showJobsBtn && (
                <button className="px-4 font-semibold  py-2  rounded-[3px] cursor-pointer bg-white dark:bg-black/80 text-black dark:text-white hover:opacity-50">
                  <Link href={"/jobs"}>Find Jobs</Link>
                </button>
              )}
            </div>

            <h1 className="font-semibold mb-1">Customize if necessary:</h1>

            <div
              style={{ scrollbarWidth: "thin" }}
              ref={editableRef}
              className="p-4 bg-white text-black border rounded-[3px] whitespace-pre-wrap  text-sm min-h-[300px]"
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
