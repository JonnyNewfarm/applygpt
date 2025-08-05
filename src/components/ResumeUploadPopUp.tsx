"use client";
import React, { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const ResumeUploadPopUp = ({ children }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  return (
    <div className="w-full  relative ">
      <div className="max-w-5xl rounded mx-auto px-4 md:px-8    text-white dark:text-black py-4 mt-5 sm:mt-0">
        <div>
          <h1 className="text-2xl font-bold">AI Resume Generator</h1>
          <p className="mb-0 mt-2 text-xl ">Already have a resume? </p>
        </div>
        <div className="mb-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 border-2 font-bold cursor-pointer dark:border-[#2b2a27] px-3 py-1.5 rounded-[3px]  text-lg   transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Upload
          </button>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-stone-800 mr-3 ml-3 text-white dark:bg-white   dark:text-black p-6 rounded-[3px] max-w-4xl w-full relative">
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
