import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Switch({ question, onChange, value = false }) {
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(value);
  }, [value]);

  const toggleQuestion = () => {
    const newState = !toggle;
    setToggle(newState);
    onChange(newState);
  };

  return (
    <div className="form-element-container group transition-all">
      {/* Question Header styled as per reference */}
      <div className="flex justify-between items-start mb-4">
        <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white">
          {question.question || "Switch Question"}
          {question.required && (
            <span className="text-emerald-500 ml-1">*</span>
          )}
        </p>
      </div>

      <div className="space-y-4 group relative">
        {/* Caption Styling matching reference */}
        {question.caption && (
          <div className="w-full">
            <p className="font-vagrounded pb-2 border-b border-zinc-800 text-sm font-medium text-zinc-400">
              {question.caption}
            </p>
          </div>
        )}

        {/* Toggle Button styled as per reference */}
        <div className="pt-2">
          <button
            type="button"
            onClick={toggleQuestion}
            className={`w-14 h-8 flex items-center rounded-full px-1 transition-all duration-300 ${
              toggle
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
          <p className="text-red-400 text-sm font-vagrounded mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Switch;