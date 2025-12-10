import React from "react";
import { IoAlertCircle } from "react-icons/io5";

function MultipleChoice({ question, value = "", onChange, hasError }) {
  const options = question.options || [];

  const handleChange = (selectedLabel) => {
    onChange(selectedLabel); // Sends the selected option text back
  };

  return (
    <div className="">
      {/* Question Text */}
      <p className="text-lg font-medium">
        {question.question || "Select"}
        {question.required ? <span className="text-red-600"> *</span> : null}
      </p>

      {/* Options */}
      {options.length === 0 ? (
        <p className="text-gray-400 italic">No options available.</p>
      ) : (
        <div className="space-y-2 mt-3">
          {options.map((option, index) => {
            const isSelected = value === option;

            return (
              <button
                key={index}
                className={`
                  flex items-center gap-4 px-3 py-2 rounded  ring-2 transition-all hover:bg-(--white) duration-200 ease-out
                  ${
                    isSelected
                      ? "bg-(--purple-lighter) ring-(--purple) "
                      : "bg-(--dirty-white) ring-(--black-lighter) "
                  }
                `}
                onClick={() => handleChange(option)}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleChange(option)}
                  className="w-5 h-5 min-w-5 min-h-5 text-(--purple) "
                />
                <span className="font-vagrounded text-gray-800 select-none text-left">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {hasError && (
        <div className="flex items-center font-vagrounded gap-1 my-2">
          <IoAlertCircle className="fill-red-500 text-xl" />
          <span className="text-md text-red-500">This field is required.</span>
        </div>
      )}
    </div>
  );
}

export default MultipleChoice;
