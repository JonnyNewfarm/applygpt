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
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-white min-h-24 md:min-h-32 md:max-h-50 max-h-42 text-black border rounded text-sm pr-10 mt-0.5"
        placeholder={placeholder}
      />
      <div className="absolute top-1/2 right-1 flex flex-col gap-1 -translate-y-1/2">
        <button
          type="button"
          onClick={increaseRows}
          className="w-6 h-6  text-black flex items-center justify-center rounded hover:bg-stone-300"
        >
          <FaChevronUp />
        </button>
        <button
          type="button"
          onClick={decreaseRows}
          className="w-6 h-6  text-black flex items-center justify-center rounded hover:bg-stone-300"
        >
          <FaChevronDown />
        </button>
      </div>
    </div>
  );
}
