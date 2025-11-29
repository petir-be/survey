import React from "react";

function Checkbox({ question, value = [], onChange }) {
  const options = question.options || [];

  const handleToggle = (selectedOption) => {
    let updated;

    if (value.includes(selectedOption)) {
      updated = value.filter((v) => v !== selectedOption);
    }
    else {
      updated = [...value, selectedOption];
    }

    onChange(updated);
  };

  return (
    <div>
      <p className="text-lg font-medium">{question.question || "Select"}</p>

      {options.length === 0 ? (
        <p className="text-gray-400 italic">No options available.</p>
      ) : (
        <div className="space-y-2 mt-3">
          {options.map((option, index) => {
            const isSelected = value.includes(option);

            return (
              <button
                key={index}
                type="button"
                className={`
                  flex items-center gap-4 px-3 py-2 rounded ring-2 transition-all hover:bg-(--white) duration-200 ease-out
                  ${
                    isSelected
                      ? "bg-(--purple-lighter) ring-(--purple)"
                      : "bg-(--dirty-white) ring-(--black-lighter)"
                  }
                `}
                onClick={() => handleToggle(option)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(option)}
                  className="w-5 h-5 min-w-5 min-h-5 text-(--purple)"
                />

                <span className="font-vagrounded text-gray-800 select-none text-left">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Checkbox;
