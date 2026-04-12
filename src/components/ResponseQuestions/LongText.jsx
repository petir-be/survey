import { useEffect, useRef, useState } from "react";
import { IoAlertCircle } from "react-icons/io5";

function LongText({ question, onChange, value = "", hasError }) {
  const answerRef = useRef(null);

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setAnswer(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setAnswer(val);
    onChange(val);
  };

  const resize = (ref) => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    resize(answerRef);
  }, [question.answer]);

  return (
    <div
      className="form-element-container group outline-none"
      tabIndex={0}

    >
      {/* Header Section: Question Text & Duplicate Button */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 flex items-start gap-3">
          <p className="w-full font-vagrounded font-bold text-xl text-white">
            {question.question}
            {question.required &&
              <span className="text-red-600"> *</span>
            }
          </p>

        </div>
      </div>

      {/* Answer Section */}
      <div className="space-y-3 mt-4 group/item relative">
        <textarea
          ref={answerRef}
          value={answer}
          onChange={(e) => {
            handleChange(e);
            resize(answerRef);
          }}
          className="w-full bg-transparent border-b border-zinc-800/50 hover:border-zinc-700 focus:border-emerald-500/50 focus:outline-none text-zinc-300 font-medium py-2 transition-all resize-none overflow-hidden placeholder:text-zinc-600 italic"
          placeholder="Type your answer here..."
          rows={1}
        />

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center font-vagrounded gap-1 mt-2">
            <IoAlertCircle className="fill-red-500 text-xl" />
            <span className="text-md text-red-500">This field is required.</span>
          </div>
        )}


      </div>
    </div>
  );
}

export default LongText;
