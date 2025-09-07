import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function ResizableTextarea({
  value,
  onChange,
  minRows = 2,
  maxRows = 15,
  placeholder = "",
}: {
  value: string;
  onChange: (val: string) => void;
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
}) {
  const [rows, setRows] = useState(minRows);

  const increaseRows = () => setRows((prev) => Math.min(prev + 1, maxRows));
  const decreaseRows = () => setRows((prev) => Math.max(prev - 1, minRows));

  return (
    <div className="relative w-full">
      <textarea
        id="custom-scrollbar"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border-t-white/60 border-t border-b-white/60 border-b min-h-24 md:min-h-32 md:max-h-50 max-h-42 text-stone-50  text-md outline-none focus:outline-none pr-10 mt-0.5"
        placeholder={placeholder}
      />
      <div className="absolute top-1/2 right-1 flex flex-col gap-1 -translate-y-1/2">
        <button
          type="button"
          onClick={increaseRows}
          className="w-6 h-6 text-stone-200  flex items-center justify-center rounded hover:bg-stone-800 cursor-pointer"
        >
          <FaChevronUp />
        </button>
        <button
          type="button"
          onClick={decreaseRows}
          className="w-6 h-6  text-stone-200 flex items-center justify-center rounded hover:bg-stone-800 cursor-pointer"
        >
          <FaChevronDown />
        </button>
      </div>
    </div>
  );
}
