import { useEffect, useState } from "react";
import { IoAlertCircle } from "react-icons/io5";

function ShortText({ question, onChange, value = "", hasError }) {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setAnswer(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setAnswer(val);
    onChange(val);
  };

  return (
    <div className="my-6">
      <p className="text-lg mb-3 font-medium">
        {question.question}{" "}
        {question.required ? <span className="text-red-600"> *</span> : null}
      </p>
      <div className="space-y-2 mt-3 group relative">
        <textarea
          value={answer}
          onChange={(e) => {
            handleChange(e);
          }}
          className="w-full placeholder:italic placeholder:text-gray-400 bg-(--dirty-white) border-b-2 border-b-(--black) text-lg focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
          placeholder="Type your answer here..."
          rows={1}
        />
      </div>
      {hasError && (
        <div className="flex items-center font-vagrounded gap-1 my-2">
          <IoAlertCircle className="fill-red-500 text-xl" />
          <span className="text-md text-red-500">This field is required.</span>
        </div>
      )}
    </div>
  );
}

export default ShortText;
