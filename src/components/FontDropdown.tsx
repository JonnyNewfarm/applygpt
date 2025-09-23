"use client";
import { useState, useEffect } from "react";
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
    <Select value={selectedFont} onValueChange={(val) => applyFont(val)}>
      <SelectTrigger className="w-32 border cursor-pointer  bg-transparent max-w-[80px] border-stone-300/30   text-white">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>
      <SelectContent className="bg-stone-800 text-white">
        {fonts.map((f) => (
          <SelectItem
            key={f}
            value={f}
            className="hover:bg-stone-600 cursor-pointer"
          >
            <span style={{ fontFamily: f }}>{displayFont(f)}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
