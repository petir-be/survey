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

function DropZone({ index, onInsert }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item) => {
      onInsert(item, index);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div
      ref={dropRef}
      className={`w-full min-h-2 flex items-center justify-center transition-all my-2 rounded ${
        isOver ? "bg-purple-200" : "bg-transparent"
      }`}
    >
      {isOver && <div className="h-1 w-full bg-blue-600 rounded" />}
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
}) {
  const canvasRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center gap-2">
        {/* --- UNCOMMENTED AND FIXED HEADER FOR PAGE DELETION --- */}
        <div className="w-[92%] px-7 mt-4 flex justify-between items-center text-white">
          <h1 className="text-xl text-left font-vagrounded mb-2">
            Page {pageNumber} of {totalPages}
          </h1>
          <div className="flex gap-2 items-center">
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => onPageChange(currentPageIndex - 1)}
                  disabled={currentPageIndex === 0}
                  className="px-3 py-2 mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-gray-200 text-black rounded disabled:opacity-50 active:scale-90 duration-100"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => onPageChange(currentPageIndex + 1)}
                  disabled={currentPageIndex === totalPages - 1}
                  className="px-3 py-2 mb-2  drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-gray-200 text-black rounded disabled:opacity-50 active:scale-90 duration-100"
                >
                  <FaChevronRight />
                </button>
                <button
                  onClick={() => {
                    // Targets the EXACT page index you are viewing
                    setDeleteTarget({ type: "page", index: currentPageIndex });
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-2 mb-2  drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-red-500 text-white rounded hover:bg-red-600 active:scale-90 duration-100"
                  title="Delete current page"
                >
                  <FaRegTrashAlt className="fill-white" />
                </button>
              </>
            )}
          </div>
        </div>

        <div
          ref={canvasRef}
          className="w-[92%] flex flex-col overflow-hidden h-[80%] bg-[#1e1e1e] mt-2 items-center ring ring-white  rounded-[12px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pl-4 "
        >
          <div className="relative flex flex-col overflow-y-auto h-full w-full">
            {questions.length === 0 && (
              <div className="w-full absolute translate-x-1/2 text-center translate-y-1/2 bottom-1/2 right-1/2 text-gray-600">
                Drag and Drop From Left Side
              </div>
            )}

            <DropZone index={0} onInsert={onInsert} />
            {questions.map((question, idx) => (
              <div key={question?.id || idx} className="w-full ">
                <div>
                  {renderElement(
                    question,
                    onUpdateQuestion,
                    onDeleteQuestion,
                    onDuplicateQuestion
                  )}
                </div>
                <DropZone index={idx + 1} onInsert={onInsert} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row justify-self-center mt-2 pb-2 w-[92%] h-15 items-center  z-10 gap-5">
          <div className="flex">
            <button
              onClick={onAddPage}
              className="text-white flex items-center w-35 flex-row px-5 gap-2 py-2 mb-1 rounded-md bg-black ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-green-800 transition-color duration-200 ease-out"
            >
              <FaPlus fill="" className="fill-white" /> Add page
            </button>
          </div>
          <div className="border-l mb-5 border-l-neutral-400" />
          <div className="flex gap-2 overflow-x-auto items-center px-2 py-2 ">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index)}
                className={`text-white px-4 rounded-md  py-2 min-w-21 justify-center items-center flex font-vagrounded drop-shadow-sm/30 hover:bg-green-700 transition-color duration-200 ease-out ${
                  index === currentPageIndex
                    ? "bg-green-800 ring ring-white"
                    : " ring ring-white inset-shadow-md/10"
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
        <p>
          {deleteTarget?.type === "page"
            ? `Are you sure you want to delete Page ${pageNumber}?`
            : "Are you sure you want to delete this question?"}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
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
            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
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