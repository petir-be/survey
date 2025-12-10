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
            className="w-full text-gray-600 placeholder:italic placeholder:text-gray-400 text-md border-b border-transparent hover:bg-gray-200 focus:bg-gray-300 focus:border-b-gray-600  focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Caption (optional)"
            rows={1}
          />
        </div>
        <button
          onClick={toggleQuestion}
          style={{
            width: 70,
            height: 34,
            backgroundColor: toggle ? "#9911ff" : "#ccc",
            borderRadius: 30,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: toggle ? "flex-end" : "flex-start",
            padding: 3,
            transition: "background-color 0.2s ease",
          }}
        >
          <motion.div
            layout
            style={{
              width: 25,
              height: 25,
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
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Switch;
