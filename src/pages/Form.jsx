import { Link, useNavigate, useParams } from "react-router";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useRef, useState, useEffect, useContext } from "react";
import FormElement from "../components/FormElement";
import Layers from "../components/Layers";
import { BiSolidUserRectangle } from "react-icons/bi";
import Canvas from "../components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../Context/authContext";
import axios from "axios";

function Form() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const saveRef = useRef();
  saveRef.current = Save;

  let navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
      question: getDefaultQuestion(item.title),
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
      "choice matrix": "Select all that Apply",

      checkbox: "Select all that apply:",
    };
    return questionMap[title?.toLowerCase?.()] || "";
  };

  const getQuestionType = (title) => {
    const typeMap = {
      contact: "contact",
      "multiple choice": "multiple_choice",
      "long text": "long_text",
      "choice matrix": "choice_matrix",
      "paragraph": "paragraph",
      "heading": "heading",
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

  const handleDuplicateQuestion = (questionId) => {
    setPages((prev) => {
      const updated = [...prev];
      const currentPage = { ...updated[currentPageIndex] };

      const questionIndex = currentPage.questions.findIndex(
        (q) => q.id === questionId
      );

      if (questionIndex !== -1) {
        const questionToDuplicate = currentPage.questions[questionIndex];

        const duplicatedQuestion = {
          ...questionToDuplicate,
          id: uuidv4(),
          order: questionToDuplicate.order + 1,
        };

        const copy = [...currentPage.questions];
        copy.splice(questionIndex + 1, 0, duplicatedQuestion);
        copy.forEach((q, idx) => {
          q.order = idx + 1;
        });
        currentPage.questions = copy;
        updated[currentPageIndex] = currentPage;
      }
      return updated;
    });
  };

  const handleReorderQuestions = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setPages((prev) => {
      const updated = [...prev];
      const current = { ...updated[currentPageIndex] };
      const copy = [...current.questions];
      const f = Math.max(0, Math.min(copy.length - 1, fromIndex));
      const t = Math.max(0, Math.min(copy.length - 1, toIndex));
      const [moved] = copy.splice(f, 1);
      if (typeof moved === "undefined") return prev;
      copy.splice(t, 0, moved);
      copy.forEach((q, idx) => (q.order = idx + 1));
      current.questions = copy;
      updated[currentPageIndex] = current;
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
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    } else if (indexToRemove < currentPageIndex) {
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
    { Icon: BiSolidUserRectangle, title: "Linear Scale" },
    { Icon: BiSolidUserRectangle, title: "Dropdown" },
    { Icon: BiSolidUserRectangle, title: "Paragraph" },
    { Icon: BiSolidUserRectangle, title: "Heading" },
    { Icon: BiSolidUserRectangle, title: "Choice Matrix" },
    { Icon: BiSolidUserRectangle, title: "Switch" },
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (saveRef.current) {
        saveRef.current();
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  async function Save() {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND}/api/Form/save/${id}`, {
        userId: user.id,
        title: titleValue,
        formData: pages,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchFormData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Form/${id}`
        );
        setPages(
          Array.isArray(res.data.formData)
            ? res.data.formData
            : [{ id: 1, questions: [] }]
        );

        setTitleValue(res.data.title);
        console.log(res.data.formData);
      } catch (err) {
        console.log(err);

        if (err.response) {
          if (err.response.status === 404) {
            setError("Form not found");
          } else if (err.response.status === 403) {
            setError("Access forbidden. You do not have permission.");
          } else {
            setError("An unexpected error occurred.");
          }
        } else {
          setError("Network error or server is unreachable.");
        }
      }
    }
    if (id) {
      fetchFormData();
    }
  }, [id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="h-dvh w-full bg-(--white) overflow-hidden">
          <header className="flex items-center justify-between  bg-(--white) pt-8 pb-8 px-10 pr-12 relative z-50">
            <div className="inline-flex items-center gap-7 bg-(--white)">
              <Link to={"/"}>
                <p className="cursor-pointer text-3xl">
                  <FaHome />
                </p>
              </Link>
              <div className="relative inline-flex items-center z-50 bg-(--white) ">
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
              <button
                onClick={handleExportData}
                className=" px-10 py-1.5 rounded-xl bg-(--white) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-gray-300 transition-color duration-200 ease-out"
              >
                Preview
              </button>
              <button className=" px-10 py-1.5 rounded-xl bg-(--white) ring ring-(--purple) inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 transition-color duration-200 ease-out">
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
            <div className="w-[20%] p-2  z-10 bg-(--white)  border-t-2 border-(--dirty-white)">
              {/* searchbox nga */}
              <div className="grid grid-cols-3 w-full gap-3 p-2 m-auto">
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
                onDuplicateQuestion={handleDuplicateQuestion}
                onAddPage={handleAddPage}
                onRemovePage={handleRemovePage}
                currentPageIndex={currentPageIndex}
                pageNumber={currentPageIndex + 1}
                totalPages={pages.length}
                onPageChange={setCurrentPageIndex}
              />
            </div>
            {/* right side */}
            <div className="h-full w-[20%] z-10 bg-(--white) p-7.5  border-t-2 border-(--dirty-white) font-vagrounded">
              <div className="w-full">
                <h1 className="text-3xl text-left">Layers</h1>
              </div>
              <div className="w-full mt-4">
                <Layers
                  questions={pages[currentPageIndex]?.questions || []}
                  onReorder={handleReorderQuestions}
                  onDelete={handleDeleteQuestion}
                />
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </>
  );
}
export default Form;
