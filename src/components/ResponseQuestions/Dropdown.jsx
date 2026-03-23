import React, { useEffect, useRef, useState } from "react";
import { IoAlertCircle } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";

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
    <div className="my-6">
      <p className="text-lg mb-3 font-medium">
        {question.question || "Select one option"}
        {question.required ? <span className="text-red-600"> *</span> : null}
      </p>

      <div className="space-y-2 mt-3 relative" ref={ref}>

        <input type="hidden" name={`question-${question.id}`} value={chosen} />


        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between border py-2 px-3 rounded bg-black text-left
            focus:outline-none focus:border-green-600
            ${open ? "border-green-600" : "border-gray-600"}
            ${isPlaceholder ? "text-gray-400" : "text-white"}
          `}
        >
          <span>{displayValue}</span>
          <IoChevronDown
            className={`transition-transform duration-200 text-gray-400 ${open ? "rotate-180" : ""}`}
          />
        </button>


        {open && (
          <ul className="absolute z-50 w-full mt-1 bg-black border border-green-600 rounded shadow-lg overflow-hidden">
            <li
              className="px-3 py-2 text-gray-400 cursor-default select-none text-sm"
            >
              -- Select an option --
            </li>

            {options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 cursor-pointer text-white
                    hover:bg-green-600 hover:text-white
                    ${chosen === option ? "bg-green-700 text-white" : ""}
                  `}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400 cursor-default">
                No options available
              </li>
            )}
          </ul>
        )}

        {hasError && (
          <div className="flex items-center font-vagrounded gap-1 my-2">
            <IoAlertCircle className="fill-red-500 text-xl" />
            <span className="text-md text-red-500">This field is required.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;