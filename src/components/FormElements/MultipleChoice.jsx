import React from "react";

function MultipleChoice({ question, onUpdate }) {
  const handleOptionChange = (index, value) => {
    const updated = [...question.options];
    updated[index] = value;
    onUpdate(question.id, { options: updated });
  };

  const addOption = () => {
    onUpdate(question.id, { options: [...question.options, ""] });
  };

  const removeOption = (index) => {
    const updated = question.options.filter((_, i) => i !== index);
    onUpdate(question.id, { options: updated });
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
            Type: {question.type || "multiple choice"}
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-3">
        {question.options?.map((opt, index) => (
          <div key={index} className="flex items-center gap-3">
            <input type="radio" disabled className="h-4 w-4 text-blue-600" />
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50"
            />
            <button
              onClick={() => removeOption(index)}
              className="text-red-500 hover:text-red-700"
            >
            </button>
          </div>
        ))}

        <button
          onClick={addOption}
          className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          + Add Option
        </button>
      </div>
    </div>
  );
}

export default MultipleChoice;
