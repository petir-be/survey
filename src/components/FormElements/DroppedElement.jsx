import React from "react";

function DroppedElement({ element, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-3 flex items-center justify-between group hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        <element.Icon className="text-2xl" />
        <p className="font-medium">{element.title}</p>
      </div>
      <button
        onClick={() => onDelete(element.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 px-2 py-1 rounded"
      >
        ×
      </button>
    </div>
  );
}

export default DroppedElement;
