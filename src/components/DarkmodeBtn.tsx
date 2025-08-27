"use client";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5 border p-2 rounded-full bg-[#2b2a27]   dark:bg-[#f6f4f2] ">
      <button
        onClick={() => theme === "dark" && toggleTheme()}
        className={`p-1 rounded-full transition-colors ${
          theme === "light"
            ? "bg-white  text-black"
            : "hover:bg-gray-300 text-[#2b2a27]"
        }`}
        aria-label="Light mode"
      >
        <Moon size={12} />
      </button>
      <button
        onClick={() => theme === "light" && toggleTheme()}
        className={`p-1 rounded-full transition-colors ${
          theme === "dark" ? "bg-black  text-yellow-500" : "hover:bg-stone-600"
        }`}
        aria-label="Dark mode"
      >
        <Sun size={12} />
      </button>
    </div>
  );
};

export default DarkModeToggle;
