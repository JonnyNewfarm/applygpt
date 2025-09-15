"use client";

import { useState } from "react";

const fontSizes = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
];

export default function FontSizeDropdown() {
  const [selectedSize, setSelectedSize] = useState("14px");

  const applyFontSize = (size: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText) return;

    const span = document.createElement("span");
    span.style.fontSize = size;
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);
    setSelectedSize(size);
  };

  return (
    <select
      className="px-2 py-[7px] text-sm mb-10 border ml-2 rounded cursor-pointer dark:border-stone-600 border-white/40  text-white dark:text-stone-600"
      value={selectedSize}
      onChange={(e) => applyFontSize(e.target.value)}
    >
      {fontSizes.map((size) => (
        <option
          key={size}
          value={size}
          style={{
            backgroundColor: "#2b2a27",
            color: "#ffffff",
          }}
        >
          {size}
        </option>
      ))}
    </select>
  );
}
