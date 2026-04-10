import React, { useRef, useEffect, useState } from "react";
import { PH } from "country-flag-icons/react/3x2";
import { IoDuplicate } from "react-icons/io5";
import { motion } from "framer-motion";

function PhoneNumber({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const [showAddOption, setShowAddOption] = useState(false);

  const [required, setRequired] = useState(false);

  function toggleRequired() {
    setRequired((prev) => !prev);
    onUpdate(question.id, { required: !required });
  }

  useEffect(() => {
    onUpdate(question.id, { required: required });
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;

    // Remove any non-digit characters
    value = value.replace(/\D/g, "");

    if (value.length > 10) value = value.slice(0, 10);

    setPhone(value);

    if (value.length === 10 || value.length === 0) {
      setError("");
    } else {
      setError("Please enter valid phone number");
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
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={question.question || "Enter your Phone Number"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-bold text-xl  text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden" placeholder="Phone Number"
            rows={1}
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-zinc-500 hover:text-emerald-500 transition-all opacity-0 group-focus-within:opacity-100 group-hover:opacity-100" >
            <IoDuplicate size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-2 mt-3 group relative">
        <div className="flex bg-transparent items-center gap-3 w-full border-b border-zinc-800 hover:border-zinc-700 focus-within:border-emerald-500/50 transition-all py-2">
          <div className="flex items-center gap-2 select-none">
            <PH className="w-6 h-4 rounded-sm object-cover" />
            <span className="text-zinc-400 font-vagrounded font-medium">(+63)</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            placeholder="Enter a 10-digit number"
            className="flex-1 bg-transparent border-none focus:outline-none text-zinc-300 font-medium placeholder:text-zinc-600 tracking-wide"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded mt-1">{error}</p>
        )}
        {showAddOption && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end items-center pt-4 mt-4 border-zinc-800/50"
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

export default PhoneNumber;
