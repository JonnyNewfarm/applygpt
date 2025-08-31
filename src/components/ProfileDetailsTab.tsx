"use client";
import React, { ReactNode, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface Props {
  children: ReactNode;
  buttonTitle: string;
}

const ProfileDetailsTab = ({ children, buttonTitle }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  return (
    <div className="w-full  relative ">
      <div className="max-w-5xl  mx-auto     text-white dark:text-black   sm:mt-0">
        <div className="mb-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 border-2 font-bold cursor-pointer dark:border-[#2b2a27] px-3 py-1 rounded-[3px]  text-sm md:text-lg text-nowrap   transform transition-transform duration-300 ease-in-out hover:scale-105"
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
              className=" mr-1 ml-1 bg-[#2b2a27] text-[#f6f4ed]  dark:bg-[#f6f4f2] dark:text-[#2b2a27]    md:px-2.5  py-6 rounded-[3px] max-w-6xl w-full relative"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-3 right-3 text-3xl cursor-pointer text-gray-200 dark:text-gray-700 hover:text-gray-200 transition-colors"
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

export default ProfileDetailsTab;
