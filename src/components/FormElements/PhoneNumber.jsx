import React, { useRef, useEffect, useState } from "react";
import { PH } from 'country-flag-icons/react/3x2'
import { IoDuplicate } from "react-icons/io5";

function PhoneNumber({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

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
    <div className="form-element-container group">
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
      </div>
    </div>
  );
}

export default PhoneNumber;
