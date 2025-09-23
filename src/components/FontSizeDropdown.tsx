"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    <div>
      <Select value={selectedSize} onValueChange={(val) => applyFontSize(val)}>
        <SelectTrigger className="w-32 border cursor-pointer  bg-transparent max-w-[80px] border-stone-300/30   text-white">
          <SelectValue placeholder="Font size" />
        </SelectTrigger>
        <SelectContent className="bg-stone-800 text-white">
          {fontSizes.map((size) => (
            <SelectItem
              key={size}
              value={size}
              className="hover:bg-stone-600 cursor-pointer"
            >
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
