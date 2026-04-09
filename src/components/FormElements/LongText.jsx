import { IoDuplicate } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function LongText({ question, onUpdate, onDuplicate }) {
  const questionRef = useRef(null);
  const answerRef = useRef(null);

  const [showAddOption, setShowAddOption] = useState(false);
  const [required, setRequired] = useState(question.required || false);

  function toggleRequired() {
    setRequired((prev) => !prev);
    onUpdate(question.id, { required: !required });
  }

  useEffect(() => {
    onUpdate(question.id, { required: required });
  }, []);

  const resize = (ref) => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  // Resize when question text changes
  useEffect(() => {
    resize(questionRef);
  }, [question.question]);

  // Resize when answer text changes
  useEffect(() => {
    resize(answerRef);
  }, [question.answer]);

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
            ref={questionRef}
            value={question.question || ""}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              resize(questionRef);
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

      <div className="space-y-3 mt-4 group/item relative">
        <textarea
          ref={answerRef}
          value={question.answer || ""}
          onChange={(e) => {
            onUpdate(question.id, { answer: e.target.value });
            resize(answerRef);
          }}
          className="w-full  bg-transparent border-b border-zinc-800/50 hover:border-zinc-700 focus:border-emerald-500/50 focus:outline-none text-zinc-300 font-medium py-2 transition-all resize-none overflow-hidden placeholder:text-zinc-600"
          placeholder="Long answer text will appear here..."
          rows={1}
        />


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

export default LongText;