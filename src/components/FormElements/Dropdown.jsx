import React, { useState } from "react";

function Dropdown({ question, onUpdate }) {
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
        {/* options din here */}
         
        <div>
          {/* <button
            onClick={addOptionField}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Option
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
