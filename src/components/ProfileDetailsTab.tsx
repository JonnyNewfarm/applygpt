"use client";
import React, { ReactNode, useState } from "react";

interface ProfileDetailsProps {
  children: ReactNode;
}

const ProfileDetailsTab = ({ children }: ProfileDetailsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-full h-full">
      <button
        className="cursor-pointer border-2 font-semibold rounded-[3px] border-white dark:border-black px-3 py-2 text-lg  hover:scale-105 transform transition-transform  "
        onClick={() => setIsModalOpen(true)}
      >
        Edit Resume
      </button>
      {isModalOpen && (
        <div className="fixed   inset-0 w-full h-full  bg-stone-900/60 flex justify-center items-center z-[9999]">
          <div className="max-w-6xl flex flex-col ml-2 mr-2 mt-1 mb-1 w-full relative bg-stone-800 p-4">
            {children}
            <div className="w-full flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className=" mt-7 bg-white/90 text-black dark:bg-black/90 dark:text-white px-3 text-md font-semibold rounded-[3px] cursor-pointer py-1  hover:scale-105 transform transition-transform  "
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
