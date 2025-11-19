import React, { useState, useEffect } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";

function Checkbox({ question, onUpdate, onDuplicate }) {
  const options = ["Option 1", "Option 2"];
  const [addOption, setAddOption] = useState(options);
  const [showAddOption, setShowAddOption] = useState(false);


  useEffect(() => {
    addOption.forEach((option, index) => {
      const span = document.getElementById(`resize-${index}`);
      const input = span?.previousElementSibling;

      if (span && input) {
        const width = span.offsetWidth + 6;
        input.style.width = width + "px";

        //makes container grow with input too
        input.parentElement.parentElement.style.width = width + 60 + "px";
      }
    });
  }, [addOption]);

  const addOptionField = () => {
    const newOption = `Option ${addOption.length + 1}`;
    setAddOption([...addOption, newOption]);
    onUpdate(question.id, { options: [...addOption, newOption] });
  };

  const removeOptionField = (index) => {
    const filtered = addOption.filter((_, i) => i !== index);

    // Reindex only default labels (Option #)
    const reindexed = filtered.map((item, i) => {
      if (/^Option \d+$/.test(item.label)) {
        return { ...item, label: `Option ${i + 1}` };
      }
      return item;
    });

    setAddOption(reindexed);
    onUpdate(question.id, { options: reindexed.map((o) => o.label) });
  };

  return (
    <div
      className="form-element-container group"
      tabIndex={0}
  
      onFocus={() => setShowAddOption(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setShowAddOption(false);
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 inline-flex">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-medium text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1"
            placeholder="Enter your question"
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="font-vagrounded mx-5 group-focus-within:opacity-100 opacity-0 transition-all duration-200"
          >
            <IoDuplicate className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mt-3 group relative">
        {addOption.length === 0 ? (
          <div className="w-full flex justify-center items-center">
            <p className="text-gray-400">Empty choices...</p>
          </div>
        ) : (
          addOption.map((option, index) => (
            <div className="group/item form-option-input" key={index}>
              <input type="checkbox" className="w-5 h-5" />

              <div className="relative h-full max-w-full">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updated = [...addOption];
                    updated[index] = e.target.value;
                    setAddOption(updated);
                    onUpdate(question.id, { options: updated });
                  }}
                  className="absolute font-vagrounded top-0 left-0 line-clamp-2 max-w-full bg-transparent focus:outline-none"
                  style={{ width: "100%" }}
                />

                <span
                  id={`resize-${index}`}
                  className="invisible whitespace-pre"
                >
                  {option || " "}
                </span>
              </div>

              <div className="absolute -top-2 -right-2 opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-200 ease-out">
                <button onClick={() => removeOptionField(index)}>
                  <FaCircleXmark
                    className="bg-white text-xl rounded-full hover:ring-2 hover:ring-(--purple)"
                    fill="purple"
                  />
                </button>
              </div>
            </div>
          ))
        )}

        {showAddOption && (
          <button
            onClick={addOptionField}
            className="mt-2 px-2 font-medium font-vagrounded py-1 text-(--purple) border-b-(--purple) border-transparent hover:border-b"
          >
            + Add Option
          </button>
        )}
      </div>
    </div>
  );
}

export default Checkbox;
