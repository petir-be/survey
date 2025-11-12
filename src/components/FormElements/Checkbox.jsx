import React, { useState } from "react";

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
  };

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
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
        {addOption.map((option, index) => (
          <div
            className="w-full px-3 flex justify-between items-center "
            key={index}
          >
            <div className="w-full flex items-center mr-2 gap-1">
              <input type="checkbox" className="w-5 h-5 " disabled />

          
                <input
                  type="text"
                  placeholder={option}
                  className="focus:outline-none px-3 placeholder:text-gray-400 py-2 w-full bg-transparent focus:ring-2 ring-blue-400 rounded transition-all duration-200 ease-out"
                />
           
            </div>
            <button
              onClick={() => removeOptionField(index)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              X
            </button>
          </div>
        ))}

        <div className="flex flex-1 justify-between items-center">
          <button
            onClick={addOptionField}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Option
          </button>
          <button 
          onClick={() => onDuplicate(question.id)}
          >
            Duplicate</button>
        </div>
      </div>
    </div>
  );
}

export default Checkbox;
