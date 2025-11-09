import { Link } from "react-router";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import FormElement from "../components/FormElement";
import { BiSolidUserRectangle } from "react-icons/bi";
import Canvas from "../components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
function Form() {
  const [pages, setPages] = useState([
    {
      id: 1,
      questions: [],
    },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleDrop = (item, index) => {
    const newQuestion = {
      id: uuidv4(),
      order:
        typeof index === "number"
          ? index + 1
          : pages[currentPageIndex].questions.length + 1,
      question: getDefaultQuestion(item.title), // ← Must be "question" not "title"
      type: getQuestionType(item.title),
      options:
        item.title === "Multiple Choice" || item.title === "Checkbox"
          ? ["Option 1"]
          : undefined,
    };

    setPages((prev) => {
      const updated = [...prev];
      const currentPage = { ...updated[currentPageIndex] };

      if (typeof index === "number") {
        const copy = [...currentPage.questions];
        copy.splice(index, 0, newQuestion);
        copy.forEach((q, idx) => {
          q.order = idx + 1;
        });
        currentPage.questions = copy;
      } else {
        currentPage.questions = [...currentPage.questions, newQuestion];
      }

      updated[currentPageIndex] = currentPage;
      return updated;
    });
  };

  const handleUpdateQuestion = (questionId, updates) => {
    setPages((prev) => {
      const updated = [...prev];
      const currentPage = { ...updated[currentPageIndex] };
      currentPage.questions = currentPage.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      );
      updated[currentPageIndex] = currentPage;
      return updated;
    });
  };

  const getDefaultQuestion = (title) => {
    const questionMap = {
      contact: "What is your contact information?",
      "multiple choice": "Select one option:",
      "long text": "Please provide your answer:",
      checkbox: "Select all that apply:",
    };
    return questionMap[title?.toLowerCase?.()] || "Enter your question here";
  };

  const getQuestionType = (title) => {
    const typeMap = {
      contact: "contact",
      "multiple choice": "multiple_choice",
      "long text": "long_text",
      checkbox: "checkbox",
    };
    return typeMap[title?.toLowerCase?.()] || "text";
  };

  const handleAddPage = () => {
    setPages((prev) => [...prev, { id: uuidv4(), questions: [] }]);
    setCurrentPageIndex(pages.length);
  };
  const handleDeleteQuestion = (questionId) => {
    setPages((prev) => {
      const updated = [...prev];
      const currentPage = { ...updated[currentPageIndex] };
      currentPage.questions = currentPage.questions
        .filter((q) => q.id !== questionId)
        .map((q, idx) => ({ ...q, order: idx + 1 }));
      updated[currentPageIndex] = currentPage;
      return updated;
    });
  };

  const handleRemovePage = (indexToRemove) => {
    if (pages.length === 1) {
      alert("Cannot delete the last page!");
      return;
    }

    setPages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (indexToRemove === currentPageIndex) {
      // If deleting current page, go to previous or first page
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    } else if (indexToRemove < currentPageIndex) {
      // If deleting a page before current, adjust index
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };
  const handleExportData = () => {
    const allData = pages.map((page, idx) => ({
      page: idx + 1,
      questions: page.questions,
    }));
    console.log(JSON.stringify(allData, null, 2));
    alert("Data exported to console!");
  };

  const types = [
    { Icon: BiSolidUserRectangle, title: "Contact" },
    { Icon: BiSolidUserRectangle, title: "Multiple Choice" },
    { Icon: BiSolidUserRectangle, title: "Long Text" },
    { Icon: BiSolidUserRectangle, title: "Checkbox" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "Conthahahahahact" },
  ];

  const [titleValue, setTitleValue] = useState("");
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const newWidth = spanRef.current.offsetWidth + 25;
      inputRef.current.style.width = `${newWidth}px`;
    }
  }, [titleValue]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="h-dvh w-full bg-(--white) overflow-hidden">
          <header className="flex items-center justify-between z-20 bg-(--white) pt-8 pb-8 px-10 pr-12">
            <div className="inline-flex items-center gap-7 z-20 bg-(--white)">
              <Link to={"/"}>
                <p className="cursor-pointer text-3xl">
                  <FaHome />
                </p>
              </Link>
              <button
                onClick={handleExportData}
                className="px-6 py-1.5 rounded-xl bg-gray-100 ring ring-gray-400 font-vagrounded hover:bg-gray-200"
              >
                Export Data
              </button>
              <div className="relative inline-flex items-center z-20 bg-(--white)">
                <span
                  ref={spanRef}
                  className="invisible absolute whitespace-pre font-medium px-2 text-xl"
                >
                  {titleValue || "Untitled Form"}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Untitled Form"
                  className="text-(--black) placeholder:text-gray-600 text-xl py-1 px-2 rounded-lg transition-all relative duration-200 focus:outline-none focus:ring ring-black"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  style={{ width: "180px" }}
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-4">
              <button className=" px-10 py-1.5 rounded-xl bg-(--white) ring ring-(--purple) inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 transition-color duration-400 ease-out">
                Share
              </button>
              <button>
                <FaUserCircle className="text-3xl" />
              </button>
            </div>
          </header>

          {/* form mismo */}

          <div className="h-full w-full bg-(--white) flex">
            {/* leftside */}
            <div className="w-[20%] p-5  z-10 bg-(--white)  border-t-2 border-(--dirty-white)">
              {/* searchbox nga */}
              <div className="grid grid-cols-3 w-full gap-4 p-4 m-auto">
                {types.map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>
            </div>
            {/* mid */}
            <div className="h-full w-[60%] border-2 border-(--dirty-white) py-10 flex flex-col">
              <Canvas
                questions={pages[currentPageIndex].questions}
                onDropElement={handleDrop}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onAddPage={handleAddPage}
                onRemovePage={handleRemovePage}
                currentPageIndex={currentPageIndex}
                pageNumber={currentPageIndex + 1}
                totalPages={pages.length}
                onPageChange={setCurrentPageIndex}
              />
            </div>
            {/* right side */}
            <div className="h-full w-[20%] z-10 bg-(--white)  border-t-2 border-(--dirty-white)"></div>
          </div>
        </div>
      </DndProvider>
    </>
  );
}
export default Form;
