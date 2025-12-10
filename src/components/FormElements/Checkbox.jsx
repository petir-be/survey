import React, { useState, useEffect, useRef } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";
import { motion } from "framer-motion";

function Checkbox({ question, onUpdate, onDuplicate }) {
  const options = ["Option 1", "Option 2"];
  const [addOption, setAddOption] = useState(question.options || options);
  const [showAddOption, setShowAddOption] = useState(false);

  const instanceId = React.useId();

  const textareaRef = useRef(null);
  const [required, setRequired] = useState(question.required || false);

  function toggleRequired() {
    setRequired((prev) => !prev);
    onUpdate(question.id, { required: !required });
  }

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

  useEffect(() => {
    onUpdate(question.id, { required: required });
    onUpdate(question.id, {
      options: addOption,
    });
  }, []);

  useEffect(() => {
    addOption.forEach((option, index) => {
      const span = document.getElementById(
        `radio-resize-${instanceId}-${index}`
      );
      const input = span?.previousElementSibling;

      if (span && input) {
        const measured = span.offsetWidth + 10;
        const min = 72; // 👈 minimum width for placeholder visibility

        const finalWidth = Math.max(measured, min);

        input.style.width = finalWidth + "px";
        input.parentElement.parentElement.style.width = finalWidth + 60 + "px";
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
      if (/^Option \d+$/.test(item)) {
        // ✅ Test the string directly
        return `Option ${i + 1}`;
      }
      return item;
    });

    setAddOption(reindexed);
    onUpdate(question.id, { options: reindexed }); // ✅ Already strings
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
            <div className="group/item form-option-input" key={index}>
              <input type="checkbox" className="w-5 h-5" />

              <div className="relative h-full max-w-full">
                <input
                  type="text"
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => {
                    const updated = [...addOption];
                    updated[index] = e.target.value;
                    setAddOption(updated);
                    onUpdate(question.id, { options: updated });
                  }}
                  className="absolute font-vagrounded top-0 left-0 line-clamp-2 placeholder:text-gray-400 max-w-full bg-transparent focus:outline-none"
                  style={{ width: "100%", minWidth: "72px" }}
                />

                <span
                  id={`radio-resize-${instanceId}-${index}`}
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
          <div className="flex justify-between pr-5 items-center">
            <button
              onClick={addOptionField}
              className="mt-2 px-2 font-medium font-vagrounded py-1 text-(--purple) border-b-(--purple) border-transparent hover:border-b"
            >
              + Add Option
            </button>
            <div className="border-2 border-transparent pl-3 border-l-gray-400 flex gap-3 font-vagrounded items-center">
              <span className="text-gray-600">Required</span>
              <button
                onClick={toggleRequired}
                style={{
                  width: 39,
                  height: 18,
                  backgroundColor: required ? "#9911ff" : "#ccc",
                  borderRadius: 30,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: required ? "flex-end" : "flex-start",
                  padding: 3,
                  transition: "background-color 0.2s ease",
                }}
              >
                <motion.div
                  layout
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                  }}
                  transition={{
                    type: "spring",
                    duration: 0.25,
                    bounce: 0.2,
                  }}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkbox;
