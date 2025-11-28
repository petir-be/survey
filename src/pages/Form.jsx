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
import { IoSettingsSharp } from "react-icons/io5";
import * as motion from "motion/react-client";
import { MdPreview } from "react-icons/md";

import {
  IoMenu,
  IoMail,
  IoDocumentText,
  IoToggleSharp,
  IoCheckbox,
} from "react-icons/io5";
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import { HiMiniH1, HiMiniArrowsUpDown } from "react-icons/hi2";
import { HiMenuAlt4, HiUpload } from "react-icons/hi";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { RiPhoneFill } from "react-icons/ri";

function Form() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [publicid, setPublicid] = useState("");
  const saveRef = useRef();
  saveRef.current = Save;

  const [showSettings, setShowSettings] = useState(false);
  const [reviewEnabled, setReviewEnabled] = useState(false);
  const [multiEnabled, setMultiEnabled] = useState(false);

  const toggleReview = () => setReviewEnabled((prev) => !prev);
  const toggleMulti = () => setMultiEnabled((prev) => !prev);

  const dropdownRef = useRef(null);

  // for settings modal lang click outside == disappear
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    }

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

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
      "short text": "Please provide your answer:",
      "choice matrix": "Select all that Apply",
      email: "Email Address",
      "phone number": "Phone Number",
      "file uploader": "Upload a file",

      checkbox: "Select all that apply:",
    };
    return questionMap[title?.toLowerCase?.()] || "";
  };

  const getQuestionType = (title) => {
    const typeMap = {
      contact: "contact",
      "multiple choice": "multiple_choice",
      "long text": "long_text",
      "short text": "short_text",
      "choice matrix": "choice_matrix",
      paragraph: "paragraph",
      heading: "heading",
      dropdown: "dropdown",
      email: "email",
      "phone number": "phone_number",
      "file uploader": "file_uploader",
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

      if (questionIndex === -1) return prev;

      const original = currentPage.questions[questionIndex];

      // MULTIPLE CHOICE → option = { id, label }
      const deepCopyMCOptions = (options = []) =>
        options.map((opt) => ({
          id: uuidv4(),
          label: opt.label,
        }));

      const deepCopyStringOptions = (options = []) =>
        options.map((opt) => (typeof opt === "string" ? opt : opt.label));

      const deepCopyMatrix = (matrix = {}) => ({
        rows: (matrix.rows || []).map((r) => ({ ...r, id: uuidv4() })),
        columns: (matrix.columns || []).map((c) => ({ ...c, id: uuidv4() })),
      });

      const duplicated = {
        id: uuidv4(),
        type: original.type,
        question: original.question || "",
        required: !!original.required,
        description: original.description || "",
        order: original.order + 1,
      };

      if (original.type === "multiple_choice") {
        duplicated.options = deepCopyMCOptions(original.options);
      }

      if (["dropdown", "checkbox"].includes(original.type)) {
        duplicated.options = deepCopyStringOptions(original.options);
      }

      if (original.type === "choice_matrix") {
        duplicated.matrix = deepCopyMatrix(original.matrix);
      }

      if (original.placeholder) duplicated.placeholder = original.placeholder;
      if (original.defaultValue)
        duplicated.defaultValue = original.defaultValue;

      const newQuestions = [...currentPage.questions];
      newQuestions.splice(questionIndex + 1, 0, duplicated);

      newQuestions.forEach((q, idx) => (q.order = idx + 1));

      currentPage.questions = newQuestions;
      updated[currentPageIndex] = currentPage;

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

  // const handleExportData = () => {
  //   const allData = pages.map((page, idx) => ({
  //     page: idx + 1,
  //     questions: page.questions,
  //   }));
  //   console.log(JSON.stringify(allData, null, 2));
  //   alert("Data exported to console!");
  // };

  const types = [
    // frequently used
    { Icon: IoMenu, foreKulay: "", bgKulay: "", title: "Long Text" },
    {
      Icon: IoEllipsisHorizontalCircleSharp,
      foreKulay: "",
      bgKulay: "",
      title: "Multiple Choice",
    },
    { Icon: IoMail, foreKulay: "", bgKulay: "", title: "Email" },

    // display text
    { Icon: HiMiniH1, foreKulay: "", bgKulay: "", title: "Heading" },
    { Icon: IoDocumentText, foreKulay: "", bgKulay: "", title: "Paragraph" },

    // choices
    {
      Icon: BsGrid3X3GapFill,
      foreKulay: "",
      bgKulay: "",
      title: "Choice Matrix",
    },
    {
      Icon: IoEllipsisHorizontalCircleSharp,
      foreKulay: "",
      bgKulay: "",
      title: "Multiple Choice",
    },
    { Icon: IoCheckbox, foreKulay: "", bgKulay: "", title: "Checkbox" },
    { Icon: IoToggleSharp, foreKulay: "", bgKulay: "", title: "Switch" },
    { Icon: HiMiniArrowsUpDown, foreKulay: "", bgKulay: "", title: "Dropdown" },
    {
      Icon: BiSolidUserRectangle,
      foreKulay: "",
      bgKulay: "",
      title: "Linear Scale",
    },

    // text
    { Icon: IoMenu, foreKulay: "", bgKulay: "", title: "Long Text" },
    { Icon: HiMenuAlt4, foreKulay: "", bgKulay: "", title: "Short Text" },
    {
      Icon: BiSolidUserRectangle,
      foreKulay: "",
      bgKulay: "",
      title: "Contact",
    },

    //others
    { Icon: RiPhoneFill, foreKulay: "", bgKulay: "", title: "Phone Number" },
    { Icon: IoMail, foreKulay: "", bgKulay: "", title: "Email" },
    { Icon: HiUpload, foreKulay: "", bgKulay: "", title: "File Uploader" },
  ];

  const [titleValue, setTitleValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const spanRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current && containerRef.current) {
      const maxWidth = containerRef.current.offsetWidth;
      const newWidth = Math.min(spanRef.current.offsetWidth + 25, maxWidth);
      inputRef.current.style.width = `${newWidth}px`;
    }
  }, [titleValue]);

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
        setPublicid(res.data.publicId);
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
    const intervalId = setInterval(() => {
      if (saveRef.current) {
        saveRef.current();
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

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
        <div className="h-dvh w-full bg-(--white) flex flex-col overflow-x-hidden">
          <header className="flex items-center justify-between bg-(--white) pt-8 pb-8 px-10 pr-12 relative z-50 border-b-2 border-(--dirty-white)">
            <div className="inline-flex items-center gap-7 bg-(--white) flex-1 min-w-0">
              <Link to={"/"}>
                <FaHome className="text-3xl cursor-pointer" />
              </Link>
              <div
                ref={containerRef}
                className="relative inline-flex items-center z-50 bg-(--white) max-w-1/3 flex-1 min-w-0"
              >
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
                  className={`text-(--black) placeholder:text-gray-600 text-xl py-1 px-2 rounded-lg transition-all relative duration-200 focus:outline-none focus:ring ring-black ${
                    !isFocused && titleValue ? "truncate" : ""
                  }`}
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={{ width: "180px" }}
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-4 flex-shrink-0">
              <Link to={`../preview/${publicid}`}>
                <button className="px-10 py-1.5 rounded-xl bg-(--white) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-gray-300 transition-color duration-200 ease-out">
                  Preview
                </button>
              </Link>
              <button className="px-10 py-1.5 rounded-xl bg-(--white) ring ring-(--purple) inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 transition-color duration-200 ease-out">
                Share
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSettings((show) => !show)}
                  className="bg-transparent ease-out flex items-center justify-center rounded-full"
                >
                  <IoSettingsSharp className="text-3xl hover:scale-[1.05] transition-all duration-200 ease-out" />
                </button>
                {showSettings && (
                  <>
                    <span className="bg-(--white) border border-(--purple) rotate-45 w-5 h-5 absolute top-10 rounded translate-x-1/2 right-1/2"></span>
                    <div className="absolute min-w-50 w-83 top-11 py-3 -right-2 bg-(--white) border border-(--purple) rounded shadow-lg z-50">
                      <div className="flex flex-col w-full gap-2">
                        {/* Review Page */}
                        <div className="w-full px-3 py-2 hover:bg-(--dirty-white) flex items-center justify-between">
                          <span className="text-md flex gap-2 items-center font-vagrounded">
                            <MdPreview className="text-5xl" />
                            <span className="flex flex-col">
                              Review Page
                              <span className="text-xs">
                                Let users review their submission
                              </span>
                            </span>
                          </span>

                          <button
                            onClick={toggleReview}
                            style={{
                              width: 45,
                              height: 21,
                              backgroundColor: reviewEnabled
                                ? "#9911ff"
                                : "#ccc",
                              borderRadius: 30,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: reviewEnabled
                                ? "flex-end"
                                : "flex-start",
                              padding: 3,
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <motion.div
                              layout
                              style={{
                                width: 15,
                                height: 15,
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
                        </div>

                        {/* Multiple Submission */}
                        <div className="w-full px-3 py-2 hover:bg-(--dirty-white) flex items-center justify-between">
                          <span className="text-md flex gap-2 items-center font-vagrounded">
                            <MdPreview className="text-5xl" />
                            <span className="flex flex-col">
                              Multiple Submission
                              <span className="text-xs">
                                Allows user to answer multiple times
                              </span>
                            </span>
                          </span>

                          <button
                            onClick={toggleMulti}
                            style={{
                              width: 45,
                              height: 21,
                              backgroundColor: multiEnabled
                                ? "#9911ff"
                                : "#ccc",
                              borderRadius: 30,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: multiEnabled
                                ? "flex-end"
                                : "flex-start",
                              padding: 3,
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <motion.div
                              layout
                              style={{
                                width: 15,
                                height: 15,
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
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button>
                <FaUserCircle className="text-3xl hover:scale-[1.05] transition-all duration-200 ease-out" />
              </button>
            </div>
          </header>

          <div className="flex-1 w-full flex overflow-hidden min-h-0">
            {/* leftside */}
            <div className="w-[20%] min-w-[300px] p-2 z-10 bg-(--white) h-full min-h-0 border-t-2 overflow-y-auto border-(--dirty-white)">
              {/* elements*/}
              {/* Frequently Used */}
              <span className="text-gray-500 font-vagrounded m-3">
                Frequently used
              </span>
              <div className="grid grid-cols-3 mb-4 w-full gap-3 p-2 m-auto ">
                {types.slice(0, 3).map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>

              {/* Display Text */}
              <span className="text-gray-500 font-vagrounded m-3 mt-5">
                Display Text
              </span>
              <div className="grid grid-cols-3 mb-4 w-full gap-3 p-2 m-auto">
                {types.slice(3, 5).map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>

              {/* Choices */}
              <span className="text-gray-500 font-vagrounded m-3 mt-5">
                Choices
              </span>
              <div className="grid grid-cols-3 mb-4 w-full gap-3 p-2 m-auto">
                {types.slice(5, 11).map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>

              {/* Text */}
              <span className="text-gray-500 font-vagrounded m-3 mt-5">
                Text
              </span>
              <div className="grid grid-cols-3 mb-4 w-full gap-3 p-2 m-auto">
                {types.slice(11, 13).map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>

              {/* Others */}
              <span className="text-gray-500 font-vagrounded m-3 mt-5">
                Others
              </span>
              <div className="grid grid-cols-3 mb-4 w-full gap-3 p-2 m-auto">
                {types.slice(13, 17).map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>
            </div>

            {/* mid */}
            <div className="h-screen w-[60%] min-h-0 border-2 border-(--dirty-white) py-7 flex flex-col">
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
            <div className="flex flex-col relative h-full w-[20%] z-10 bg-(--white) p-7.5 pr-0 min-h-0 border-t-2 border-(--dirty-white) font-vagrounded overflow-auto">
              <div className="w-full">
                <h1 className="text-3xl text-left">Layers</h1>
              </div>
              <div className="w-full mt-4 max-h-10/12 overflow-auto">
                <Layers
                  questions={pages[currentPageIndex]?.questions || []}
                  onReorder={handleReorderQuestions}
                  onDelete={handleDeleteQuestion}
                />
              </div>
              <div className="flex w-14/15 mt-3 border border-t-(--dirty-white) border-transparent "></div>
            </div>
          </div>
        </div>
      </DndProvider>
    </>
  );
}
export default Form;
