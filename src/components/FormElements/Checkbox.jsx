import React, { useState } from "react";
import { FaCircleXmark } from "react-icons/fa6";

function Checkbox({ question, onUpdate, onDuplicate }) {
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
    document.activeElement.blur();
  };

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
            <div
              className="group form-option-input"
              key={index}
            >
              <div className="w-full flex items-center mr-2 gap-1">
                <input type="checkbox" className="w-5 h-5" />

                <input
                  type="text"
                  placeholder={option}
                  className="focus:outline-none placeholder:text-gray-400 bg-transparent w-full"
                />
              </div>

              <div
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 ease-out"
              >
                <button
                  onClick={() => removeOptionField(index)}
                >
                  <FaCircleXmark className="group-focus-within:ring-2 rounded-full bg-white group-focus-within:ring-blue-400 text-xl hover:scale-[108%] transition-all duration-200 ease-out" fill="red" />
                </button>
              </div>
            </div>
          ))
        )}

        <div className="flex flex-1 justify-between items-center">
          <button
            onClick={addOptionField}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Option
          </button>
          <button onClick={() => onDuplicate(question.id)}>Duplicate</button>
        </div>
      </div>
    </div>
  );
}

export default Checkbox;
