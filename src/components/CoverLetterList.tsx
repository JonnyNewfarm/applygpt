"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";

type CoverLetter = {
  id: string;
  userId: string;
  content: string;
  tone: string;
  jobAd: string;
  createdAt: string;
};

type Props = {
  initialCoverLetters: CoverLetter[];
};

export default function CoverLetterList({ initialCoverLetters }: Props) {
  const [coverLetters, setCoverLetters] =
    useState<CoverLetter[]>(initialCoverLetters);

  function updateCoverLetter(id: string, value: string) {
    setCoverLetters((cls) =>
      cls.map((cl) => (cl.id === id ? { ...cl, content: value } : cl))
    );
  }

  function downloadPDF(cl: CoverLetter) {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(12);
    doc.text("Cover Letter:", 10, y);

    y += 10;
    doc.setFontSize(10);

    const contentLines = doc.splitTextToSize(cl.content, 190);
    doc.text(contentLines, 10, y);

    doc.save(`cover-letter-${cl.id}.pdf`);
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Recent Cover Letters</h2>
      <ul className="space-y-16">
        {coverLetters.map((cl) => (
          <li
            key={cl.id}
            className=" dark:border-[#2b2a27]   border-l-2 border-[#f6f4ed] p-4 rounded-[3px] text-sm whitespace-pre-wrap"
          >
            <p className="mb-2 text-xs text-white/90 dark:text-black/90">
              {new Date(cl.createdAt).toLocaleString()}
            </p>

            <p className="mb-1 font-semibold">Edit if necessary</p>

            <textarea
              rows={8}
              className="w-full mb-2 border rounded min-h-52 p-1 text-xs bg-white text-black"
              value={cl.content}
              onChange={(e) => updateCoverLetter(cl.id, e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => downloadPDF(cl)}
                className="mt-2 border-2 font-semibold cursor-pointer dark:border-[#2b2a27]  px-3 py-1.5 rounded-[3px] border-[#f6f4ed]  text-sm text-[#f6f4ed]   dark:text-[#2b2a27] transform transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Download PDF
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
