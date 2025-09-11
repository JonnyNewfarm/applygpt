import { useState, useRef, useLayoutEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function ResizableTextarea({
  value,
  onChange,
  minRows = 6,
  maxRows = 20,
  placeholder = "",
  step = 3,
}: {
  value: string;
  onChange: (val: string) => void;
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
  step?: number;
}) {
  const [rows, setRows] = useState(minRows);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [targetHeight, setTargetHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textareaRef.current).lineHeight,
        10
      );
      setTargetHeight(rows * lineHeight);
    }
  }, [rows]);

  const increaseRows = () => setRows((prev) => Math.min(prev + step, maxRows));
  const decreaseRows = () => setRows((prev) => Math.max(prev - step, minRows));

  return (
    <div className="relative w-full">
      <motion.textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ height: targetHeight }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="w-full p-2 border-t-white/60 border-t border-b-white/60 border-b 
                   text-stone-50 text-md outline-none focus:outline-none pr-10 mt-0.5
                   resize-none overflow-hidden bg-transparent"
      />
      <div className="absolute top-1/2 right-1 flex flex-col gap-1 -translate-y-1/2">
        <button
          type="button"
          onClick={increaseRows}
          className="w-6 h-6 text-stone-200 flex items-center justify-center rounded hover:bg-stone-800 cursor-pointer"
        >
          <FaChevronUp />
        </button>
        <button
          type="button"
          onClick={decreaseRows}
          className="w-6 h-6 text-stone-200 flex items-center justify-center rounded hover:bg-stone-800 cursor-pointer"
        >
          <FaChevronDown />
        </button>
      </div>
    </div>
  );
}
