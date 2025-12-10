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
      <div className="flex justify-between items-start">
        <div className="flex-1 inline-flex items-start">
          <textarea
            ref={textareaRef}
            value={question.question || "Enter your Phone Number"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-lg border-b border-transparent hover:border-gray-300 focus:border-[var(--purple)] focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Phone Number"
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
      <div className="space-y-2 mt-3 group relative">
        <div className="flex items-center px-3 py-1 bg-[var(--dirty-white)] border-b-2 border-b-[var(--black)] text-lg focus-within:border-[var(--purple)] focus:outline-none">
          <PH className="w-7 h-7 mr-2" />
          <p className="text-(--black) font-vagrounded">(+63)</p>
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            className="w-full placeholder:italic placeholder:text-gray-400 focus:outline-none px-2 py-1 overflow-hidden"
            placeholder="Enter 10-digit number"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
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

export default PhoneNumber;
