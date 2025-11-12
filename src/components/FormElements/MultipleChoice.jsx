import React, { useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";

function MultipleChoice({ question, onUpdate }) {
  const options = ["Option 1", "Option 2"];
  const [addOption, setAddOption] = useState(options);

  const addOptionField = () => {
    const newOption = `Option ${addOption.length + 1}`;
    setAddOption([...addOption, newOption]);
    onUpdate(question.id, { options: [...addOption, newOption] });
  };

  const removeOptionField = (index) => {
    const updatedOptions = addOption.filter((_, i) => i !== index);
    const reindexed = updatedOptions.map((_, i) => `Option ${i + 1}`);
    setAddOption(reindexed);
    onUpdate(question.id, { options: reindexed });

    if (selected === addOption[index]) {
      setSelected("");
    }
  };

  const [selected, setSelected] = useState("");

  return (
    <div className="form-element-container">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-medium text-lg border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
            placeholder="Enter your question"
          />
          <p className="text-sm text-gray-500 mt-1">
            Type: {question.type || "contact"}
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-3 w-full">
        {addOption.length === 0 ? (
          <div className="w-full flex justify-center items-center">
            <p className="text-gray-400">Empty choices...</p>
          </div>
        ) : (
          addOption.map((option, index) => (
            <div className="group form-option-input gap-2 " key={index}>
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="w-5 h-5 accent-blue-500"
              />
              <input
                type="text"
                placeholder={option}
                onChange={(e) => {
                  const updatedOptions = [...addOption];
                  updatedOptions[index] = e.target.value;
                  setAddOption(updatedOptions);
                  onUpdate(question.id, { options: updatedOptions });
                }}
                className="text-md focus:outline-none placeholder:text-gray-400 w-full rounded "
              />

              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ease-out">
                <button
                  onClick={() => removeOptionField(index)}
                  className="text-red-500"
                >
                  <FaCircleXmark className="ring-2 rounded-full bg-white group-focus-within:ring-blue-400 text-xl hover:scale-[108%] transition-all duration-200 ease-out" />
                </button>
              </div>
            </div>
          ))
        )}

        <div>
          <button
            onClick={addOptionField}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Option
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultipleChoice;
