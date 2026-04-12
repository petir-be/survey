import React, { useRef, useEffect, useState } from "react";
import { IoDuplicate, IoMail } from "react-icons/io5";
import { motion } from "framer-motion";

function Email({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showAddOption, setShowAddOption] = useState(false);

  const [required, setRequired] = useState(question.required || false);

  function toggleRequired() {
    setRequired((prev) => !prev);
    onUpdate(question.id, { required: !required });
  }

  useEffect(() => {
    onUpdate(question.id, { required: required });
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === "" || emailRegex.test(value)) {
      setError("");
    } else {
      setError("Please enter a valid email address");
    }
  };

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
      <div className="flex justify-between items-start">
        <div className="flex-1 inline-flex items-start">
          <textarea
            ref={textareaRef}
            value={question.question || "Enter your Email Address"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-bold text-xl  bg-transparent text-white placeholder:text-white focus:outline-none resize-none overflow-hidden"
            placeholder="Email"
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
        <div
          tabIndex="0"
          className="flex items-center py-1 transition-all duration-300 bg-zinc-950/40  border-b border-zinc-800 hover:border-emerald-500/30
           focus-within:ring-b-1 focus-within:ring-emerald-500/50 "
        >          <IoMail className="text-3xl" color="white" />

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="ispecmn@gmail.com"
            className="w-full text-zinc-300  plaeholder:italic placeholder:text-zinc-500 focus:outline-none px-2 py-1 overflow-hidden"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}

        {showAddOption && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end items-center pt-4 mt-4  "
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

export default Email;
