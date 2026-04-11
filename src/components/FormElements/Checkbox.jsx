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
        const min = 72;

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
    onUpdate(question.id, { options: reindexed });
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
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={question.question || ""}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-bold text-xl bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="Type your paragraph here"
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
      <div className="space-y-3 mt-4">
        {addOption.length === 0 ? (
          <div className="w-full flex justify-center items-center py-2">
            <p className="text-zinc-500 text-sm italic">Empty choices...</p>
          </div>
        ) : (
          addOption.map((option, index) => (
            <div className="group/item flex items-center gap-3 relative" key={index}>

              {/* CHECKBOX */}
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 shrink-0 rounded-md border-2 border-zinc-700 appearance-none checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
              />

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
                className="flex-1 font-vagrounded bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500/50 focus:outline-none text-zinc-300 font-medium py-1 transition-all placeholder:text-zinc-600"
              />

              {/* DELETE BUTTON */}
              <button
                onClick={() => removeOptionField(index)}
                className="opacity-0 group-hover/item:opacity-100 focus:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-opacity"
              >
                <FaCircleXmark size={16} />
              </button>
            </div>
          ))
        )}

        {showAddOption && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-800/50"
          >
            <button
              onClick={addOptionField}
              className="text-xs font-bold uppercase tracking-widest text-emerald-500/80 hover:text-emerald-400 flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span> Add Option
            </button>

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

export default Checkbox;
