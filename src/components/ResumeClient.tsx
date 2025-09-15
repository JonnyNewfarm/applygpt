"use client";

import { useEffect, useRef, useState } from "react";
import BuyAccessButton from "../components/BuyAccessButton";
import ManageSubscriptionButton from "../components/ManageSubscriptionButton";
import toast from "react-hot-toast";
import ResumeUploadPopUp from "./ResumeUploadPopUp";
import ResumeForm from "./ResumeForm";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import VoiceInput from "./VoiceInput";
import ResizableTextarea from "./ResizebleTextarea";
import MagneticCompWide from "./MagneticCompWide";
import { AnimatePresence, motion } from "framer-motion";

interface ResumeClientProps {
  resume: string;
}

export default function ResumeClient({ resume }: ResumeClientProps) {
  const [form, setForm] = useState({
    generalInfo: "",
    fullAddress: "",
    experience: "",
    skills: "",
    other: "",
  });

  const [errors, setErrors] = useState<{
    generalInfo?: string;
    fullAddress?: string;
    experience?: string;
    skills?: string;
  }>({});

  const [generatedResume, setGeneratedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExperienceModalRecord, setShowExperienceModalRecord] =
    useState(false);

  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showSkillsModalRecord, setShowSkillsModalRecord] = useState(false);
  const [showAddressModalRecord, setShowAddressModalRecord] = useState(false);
  const [showGeneralInfoRecord, setShowGeneralInfoRecord] = useState(false);
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
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onGenerate() {
    if (isAtLimit) {
      toast.error("You have reached your generation limit.");
      return;
    }

    const newErrors: typeof errors = {};
    if (!form.generalInfo.trim())
      newErrors.generalInfo = "General info required.";
    if (!form.fullAddress.trim()) newErrors.fullAddress = "Address required.";
    if (!form.experience.trim()) newErrors.experience = "Experience required.";
    if (!form.skills.trim()) newErrors.skills = "Skills required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

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
        headers: { "Content-Type": "application/json" },
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

  return (
    <div className="w-full md:pt-10   min-h-screen r   dark:bg-[#f6f4f2] dark:text-[#2b2a27] ">
      <ResumeUploadPopUp
        title={resume ? "Edit Your Resume:" : "Already have a resume?"}
        buttonTitle={resume ? "Edit " : "Upload"}
      >
        <ResumeForm resume={resume} />
      </ResumeUploadPopUp>
      <div className="w-full flex justify-center">
        <div className="max-w-3xl px-4 md:px-8 w-full">
          <h1 className="font-semibold text-lg md:text-2xl">
            Create a Standout Resume — Now with Voice Recording
          </h1>
          <h1 className="mb-5 md:text-xl text-sm">
            Just talk, and we’ll turn your words into a polished resume ready
            for job applications.
          </h1>
        </div>
      </div>

      <div className="flex justify-center flex-col items-center w-full ">
        <div className="grid px-4 md:px-8 grid-cols-1 md:grid-cols-2 w-full max-w-3xl  gap-4 md:gap-6">
          <button
            className="border-2 cursor-pointer border-white dark:border-black hover:scale-102  transition-transform hover:ease-out px-3 py-3 text-sm md:text-lg rounded-[5px] font-semibold"
            onClick={() => setShowGeneralInfoRecord(true)}
          >
            Add General Info
          </button>
          <button
            className="border-2 cursor-pointer border-white hover:scale-102  transition-transform hover:ease-out dark:border-black px-3 py-3 text-sm md:text-lg rounded-[5px] font-semibold"
            onClick={() => setShowAddressModalRecord(true)}
          >
            Add Address
          </button>

          <button
            className="border-2 cursor-pointer hover:scale-102  transition-transform hover:ease-out border-white dark:border-black px-3 py-3 text-sm md:text-lg rounded-[5px] font-semibold"
            onClick={() => setShowExperienceModalRecord(true)}
          >
            <p className="text-wrap"> Work/Education</p>
          </button>

          <button
            className="border-2 cursor-pointer hover:scale-102  transition-transform hover:ease-out border-white dark:border-black px-3 py-3 text-sm md:text-lg rounded-[5px] font-semibold"
            onClick={() => setShowSkillsModalRecord(true)}
          >
            Skills/Other
          </button>
        </div>
      </div>

      <div className="text-red-700 max-w-3xl text-sm w-full mx-auto px-8 mt-1 grid grid-cols-2 space-x-1">
        <p>{errors.generalInfo}</p>
        <p>{errors.fullAddress}</p>
        <p>{errors.experience}</p>
        <p>{errors.skills}</p>
      </div>

      <AnimatePresence>
        {showGeneralInfoRecord && (
          <motion.div
            onClick={() => setShowGeneralInfoRecord(false)}
            className="fixed inset-0 z-50 h-[dvh] bg-black/65 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2b2a27] text-[#f6f4ed] p-4 rounded w-[90%] max-w-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <VoiceInput
                value={form.generalInfo}
                onTextChangeAction={(newText) =>
                  setForm((prev) => ({ ...prev, generalInfo: newText }))
                }
              />

              <p className="text-sm md:text-md mt-2 mr-1.5">
                Voice commands supported: say{" "}
                <strong>&lsquo;new line&lsquo;</strong> to break a line,{" "}
                <strong>&lsquo;comma&lsquo;</strong> for <code>,</code>,{" "}
                <strong>&lsquo;dot&lsquo;</strong> for <code>.</code>
                <button
                  type="button"
                  onClick={() => setShowVoiceCommands((prev) => !prev)}
                  className="underline cursor-pointer text-sm"
                >
                  {showVoiceCommands
                    ? "Hide all commands"
                    : "Show all commands"}
                </button>
              </p>

              <h2 className="text-md font-semibold mt-2">
                General Information
              </h2>

              <ResizableTextarea
                value={form.generalInfo}
                onChange={(val) => handleChange("generalInfo", val)}
                placeholder="Add your general info here (name, profession, contact, etc.)"
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowGeneralInfoRecord(false)}
                  className="px-4 py-2 cursor-pointer border border-stone-50 text-stone-50 rounded-[3px] hover:scale-105 transition-transform ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowGeneralInfoRecord(false)}
                  className="px-4 py-2 cursor-pointer bg-stone-200 text-stone-900 rounded-[3px] font-semibold hover:scale-105 transition-transform ease-in-out"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showVoiceCommands && (
        <div className="fixed inset-0 z-[60] bg-black/65 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-sm w-[90%] text-black">
            <h3 className="text-lg font-semibold mb-4">
              Available Voice Commands
            </h3>
            <div className=" p-2 rounded text-sm md:text-lg bg-gray-50 text-gray-800 space-y-1">
              <p>
                <strong>comma</strong> → ,
              </p>
              <p>
                <strong>dot</strong> or <strong>period</strong> → .
              </p>
              <p>
                <strong>question mark</strong> → ?
              </p>
              <p>
                <strong>exclamation mark</strong> → !
              </p>
              <p>
                <strong>colon</strong> → :
              </p>
              <p>
                <strong>semicolon</strong> → ;
              </p>
              <p>
                <strong>new line</strong> or <strong>next line</strong> → line
                break
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowVoiceCommands(false)}
                className="px-4 py-2 cursor-pointer bg-stone-800 text-white rounded hover:bg-black/80 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAddressModalRecord && (
          <motion.div
            onClick={() => setShowAddressModalRecord(false)}
            className="fixed h-[100dvh] inset-0 z-50 bg-black/65 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2b2a27] text-[#f6f4ed] p-4 rounded w-[90%] max-w-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <VoiceInput
                value={form.fullAddress}
                onTextChangeAction={(newText) =>
                  setForm((prev) => ({ ...prev, fullAddress: newText }))
                }
              />

              <p className="text-sm md:text-md text-stone-100 mt-2">
                Voice commands supported: say{" "}
                <strong>&lsquo;new line&lsquo;</strong> to break a line,{" "}
                <strong>&lsquo;comma&lsquo;</strong> for <code>,</code>,{" "}
                <strong>&lsquo;dot&lsquo;</strong> for <code>.</code>
                <button
                  type="button"
                  onClick={() => setShowVoiceCommands((prev) => !prev)}
                  className="underline cursor-pointer text-stone-100 hover:text-stone-200 text-sm"
                >
                  {showVoiceCommands
                    ? "Hide all commands"
                    : "Show all commands"}
                </button>
              </p>
              <h2 className="text-lg font-semibold ml-0.5 mt-1.5">Address</h2>

              <ResizableTextarea
                value={form.fullAddress}
                onChange={(val) => handleChange("fullAddress", val)}
                placeholder="Add your full address here (country, city, street, etc.)"
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowAddressModalRecord(false)}
                  className="px-4 py-2 cursor-pointer border border-stone-200 text-stone-100 rounded-[3px] hover:scale-105 transition-transform ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddressModalRecord(false)}
                  className="px-4 py-2 cursor-pointer bg-stone-200 text-stone-900 rounded-[3px] font-semibold hover:scale-105 transition-transform ease-in-out"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExperienceModalRecord && (
          <motion.div
            onClick={() => setShowExperienceModalRecord(false)}
            className="fixed h-[100dvh] inset-0 z-50 bg-black/65 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2b2a27] text-[#f6f4ed] p-4 rounded w-[90%] max-w-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <VoiceInput
                value={form.experience}
                onTextChangeAction={(newText) =>
                  setForm((prev) => ({ ...prev, experience: newText }))
                }
              />

              <p className="text-sm md:text-md text-stone-100 mt-2">
                Voice commands supported: say{" "}
                <strong>&lsquo;new line&lsquo;</strong> to break a line,{" "}
                <strong>&lsquo;comma&lsquo;</strong> for <code>,</code>,{" "}
                <strong>&lsquo;dot&lsquo;</strong> for <code>.</code>
                <button
                  type="button"
                  onClick={() => setShowVoiceCommands((prev) => !prev)}
                  className="underline cursor-pointer text-stone-100 hover:text-stone-200 text-sm"
                >
                  {showVoiceCommands
                    ? "Hide all commands"
                    : "Show all commands"}
                </button>
              </p>
              <h2 className="text-md mt-2 font-semibold">
                Work Experience & Education
              </h2>

              <ResizableTextarea
                value={form.experience}
                onChange={(val) => handleChange("experience", val)}
                placeholder="Add your experience and education"
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowExperienceModalRecord(false)}
                  className="px-4 py-2 cursor-pointer border border-stone-200 text-stone-100 rounded-[3px] hover:scale-105 transition-transform ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowExperienceModalRecord(false)}
                  className="px-4 py-2 cursor-pointer bg-stone-200 text-stone-900 rounded-[3px] font-semibold hover:scale-105 transition-transform ease-in-out"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkillsModalRecord && (
          <motion.div
            onClick={() => setShowSkillsModalRecord(false)}
            className="fixed h-[100dvh] inset-0 z-50 bg-black/65 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2b2a27] text-[#f6f4ed] p-4 rounded w-[90%] max-w-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <VoiceInput
                value={form.skills}
                onTextChangeAction={(newText) =>
                  setForm((prev) => ({ ...prev, skills: newText }))
                }
              />

              <p className="text-sm md:text-md text-stone-100 mt-2">
                Voice commands supported: say{" "}
                <strong>&lsquo;new line&lsquo;</strong> to break a line,{" "}
                <strong>&lsquo;comma&lsquo;</strong> for <code>,</code>,{" "}
                <strong>&lsquo;dot&lsquo;</strong> for <code>.</code>
                <button
                  type="button"
                  onClick={() => setShowVoiceCommands((prev) => !prev)}
                  className="underline cursor-pointer text-stone-100 hover:text-stone-200 text-sm"
                >
                  {showVoiceCommands
                    ? "Hide all commands"
                    : "Show all commands"}
                </button>
              </p>

              <h2 className="text-md font-semibold mt-2">Skills</h2>
              <ResizableTextarea
                value={form.skills}
                onChange={(val) => handleChange("skills", val)}
                placeholder="Add your skills"
              />

              <div className="w-full mt-2">
                <VoiceInput
                  value={form.other}
                  onTextChangeAction={(newText) =>
                    setForm((prev) => ({ ...prev, other: newText }))
                  }
                />
              </div>

              <h2 className="text-md font-semibold mt-2">Other (Optional)</h2>
              <ResizableTextarea
                value={form.other}
                onChange={(val) => handleChange("other", val)}
                placeholder="Other information (optional)"
              />

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowSkillsModalRecord(false)}
                  className="px-4 py-2 cursor-pointer border border-stone-200 text-stone-100 rounded-[3px] hover:scale-105 transition-transform ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSkillsModalRecord(false)}
                  className="px-4 py-2 cursor-pointer bg-stone-200 text-stone-900 rounded-[3px] font-semibold hover:scale-105 transition-transform ease-in-out"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="mb-3 text-sm mt-2 text-[#f6f4ed] dark:text-[#2b2a27]">
          {usage.generationLimit === null
            ? `Used ${usage.generationCount} generations (Unlimited plan)`
            : `Usage: ${usage.generationCount} / ${usage.generationLimit} generations`}
        </div>

        {isAtLimit ? (
          <div className="p-4 border w-full text-white rounded dark:text-stone-900">
            <p className="font-semibold">No more tokens</p>
            <p className="mb-3">
              You have used up all your resume generations.
            </p>
            {usage.generationLimit !== null ? (
              <BuyAccessButton />
            ) : (
              <ManageSubscriptionButton />
            )}
          </div>
        ) : (
          <MagneticCompWide>
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`w-full cursor-pointer py-3 rounded-[5px] uppercase tracking-wide px-3 text-lg
    bg-gradient-to-tr from-[#f5f4edd0] via-[#e2dfc7] to-[#f5f4edad]
    dark:from-[#2c2c2cd2] dark:via-[#3a3a3a] dark:to-[#2c2c2cc2]
    text-black dark:text-white font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 ${
      isGenerating ? "cursor-not-allowed" : "hover:opacity-90"
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
          </MagneticCompWide>
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
            className="fixed h-[100dvh] inset-0 z-50 bg-stone-900/65 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1c1c1b] relative py-6 border-white/20  border  rounded w-[90%] max-w-6xl"
            >
              <button
                onClick={() => setShowEditResumeModal(false)}
                className="absolute top-3 hover:scale-103 transition-transform ease-in-out   rounded-full p-[3px] right-3.5 text-lg z-[99999] cursor-pointer bg-stone-500/30 text-stone-200 "
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
                  className="px-4 py-2 border-2 font-bold rounded-[5px] cursor-pointer hover:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & Edit"}
                </button>
              )}

              {showJobsBtn && (
                <button className="px-4 font-semibold py-2 rounded-[5px] cursor-pointer bg-white dark:bg-black/80 text-black dark:text-white hover:opacity-50">
                  <Link href={"/jobs"}>Find Jobs</Link>
                </button>
              )}
            </div>

            <h1 className="font-semibold mb-1">Customize if necessary:</h1>

            <div
              style={{ scrollbarWidth: "thin" }}
              ref={editableRef}
              className="p-4 bg-white text-black border rounded whitespace-pre-wrap text-sm min-h-[300px]"
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
