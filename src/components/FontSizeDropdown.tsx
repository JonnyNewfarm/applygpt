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
    onApply?.(); // restore selection

    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      try {
        // Use execCommand for mobile compatibility
        document.execCommand("fontSize", false, "7"); // 1-7 scale

        // Replace <font size="7"> with actual px
        const editor = document.activeElement as HTMLElement;
        if (editor) {
          editor.querySelectorAll('font[size="7"]').forEach((el) => {
            (el as HTMLElement).style.fontSize = size;
            el.removeAttribute("size");
          });
        }

        setSelectedSize(size);
      } catch (err) {
        console.warn("applyFontSize failed", err);
      }
    }, 100);
  };

  return (
    <div
      className="inline-block"
      onMouseDown={(e) => {
        e.preventDefault();
        onOpen?.();
      }}
      onTouchStart={(e) => {
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
