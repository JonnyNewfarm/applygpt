"use client";

import { useState, useRef, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Font");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleFontChange = (font: string) => {
    document.execCommand("fontName", false, font);
    setSelectedFont(font);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative mr-2 inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-3 py-1.5 cursor-pointer border    font-semibold rounded text-sm  border-stone-300 dark:border-stone-700 dark:text-stone-800 text-stone-200"
      >
        {selectedFont.slice(0, 8)}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-44 rounded bg-white text-black  shadow-md ">
          {fonts.map((font) => (
            <button
              key={font}
              onMouseDown={() => handleFontChange(font)}
              className="w-full cursor-pointer text-left px-3 py-1.5 text-xs md:text-sm hover:bg-gray-100 "
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
