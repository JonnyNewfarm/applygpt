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

export default function FontDropdown() {
  const [selectedFont, setSelectedFont] = useState("Arial");

  const applyFont = (font: string) => {
    document.execCommand("fontName", false, font);
    setSelectedFont(font);
  };

  return (
    <div className="inline-block">
      <Select value={selectedFont} onValueChange={(value) => applyFont(value)}>
        <SelectTrigger className="mt-1 mr-3 px-3 py-0 rounded-[3px] mb-10 text-xs md:text-sm cursor-pointer border border-white/20 bg-transparent text-[#f6f4ed] focus:outline-none focus:ring-0 max-w-[80px] truncate">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent className="bg-stone-800 text-stone-100 rounded-[3px] border border-white/20 max-w-[150px]">
          {fonts.map((font) => (
            <SelectItem
              key={font}
              value={font}
              className="cursor-pointer hover:bg-black hover:text-white truncate"
              style={{ fontFamily: font }}
            >
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
