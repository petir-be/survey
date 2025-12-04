import React, { useRef, useEffect, useState } from "react";
import { IoDuplicate, IoMail } from "react-icons/io5";

function Email({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    <div className="form-element-container group">
      <div className="flex justify-between items-start">
        <div className="flex-1 inline-flex items-start">
          <textarea
            ref={textareaRef}
            value={question.question || "Enter your Email Address"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Email"
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
        <div className="flex items-center px-3 py-1 bg-(--dirty-white) border-b-2 border-b-(--black) text-lg focus:border-(--purple) focus:outline-none">
          <IoMail className="text-3xl" fill="#212529" />

          <input
            type="email"
            value={email}
            onChange={handleChange}
            className="w-full placeholder:italic placeholder:text-gray-400 focus:outline-none px-2 py-1 overflow-hidden"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Email;
