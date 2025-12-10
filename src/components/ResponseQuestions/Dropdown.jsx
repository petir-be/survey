import React, { useEffect, useState } from "react";
import { IoAlertCircle } from "react-icons/io5";

function Dropdown({ question, onChange, value = "", hasError }) {
  const options = question.options || [];
  const [chosen, setChosen] = useState(value);

  useEffect(() => {
    setChosen(value);
  }, [value]);

  useEffect(() => {
    onChange(chosen);
  }, [chosen]);

  return (
    <div className="my-6">
      <p className="text-lg mb-3 font-medium">
        {question.question || "Select one option"}
        {question.required ? <span className="text-red-600"> *</span> : null}
      </p>

      <div className="space-y-2 mt-3 group relative">
        <select
          className="w-full block border focus:border-(--purple) py-2 mb-5 px-3 rounded bg-(--dirty-white)"
          value={chosen}
          onChange={(e) => setChosen(e.target.value)}
          name={`question-${question.id}`}
        >
          <option value="" disabled>
            -- Select an option --
          </option>

          {options.length > 0 ? (
            options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))
          ) : (
            <option disabled>No options available</option>
          )}
        </select>
        {hasError && (
          <div className="flex items-center font-vagrounded gap-1 my-2">
            <IoAlertCircle className="fill-red-500 text-xl" />
            <span className="text-md text-red-500">
              This field is required.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
