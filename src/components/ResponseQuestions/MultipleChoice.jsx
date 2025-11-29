import React from "react";

function MultipleChoice({ question, value = "", onChange }) {
  const options = question.options || [];

  const handleChange = (selectedLabel) => {
    onChange(selectedLabel); // Sends the selected option text back
  };

  return (
    <div className="">
      {/* Question Text */}
      <p className="text-lg font-medium">
        {question.question || "Select"}
        {/* {question.required && <span className="text-red-500 ml-1">*</span>} */}
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
                  ${isSelected 
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

      {/* Optional: Show "Other" field if you support it later */}
      {/* {question.hasOther && (
        <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-300">
          <input type="radio" name={`question-${question.id}`} />
          <input
            type="text"
            placeholder="Other (please specify)"
            className="flex-1 outline-none text-lg"
          />
        </label>
      )} */}
    </div>
  );
}

export default MultipleChoice;