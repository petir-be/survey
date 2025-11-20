import React, { useRef, useEffect, useState } from "react";
import { IoDuplicate } from "react-icons/io5";

function Contact({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);

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
            value={question.question || ""}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-2xl border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Type your heading here"
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
       
         
      </div>
    </div>
  );
}

export default Contact;
