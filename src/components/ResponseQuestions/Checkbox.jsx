import React from "react";
import { IoAlertCircle } from "react-icons/io5";

function Checkbox({ question, value = [], onChange, hasError }) {
  const options = question.options || [];

  const handleToggle = (selectedOption) => {
    let updated;
    if (value.includes(selectedOption)) {
      updated = value.filter((v) => v !== selectedOption);
    } else {
      updated = [...value, selectedOption];
    }
    onChange(updated);
  };

  return (
    <div className="form-element-container group transition-all">
      {/* Question Header styled as per reference */}
      <div className="flex justify-between items-start mb-4">
        <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white">
          {question.question || "Select"}
          {question.required && (
            <span className="text-emerald-500 ml-1">*</span>
          )}
        </p>
      </div>

      {options.length === 0 ? (
        <p className="text-zinc-600 italic text-sm">No options available.</p>
      ) : (
        <div className="space-y-3 mt-4">
          {options.map((option, index) => {
            const isSelected = value.includes(option);

            return (
              <button
                key={index}
                type="button"
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group/item
                  ${isSelected
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-transparent border-zinc-800 hover:border-zinc-700"
                  }
                `}
                onClick={() => handleToggle(option)}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(option)}
                    className="w-4 h-4 rounded border-2 border-zinc-700 appearance-none checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                  />
                  {/* Visual checkmark for custom appearance */}
                  {isSelected && (
                    <div className="absolute pointer-events-none text-white font-bold text-[10px]">
                      ✓
                    </div>
                  )}
                </div>

                <span className={`font-medium select-none text-left transition-colors ${isSelected ? "text-emerald-400" : "text-zinc-300"
                  }`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Error Message - Consistent with other components */}
      {hasError && (
        <div className="flex items-center font-vagrounded gap-2 mt-4 px-1">
          <IoAlertCircle className="text-red-500 text-xl" />
          <span className="text-sm font-bold tracking-wide uppercase text-red-500/90">
            This field is required.
          </span>
        </div>
      )}
    </div>
  );
}

export default Checkbox;