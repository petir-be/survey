import { Link, useNavigate, useParams } from "react-router";
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
import { motion, AnimatePresence } from "framer-motion";

import { BiSelectMultiple } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { MdPreview } from "react-icons/md";


import { FaHome, FaUserCircle, FaCopy } from "react-icons/fa";
import {
  IoMenu,
  IoMail,
  IoDocumentText,
  IoToggleSharp,
  IoCheckbox,
  IoShareSocialSharp,
} from "react-icons/io5";
import { IoEllipsisHorizontalCircleSharp, IoDownload } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaArrowUp } from "react-icons/fa6";

import { HiMiniH1, HiMiniArrowsUpDown } from "react-icons/hi2";
import { HiMenuAlt4, HiUpload } from "react-icons/hi";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { RiPhoneFill } from "react-icons/ri";
import { BsFillSendXFill } from "react-icons/bs";
import Modal from "../components/Modal";
import Results from "./Results";

function Form() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [publicid, setPublicid] = useState("");
  const saveRef = useRef();
  saveRef.current = Save;
  const [shareLoading, setShareLoading] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [allowMultipleSubmissionsValue, setAllowMultipleSubmissionValue] =
    useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [hasReviewPage, setHasReviewPage] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copy, setCopy] = useState(false);
  const [copyQR, setCopyQR] = useState(false);

  const [resultPage, setResultPage] = useState(false);

  const toggleReview = () => setHasReviewPage((prev) => !prev);
  const toggleMulti = () => setAllowMultipleSubmissionValue((prev) => !prev);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const qrCodeRef = useRef(null);
  let timeout = 2000;

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target);
      const clickedPublishButton =
        triggerRef.current && triggerRef.current.contains(event.target);
      const clickedSettingsButton =
        settingsBtnRef.current && settingsBtnRef.current.contains(event.target);

      if (clickedPublishButton || clickedSettingsButton) {
        return;
      }

      if (clickedOutsideDropdown) {
        setShowSettings(false);
        setShowPublishModal(false);
      }
    }

    if (showSettings || showPublishModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings, showPublishModal, dropdownRef, triggerRef, settingsBtnRef]);

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
        // console.log(res.data);
        setAllowMultipleSubmissionValue(res.data.allowMultipleSubmissions);
        setIsPublished(res.data.isPublished);
        setHasReviewPage(res.data.hasReviewPage);
        // console.log(res.data.formData);
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
        allowMultipleSubmissions: allowMultipleSubmissionsValue,
        hasReviewPage: hasReviewPage,
        isPublished: isPublished,
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

  function PublishForm(e) {
    e.stopPropagation();
    timeout = 100;

    //walang loading pag close ng share modal
    if (isPublished && showPublishModal) {
      setShowPublishModal((prev) => !prev);
      setShareLoading(false);
      setShowSettings(false);

      return;
    }

    //delay ng loading sa publishing
    if (!isPublished) {
      timeout = 2000;
    }
    setShareLoading(true);
    setShowSettings(false);

    setTimeout(() => {
      //publish na para may loading parin pag open ng share
      if (isPublished) {
        setShowPublishModal((prev) => !prev);
        setShareLoading(false);
        setShowSettings(false);

        return;
      }

      //publish palang
      setIsPublished(true);
      toast.success("Form successfully published!");
      setShowPublishModal(true);
      setShareLoading(false);
    }, timeout);
  }

  // ------------------PAKIPALITAN PAG NAKA UPLOAD NA------------------
  function handleCopyButton() {
    // navigator.clipboard.writeText(`https://[websitename]/form/${publicid}`);
    navigator.clipboard.writeText(`localhost:5173/form/${publicid}`);
    toast.success("Link copied successfully!");
    setCopy(true);
  }

  function useQRCodeDownloader(qrRef, filename) {
    return () => {
      const canvas = qrRef.current;
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      // Wait a tick to ensure canvas is painted
      setTimeout(() => {
        try {
          const pngUrl = canvas.toDataURL("image/png");

          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = `${filename}.png`;
          link.click();
        } catch (err) {
          console.error("Failed to generate PNG:", err);
        }
      }, 50); // 50ms delay
    };
  }

  const handleCopyQRImage = async () => {
    const canvas = qrCodeRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to Blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Use Clipboard API
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);

        toast.success("QR copied successfully!");
        setCopyQR(true);
      });
    } catch (err) {
      toast.error("Failed to copy QR image:", err);
    }
  };

  const handleDownloadQR = useQRCodeDownloader(qrCodeRef, `form-${publicid}`);

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
      <Toaster position="top-right" />
      <DndProvider backend={HTML5Backend}>
        <div className="h-dvh w-full bg-(--white) flex flex-col overflow-x-hidden">
          <header className="flex items-center justify-between bg-(--white) pt-8 pb-8 px-10 pr-12 relative z-50 border border-transparent border-b-(--dirty-white)">
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

            <div className="inline-flex items-center gap-7 bg-(--white) flex-1 min-w-0">
              {/* <Link to={`/newform/${id}`}> */}
              <div onClick={() => setResultPage(false)} className="group min-w-1/4 justify-center items-center  px-8 py-1 relative flex flex-col border-2 border-(--dirty-white) ">
                <div className="absolute flex items-center justify-center top-0 right-0 w-4 h-4 bg-(--dirty-white)">
                  <button className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                    <FaArrowUp className="text-xs rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                    <FaArrowUp
                      className=" text-xs absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-400 ease-out"
                      fill="purple"
                    />
                  </button>
                </div>
                <p className="text-md font-vagrounded mt-1 font-bold">
                  Questions
                </p>
              </div>
              {/* </Link> */}

              {/* <Link to={`/newform/${id}/responses`}> */}
              <div
                onClick={() => setResultPage(true)}
                className="group min-w-1/4 justify-center items-center px-8 py-1 relative flex flex-col border-2 border-(--dirty-white) "
              >
                <div className="absolute flex items-center justify-center top-0 right-0 w-4 h-4 bg-(--dirty-white)">
                  <button className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                    <FaArrowUp className="text-xs rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                    <FaArrowUp
                      className="text-xs absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-400 ease-out"
                      fill="purple"
                    />
                  </button>
                </div>
                <p className="text-md font-vagrounded mt-1 font-bold">
                  Responses
                </p>
              </div>
              {/* </Link> */}
            </div>

            <div className="inline-flex items-center gap-4 shrink-0">
              <Link to={`../preview/${publicid}`}>
                <button className="px-7 py-1.5 rounded-xl bg-(--white) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-gray-300 transition-color duration-200 ease-out">
                  Preview
                </button>
              </Link>
              <div className="relative">
                <button
                  onClick={PublishForm}
                  disabled={shareLoading}
                  ref={triggerRef}
                  className="flex items-center gap-2 px-7 py-1.5 rounded-xl bg-(--white) ring ring-(--purple) 
             inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 
             transition-color duration-200 ease-out disabled:opacity-60"
                >
                  {shareLoading ? (
                    <span className="w-6 h-6 border-2 border-(--purple) border-t-transparent rounded-full animate-spin"></span>
                  ) : isPublished ? (
                    <>
                      <IoShareSocialSharp className="text-lg" /> Share
                    </>
                  ) : (
                    "Publish"
                  )}
                </button>
                <AnimatePresence>
                  {showPublishModal && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{ transformOrigin: "top right" }}
                      className="absolute top-12 right-0 z-50"
                    >
                      {/* Pointer triangle */}
                      <span className="bg-(--white) border -z-10 border-(--purple) rotate-45 w-5 h-5 absolute -top-1 right-5 rounded"></span>

                      {/* Modal Box */}
                      <div className="font-vagrounded min-w-100 w-80 py-4 px-2 bg-(--white) border border-(--purple) rounded shadow-lg">
                        <div className="gap-1 px-3 flex-col flex">
                          <p className="text-xl">Share Link</p>

                          <div className="flex w-full gap-2 items-center">
                            <p className="text-sm flex-1 font-sans line-clamp-1 border-2 border-(--dirty-white) rounded-md p-2 truncate">
                              {`localhost:5173/form/${publicid}`}
                            </p>

                            <button
                              onClick={handleCopyButton}
                              className="flex items-center justify-center gap-2 text-sm p-2 border-(--purple) bg-(--purple-lighter) hover:bg-[#b099f5] transition-all duration-200 ease-out border-2 rounded-lg px-4"
                            >
                              {copy ? (
                                <IoIosCheckmarkCircle className="text-xl" />
                              ) : (
                                <FaCopy className="text-xl" />
                              )}
                              {copy ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 px-3 my-2">
                          <hr className="flex-1 border-gray-400" />
                          <p className="text-sm text-gray-500 font-vagrounded">
                            or
                          </p>
                          <hr className="flex-1 border-gray-400" />
                        </div>
                        <p className="px-3 text-xl font-vagrounded">
                          Get the QR Code
                        </p>
                        <p className="px-3 text-gray-500 text-sm font-vagrounded">
                          Scan the code to launch your form
                        </p>

                        {/* // ------------------PAKIPALITAN PAG NAKA UPLOAD NA------------------  */}
                        <div className="flex px-3 mt-3 gap-2 ">
                          <QRCodeCanvas
                            bgColor="#dfe0f0"
                            value={`localhost:5173/form/${publicid}`}
                            size={220}
                            ref={qrCodeRef}
                          />
                          <div className="flex flex-col font-vagrounded flex-1 justify-center gap-3">
                            <button
                              onClick={handleCopyQRImage}
                              className="flex hover:bg-(--white) transition-all duration-200 ease-out bg-(--dirty-white) justify-center items-center gap-2 text-md p-2 border-2 border-(--black-lighter) rounded-lg "
                            >
                              {copyQR ? (
                                <IoIosCheckmarkCircle className="text-xl" />
                              ) : (
                                <FaCopy className="text-xl" />
                              )}
                              {copyQR ? "Copied" : "Copy Code"}
                            </button>
                            <button
                              onClick={handleDownloadQR}
                              className="flex bg-(--white) justify-center items-center gap-1 text-md p-2 border-2 border-(--black-lighter) rounded-lg "
                            >
                              <IoDownload className="text-2xl" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowSettings((show) => !show);
                    setShowPublishModal(false);
                  }}
                  ref={settingsBtnRef}
                  className="bg-transparent ease-out flex items-center justify-center rounded-full"
                >
                  <IoSettingsSharp className="text-3xl hover:scale-[1.05] transition-all duration-200 ease-out" />
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{ transformOrigin: "top right" }}
                      className="absolute top-11 right-0 z-50"
                    >
                      <span className="bg-(--white) -z-10 border border-(--purple) rotate-45 w-5 h-5 absolute -top-1 right-2 rounded"></span>
                      <div className="min-w-50 w-83 py-3 z-10 bg-(--white) border border-(--purple) rounded shadow-lg">
                        <div className="flex flex-col w-full gap-2">
                          <div className="w-full px-3 py-2 hover:bg-(--dirty-white) flex items-center justify-between">
                            <span className="text-md flex gap-2 items-center font-vagrounded">
                              <MdPreview className="text-3xl" />
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
                                backgroundColor: hasReviewPage
                                  ? "#9911ff"
                                  : "#ccc",
                                borderRadius: 30,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: hasReviewPage
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
                              <BiSelectMultiple className="text-3xl" />
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
                                backgroundColor: allowMultipleSubmissionsValue
                                  ? "#9911ff"
                                  : "#ccc",
                                borderRadius: 30,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: allowMultipleSubmissionsValue
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

                          {/* UNPUBLISH BUTTOn  */}
                          <div className="flex items-center justify-center gap-4 px-3">
                            <hr className="flex-1 border-gray-400" />
                          </div>
                          <div
                            onClick={() => {
                              isPublished ? setShowUnpublishModal(true) : null;
                            }}
                            className={`w-full px-3 py-2 flex items-center justify-between ${
                              isPublished
                                ? "hover:bg-(--dirty-white) "
                                : "opacity-50 hover:none disable"
                            }`}
                          >
                            <span className="text-md flex gap-2 items-center font-vagrounded">
                              <BsFillSendXFill className="text-2xl font-bold" />
                              <span className="flex flex-col">
                                Unpublish Form
                                <span className="text-xs">
                                  The form will no longer be visible to
                                  responders.
                                </span>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button>
                <FaUserCircle className="text-3xl hover:scale-[1.05] transition-all duration-200 ease-out" />
              </button>
            </div>
          </header>

          {resultPage && (
            <>
              <Results />
            </>
          )}

          {!resultPage && (
            <>
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
            </>
          )}

          <Modal
            isOpen={showUnpublishModal}
            close={() => setShowUnpublishModal(false)}
            title="Unpublish form"
          >
            <p>
              The form will no longer be visible to responders. Responders will
              see a blank page if they open the form link. Form editors can
              still make changes and publish the form again.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowUnpublishModal(false)}
                className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPublished(false);
                  setShowUnpublishModal(false);
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Unpublish
              </button>
            </div>
          </Modal>
        </div>
      </DndProvider>
    </>
  );
}
export default Form;
