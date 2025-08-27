"use client";
import React, { ReactNode, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface Props {
  children: ReactNode;
  title: string;
  buttonTitle: string;
}

const ResumeUploadPopUp = ({ children, title, buttonTitle }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  return (
    <div className="w-full  relative ">
      <div className="max-w-5xl rounded-[3px] mx-auto px-4 md:px-8    text-white dark:text-black py-4 mt-5 sm:mt-0">
        <div>
          <h1 className="text-2xl font-bold">AI Resume Generator</h1>
          <p className="mb-0 mt-1 text-xl ">{title} </p>
        </div>
        <div className="mb-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 border-2 font-bold cursor-pointer dark:border-[#2b2a27] px-3 py-1 rounded-[3px]  text-lg   transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            {buttonTitle}
          </button>
        </div>

        {showUploadModal && (
          <div
            onClick={() => setShowUploadModal(false)}
            className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className=" mr-1 ml-1 bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]   md:px-2.5  py-6 rounded-[3px] max-w-4xl w-full relative"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-3 right-3 text-2xl cursor-pointer text-gray-200 dark:text-gray-700 hover:text-gray-200 transition-colors"
              >
                <IoMdClose />
              </button>
              {children}{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPopUp;
