import { IoDuplicate } from "react-icons/io5";
import { useEffect, useRef } from "react";

function Paragraph({ question, onUpdate, onDuplicate }) {
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
            className="w-full font-vagrounded font-bold text-l bg-transparent pb-2 border-b border-zinc-500 hover:border-green-700  focus:border-green-800 text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="Type your paragraph here"
            rows={1}
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-zinc-500 hover:text-emerald-500 transition-all opacity-0 group-focus-within:opacity-100"
          >
            <IoDuplicate className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Paragraph;
