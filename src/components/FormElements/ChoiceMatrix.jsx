import { useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";

function ChoiceMatrix({ question, onUpdate, onDuplicate }) {
  const [addColumnField, setAddColumnField] = useState(["Column 1", "Column 2"]);
  const [addRowField, setAddRowField] = useState(["Row 1", "Row 2"]);
  const [showAddButtons, setShowAddButtons] = useState(false);

  const addColumn = () => {
    const newColumn = `Column ${addColumnField.length + 1}`;
    const updated = [...addColumnField, newColumn];
    setAddColumnField(updated);
    onUpdate(question.id, { columns: updated });
  };

  const addRow = () => {
    const newRow = `Row ${addRowField.length + 1}`;
    const updated = [...addRowField, newRow];
    setAddRowField(updated);
    onUpdate(question.id, { rows: updated });
  };

  const removeColumn = (index) => {
    if (addColumnField.length <= 2) return;

    const updated = addColumnField.filter((_, i) => i !== index);
    setAddColumnField(updated);
    onUpdate(question.id, { columns: updated });
    document.activeElement.blur();
  };

  const removeRow = (index) => {
    if (addRowField.length <= 1) return;

    const updated = addRowField.filter((_, i) => i !== index);
    setAddRowField(updated);
    onUpdate(question.id, { rows: updated });
    document.activeElement.blur();
  };

  return (
    <div
      className="form-element-container group"
      tabIndex={0}
      onFocus={() => setShowAddButtons(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setShowAddButtons(false);
        }
      }}
    >
      {/* QUESTION + DUPLICATE BUTTON */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 inline-flex">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-medium text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1"
            placeholder="Enter your question"
          />

          <button
            onClick={() => onDuplicate(question.id)}
            className="font-vagrounded mx-5 opacity-0 group-focus-within:opacity-100 transition-all duration-200"
          >
            <IoDuplicate className="text-2xl" />
          </button>
        </div>
      </div>

      {/* MATRIX TABLE */}
      <div className="overflow-x-auto">
        <div className="overflow-visible inline-block">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="w-40"></th>

                {addColumnField.map((col, colIndex) => (
                  <th
                    key={colIndex}
                    className="relative border px-3 py-2 bg-gray-100 min-w-28 text-center"
                  >
                    {/* DELETE ICON */}
                    <div className="absolute -top-2 translate-x-1/2 right-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <button onClick={() => removeColumn(colIndex)}>
                        <FaCircleXmark
                          className="bg-white text-xl rounded-full hover:ring-2 hover:ring-(--purple)"
                          fill="purple"
                        />
                      </button>
                    </div>

                    {/* Editable column name */}
                    <input
                      className="w-full bg-transparent text-center focus:outline-none"
                      value={col}
                      onChange={(e) => {
                        const updated = [...addColumnField];
                        updated[colIndex] = e.target.value;
                        setAddColumnField(updated);
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {addRowField.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* ROW LABEL + DELETE */}
                  <td className="border px-3 py-2 bg-gray-50 min-w-32 relative">
                    <input
                      className="w-full bg-transparent focus:outline-none"
                      value={row}
                      onChange={(e) => {
                        const updated = [...addRowField];
                        updated[rowIndex] = e.target.value;
                        setAddRowField(updated);
                      }}
                    />

                    <div className="absolute right-2 translate-y-1/2 bottom-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <button onClick={() => removeRow(rowIndex)}>
                        <FaCircleXmark
                          className="bg-white text-xl rounded-full hover:ring-2 hover:ring-(--purple)"
                          fill="purple"
                        />
                      </button>
                    </div>
                  </td>

                  {/* RADIO BUTTONS */}
                  {addColumnField.map((_, colIndex) => (
                    <td key={colIndex} className="border px-3 py-2 text-center">
                      <input
                        type="radio"
                        name={`row-${rowIndex}`}
                        className="h-5 w-5 accent-(--purple)"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD BUTTONS (matched style) */}
      {showAddButtons && (
        <div className="flex gap-4 mt-3">
          <button
            onClick={addColumn}
            className="px-2 font-medium font-vagrounded py-1 text-(--purple) border-b-(--purple) border-transparent hover:border-b"
          >
            + Add Column
          </button>

          <button
            onClick={addRow}
            className="px-2 font-medium font-vagrounded py-1 text-(--purple) border-b-(--purple) border-transparent hover:border-b"
          >
            + Add Row
          </button>
        </div>
      )}
    </div>
  );
}

export default ChoiceMatrix;
