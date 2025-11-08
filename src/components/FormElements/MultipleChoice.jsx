import React from "react";

function MultipleChoice({ element }) {
  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
      <div className="mb-2">
        <p className="font-medium">Type your question here</p>
        <p className="text-gray-600">{element.title}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="radio" name="option" />
          <span>Option 1</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="option" />
          <span>Option 2</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="option" />
          <span>Option 3</span>
        </label>
      </div>
    </div>
  );
}

export default MultipleChoice;
