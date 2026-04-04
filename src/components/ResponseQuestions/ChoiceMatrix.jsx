import React, { useEffect } from "react";

function ChoiceMatrix({ question, value = {}, onChange }) {
  const columns = question.columns || [];
  const rows = question.rows || [];

  useEffect(() => {
    const initial = {};
    let hasMissing = false;

    rows.forEach((row) => {
      if (!value[row]) {
        initial[row] = "Unanswered";
        hasMissing = true;
      }
    });

    if (hasMissing) {
      onChange({ ...value, ...initial });
    }
  }, [rows]);

  // Handle selection for a specific row
  const handleSelect = (rowLabel, colLabel) => {
    const updated = {
      ...value,
      [rowLabel]: colLabel || "Unanswered",
    };

    onChange(updated);
  };

  return (
    <div className="my-6">
      <p className="text-lg font-medium mb-3 text-white">
        {question.question || "Matrix Question"}
      </p>

      {columns.length === 0 || rows.length === 0 ? (
        <p className="text-gray-400 italic">Matrix is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="w-40"></th>
                {columns.map((col, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-3 py-2 min-w-28 text-center italic text-white"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody >
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="text-white">
                  <td className="bg-black px-3 py-2 min-w-32 italic rounded-l-xl">
                    {row}
                  </td>

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="bg-black px-3 py-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`row-${question.id}-${rowIndex}`}
                        checked={value[row] === col}
                        onChange={() => handleSelect(row, col)}
                        className="h-5 w-5 text-(--purple) accent-green-600"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ChoiceMatrix;
