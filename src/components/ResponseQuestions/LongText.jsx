import { useEffect, useRef, useState } from "react";

function LongText({ question, onChange, value = "" }) {
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
    <div className="my-6">
      <p className="text-lg mb-3 font-medium">{question.question}</p>
      <div className="space-y-2 mt-3 group relative">
        <textarea
          ref={answerRef}
          value={answer}
          onChange={(e) => {
            handleChange(e);
            resize(answerRef);
          }}
          className="w-full min-h-17 placeholder:italic placeholder:text-gray-400 bg-(--dirty-white) border-b-2 border-b-(--black) text-lg focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
          placeholder="Type your answer here..."
          rows={1}
        />
      </div>
    </div>
  );
}

export default LongText;
