import React, { useState, useEffect, useRef } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import { IoDuplicate } from "react-icons/io5";
import { motion } from "framer-motion";

function MultipleChoice({ question, onUpdate, onDuplicate }) {
  const defaultOptions = [
    { id: crypto.randomUUID(), label: "Option 1" },
    { id: crypto.randomUUID(), label: "Option 2" },
  ];

  const [required, setRequired] = useState(question.required || false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [selected, setSelected] = useState("");
  const instanceId = React.useId();
  const textareaRef = useRef(null);

  const normalizeOptions = (options) => {
    if (!Array.isArray(options) || options.length === 0) return defaultOptions;
    return options.map((opt, i) => {
      if (typeof opt === "string") return { id: crypto.randomUUID(), label: opt };
      return {
        id: opt.id || crypto.randomUUID(),
        label: opt.label ?? `Option ${i + 1}`,
      };
    });
  };

  const [addOption, setAddOption] = useState(normalizeOptions(question.options));

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => { adjustHeight(); }, [question.question]);

  useEffect(() => {
    onUpdate(question.id, { options: addOption.map((o) => o.label), required: required });
  }, [addOption, required]);

  const addOptionField = () => {
    const newOption = { id: crypto.randomUUID(), label: `Option ${addOption.length + 1}` };
    setAddOption([...addOption, newOption]);
  };

  const removeOptionField = (index) => {
    const filtered = addOption.filter((_, i) => i !== index);
    setAddOption(filtered);
  };

  return (
    <div
      className="relative p-6 justify-self-center w-11/12 transition-all duration-300 bg-zinc-950/40 backdrop-blur-md border border-zinc-800 rounded-2xl hover:border-emerald-500/30 group mb-6 focus-within:ring-1 focus-within:ring-emerald-500/50 focus-within:bg-zinc-950/60"
      tabIndex={0}
      onFocus={() => setShowAddOption(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setShowAddOption(false);
      }}
    >
      {/* HEADER SECTION */}
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
            placeholder="Untitled Question"
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

      {/* OPTIONS SECTION */}
      <div className="space-y-3 mt-4">
        {addOption.map((option, index) => (
          <div className="group/item flex items-center gap-3 relative" key={option.id}>
            <input
              type="radio"
              disabled
              className="w-4 h-4 rounded-full border-2 border-zinc-700 appearance-none checked:bg-emerald-500 checked:border-emerald-500 transition-all"
            />

            <input
              type="text"
              value={option.label}
              onChange={(e) => {
                const updated = [...addOption];
                updated[index].label = e.target.value;
                setAddOption(updated);
              }}
              className="flex-1 bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500/50 focus:outline-none text-zinc-300 font-medium py-1 transition-all"
            />

            <button
              onClick={() => removeOptionField(index)}
              className="opacity-0 group-hover/item:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-opacity"
            >
              <FaCircleXmark size={16} />
            </button>
          </div>
        ))}

        {/* FOOTER ACTIONS */}
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

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Required</span>
              <button
                onClick={() => setRequired(!required)}
                className={`w-9 h-5 flex items-center rounded-full px-1 transition-all duration-300 ${required ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800"
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

export default MultipleChoice;