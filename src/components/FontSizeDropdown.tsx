"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onOpen?: () => void;
  onApply?: () => void;
}

export default function FontSizeDropdown({
  onOpen,
  onApply,
}: FontSizeDropdownProps) {
  const [selectedSize, setSelectedSize] = useState("14px");

  const applyFontSize = (size: string) => {
    onApply?.();

    setTimeout(() => {
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
    }, 60);
  };

  return (
    <div
      className="inline-block"
      onMouseDown={(e) => {
        e.preventDefault();
        onOpen?.();
      }}
      onTouchStart={() => {
        onOpen?.();
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        onOpen?.();
      }}
    >
      <Select
        value={selectedSize}
        onValueChange={(value) => applyFontSize(value)}
      >
        <SelectTrigger className="mt-1 h-[36px] px-3 py-1 rounded-[3px] text-xs md:text-sm cursor-pointer border border-white/20 bg-transparent text-[#f6f4ed] focus:outline-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-stone-800 text-stone-100 rounded-[4px] border border-white/20">
          {fontSizes.map((size) => (
            <SelectItem
              key={size}
              value={size}
              className="cursor-pointer hover:bg-black hover:text-white"
            >
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
