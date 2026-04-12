import React, { useEffect, useRef } from "react";

function ChoiceMatrix({ question, value = {}, onChange, }) {
  const columns = question.columns || [];
  const rows = question.rows || [];
  const instanceId = useRef(crypto.randomUUID());
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
    <div className="form-element-container group transition-all">
      {/* Question Header styled as per reference */}
      <div className="flex justify-between items-start mb-4">
        <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white">
          {question.question || "Matrix Question"}
          {question.required && (
            <span className="text-red-600"> *</span>
          )}
        </p>
      </div>

      {columns.length === 0 || rows.length === 0 ? (
        <p className="text-zinc-600 italic text-sm">Matrix is empty.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <div className="min-w-max pb-2">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="w-40"></th>
                  {columns.map((col, colIndex) => (
                    <th
                      key={colIndex}
                      className="px-3 py-2 min-w-28 text-center text-zinc-500 font-medium text-sm uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="group/item border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-3 py-4 min-w-32 text-left text-zinc-300 font-medium font-vagrounded">
                      {row}
                    </td>

                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-3 py-4 text-center"
                      >
                        <input
                          type="radio"
                          name={`matrix-${instanceId.current}-row-${rowIndex}`}
                          checked={value[row] === col}
                          onChange={() => handleSelect(row, col)}
                          className="w-5 h-5 accent-emerald-500 cursor-pointer transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChoiceMatrix;