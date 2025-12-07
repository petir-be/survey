import React, { useEffect, useState } from "react";

function Dropdown({ question, onChange, value = "" }) {
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
      <p className="text-lg mb-3 font-medium">{question.question || "Select one option"}</p>

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
      </div>
    </div>
  );
}

export default Dropdown;
