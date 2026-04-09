import React, { useState, useRef, useEffect } from "react";
import { IoDuplicate } from "react-icons/io5";
import { FaCircleXmark } from "react-icons/fa6";
import { motion } from "framer-motion";

function Dropdown({ question, onUpdate, onDuplicate }) {
  const defaultOption = ["Option 1", "Option 2"];
  const [addOption, setAddOption] = useState(question.options || defaultOption);
  const [showAddOption, setShowAddOption] = useState(false);
  const textareaRef = useRef(null);
  const instanceId = React.useId();

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

  useEffect(() => {
    adjustHeight();
  }, [question.question]);

  useEffect(() => {
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
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={question.question || "Type your question here"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-bold text-xl bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="Type your question here"
            rows={1}
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-zinc-500 hover:text-emerald-500 transition-all opacity-0 group-focus-within:opacity-100"
          >
            <IoDuplicate size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-2 mt-3 group relative">
        <select className="w-full block border border-zinc-700 hover:border-zinc-600 focus:border-emerald-500/50 py-2.5 mb-5 px-3 rounded-lg bg-zinc-800/50 text-zinc-300 outline-none transition-all cursor-pointer shadow-sm">
          {addOption.length > 0 ? (
            addOption.map((option, index) => (
              <option key={index} value={option} className="bg-zinc-800 text-zinc-200">
                {option}
              </option>
            ))
          ) : (
            <option disabled className="bg-zinc-800 text-zinc-500">
              No options available
            </option>)}
        </select>

        {addOption.length === 0 ? (
          <div className="w-full flex justify-center items-center py-2">
            <p className="text-zinc-500 text-sm italic">Empty choices...</p>
          </div>
        ) : (
          addOption.map((option, index) => (
            <div 
            className="group/item flex items-center gap-3 relative py-1"

              key={index}
            >

              <div className="flex items-center justify-center w-5 h-5 rounded bg-zinc-800 text-zinc-500 text-xs font-bold">
                {index + 1}
              </div>
              <div className="relative h-full max-w-full flex-1">
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
                  className="absolute font-vagrounded top-0 left-0 line-clamp-2 placeholder:text-zinc-600 max-w-full
                   bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500/50 focus:outline-none
                    text-zinc-300 font-medium transition-all"
                />

                <span
                  id={`radio-resize-${instanceId}-${index}`}
                  className="invisible whitespace-pre font-medium"  >
                  {option || " "}
                </span>
              </div>

              <button
                onClick={() => removeOptionField(index)}
                className="opacity-0 group-hover/item:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-opacity"
              >
                <FaCircleXmark size={16} />
              </button>
            </div>

          ))
        )}

        {/* FOOTER ACTIONS */}
       {showAddOption && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end items-center pt-4 mt-4border-zinc-800/50"
          >
            <div className="font-vagrounded flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Required
              </span>
              <button
                onClick={toggleRequired}
                className={`w-9 h-5 flex items-center rounded-full px-1 transition-all duration-300 ${required
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-zinc-800"
                  }`}
              >
                <motion.div
                  layout
                  className="w-3 h-3 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ marginLeft: required ? "auto" : "0" }}
                />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
