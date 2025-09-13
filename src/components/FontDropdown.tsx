"use client";
import { useState, useEffect } from "react";

const fonts = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Calibri",
  "Cambria",
  "Garamond",
  "Helvetica",
  "Tahoma",
  "Palatino Linotype",
  "Book Antiqua",
  "Lucida Sans",
];

interface FontDropdownProps {
  onApply?: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export default function FontDropdown({
  onApply,
  editorRef,
}: FontDropdownProps) {
  const [selectedFont, setSelectedFont] = useState("Arial");

  const applyFont = (font: string) => {
    onApply?.();
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      const text = selection.toString();
      if (!text) return;

      const span = document.createElement("span");
      span.style.fontFamily = font;
      span.textContent = text;

      range.deleteContents();
      range.insertNode(span);

      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      setSelectedFont(font);
      editorRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    const updateFont = () => {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const node = selection.anchorNode as HTMLElement;
      if (!node) return;
      const computedFont = window.getComputedStyle(
        node.nodeType === 3 ? node.parentElement! : node
      ).fontFamily;
      if (fonts.includes(computedFont)) setSelectedFont(computedFont);
    };

    document.addEventListener("selectionchange", updateFont);
    return () => document.removeEventListener("selectionchange", updateFont);
  }, []);

  const displayFont = (font: string) =>
    font.length > 12 ? font.slice(0, 12) + "…" : font;

  return (
    <select
      value={selectedFont}
      onChange={(e) => applyFont(e.target.value)}
      className="px-3 py-[9px] text-xs md:text-sm bg-[bg-[#1c1c1b] text-stone-100 border border-white/20 rounded-[3px] cursor-pointer max-w-[60px] truncate appearance-none"
      title={selectedFont}
      style={{ WebkitAppearance: "none", MozAppearance: "none" }}
    >
      {fonts.map((f) => (
        <option
          key={f}
          value={f}
          style={{
            fontFamily: f,
            backgroundColor: "#2a2a2a",
            color: "#f6f4ed",
          }}
        >
          {displayFont(f)}
        </option>
      ))}
    </select>
  );
}
