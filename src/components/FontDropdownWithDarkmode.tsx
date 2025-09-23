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
  const [selectedFont, setSelectedFont] = useState("Font");

  const handleFontChange = (font: string) => {
    document.execCommand("fontName", false, font);
    setSelectedFont(font);
  };

  return (
    <Select onValueChange={handleFontChange}>
      <SelectTrigger className="w-30 border cursor-pointer mr-2  bg-transparent max-w-[80px] border-stone-300/30   text-white dark:text-black dark:border-stone-700">
        <SelectValue placeholder={selectedFont.slice(0, 8)} />
      </SelectTrigger>
      <SelectContent className="bg-stone-800 text-white">
        {fonts.map((font) => (
          <SelectItem
            key={font}
            value={font}
            style={{ fontFamily: font }}
            className="hover:bg-stone-600 cursor-pointer"
          >
            {font}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
