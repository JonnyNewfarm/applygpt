"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onOpen?: () => void;
  onApply?: () => void;
}

export default function FontDropdown({ onOpen, onApply }: FontDropdownProps) {
  const [selectedFont, setSelectedFont] = useState("Arial");

  const applyFont = (font: string) => {
    onApply?.(); // restore selection

    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      if (!selectedText) return;

      const span = document.createElement("span");
      span.style.fontFamily = font;
      span.textContent = selectedText;

      range.deleteContents();
      range.insertNode(span);

      // move caret after span
      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      setSelectedFont(font);
    }, 50);
  };

  return (
    <div
      className="inline-block"
      onMouseDown={(e) => {
        e.preventDefault();
        onOpen?.(); // ✅ save selection before dropdown opens
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        onOpen?.(); // ✅ also for mobile
      }}
    >
      <Select
        value={selectedFont}
        onOpenChange={(open) => {
          if (open) onOpen?.(); // ✅ save selection only when menu opens
        }}
        onValueChange={(value) => applyFont(value)}
      >
        {" "}
        <SelectTrigger className="mt-1 mr-3 px-3 py-0 rounded-[3px] mb-10 text-xs md:text-sm cursor-pointer border border-white/20 bg-transparent text-[#f6f4ed] focus:outline-none focus:ring-0 max-w-[80px] truncate">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent className="bg-stone-800 text-stone-100 rounded-[3px] border border-white/20 max-w-[150px]">
          {fonts.map((font) => (
            <SelectItem
              key={font}
              value={font}
              style={{ fontFamily: font }}
              className="cursor-pointer hover:bg-black hover:text-white truncate"
            >
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
