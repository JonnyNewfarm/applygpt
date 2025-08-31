"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { X, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

export default function ResumeExampleSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;

    if (isZoomed) {
      // Reset zoom
      setIsZoomed(false);
      setTransformOrigin("center center");
    } else {
      // Zoom in at click position
      const rect = imgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTransformOrigin(`${x}% ${y}%`);
      setIsZoomed(true);
    }
  };

  return (
    <section className="w-full bg-[#2b2a27] text-[#f5f4ef] dark:bg-[#f6f4f2] dark:text-[#2b2a27] py-20">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-12 items-center px-6">
        <div className="flex justify-center relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative cursor-pointer text-left"
          >
            <p>Example Resume:</p>

            <img
              src="/resume-example.jpg"
              alt="Resume Example"
              className="w-full max-w-lg border border-gray-200 cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
              <Maximize2 className="w-10 h-10 text-white" />
            </div>
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Build Resumes That Get You Hired
          </h2>
          <p className="text-lg">
            Jobscriptor uses <strong>AI</strong> to help you create
            professional, ATS-friendly resumes in minutes. No design skills
            needed — just fill in your details or{" "}
            <strong>use the voice recorder</strong> to input them quickly.
          </p>
          <ul className="space-y-2.5">
            <li>✔ AI generated resumes</li>
            <li>✔ Easy editing and customization</li>
            <li>✔ Download in PDF</li>
            <li className="mt-6">
              <Link
                className="border-2 rounded-[4px] font-semibold px-3 py-2"
                href={"/resume-generator"}
              >
                Try it out
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => {
            setIsOpen(false);
            setIsZoomed(false);
          }}
        >
          <button
            className="absolute top-5 right-5 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-8 h-8 cursor-pointer" />
          </button>

          <div
            className="relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={imgRef}
              src="/resume-example.jpg"
              alt="Resume Example Fullscreen"
              onClick={handleImageClick}
              style={{
                transform: isZoomed ? "scale(2)" : "scale(1)",
                transformOrigin,
                transition: "transform 0.3s ease",
                cursor: isZoomed ? "zoom-out" : "zoom-in",
              }}
              className="max-w-[90%] md:max-w-[80%] mx-auto max-h-[90%] border border-gray-400"
            />

            {!isZoomed ? (
              <ZoomIn className="absolute top-4 left-4 w-8 h-8 text-white opacity-70 pointer-events-none" />
            ) : (
              <ZoomOut className="absolute top-4 left-4 w-8 h-8 text-white opacity-70 pointer-events-none" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
