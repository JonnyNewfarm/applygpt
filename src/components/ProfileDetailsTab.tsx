"use client";
import React, { ReactNode, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  children: ReactNode;
  buttonTitle: string;
}

const ProfileDetailsTab = ({ children, buttonTitle }: Props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  return (
    <div className="w-full  relative ">
      <div className="max-w-5xl  mx-auto     text-white    sm:mt-0">
        <div className="mb-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-2 border-2 font-bold cursor-pointer dark:border-stone-700 dark:text-stone-900  px-3 py-1 rounded-[3px]  text-sm md:text-lg text-nowrap   transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            {buttonTitle}
          </button>
        </div>
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
            >
              <motion.div
                key="modal"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()}
                className="mr-1.5 ml-1.5 bg-[#1c1c1b] text-[#f6f4ed]  md:px-2.5 px-1.5 py-6  rounded-[5px] max-w-6xl w-full relative"
              >
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-3 hover:scale-103 transition-transform ease-in-out bg-[#eaeae592]  rounded-full p-[3px] right-3.5 text-lg z-[99999] cursor-pointer text-stone-900  "
                >
                  <IoMdClose />
                </button>
                {children}{" "}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileDetailsTab;
