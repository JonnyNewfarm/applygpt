"use client";
import React, { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const ResumeUploadPopUp = ({ children }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false); // ✅ Modal toggle
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-4xl w-full sm:px-8 px-4 mt-10">
        <h1 className="text-3xl font-bold mb-2">Resume Generator</h1>

        <p className="mb-2 text-xl">
          Already have a resume? Save it in your profile page.
        </p>

        <div className="mb-7">
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 border-2 font-bold cursor-pointer dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px] border-[#f6f4ed] text-lg text-[#f6f4ed] dark:text-[#2b2a27] transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Upload
          </button>
        </div>

        {/* ✅ MODAL */}
        {showUploadModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-stone-800 text-white dark:bg-white   dark:text-black p-6 rounded-[3px] max-w-lg w-full relative">
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-3 right-3 text-xl cursor-pointer font-bold"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4">Upload Your Resume</h2>
              {children}{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPopUp;
