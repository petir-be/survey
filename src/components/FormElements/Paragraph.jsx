import { IoDuplicate } from "react-icons/io5";


function Paragraph({ question, onUpdate, onDuplicate }) {
  return (
    <div className="form-element-container group">
      <div className="flex justify-between items-start">
        <div className="flex-1 inline-flex">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1"
            placeholder="Type your paragraph here"
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="font-vagrounded mx-5 group-focus-within:opacity-100 opacity-0 transition-all duration-200"
          >
            <IoDuplicate className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default Paragraph;
