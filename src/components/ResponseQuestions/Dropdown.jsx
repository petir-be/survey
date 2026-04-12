import React, { useEffect, useRef, useState } from "react";
import { IoAlertCircle, IoChevronDown } from "react-icons/io5";

function Dropdown({ question, onChange, value = "", hasError }) {
  const options = question.options || [];
  const [chosen, setChosen] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setChosen(value);
  }, [value]);

  useEffect(() => {
    onChange(chosen);
  }, [chosen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setChosen(option);
    setOpen(false);
  };

  const displayValue = chosen || "-- Select an option --";
  const isPlaceholder = !chosen;

  return (
    <div className="form-element-container group transition-all">
      {/* Question Header Styled per Reference */}
      <div className="flex justify-between items-start mb-4">
        <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white">
          {question.question || "Select one option"}
          {question.required && (
            <span className="text-emerald-500 ml-1">*</span>
          )}
        </p>
      </div>

      <div className="space-y-2 mt-3 relative" ref={ref}>
        <input type="hidden" name={`question-${question.id}`} value={chosen} />

        {/* Custom Select Trigger Button matching Zinc/Emerald UI */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between border py-2.5 px-3 rounded-lg bg-zinc-800/50 text-left
            transition-all cursor-pointer shadow-sm focus:outline-none
            ${open ? "border-emerald-500/50 ring-1 ring-emerald-500/20" : "border-zinc-700 hover:border-zinc-600"}
            ${isPlaceholder ? "text-zinc-500" : "text-zinc-200"}
          `}
        >
          <span className="font-medium">{displayValue}</span>
          <IoChevronDown
            className={`transition-transform duration-300 text-zinc-500 ${open ? "rotate-180 text-emerald-500" : ""}`}
          />
        </button>

        {/* Dropdown Menu Styled per Reference Options */}
        {open && (
          <ul className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
            <li
              className="px-3 py-2 text-zinc-600 cursor-default select-none text-xs font-bold uppercase tracking-widest bg-zinc-950/50"
            >
              Options
            </li>

            {options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2.5 cursor-pointer text-zinc-300 transition-colors font-medium
                    hover:bg-emerald-500/10 hover:text-emerald-400
                    ${chosen === option ? "bg-emerald-500/20 text-emerald-400" : ""}
                  `}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-zinc-500 italic text-sm">
                No options available
              </li>
            )}
          </ul>
        )}

        {/* Standardized Error Message */}
        {hasError && (
          <div className="flex items-center font-vagrounded gap-2 mt-4 px-1">
            <IoAlertCircle className="text-red-500 text-xl" />
            <span className="text-sm font-bold tracking-wide uppercase text-red-500/90">
              This field is required.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;