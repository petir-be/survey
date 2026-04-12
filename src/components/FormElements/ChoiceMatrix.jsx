import { useEffect, useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";
import { motion } from "framer-motion";

function ChoiceMatrix({ question, onUpdate, onDuplicate }) {
  
  const defaultRow = ["Row 1", "Row 2"];
  const defaultColumn = ["Column 1", "Column 2"];
  const [showAddOption, setShowAddOption] = useState(false);
  const [addColumnField, setAddColumnField] = useState(
    question.columns || defaultColumn
  );

  function toggleRequired() {
    const newRequiredState = !required;
    setRequired(newRequiredState);
    onUpdate(question.id, { required: newRequiredState });
  }
  const [addRowField, setAddRowField] = useState(question.rows || defaultRow);
  const [showAddButtons, setShowAddButtons] = useState(false);
  const [required, setRequired] = useState(question.required || false);

  useEffect(() => {
    onUpdate(question.id, {
      columns: addColumnField,
      rows: addRowField,
      required: required,
    });
  }, []);

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
      <div className="flex justify-between items-start ">
        <div className="flex-1 flex items-start gap-3">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-vagrounded font-bold text-xl bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="Enter your question"
          />

          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-zinc-500 hover:text-emerald-500 transition-all opacity-0 group-focus-within:opacity-100"
          >
            <IoDuplicate size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <div className="overflow-y-visible min-w-max pt-2 pb-2">
          <table className="border-collapse w-full">
            <thead>
              <tr className="">
                <th className="w-40"></th>

                {addColumnField.map((col, colIndex) => (
                  <th
                    key={colIndex}
                    className="relative px-3 py-2 min-w-28 text-center group/item"
                  >
                    <input
                      className="w-full bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500/50 focus:outline-none text-zinc-300 font-medium py-1 transition-all text-center"
                      value={col}
                      placeholder={col}
                      onChange={(e) => {
                        const updated = [...addColumnField];
                        updated[colIndex] = e.target.value;
                        setAddColumnField(updated);
                      }}
                      // FIX 1: persist column label changes on blur
                      onBlur={() => {
                        onUpdate(question.id, { columns: addColumnField });
                      }}
                    />

                    <div className="absolute -top-3 right-1/2 translate-x-1/2 opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeColumn(colIndex)}
                        className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <FaCircleXmark size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="">
              {addRowField.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group/item border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="px-3 py-3 min-w-32 relative text-left">
                    <input
                      className="w-full bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500/50 focus:outline-none text-zinc-300 font-medium py-1 pr-6 transition-all"
                      value={row}
                      onChange={(e) => {
                        const updated = [...addRowField];
                        updated[rowIndex] = e.target.value;
                        setAddRowField(updated);
                      }}
                      // FIX 1: persist row label changes on blur
                      onBlur={() => {
                        onUpdate(question.id, { rows: addRowField });
                      }}
                    />

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <FaCircleXmark size={16} />
                      </button>
                    </div>
                  </td>

                  {addColumnField.map((_, colIndex) => (
                    <td key={colIndex} className="px-3 py-3 text-center">
                      <input
                        type="radio"
                        name={`matrix-${question.id}-row-${rowIndex}`}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer transition-all"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddButtons && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-800/50"
        >
          <div className="flex gap-6">
            <button
              onClick={addColumn}
              className="text-xs font-bold uppercase tracking-widest text-emerald-500/80 hover:text-emerald-400 flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span> Add Column
            </button>

            <button
              onClick={addRow}
              className="text-xs font-bold uppercase tracking-widest text-emerald-500/80 hover:text-emerald-400 flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span> Add Row
            </button>
          </div>
          <div className="font-vagrounded flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Required
            </span>
            <button
              onClick={toggleRequired}
              className={`w-9 h-5 flex items-center rounded-full px-1 transition-all duration-300 ${
                required
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-zinc-800"
              }`}
            >
              <motion.div
                layout
                className="w-3 h-3 bg-white rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ marginLeft: required ? "auto" : "0" }}
              />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ChoiceMatrix;