import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
  limit?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  limit = 300,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > limit;
  const displayText = expanded || !isLong ? text : text.slice(0, limit) + "...";

  return (
    <div>
      <p className={className}>{displayText}</p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 cursor-pointer text-gray-100 dark:text-stone-700 underline text-base"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
