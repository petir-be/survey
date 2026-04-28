import { useDrop } from "react-dnd";
import Contact from "./FormElements/Contact";
import MultipleChoice from "./FormElements/MultipleChoice";
import Checkbox from "./FormElements/Checkbox";
import Dropdown from "./FormElements/Dropdown";
import ChoiceMatrix from "./FormElements/ChoiceMatrix";
import Paragraph from "./FormElements/Paragraph";
import Heading from "./FormElements/Heading";
import LongText from "./FormElements/LongText";
import Email from "./FormElements/Email";
import PhoneNumber from "./FormElements/PhoneNumber";
import FileUpload from "./FormElements/FileUploader";
import Switch from "./FormElements/Switch";
import { FaPlus } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight, FaRegTrashAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "./Modal";
import ShortText from "./FormElements/ShortText";
import { useMediaQuery } from "react-responsive";



function DropZone({ index, onInsert }) {
  const scrollContainerRef = useRef(null);

  const [{ isOver }, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      onInsert(item, index);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div
      ref={dropRef}
      className={`w-full min-h-2 flex items-center justify-center transition-all my-2 rounded ${isOver ? "bg-purple-200" : "bg-transparent"
        }`}
    >
      {isOver && <div className="h-1 w-full bg-blue-600 rounded" />}
    </div>
  );
}

function QuestionDropWrapper({ index, onInsert, children }) {
  const ref = useRef(null);

  const [{ isOver, isTop }, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!hoverBoundingRect || !clientOffset) {
        onInsert(item, index + 1);
        return;
      }
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (hoverClientY < hoverMiddleY) {
        onInsert(item, index);
      } else {
        onInsert(item, index + 1);
      }
    },
    hover: () => {
      // not strictly necessary if we only want to drop, 
      // but used if we want to preview it being "over"
    },
    collect: (monitor) => {
      if (!monitor.isOver({ shallow: true })) return { isOver: false, isTop: false };
      const clientOffset = monitor.getClientOffset();
      if (!ref.current || !clientOffset) return { isOver: true, isTop: false };
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      return {
        isOver: true,
        isTop: hoverClientY < hoverMiddleY,
      };
    },
  });

  dropRef(ref);

  return (
    <div ref={ref} className="w-full relative transition-all">
      {isOver && (
        <div className="absolute top-[-12px] left-0 right-0 h-1 bg-blue-600 rounded z-50 pointer-events-none" />
      )}
      {children}
    </div>
  );
}
const SCROLL_ZONE = 80;  // px from top/bottom edge that activates scroll
const SCROLL_SPEED = 14; // max px scrolled per dragover tick

function handleDragScroll(e, ref) {
  const el = ref.current;
  if (!el) return;
  const { top, bottom } = el.getBoundingClientRect();
  const y = e.clientY;
  if (y - top < SCROLL_ZONE) {
    el.scrollTop -= SCROLL_SPEED * (1 - (y - top) / SCROLL_ZONE);
  } else if (bottom - y < SCROLL_ZONE) {
    el.scrollTop += SCROLL_SPEED * (1 - (bottom - y) / SCROLL_ZONE);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

function PageContent({
  questions,
  onInsert,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onPingSidebar,
  isCanvasOver,
  emptyCanvasDropRef,
  canvasRef,
  scrollContainerRef,
}) {
  return (
    // KEY FIX: this div is the ONLY scrollable element. It owns the ref and
    // the onDragOver handler. Nothing above it has overflow-auto/scroll.
    <div
      ref={scrollContainerRef}
      className="flex-1 min-h-0 w-full overflow-y-auto bg-[#0a0a0a] flex flex-col"
      onDragOver={(e) => handleDragScroll(e, scrollContainerRef)}
    >
      <div
        ref={canvasRef}
        className="w-full mx-auto rounded-xl shadow-lg relative flex-1 flex flex-col"
      >
        <div className="flex-1 flex flex-col p-4">
          {questions.length === 0 ? (
            <div
              ref={emptyCanvasDropRef}
              className={`relative flex flex-1 flex-col items-center justify-center w-full border-2 border-dashed rounded-xl transition-all duration-300 group ${isCanvasOver
                ? "border-green-500 bg-green-500/10 scale-[0.99]"
                : "border-green-500/30 bg-black hover:border-green-500/70 hover:bg-[#0a0a0a]"
                }`}
            >
              <div className="flex flex-col items-center justify-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onPingSidebar?.();
                  }}
                  className={`p-4 cursor-pointer mb-4 rounded-full transition-transform duration-300 ${isCanvasOver
                    ? "bg-green-500/20 text-green-400 scale-110"
                    : "bg-green-500/10 text-green-500 group-hover:scale-110"
                    }`}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className={`text-lg font-medium ${isCanvasOver ? "text-green-400" : "text-gray-200"}`}>
                  {isCanvasOver ? "Release to drop element" : "Drag and drop form elements here"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Start building your layout</p>
              </div>
            </div>
          ) : (
            questions.map((question, idx) => (
              <div key={question?.id || idx}>
                {idx === 0 && <DropZone index={0} onInsert={onInsert} />}
                <QuestionDropWrapper index={idx} onInsert={onInsert}>
                  {renderElement(question, onUpdateQuestion, onDeleteQuestion, onDuplicateQuestion)}
                </QuestionDropWrapper>
                <DropZone index={idx + 1} onInsert={onInsert} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
function Page({
  questions = [],
  onInsert,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onAddPage,
  onRemovePage,
  currentPageIndex,
  pageNumber,
  totalPages,
  onPageChange,
  onPingSidebar, // <--- 1. EXTRACT THE PROP HERE
  ...props
}) {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 822px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 821px)" });
  const canvasRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const scrollContainerRef = useRef(null);
  const [{ isCanvasOver }, emptyCanvasDropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item, monitor) => {
      // If it already dropped into a nested DropZone, ignore it here
      if (monitor.didDrop()) return;
      onInsert(item, 0); // Insert at index 0 for an empty canvas
    },
    collect: (monitor) => ({
      isCanvasOver: !!monitor.isOver({ shallow: true }),
    }),
  });
  const captureScreenshot = async () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `ds.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert("Could not save image. See console for details.");
    }
  };

  const pageContentProps = {
    questions,
    onInsert,
    onUpdateQuestion,
    onDeleteQuestion,
    onDuplicateQuestion,
    onPingSidebar,
    isCanvasOver,
    emptyCanvasDropRef,
    canvasRef,
    scrollContainerRef,
  };
  const deleteModal = (
    <Modal
      isOpen={showDeleteModal}
      close={() => setShowDeleteModal(false)}
      title="Confirm Deletion"
    >
      <p className="text-zinc-300 mt-2 mb-6">
        {deleteTarget?.type === "page"
          ? `Are you sure you want to delete Page ${pageNumber}?`
          : "Are you sure you want to delete this question?"}
      </p>
      <div className="flex justify-end gap-3 font-vagrounded">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 text-sm font-medium text-green-400 bg-transparent border border-green-500/40 rounded-lg hover:bg-green-500/10 hover:border-green-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (deleteTarget?.type === "page") {
              onRemovePage(deleteTarget.index);
              if (deleteTarget.index === totalPages - 1 && deleteTarget.index > 0) {
                onPageChange(deleteTarget.index - 1);
              }
            } else if (deleteTarget?.type === "question") {
              onDeleteQuestion(deleteTarget.id);
            }
            setShowDeleteModal(false);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );

  const pageTabs = (
    <div className="flex gap-3 items-center px-2 pt-1 overflow-x-auto scrollbar-vscode w-full">

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`text-white flex items-center whitespace-nowrap flex-row px-5 gap-2 py-2 mb-1 outline outline-green-700 rounded-md font-vagrounded hover:bg-green-700/40 transition-colors duration-200 ease-out ${index === currentPageIndex
            ? "bg-green-700/40 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            : "bg-black text-zinc-300"
            }`}
        >
          Page {index + 1}
        </button>
      ))}
    </div>
  );
  const pageControls = (
    <div className="flex gap-2 items-center bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800">
      {totalPages > 1 && (
        <>
          <button
            onClick={() => onPageChange(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md disabled:opacity-30 transition-all"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => onPageChange(currentPageIndex + 1)}
            disabled={currentPageIndex === totalPages - 1}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md disabled:opacity-30 transition-all"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={() => {
              setDeleteTarget({ type: "page", index: currentPageIndex });
              setShowDeleteModal(true);
            }}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
            title="Delete current page"
          >
            <FaRegTrashAlt className="fill-white" />
          </button>
        </>
      )}
    </div>
  );
  return (
    <>
      {isDesktopOrLaptop &&
        <>
          <div className="flex flex-col h-screen w-full bg-black overflow-hidden">


            <div className="h-[70px] w-full flex items-center justify-between px-8 border-b border-zinc-800">
              <h1 className="text-xl text-white font-vagrounded">
                Page {pageNumber} <span className="text-zinc-600 text-sm font-normal">/ {totalPages}</span>
              </h1>
              <div className="flex gap-2 items-center bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800">
                {totalPages > 1 && (
                  <>
                    <button
                      onClick={() => onPageChange(currentPageIndex - 1)}
                      disabled={currentPageIndex === 0}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md disabled:opacity-30 transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => onPageChange(currentPageIndex + 1)}
                      disabled={currentPageIndex === totalPages - 1}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md disabled:opacity-30 transition-all"      >
                      <FaChevronRight />
                    </button>
                    <button
                      onClick={() => {

                        setDeleteTarget({ type: "page", index: currentPageIndex });
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all" title="Delete current page"
                    >
                      <FaRegTrashAlt className="fill-white" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex-1 w-full overflow-y-auto bg-[#0a0a0a] flex flex-col"
              onDragOver={(e) => handleDragScroll(e, scrollContainerRef)}
            >              <div
              ref={canvasRef}
              className="w-full mx-auto rounded-xl shadow-lg relative flex-1 flex flex-col">

                <div className="flex-1 flex flex-col p-4">
                  {questions.length === 0 ? (
                    /* Empty State UI */
                    <div
                      ref={emptyCanvasDropRef}
                      className={`relative flex flex-1 flex-col items-center justify-center w-full border-2 border-dashed rounded-xl transition-all duration-300 group ${isCanvasOver
                        ? "border-green-500 bg-green-500/10 scale-[0.99]" // Active Drag Hover State
                        : "border-green-500/30 bg-black hover:border-green-500/70 hover:bg-[#0a0a0a]" // Normal/Hover State
                        }`}
                    >
                      <div className="flex flex-col items-center justify-center ">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onPingSidebar();
                          }}
                          className={`p-4 cursor-pointer mb-4 rounded-full transition-transform duration-300 ${isCanvasOver
                            ? "bg-green-500/20 text-green-400 scale-110"
                            : "bg-green-500/10 text-green-500 group-hover:scale-110"
                            }`}>
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>

                        <p className={`text-lg font-medium ${isCanvasOver ? "text-green-400" : "text-gray-200"}`}>
                          {isCanvasOver ? "Release to drop element" : "Drag and drop form elements here"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Start building your layout
                        </p>
                      </div>

                    </div>
                  ) : (

                    /* Mapped Questions UI */
                    questions.map((question, idx) => (
                      <div key={question?.id || idx}>

                        {/* Add a DropZone at index 0 so users can drop items at the very top of the list */}
                        {idx === 0 && <DropZone index={0} onInsert={onInsert} />}

                        <QuestionDropWrapper index={idx} onInsert={onInsert}>
                          {renderElement(question, onUpdateQuestion, onDeleteQuestion, onDuplicateQuestion)}
                        </QuestionDropWrapper>

                        <DropZone index={idx + 1} onInsert={onInsert} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row  w-full border-t border-zinc-800 items-start z-10 gap-5 p-6 ">
              <div className="flex shrink-0 pt-1 ">
                <button
                  onClick={onAddPage}
                  className="flex items-center text-white font-vagrounded whitespace-nowrap flex-row px-5 gap-2 py-2 rounded-md bg-green-700/40 hover:bg-green-800/40 outline outline-green-700  hover:outline-green-800 transition-all duration-200 ease-out whitespace-nowrap"
                >
                  <FaPlus fill="" className="fill-white" /> Add page
                </button>
              </div>
              <div className="border-l border-l-zinc-500 mt-1 h-10" />

              <div className="flex gap-2 items-start px-2 pt-1 pb-4 overflow-x-auto  scrollbar-vscode w-full">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => onPageChange(index)}
                    className={`text-white flex items-center whitespace-nowrap flex-row px-5 gap-2 py-2 mb-1 outline outline-green-700 rounded-md font-vagrounded hover:bg-green-700/40 transition-color duration-200 ease-out ${index === currentPageIndex
                      ? " bg-green-700/40 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                      : " bg-black text-zinc-300"
                      }`}
                  >
                    Page {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Modal
            isOpen={showDeleteModal}
            close={() => setShowDeleteModal(false)}
            title="Confirm Deletion"

          >
            <p className="text-zinc-300 mt-2 mb-6">
              {deleteTarget?.type === "page"
                ? `Are you sure you want to delete Page ${pageNumber}?`
                : "Are you sure you want to delete this question?"}
            </p>
            <div className="flex justify-end gap-3 font-vagrounded">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-green-400 bg-transparent border border-green-500/40 rounded-lg hover:bg-green-500/10 hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // --- UPDATED DELETE EXECUTION LOGIC ---
                  if (deleteTarget?.type === "page") {
                    onRemovePage(deleteTarget.index);

                    // If the user deletes the last page, shift their view back by 1 so they aren't on a blank screen
                    if (deleteTarget.index === totalPages - 1 && deleteTarget.index > 0) {
                      onPageChange(deleteTarget.index - 1);
                    }
                  } else if (deleteTarget?.type === "question") {
                    onDeleteQuestion(deleteTarget.id);
                  }
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"              >
                Delete
              </button>
            </div>
          </Modal>
        </>
      }
      {isTabletOrMobile && (
        <>
          <div className="flex flex-col h-screen w-full bg-black overflow-hidden">
            {/* header */}
            <div className="relative z-10 h-[70px] w-full flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
              <h1 className="text-xl text-white font-vagrounded">
                Page {pageNumber}{" "}
                <span className="text-zinc-600 text-sm font-normal">/ {totalPages}</span>
              </h1>
              {pageControls}
            </div>

            {/* scrollable canvas */}
            <PageContent {...pageContentProps} />

            {/* footer */}
            <div className="flex flex-row w-full border-t border-zinc-800 items-start z-10 gap-5 px-4 pt-4  shrink-0">
              <div className="flex shrink-0 pt-1">
                <button
                  onClick={onAddPage}
                  className="flex items-center text-white font-vagrounded whitespace-nowrap flex-row px-5 gap-2 py-2 rounded-md bg-green-700/40 hover:bg-green-800/40 outline outline-green-700 hover:outline-green-800 transition-all duration-200 ease-out"
                >
                  <FaPlus className="fill-white" /> Add page
                </button>
              </div>
              <div className="flex items-center border-l mt-1 border-l-zinc-500 h-10" />
              {pageTabs}
            </div>
          </div>
          {deleteModal}
        </>
      )}
    </>
  );
}
function renderElement(question, onUpdate, onDelete, onDuplicate) {
  if (!question) {
    console.error("Question is null or undefined");
    return null;
  }
  if (question.title && !question.question) {
    return (



      <div className="p-4 border-2 border-red-500 rounded-xl bg-red-50">
        <p className="text-red-600 font-bold">⚠️ Old Data Structure Detected</p>
        <p className="text-sm text-red-500 mt-1">
          This element was created with the old structure. It has:
        </p>
        <pre className="text-xs mt-2 bg-white p-2 rounded">
          {JSON.stringify(question, null, 2)}
        </pre>
        <p className="text-sm text-red-500 mt-2">
          Please delete this and drag a new element from the left sidebar.
        </p>
        <button
          onClick={() => onDelete(question.id)}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete This Element
        </button>
      </div>
    );
  }

  if (!question.id || !question.type || question.question === undefined) {
    return (
      <div className="p-4 border-2 border-yellow-500 rounded-xl bg-yellow-50">
        <p className="text-yellow-700 font-bold">⚠️ Invalid Question Data</p>
        <p className="text-sm text-yellow-600 mt-1">
          Missing required properties. Current data:
        </p>
        <pre className="text-xs mt-2 bg-white p-2 rounded overflow-auto">
          {JSON.stringify(question, null, 2)}
        </pre>
        <button
          onClick={() => onDelete(question.id)}
          className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Delete This Element
        </button>
      </div>
    );
  }

  if (question.type === "contact")
    return (
      <Contact question={question} onUpdate={onUpdate} onDelete={onDelete} />
    );
  if (question.type === "multiple_choice")
    return (
      <MultipleChoice
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "checkbox")
    return (
      <Checkbox
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "dropdown")
    return (
      <Dropdown
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "choice_matrix")
    return (
      <ChoiceMatrix
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "paragraph")
    return (
      <Paragraph
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "heading")
    return (
      <Heading
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "long_text")
    return (
      <LongText
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "short_text")
    return (
      <ShortText
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "email")
    return (
      <Email
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "phone_number")
    return (
      <PhoneNumber
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "file_uploader")
    return (
      <FileUpload
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );
  if (question.type === "switch")
    return (
      <Switch
        question={question}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    );

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-medium text-lg border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
            placeholder="Enter your question"
          />
          <p className="text-sm text-gray-500 mt-1">Type: {question.type}</p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Delete this question?")) {
              onDelete(question.id);
            }
          }}
          className="ml-2 text-red-500 hover:text-red-700 text-xl"
          title="Delete question"
        >
          ×
        </button>
      </div>
      <input
        type="text"
        placeholder="Answer will appear here..."
        className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
        disabled
      />
    </div>
  );
}

export default Page;