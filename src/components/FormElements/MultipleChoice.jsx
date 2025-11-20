import React, { useState, useEffect, useRef } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";

function MultipleChoice({ question, onUpdate, onDuplicate }) {
  const initialOptions = [
    { id: crypto.randomUUID(), label: "Option 1" },
    { id: crypto.randomUUID(), label: "Option 2" },
  ];
  const instanceId = React.useId();

  const [addOption, setAddOption] = useState(initialOptions);
  const [showAddOption, setShowAddOption] = useState(false);
  const [selected, setSelected] = useState("");

    const textareaRef = useRef(null);
  
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    };
  
    useEffect(() => {
      adjustHeight();
    }, [question.question]);

  // Sync initial options with onUpdate
  useEffect(() => {
    onUpdate(question.id, { options: addOption.map((o) => o.label) });
  }, []);

  // Auto resize inputs
  useEffect(() => {
    addOption.forEach((option, index) => {
      const span = document.getElementById(
        `radio-resize-${instanceId}-${index}`
      );
      const input = span?.previousElementSibling;

      if (span && input) {
        const measured = span.offsetWidth + 10;
        const min = 72;
        const finalWidth = Math.max(measured, min);

        input.style.width = finalWidth + "px";
        input.parentElement.parentElement.style.width = finalWidth + 60 + "px";
      }
    });
  }, [addOption]);

  const addOptionField = () => {
    const newOpt = {
      id: crypto.randomUUID(),
      label: `Option ${addOption.length + 1}`,
    };

    const updated = [...addOption, newOpt];
    setAddOption(updated);
    onUpdate(question.id, { options: updated.map((o) => o.label) });
  };

  const removeOptionField = (index) => {
    const removed = addOption[index];

    const filtered = addOption.filter((_, i) => i !== index);
    const reindexed = filtered.map((item, i) => {
      if (/^Option \d+$/.test(item.label)) {
        return { ...item, label: `Option ${i + 1}` };
      }
      return item;
    });

    if (selected === removed.label) {
      setSelected("");
    }

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
          <textarea
            ref={textareaRef}
            value={question.question || ""}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Type your paragraph here"
            rows={1}
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
            <div className="group/item form-option-input" key={option.id}>
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={selected === option.label}
                onChange={() => setSelected(option.label)}
                className="w-5 h-5 accent-blue-500"
              />

              <div className="relative h-full max-w-full">
                <input
                  type="text"
                  value={option.label}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => {
                    const updated = [...addOption];
                    updated[index] = {
                      ...updated[index],
                      label: e.target.value,
                    };
                    setAddOption(updated);
                    onUpdate(question.id, {
                      options: updated.map((o) => o.label),
                    });
                  }}
                  className="absolute font-vagrounded top-0 left-0 line-clamp-2 text-wrap max-w-full placeholder:text-gray-400 focus:outline-none"
                  style={{ width: "100%", minWidth: "72px" }}
                />

                <span
                  id={`radio-resize-${instanceId}-${index}`}
                  className="invisible whitespace-pre"
                >
                  {option.label || " "}
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

export default MultipleChoice;
