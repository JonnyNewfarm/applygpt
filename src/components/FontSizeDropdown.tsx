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

interface FontSizeDropdownProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export default function FontSizeDropdown({ editorRef }: FontSizeDropdownProps) {
  const [selectedSize, setSelectedSize] = useState("14px");

  const applyFontSize = (size: string) => {
    setSelectedSize(size);

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const text = selection.toString();
    if (!text) return;

    const span = document.createElement("span");
    span.style.fontSize = size;
    span.textContent = text;

    range.deleteContents();
    range.insertNode(span);

    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    editorRef.current?.focus();
  };

  return (
    <select
      value={selectedSize}
      onChange={(e) => applyFontSize(e.target.value)}
      className="px-3 py-[9px] text-xs md:text-sm bg-[#1c1c1b] text-stone-100 border border-white/20 rounded-[3px] cursor-pointer max-w-[80px] truncate appearance-none"
      title={selectedSize}
      style={{ WebkitAppearance: "none", MozAppearance: "none" }}
    >
      {fontSizes.map((s) => (
        <option
          key={s}
          value={s}
          style={{ backgroundColor: "#2a2a2a", color: "#f6f4ed" }}
        >
          {s}
        </option>
      ))}
    </select>
  );
}
