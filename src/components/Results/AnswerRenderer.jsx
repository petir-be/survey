import React from "react";
import FileAnswerDisplay from "./FileAnswerDisplay"; // Don't forget to import this!

function AnswerRenderer({ answer }) {
  if (
    answer === null ||
    answer === undefined ||
    (Array.isArray(answer) && answer.length === 0)
  ) {
    return <span className="text-gray-400 italic">No answer</span>;
  }

  if (Array.isArray(answer)) {
    const firstItem = answer[0];
    if (
      firstItem &&
      typeof firstItem === "object" &&
      (firstItem.mediaUrl || firstItem.size || firstItem.fileType)
    ) {
      return <FileAnswerDisplay files={answer} />;
    }

    return (
      <ul className="list-disc list-inside">
        {answer.map((item, index) => (
          <li key={index}>
            {/* Added a tiny safety check here so it doesn't crash if an object slips through */}
            {typeof item === "object" ? JSON.stringify(item) : item}
          </li>
        ))}
      </ul>
    );
  }

  // ✅ Choice matrix (object map)
  if (typeof answer === "object") {
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(answer).map(([row, column]) => (
          <div key={row}>
            <strong>{row}:</strong> {column}
          </div>
        ))}
      </div>
    );
  }

  // ✅ Primitive answers (string, number, boolean)
  return <span>{String(answer)}</span>;
}

export default AnswerRenderer;
