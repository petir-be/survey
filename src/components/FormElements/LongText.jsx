import { IoDuplicate } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function LongText({ question, onUpdate, onDuplicate }) {
  const questionRef = useRef(null);
  const answerRef = useRef(null);

  const [showAddOption, setShowAddOption] = useState(false);

  const [required, setRequired] = useState(false);

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
      {/* QUESTION TEXTAREA */}
      <div className="flex justify-between items-start">
        <div className="flex-1 inline-flex items-start">
          <textarea
            ref={questionRef}
            value={question.question || ""}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              resize(questionRef);
            }}
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Type your question here"
            rows={1}
          />

          <button
            onClick={() => onDuplicate(question.id)}
            className="font-vagrounded mx-5 mt-1 group-focus-within:opacity-100 opacity-0 transition-all duration-200"
          >
            <IoDuplicate className="text-2xl" />
          </button>
        </div>
      </div>

      {/* ANSWER PREVIEW TEXTAREA */}
      <div className="space-y-2 mt-3 group relative">
        <textarea
          ref={answerRef}
          value={question.answer || ""}
          onChange={(e) => {
            onUpdate(question.id, { answer: e.target.value });
            resize(answerRef);
          }}
          className="w-full min-h-17 placeholder:italic placeholder:text-gray-400 bg-(--dirty-white) border-b-2 border-b-(--black) text-lg focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
          placeholder="User answer will appear here..."
          rows={1}
        />
        {showAddOption && (
          <div className="flex justify-end pr-5 items-center">
            <div className="border-2 border-transparent pl-3 mt-1 border-l-gray-400 flex gap-3 font-vagrounded items-center">
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

export default LongText;
