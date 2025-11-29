import React from "react";

function ChoiceMatrix({ question, value = {}, onChange }) {
  const columns = question.columns || [];
  const rows = question.rows || [];

  // Handle selection for a specific row
  const handleSelect = (rowLabel, colLabel) => {
    const updated = {
      ...value,
      [rowLabel]: colLabel,
    };

    onChange(updated);
  };

  return (
    <div className="my-6">
      <p className="text-lg font-medium mb-3">
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
                    className="px-3 py-2 min-w-28 text-center italic"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b-4 border-(--white)">
                  <td className="bg-(--dirty-white) px-3 py-2 min-w-32 italic rounded-l-xl">
                    {row}
                  </td>

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="bg-(--dirty-white) px-3 py-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`row-${question.id}-${rowIndex}`}
                        checked={value[row] === col}
                        onChange={() => handleSelect(row, col)}
                        className="h-5 w-5 text-(--purple)"
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
