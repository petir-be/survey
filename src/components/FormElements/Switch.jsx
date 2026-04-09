import React, { useRef, useEffect, useState } from "react";
import { IoDuplicate, IoMail } from "react-icons/io5";
import { motion } from "framer-motion";

function Switch({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);
  const captionRef = useRef(null);

  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    onUpdate(question.id, { toggle: question.toggle || false });
  }, []);

  const toggleQuestion = () => {
    setToggle((prev) => !prev);
    onUpdate(question.id, { toggle: !toggle });
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    const captionarea = captionRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
    if (captionarea) {
      captionarea.style.height = "auto";
      captionarea.style.height = captionarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [question.question, question.caption]);

  return (
    <div className="form-element-container group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={question.question || "Enter your Email Address"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-bold text-xl bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="Email"
            rows={1}
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-zinc-500 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <IoDuplicate size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-5 group relative">
        <div className="w-full flex-1 items-start">
          <textarea
            ref={captionRef}
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
              onUpdate(question.id, { caption: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-medium text-sm bg-transparent text-zinc-400 placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="Caption (optional)"
            rows={1}
          />

        </div>
        <div className="pt-2">
          <button
            onClick={toggleQuestion}
            className={`w-14 h-8 flex items-center rounded-full px-1 transition-all duration-300 ${toggle
              ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              : "bg-zinc-800"
              }`}
          >
            <motion.div
              layout
              className="w-6 h-6 bg-white rounded-full shadow-sm"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              style={{ marginLeft: toggle ? "auto" : "0" }}
            />
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}

      </div>
    </div>
  );
}

export default Switch;
