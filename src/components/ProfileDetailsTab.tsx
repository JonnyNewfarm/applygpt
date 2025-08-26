"use client";
import React, { ReactNode, useState } from "react";

interface ProfileDetailsProps {
  children: ReactNode;
}

const ProfileDetailsTab = ({ children }: ProfileDetailsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-full h-full ">
      <button
        className="cursor-pointer border-1 font-semibold rounded-[3px] border-white dark:border-black px-3 py-2 text-md md:text-lg  hover:scale-105 transform transition-transform  "
        onClick={() => setIsModalOpen(true)}
      >
        Edit Resume
      </button>
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed   inset-0 w-full h-full text-white  bg-stone-900/60 flex justify-center items-center z-[9999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl flex flex-col bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] ml-2 mr-2 mt-1 mb-1 w-full relative  p-4"
          >
            {children}
            <div className="w-full flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className=" border-2 border-white dark:border-black rounded-[3px] px-3 py-1.5 mt-5 mr-4.5  text-md cursor-pointer font-bold  hover:scale-105 transform transition-transform  "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetailsTab;
