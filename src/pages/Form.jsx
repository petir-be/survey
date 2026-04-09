import { Link, useNavigate, useParams } from "react-router";
import { FaHome, FaUserCircle, FaSpinner } from "react-icons/fa"; // Added FaSpinner
import React, { useContext, useState, useEffect, useRef } from "react";
import FormElement from "../components/FormElement";
import Layers from "../components/Layers";
import { BiSolidUserRectangle } from "react-icons/bi";
import Canvas from "../components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../Context/authContext";
import axios from "axios";

import * as motion from "motion/react-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { BiSelectMultiple } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { MdPreview } from "react-icons/md";
import { QRCodeCanvas } from "qrcode.react";
import { FaCopy } from "react-icons/fa";
import { debounce } from "lodash"; // or use lodash.debounce
import {
  IoMenu,
  IoMail,
  IoDocumentText,
  IoToggleSharp,
  IoCheckbox,
  IoShareSocialSharp, IoSettingsSharp, IoChevronForward,
  IoChevronBack
} from "react-icons/io5";
import { IoEllipsisHorizontalCircleSharp, IoDownload } from "react-icons/io5";
import { MdLinearScale } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaArrowUp } from "react-icons/fa6";
import AccountModal from "../components/AccountModal";
import { HiMiniH1, HiMiniArrowsUpDown } from "react-icons/hi2";
import { HiMenuAlt4, HiUpload, HiMenu } from "react-icons/hi";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { RiPhoneFill } from "react-icons/ri";
import { BsFillSendXFill } from "react-icons/bs";
import Modal from "../components/Modal";
import Results from "./Results";
import Loading from "../components/Loading";
import { useMediaQuery } from "react-responsive";

function Form() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const { user, isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('questions');

  // Helper function for conditional classes
  const getTabStyles = (tabName) => {
    const isActive = activeTab === tabName;
    return `
      justify-center px-8 py-4 relative flex flex-col border-2 duration-200 transition-all outline-none
      ${isActive
        ? 'bg-[#1e1e1e] border-green-500' // The "Focused" look
        : 'bg-black border-[var(--dirty-white)] hover:bg-[#1e1e1e] hover:border-green-500'
      }
    `;
  };
  const { id } = useParams();
  const [publicid, setPublicid] = useState("");
  const saveRef = useRef();
  // saveRef.current = Save;
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

  const [showMobileLayers, setShowMobileLayers] = useState(false);
  const layersRef = useRef(null);

  const [showMobileElements, setShowMobileElements] = useState(false);

  const toggleReview = () => {
    setHasReviewPage((prev) => !prev);
    setHasUnsavedChanges(true);
  };
  const toggleMulti = () => {
    setAllowMultipleSubmissionValue((prev) => !prev);
    setHasUnsavedChanges(true);
  };
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const qrCodeRef = useRef(null);
  const isFirstRender = useRef(true);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let timeout = 2000;

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: responses = [], isLoading: responsesLoading } = useQuery({
    queryKey: ["formResponses", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/Response/responses/${id}`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

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
      setHasUnsavedChanges(true);

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
    setHasUnsavedChanges(true);
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
      switch: "Toggle switch options:",
      dropdown: "Select one option:",

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
      switch: "switch",
      checkbox: "checkbox",
    };
    return typeMap[title?.toLowerCase?.()] || "text";
  };

  const handleAddPage = () => {
    setPages((prev) => [...prev, { id: uuidv4(), questions: [] }]);
    setCurrentPageIndex(pages.length);

    setHasUnsavedChanges(true);
  };
  const handleDeleteQuestion = (questionId) => {
    setPages((prev) => {
      const updated = [...prev];
      const currentPage = { ...updated[currentPageIndex] };
      currentPage.questions = currentPage.questions
        .filter((q) => q.id !== questionId)
        .map((q, idx) => ({ ...q, order: idx + 1 }));
      updated[currentPageIndex] = currentPage;
      setHasUnsavedChanges(true);
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

      setHasUnsavedChanges(true);

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
      setHasUnsavedChanges(true);
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

    setHasUnsavedChanges(true);
  };

  const types = [
    // frequently used
    { Icon: HiMenu, title: "Long Text" },
    { Icon: IoEllipsisHorizontalCircleSharp, title: "Multiple Choice" },
    { Icon: IoMail, title: "Email" },

    // display text
    { Icon: HiMiniH1, title: "Heading" },
    { Icon: IoDocumentText, title: "Paragraph" },

    // choices
    { Icon: BsGrid3X3GapFill, title: "Choice Matrix" },
    { Icon: IoEllipsisHorizontalCircleSharp, title: "Multiple Choice" },
    { Icon: IoCheckbox, title: "Checkbox" },
    { Icon: IoToggleSharp, title: "Switch" },
    { Icon: HiMiniArrowsUpDown, title: "Dropdown" },

    // text
    { Icon: HiMenu, title: "Long Text" },
    { Icon: HiMenuAlt4, title: "Short Text" },

    //others
    { Icon: RiPhoneFill, title: "Phone Number" },
    { Icon: IoMail, title: "Email" },
    { Icon: HiUpload, title: "File Uploader" },
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


  const { data: formData, isLoading: formLoading, error: formError } = useQuery({
    queryKey: ["formData", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/Form/${id}`);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // 2. SEED LOCAL STATE (Sync Server State -> Local UI State)
  useEffect(() => {
    if (formData && isFirstRender.current) {
      setPages(Array.isArray(formData.formData) ? formData.formData : [{ id: 1, questions: [] }]);
      setTitleValue(formData.title || "Untitled Form");
      setPublicid(formData.publicId);
      setAllowMultipleSubmissionValue(formData.allowMultipleSubmissions);
      setIsPublished(formData.isPublished);
      setHasReviewPage(formData.hasReviewPage);

      isFirstRender.current = false; // Prevent re-seeding on subsequent renders
    }
  }, [formData]);

  const loading = formLoading || responsesLoading;
  const error = formError?.message || null;


  useEffect(() => {
    if (loading || !hasUnsavedChanges || isFirstRender.current) return;

    const timeoutId = setTimeout(() => {
      saveMutation.mutate({
        userId: user.id,
        title: titleValue,
        formData: pages,
        allowMultipleSubmissions: allowMultipleSubmissionsValue,
        hasReviewPage: hasReviewPage,
        isPublished: isPublished,
      });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [pages, titleValue, allowMultipleSubmissionsValue, hasReviewPage, isPublished, hasUnsavedChanges]);


  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (savePayload) => {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND}/api/Form/save/${id}`, savePayload);
      return res.data;
    },
    onSuccess: () => {
      console.log("Saved successfully");
      setHasUnsavedChanges(false);
      // 2. This forces the Workspace page to refetch the new title
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
    onError: (error) => {
      console.error("Save failed", error);
      toast.error("Failed to auto-save changes.");
    }
  });
  useEffect(() => {
    // Don't save if it's currently fetching, or if there's nothing to save
    if (loading || !hasUnsavedChanges || isFirstRender.current) return;

    // Wait 1.5 seconds after the user stops typing/dragging before hitting the API
    const timeoutId = setTimeout(() => {
      saveMutation.mutate({
        userId: user.id,
        title: titleValue,
        formData: pages,
        allowMultipleSubmissions: allowMultipleSubmissionsValue,
        hasReviewPage: hasReviewPage,
        isPublished: isPublished,
      });
    }, 1500);

    // If the user types again before 1.5s is up, this clears the old timer and starts over!
    return () => clearTimeout(timeoutId);
  }, [
    pages,
    titleValue,
    allowMultipleSubmissionsValue,
    hasReviewPage,
    isPublished,
    hasUnsavedChanges, // <--- This must be true for the timer to start
    loading
  ]);


  function PublishForm(e) {
    e.stopPropagation();


    if (isPublished && showPublishModal) {
      setShowPublishModal(false);
      setShowSettings(false);
      return;
    }

    // Toggle the publish state
    setIsPublished(true);
    setHasUnsavedChanges(true);

    // UI Updates immediately
    toast.success("Form successfully published!");
    setShowPublishModal(true);
    setShowSettings(false);
  }

  function handleTitleUpdate(newTitle) {
    setTitleValue(newTitle);
    setHasUnsavedChanges(true);
  }

  // saving para sa mga instant save like toggle buttons and delete shits
  useEffect(() => {
    // 1. Check if the component is loading or if there are no changes
    if (loading || !hasUnsavedChanges) {
      return;
    }

    const timer = setTimeout(() => {
      Save();
    }, 100);

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, loading]);

  async function Save() {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND}/api/Form/save/${id}`, {
        userId: user.id,
        title: titleValue, // ADD THIS LINE
        formData: pages,
        allowMultipleSubmissions: allowMultipleSubmissionsValue,
        hasReviewPage: hasReviewPage,
        isPublished: isPublished,
      });

      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ["forms"] }); // Add this here too
      console.log("Saved successfully");
    } catch (error) {
      console.log("Save failed", error);
    }
  }
  // ------------------PAKIPALITAN PAG NAKA UPLOAD NA------------------
  function handleCopyButton() {
    // navigator.clipboard.writeText(`https://[websitename]/form/${publicid}`);
    // navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}/form/${publicid}`); 
    navigator.clipboard.writeText(`https://ispecmn.site/form/${publicid}`);
    // navigator.clipboard.writeText(`localhost:5173/form/${publicid}`);
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

  if (loading) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center">
        <Loading />
      </div>
    );
  }

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
      {isDesktopOrLaptop &&
        <>
          <AccountModal
            isOpen={showAccountModal}
            close={() => setShowAccountModal(false)}
            title="Account Information"
          ></AccountModal>
          <Toaster position="top-right" />
          <DndProvider backend={HTML5Backend}>
            <div className="h-dvh w-full bg-black flex flex-col overflow-x-hidden">

              <header className="flex items-center justify-between bg-black pt-4 pb-4 px-5 lg:pt-8 lg:pb-8 lg:px-10 pr-12 relative z-50 border border-transparent border-b-(--dirty-white) lg:pd-4">
                <div className="inline-flex items-center gap-7 flex-1 min-w-0">
                  <Link to={"/"}>
                    <FaHome fill='white' className="text-3xl cursor-pointer" />
                  </Link>
                  <div
                    ref={containerRef}
                    className="relative inline-flex items-center z-50  max-w-2/3 flex-1 min-w-0"
                  >
                    <span
                      ref={spanRef}
                      className="text-[#1E1E1E] invisible absolute whitespace-pre font-medium px-2 text-xl"
                    >
                      {titleValue || "Untitled Form"}
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Untitled Form"
                      className={`text-white placeholder:text-gray-400 text-xl py-1 px-2 rounded-lg transition-all relative duration-200 focus:outline-none focus:ring ring-black ${!isFocused && titleValue ? "truncate" : ""
                        }`}
                      value={titleValue}
                      onChange={(e) => handleTitleUpdate(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={{ width: "180px" }}
                    />
                  </div>
                </div>
                <div className="hidden  lg:flex absolute left-1/2 -translate-x-1/2 gap-5 items-center">
                  <button
                    className="text-left group outline-none rounded-[6px] overflow-hidden"
                    onClick={() => {
                      setResultPage(false);
                      window.location.hash = "questions";
                    }}
                  >
                    <div
                      className={`relative flex flex-col justify-center px-8 py-5 min-w-[200px] rounded-[6px] bg-black border transition-all duration-300 ease-out 
      ${!resultPage
                          ? "border-green-700 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          : "border-zinc-800 group-hover:border-green-800"}`}
                    >
                      {/* Animated Corner Icon */}
                      <div className="absolute top-0 right-0 w-8 h-9 flex items-center justify-center overflow-hidden ">
                        <div
                          className={`absolute top-0 right-0 w-full h-full transition-colors duration-300 
          ${!resultPage ? "bg-green-900" : "bg-zinc-900 group-hover:bg-green-900"}`}
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                        />
                        <div className="relative z-10 p-1 mb-3 ml-3">
                          <FaArrowUp
                            size={12}
                            className={`rotate-45 transition-all duration-300 ease-in-out 
            ${!resultPage ? "-translate-y-8 translate-x-8 opacity-0" : "text-zinc-500 group-hover:-translate-y-8 group-hover:translate-x-8"}`}
                          />
                          <FaArrowUp
                            size={12}
                            className={`absolute inset-0 m-auto text-green-300 rotate-45 transition-all duration-300 ease-in-out 
            ${!resultPage ? "translate-y-0 translate-x-0" : "translate-y-8 -translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0"}`}
                          />
                        </div>
                      </div>

                      <span className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-1 transition-colors duration-300 font-vagrounded
      ${!resultPage ? "text-green-700" : "text-zinc-500 group-hover:text-green-800"}`}>
                        Edit Questions
                      </span>

                      <span className={`font-vagrounded font-semibold text-lg tracking-tight transition-colors duration-300 
      ${!resultPage ? "text-white" : "text-zinc-100 group-hover:text-white"}`}>
                        Questions
                      </span>

                      {/* Bottom Accent Line */}
                      <div className={`absolute bottom-0 left-0 h-[2px] bg-green-700 transition-all duration-500 
      ${!resultPage ? "w-full" : "w-0 group-hover:w-full"}`} />
                    </div>
                  </button>

                  <button
                    className="text-left group outline-none rounded-[6px] overflow-hidden"
                    onClick={() => {
                      setResultPage(true);
                      window.location.hash = "responses";
                    }}
                  >
                    <div
                      className={`relative flex flex-col justify-center px-8 py-5 min-w-[200px] bg-black border transition-all duration-300 ease-out  rounded-[6px]
      ${resultPage
                          ? "border-green-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          : "border-zinc-800 group-hover:border-green-800"}`}
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center overflow-hidden">
                        <div
                          className={`absolute top-0 right-0 w-full h-full transition-colors duration-300
          ${resultPage ? "bg-green-900" : "bg-zinc-900 group-hover:bg-green-900"}`}
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                        />
                        <div className="relative z-10 p-1 mb-3 ml-3">
                          <FaArrowUp
                            size={12}
                            className={`rotate-45 transition-all duration-300 ease-in-out 
            ${resultPage ? "-translate-y-8 translate-x-8 opacity-0" : "text-zinc-500 group-hover:-translate-y-8 group-hover:translate-x-8"}`}
                          />
                          <FaArrowUp
                            size={12}
                            className={`absolute inset-0 m-auto text-green-300 rotate-45 transition-all duration-300 ease-in-out 
            ${resultPage ? "translate-y-0 translate-x-0" : "translate-y-8 -translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0"}`}
                          />
                        </div>
                      </div>

                      <span className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-1 transition-colors duration-300 font-vagrounded
      ${resultPage ? "text-green-700" : "text-zinc-500 group-hover:text-green-800"}`}>
                        View Data
                      </span>

                      <span className={`font-vagrounded font-semibold text-lg tracking-tight transition-colors duration-300 
      ${resultPage ? "text-white" : "text-zinc-100 group-hover:text-white"}`}>
                        Responses
                      </span>

                      <div className={`absolute bottom-0 left-0 h-[2px] bg-green-600 transition-all duration-500 
      ${resultPage ? "w-full" : "w-0 group-hover:w-full"}`} />
                    </div>
                  </button>

                </div>
                <div className="flex-1 flex justify-end items-center gap-4">
                  <button
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    className="lg:hidden flex items-center justify-center"
                  >
                    <HiMenu className="text-3xl " />
                  </button>

                  <div className="hidden lg:inline-flex items-center gap-4 shrink-0">
                    <Link to={`../preview/${publicid}`}>
                      <button className="text-zinc-400 px-6 py-2 rounded-lg bg-zinc-900 border border-zinc-800 font-vagrounded text-sm font-bold 
                      tracking-wider hover:text-white hover:border-zinc-600 transition-all duration-200 ease-out active:scale-95">

                        Preview
                      </button>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={PublishForm}
                        disabled={shareLoading}
                        ref={triggerRef}
                        className={`flex items-center gap-2 px-7 py-2 rounded-lg font-vagrounded text-sm text-white font-bold  tracking-widest transition-all duration-300 ease-out active:scale-95 disabled:opacity-50
        ${isPublished
                            ? "bg-black border border-green-700 text-green-500 hover:bg-green-800 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "bg-green-700 text-black hover:bg-green-800 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                          }`}
                      >
                        {shareLoading ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>) : isPublished ? (
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
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{ transformOrigin: "top right" }}
                            className="absolute top-14 right-0 z-50 w-96"
                          >

                            <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-950 border-t border-l border-green-700/50 rotate-45 z-0"></div>


                            <div className="relative z-10 flex flex-col gap-5 p-5 bg-black text-white border border-green-700/50 rounded-xl shadow-2xl overflow-hidden font-vagrounded">

                              <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-semibold text-gray-100">Share Link</h3>

                                <div className="flex w-full gap-2 items-center">

                                  <div className="flex-1 bg-black border border-gray-700/50 rounded-lg p-2.5 overflow-hidden">
                                    <p className="text-sm text-gray-300 truncate select-all">
                                      {`https://ispecmn.site/form/${publicid}`}
                                    </p>
                                  </div>


                                  <button
                                    onClick={handleCopyButton}
                                    className="flex items-center justify-center gap-2 text-sm font-medium p-2.5 bg-green-600 hover:bg-green-700 transition-colors duration-200 rounded-lg min-w-[95px]"
                                  >
                                    {copy ? (
                                      <IoIosCheckmarkCircle className="text-lg" />
                                    ) : (
                                      <FaCopy className="text-sm" />
                                    )}
                                    {copy ? "Copied" : "Copy"}
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 opacity-60">
                                <hr className="flex-1 border-gray-700" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                  Or
                                </span>
                                <hr className="flex-1 border-gray-700" />
                              </div>

                              <div className="flex gap-3 items-center black p-2.5 border border-gray-800 rounded-lg">

                                <div className="bg-white p-1.5 rounded-md shadow-inner shrink-0">
                                  <QRCodeCanvas
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    value={`https://ispecmn.site/form/${publicid}`}
                                    size={88} // Reduced size heavily
                                    ref={qrCodeRef}
                                  />
                                </div>

                                <div className="flex flex-col flex-1 gap-2">
                                  <div>
                                    <h3 className="text-sm font-semibold text-gray-100 leading-tight">QR Code</h3>
                                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Scan to launch form</p>
                                  </div>

                                  <div className="flex gap-1.5 mt-1">
                                    <button
                                      onClick={handleCopyQRImage}
                                      className="flex-1 flex justify-center items-center gap-1 text-xs py-1.5 px-2 bg-black hover:bg-[#1e1e1e] transition-colors duration-200 border border-gray-700 rounded-md text-gray-200 hover:text-white"
                                    >
                                      {copyQR ? (
                                        <IoIosCheckmarkCircle className="text-sm text-green-500" />
                                      ) : (
                                        <FaCopy className="text-xs" />
                                      )}
                                      {copyQR ? "Copied" : "Copy"}
                                    </button>

                                    <button
                                      onClick={handleDownloadQR}
                                      className="flex-1 flex justify-center items-center gap-1 text-xs py-1.5 px-2 bg-black hover:bg-[#1e1e1e] transition-colors duration-200 border border-gray-700 rounded-md text-gray-200 hover:text-white"
                                    >
                                      <IoDownload className="text-sm" />
                                      Save
                                    </button>
                                  </div>
                                </div>

                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

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
                      <IoSettingsSharp fill="white" className="text-3xl hover:scale-[1.05] transition-all duration-200 ease-out" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          style={{ transformOrigin: "top right" }}
                          className="absolute top-12 right-0 z-50"
                        >

                          <div className="absolute -top-1.5 right-3 w-3 h-3 bg-black border-t border-l border-zinc-800 rotate-45 z-0" />

                          <div className="relative w-80 overflow-hidden bg-black  border border-zinc-800 text-white rounded-xl shadow-2xl shadow-black/50">
                            <div className="flex flex-col p-1">

                              {/* Review Setting */}
                              <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={toggleReview}>
                                <div className="mt-1 text-green-600 text-xl">
                                  <MdPreview />
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <span className="text-sm font-medium text-zinc-100">Allow User Review</span>
                                  <span className="text-xs text-zinc-400 leading-relaxed">Let users check answers before submission</span>
                                </div>
                                <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 mt-1 ${hasReviewPage ? 'bg-green-600' : 'bg-zinc-700'}`}>
                                  <motion.div
                                    animate={{ x: hasReviewPage ? 18 : 2 }}
                                    className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* Multiple Submission */}
                              <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={toggleMulti}>
                                <div className="mt-1 text-green-600 text-xl">
                                  <BiSelectMultiple />
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <span className="text-sm font-medium text-zinc-100">Multiple Submissions</span>
                                  <span className="text-xs text-zinc-400 leading-relaxed">Allows users to answer multiple times</span>
                                </div>
                                <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 mt-1 ${allowMultipleSubmissionsValue ? 'bg-green-600' : 'bg-zinc-700'}`}>
                                  <motion.div
                                    animate={{ x: allowMultipleSubmissionsValue ? 18 : 2 }}
                                    className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* Divider */}
                              <div className="my-1 border-t border-zinc-800 mx-2" />

                              {/* Unpublish Action */}
                              <button
                                disabled={!isPublished}
                                onClick={() => isPublished && setShowUnpublishModal(true)}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-all w-full text-left
              ${isPublished
                                    ? 'hover:bg-red-500/10 group'
                                    : 'opacity-40 cursor-not-allowed'
                                  }`}
                              >
                                <div className={`mt-1 text-xl ${isPublished ? 'text-zinc-400 group-hover:text-red-600' : 'text-zinc-500'}`}>
                                  <BsFillSendXFill />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-sm font-medium ${isPublished ? 'text-zinc-100 group-hover:text-red-600' : 'text-zinc-500'}`}>
                                    Unpublish Form
                                  </span>
                                  <span className="text-xs text-zinc-500">Stop accepting new responses</span>
                                </div>
                              </button>

                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="bg-white h-12 w-12 rounded-full flex justify-center items-center">
                    <img
                      src={user.avatar}
                      onClick={() => setShowAccountModal(true)}
                      className="h-10 w-10 cursor-pointer rounded-full"
                    />
                  </div>
                </div>
              </header>

              {resultPage && (
                <div className="flex-1 w-full overflow-auto ">
                  <Results
                    defaultFormName={titleValue}
                    parentResponses={responses}
                    parentLoading={responsesLoading}
                    parentFormData={pages}
                  />
                </div>
              )}

              {!resultPage && (
                <>
                  <div
                    id="questions"
                    className="flex-1 w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0 scrollbar-vscode"              >
                    <div className="w-[22%] bg-black h-full border-r border-zinc-800 flex flex-col overflow-hidden">
                      <div className="p-6 pb-2">
                        <h2 className="text-green-600 font-vagrounded text-xs uppercase tracking-[0.2em] font-bold">
                          Form Elements
                        </h2>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar">

                        {[
                          { title: "Frequently used", range: [0, 3], color: "#00a651" },
                          { title: "Display Text", range: [3, 5], color: "#00a651" },
                          { title: "Choices", range: [5, 11], color: "#00a651" },
                          { title: "Text", range: [11, 13], color: "#00a651" },
                          { title: "Others", range: [13, 17], color: "#00a651" },
                        ].map((section, idx) => (
                          <div key={idx} className="mb-8">
                            {/* Label */}
                            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4 ml-2">
                              {section.title}
                            </span>

                            {/* Element Grid */}
                            <div className="grid grid-cols-3 gap-2">
                              {types.slice(section.range[0], section.range[1]).map((type, index) => (
                                <FormElement

                                  bgKulay={`${section.color}15`}
                                  foreKulay={section.color}
                                  icon={type.Icon}
                                  title={type.title}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                    <div className="h-screen py-4 flex flex-col w-[60%]">
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

                    <div className="flex flex-col relative h-auto lg:h-full w-full lg:w-[22%] bg-black p-0 min-h-0 border-t lg:border-t-0 lg:border-l border-zinc-800 font-vagrounded overflow-hidden">

                      {/* Header Section */}
                      <div className="p-6 pb-4 flex items-center justify-between border-b border-zinc-900">
                        <div className="flex items-center gap-2">
                          {/* Decorative Green Dot */}
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                          <h1 className="text-zinc-100 text-sm font-bold uppercase tracking-widest">
                            Layers
                          </h1>
                        </div>


                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-green-600 text-[10px] font-mono">
                          {pages[currentPageIndex]?.questions?.length || 0} ITEMS
                        </span>
                      </div>


                      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                        <div className="w-full mt-2">
                          <Layers
                            questions={pages[currentPageIndex]?.questions || []}
                            onReorder={handleReorderQuestions}
                            onDelete={handleDeleteQuestion}
                          />
                        </div>
                      </div>


                      <div className="h-12 border-t border-zinc-900 bg-zinc-950/30 flex items-center px-6">
                        <span className="text-[9px] text-zinc-600 uppercase tracking-tighter">
                          Page {currentPageIndex + 1} Structure
                        </span>
                      </div>
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
                      setHasUnsavedChanges(true);
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Unpublish
                  </button>
                </div>
              </Modal>
            </div>
          </DndProvider>
        </>}


      {isTabletOrMobile &&
        <>
          <AccountModal
            isOpen={showAccountModal}
            close={() => setShowAccountModal(false)}
            title="Account Information"
          ></AccountModal>
          <Toaster position="top-right" />
          <DndProvider backend={HTML5Backend}>
            <div className="h-dvh w-full bg-black flex flex-col overflow-x-hidden">

              <header className="flex items-center justify-between  pt-4 pb-4 px-5 lg:pt-8 lg:pb-8 lg:px-10 pr-6 lg:pr-10 relative z-50 border border-transparent border-b-(--dirty-white)">
                {/* {Mobile Hamburger} */}
                <AnimatePresence>
                  {mobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="lg:hidden absolute top-full left-0 w-full z-40
                 bg-black text-white border-t border-(--dirty-white) shadow-lg"
                    >
                      <div className="flex flex-col divide-y">
                        {/* Questions */}
                        <button
                          onClick={() => {
                            setResultPage(false);
                            window.location.hash = "questions";
                            setMobileMenuOpen(false);
                          }}
                          className="px-6 py-4 text-left hover:bg-[#1e1e1e]"
                        >
                          Questions
                        </button>

                        {/* Responses */}
                        <button
                          onClick={() => {
                            setResultPage(true);
                            window.location.hash = "responses";
                            setMobileMenuOpen(false);
                          }}
                          className="px-6 py-4 text-left hover:bg-[#1e1e1e]"
                        >
                          Responses
                        </button>

                        {/* Preview */}
                        <Link
                          to={`../preview/${publicid}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-6 py-4 hover:bg-[#1e1e1e]"
                        >
                          Preview
                        </Link>

                        {/* Publish / Share */}
                        <button
                          onClick={(e) => {
                            PublishForm(e);
                            setMobileMenuOpen(false);
                          }}
                          className="px-6 py-4 text-left hover:bg-[#1E1E1E]"
                        >
                          {isPublished ? "Share" : "Publish"}
                        </button>

                        {/* Settings */}
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setMobileMenuOpen(false);
                          }}
                          className="px-6 py-4 text-left hover:bg-[#1e1e1e]"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            setShowMobileLayers(true);
                            setMobileMenuOpen(false);
                          }}
                          className="px-6 py-4 text-left hover:bg-[#1e1e1e]"
                        >
                          Layers
                        </button>
                        <button
                          onClick={() => {
                            setShowMobileElements(true);
                            setMobileMenuOpen(false);
                          }}
                          className="px-6 py-4 text-left hover:bg-[#1e1e1e]"
                        >
                          Form Elements
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="inline-flex items-center gap-7 flex-1 min-w-0">              <Link to={"/"}>
                  <FaHome fill='white' className="text-2xl cursor-pointer" />
                </Link>
                  <div
                    ref={containerRef}
                    className="relative inline-flex items-center z-50  max-w-2/3 flex-1 min-w-0"
                  >
                    <span
                      ref={spanRef}
                      className="text-[#1E1E1E] invisible absolute whitespace-pre font-medium px-2 text-xl"
                    >
                      {titleValue || "Untitled Form"}
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Untitled Form"
                      className={`text-white placeholder:text-gray-400 text-xl py-1 px-2 rounded-lg transition-all relative duration-200 focus:outline-none focus:ring ring-black ${!isFocused && titleValue ? "truncate" : ""
                        }`}
                      value={titleValue}
                      onChange={(e) => handleTitleUpdate(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={{ width: "180px" }}
                    />
                  </div>
                </div>
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-5 items-center">
                  <button
                    className="text-left"
                    onClick={() => {
                      setResultPage(false);
                      window.location.hash = "questions";
                    }}

                  >
                    <div tabIndex='1' className="  justify-center bg-black hover:bg-gray-[#1E1E1E] focus:bg-[#1e1e1e] group px-8  py-4  relative flex flex-col border-2 border-[var(--dirty-white)] duration-200 hover:border-green-000 ">
                      <div className="absolute flex items-center justify-center top-0 right-0 w-5 h-5  bg-[#C8C9DA]">
                        <button onClick={() => setActiveTab('questions')} className="relative w-full h-full font-bold cursor-pointer  flex items-center justify-center overflow-hidden">
                          <FaArrowUp size={12} className="fill-black rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                          <FaArrowUp size={12}
                            className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                                               transition-all duration-400 ease-out fill-green-700"
                          />
                        </button>
                      </div>

                      <span className="vagrounded font-semibold text-[15px] text-white mb-[2px]">
                        Questions
                      </span>

                    </div>
                  </button>

                  <button
                    className="text-left"
                    onClick={() => {
                      setResultPage(true);
                      window.location.hash = "responses";
                    }}

                  >
                    <div tabIndex='0' className="  justify-center  bg-black hover:bg-gray-[#1E1E1E] focus:bg-[#1e1e1e] group px-8 py-4 relative flex flex-col border-2 border-[var(--dirty-white)] duration-200 hover:border-green-000 ">
                      <div className="absolute flex items-center justify-center top-0 right-0   w-5 h-5 bg-[#C8C9DA]">
                        <button className="relative w-full h-full font-bold cursor-pointer  flex items-center justify-center overflow-hidden">
                          <FaArrowUp size={12} className="fill-black rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                          <FaArrowUp size={12}
                            className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                                               transition-all duration-400 ease-out fill-green-700"
                          />
                        </button>
                      </div>

                      <span className="vagrounded font-semibold text-[15px] text-white mb-[2px]">
                        Responses
                      </span>

                    </div>
                  </button>

                </div>
                <div className="flex-1 flex justify-end items-center gap-4">
                  <button
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    className="lg:hidden flex items-center justify-center"
                  >
                    <HiMenu className="text-3xl text-white" />
                  </button>

                  <div className="hidden lg:inline-flex items-center gap-4 shrink-0">
                    <Link to={`../preview/${publicid}`}>
                      <button className="text-white px-7 py-1.5 rounded-xl bg-black ring inset-shadow-lg/10   font-vagrounded drop-shadow-sm/30 hover:bg-[#1E1E1E] transition-color duration-200 ease-out">
                        Preview
                      </button>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={PublishForm}
                        disabled={shareLoading}
                        ref={triggerRef}
                        className="flex text-white items-center gap-2 px-7 py-1.5 rounded-xl bg-green-700 ring ring-green-700
              inset-shadow-lg/10 font-vagrounded drop-shadow-sm/30 hover:bg-green-800 ease duration-200 hover:ring-green-800
              disabled:opacity-60"
                      >
                        {shareLoading ? (
                          <span className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></span>
                        ) : isPublished ? (
                          <>
                            <IoShareSocialSharp className="text-lg" /> Share
                          </>
                        ) : (
                          "Publish"
                        )}
                      </button></div>

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
                      <IoSettingsSharp fill="white" className="text-2xl hover:scale-[1.05] transition-all duration-200 ease-out" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          style={{ transformOrigin: "top right" }}
                          className="absolute top-12 right-0 sm:right-0 z-50 origin-top-right">
                          <div className="absolute -top-1.5 right-2 w-3 h-3 bg-black border-t border-l border-zinc-800 rotate-45 z-0" />
                          <div className="relative w-[280px] sm:w-80 overflow-hidden bg-black border border-zinc-800 text-white rounded-xl shadow-2xl shadow-black/50">                            <div className="flex flex-col p-1">

                            {/* Review Setting */}
                            <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={toggleReview}>
                              <div className="mt-1 text-green-600 text-xl">
                                <MdPreview />
                              </div>
                              <div className="flex-1 flex flex-col min-w-0">
                                <span className="text-sm font-medium text-zinc-100">Allow User Review</span>
                                <span className="text-xs text-zinc-400 leading-relaxed">Let users check answers before submission</span>
                              </div>
                              <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 mt-1 ${hasReviewPage ? 'bg-green-600' : 'bg-zinc-700'}`}>
                                <motion.div
                                  animate={{ x: hasReviewPage ? 18 : 2 }}
                                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Multiple Submission */}
                            <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={toggleMulti}>
                              <div className="mt-1 text-green-600 text-xl">
                                <BiSelectMultiple />
                              </div>
                              <div className="flex-1 flex flex-col min-w-0">
                                <span className="text-sm font-medium text-zinc-100">Multiple Submissions</span>
                                <span className="text-xs text-zinc-400 leading-relaxed">Allows users to answer multiple times</span>
                              </div>
                              <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 mt-1 ${allowMultipleSubmissionsValue ? 'bg-green-600' : 'bg-zinc-700'}`}>
                                <motion.div
                                  animate={{ x: allowMultipleSubmissionsValue ? 18 : 2 }}
                                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="my-1 border-t border-zinc-800 mx-2" />

                            {/* Unpublish Action */}
                            <button
                              disabled={!isPublished}
                              onClick={() => isPublished && setShowUnpublishModal(true)}
                              className={`flex items-start gap-3 p-3 rounded-lg transition-all w-full text-left
              ${isPublished
                                  ? 'hover:bg-red-500/10 group'
                                  : 'opacity-40 cursor-not-allowed'
                                }`}
                            >
                              <div className={`mt-1 text-xl ${isPublished ? 'text-zinc-400 group-hover:text-red-600' : 'text-zinc-500'}`}>
                                <BsFillSendXFill />
                              </div>
                              <div className="flex-1 flex flex-col min-w-0">
                                <span className={`text-sm font-medium ${isPublished ? 'text-zinc-100 group-hover:text-red-600' : 'text-zinc-500'}`}>
                                  Unpublish Form
                                </span>
                                <span className="text-xs text-zinc-500">Stop accepting new responses</span>
                              </div>
                            </button>

                          </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="bg-white h-8 w-8 rounded-full flex justify-center items-center">
                    <img
                      src={user.avatar}
                      onClick={() => setShowAccountModal(true)}
                      className="h-8 w-8 cursor-pointer rounded-full"
                    />
                  </div>
                </div>
              </header>

              {resultPage && (
                <div className="flex-1 w-full overflow-auto ">
                  <Results
                    defaultFormName={titleValue}
                    parentResponses={responses}
                    parentLoading={responsesLoading}
                    parentFormData={pages}
                  />
                </div>
              )}

              {!resultPage && (
                <>
                  <div
                    id="questions"
                    className="flex-1 w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0"              >


                    {/* form  */}
                    <div className="h-screen  min-h-0  py-4 flex flex-col w-full lg:w-[60%]">
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

                  </div>

                </>
              )}

              <AnimatePresence>
                {showMobileElements && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-black z-50 flex flex-col border-r border-zinc-800 font-vagrounded lg:hidden overflow-hidden shadow-2xl"
                  >

                    <div className="p-6 pb-2 flex items-center justify-between">
                      <h2 className="text-green-600 text-xs uppercase tracking-[0.2em] font-bold">
                        Form Elements
                      </h2>
                      <button
                        onClick={() => setShowMobileElements(false)}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 pt-2 scrollbar-vscode">
                      {[
                        { title: "Frequently used", range: [0, 3], color: "#00a651" },
                        { title: "Display Text", range: [3, 5], color: "#00a651" },
                        { title: "Choices", range: [5, 11], color: "#00a651" },
                        { title: "Text", range: [11, 13], color: "#00a651" },
                        { title: "Others", range: [13, 17], color: "#00a651" },
                      ].map((section, idx) => (
                        <div key={idx} className="mb-8">
                          {/* Label */}
                          <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4 ml-2">
                            {section.title}
                          </span>


                          <div className="grid grid-cols-3 gap-2 px-1">
                            {types.slice(section.range[0], section.range[1]).map((type, index) => (
                              <FormElement
                                key={index}
                                bgKulay={`${section.color}15`}
                                foreKulay={section.color}
                                icon={type.Icon}
                                title={type.title}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* right side */}
              {/*
<div className="flex flex-col relative h-auto lg:h-full w-full lg:w-[20%] bg-black p-7.5 pr-0 min-h-0 border-t-2 lg:border-t-0 lg:border-l-2 border-(--dirty-white) font-vagrounded overflow-auto pb-10">                  <div className="w-full">
                    <h1 className="text-white text-3xl text-left">Layers</h1>
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
            
  */}
              <AnimatePresence>
                {/* Backdrop */}
                {showMobileLayers && (
                  <motion.div
                    key="layers-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black z-40 lg:hidden"
                    onClick={() => setShowMobileLayers(false)}
                  />
                )}

                {/* Layers Panel */}
                {showMobileLayers && (
                  <motion.div
                    key="layers-panel"
                    ref={layersRef}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="
                      fixed bottom-0 left-0 right-0
                      h-[80vh]
                      bg-black
                      z-50
                      p-6
                      border border-white
                      font-vagrounded
                      lg:hidden
                      flex flex-col
                      scrollbar-vscode
                    "
                  >
                    <div className="flex items-center text-white justify-between">

                      <h1 className="text-2xl ">Layers</h1>
                      <button
                        onClick={() => setShowMobileLayers(false)}
                        className="text-xl px-3 py-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mt-4 flex-1 overflow-auto">
                      <Layers
                        questions={pages[currentPageIndex]?.questions || []}
                        onReorder={handleReorderQuestions}
                        onDelete={handleDeleteQuestion}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


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
                      setHasUnsavedChanges(true);
                    }}
                    className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Unpublish
                  </button>
                </div>
              </Modal>

            </div>
          </DndProvider>
          <AnimatePresence>
            {showPublishModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* 1. Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPublishModal(false)} // Close when clicking outside
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* 2. Modal Content */}
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative z-10 w-full max-w-md"
                >
                  {/* Modal Box */}
                  <div className="font-vagrounded py-6 px-2 bg-black text-white border border-green-700 rounded-2xl shadow-2xl">

                    {/* Close Button (X) */}
                    <button
                      onClick={() => setShowPublishModal(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="gap-1 px-3 flex-col flex">
                      <p className="text-2xl mb-2">Share Link</p>

                      <div className="flex w-full gap-2 items-center">
                        <p className="text-sm flex-1 font-sans line-clamp-1 border-2 border-zinc-800 rounded-lg p-2 truncate bg-zinc-900">
                          {`${import.meta.env.VITE_FRONTEND_URL}/form/${publicid}`}
                        </p>

                        <button
                          onClick={handleCopyButton}
                          className="flex items-center justify-center gap-2 text-sm p-2  bg-green-700 hover:bg-green-800 transition-all duration-200 ease-out border-2 rounded-lg px-4"
                        >
                          {copy ? (
                            <IoIosCheckmarkCircle className="text-xl" />
                          ) : (
                            <FaCopy className="text-md" />
                          )}
                          {copy ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 px-3 my-6">
                      <hr className="flex-1 border-zinc-700" />
                      <p className="text-sm text-gray-500 font-vagrounded uppercase tracking-widest">
                        or
                      </p>
                      <hr className="flex-1 border-zinc-700" />
                    </div>

                    <p className="px-3 text-2xl font-vagrounded">
                      Get the QR Code
                    </p>
                    <p className="px-3 text-gray-400 text-sm font-vagrounded mb-4">
                      Scan the code to launch your form
                    </p>

                    <div className="flex flex-col sm:flex-row px-3 gap-4 items-center">
                      <div className="p-2 bg-white rounded-xl">
                        <QRCodeCanvas
                          bgColor="#ffffff"
                          value={`${import.meta.env.VITE_FRONTEND_URL}/form/${publicid}`} size={180}
                          ref={qrCodeRef}
                        />
                      </div>

                      <div className="flex flex-col font-vagrounded w-full flex-1 justify-center gap-3">
                        <button
                          onClick={handleCopyQRImage}
                          className={`flex transition-all duration-200 ease-out justify-center items-center gap-2 text-sm p-2 border-2 border-(--black-lighter) rounded-lg 
    ${copyQR ? "bg-[#1e1e1e]" : "bg-black hover:bg-[#1e1e1e]"}`}
                        >
                          {copyQR ? (
                            <IoIosCheckmarkCircle className="text-md " />
                          ) : (
                            <FaCopy className="text-md" />
                          )}
                          {copyQR ? " Copied" : "Copy Code"}
                        </button>
                        <button
                          onClick={handleDownloadQR}
                          className="flex bg-black hover:bg-[#1e1e1e] justify-center items-center gap-1 text-sm p-2 border-2 border-(--black-lighter) rounded-lg "
                        >
                          <IoDownload className="text-lg" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>


      }

    </>
  );
}
export default Form;
