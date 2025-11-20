import React, { useRef, useEffect, useState } from "react";
import { IoDuplicate, IoClose } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";

//lagyan ng limit ng file size upload

function FileUploader({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [question.question]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filesWithProgress = files.map((file) => ({
      file,
      progress: 0,
      fileSize: file.size,
      id: crypto.randomUUID(),
    }));

    setUploadedFiles((prev) => [...prev, ...filesWithProgress]);
    simulateUploadProgress(filesWithProgress);
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const filesWithProgress = files.map((file) => ({
      file,
      progress: 0,
      fileSize: file.size,
      id: crypto.randomUUID(),
    }));

    setUploadedFiles((prev) => [...prev, ...filesWithProgress]);
    simulateUploadProgress(filesWithProgress);
  };

  //peke to simulation lang ------ ayusin pa kaya ung totoo
  const simulateUploadProgress = (files) => {
    files.forEach((fileObj) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => clearInterval(interval), 2200);
    });
  };

  return (
    <div className="form-element-container group flex flex-col gap-2">
      {/* Question textarea */}
      <div className="flex justify-between items-start">
        <div className="flex-1 inline-flex items-start">
          <textarea
            ref={textareaRef}
            value={question.question || "Enter your Email Address"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-medium placeholder:italic placeholder:text-gray-400 text-lg border-b border-transparent hover:border-gray-300 focus:border-(--purple) focus:outline-none px-2 py-1 resize-none overflow-hidden"
            placeholder="Email"
            rows={1}
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="font-vagrounded mx-5 mt-1 group-focus-within:opacity-100 opacity-0 transition-all duration-200"
          >
            <IoDuplicate className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-3 border-2 border-dashed border-(--black-lighter) rounded-lg cursor-pointer bg-(--dirty-white) p-4 transition-all duration-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full"
        >
          {uploadedFiles.length >= 0 && (
            <>
              <FaFile className="text-2xl mb-2" />
              <span className="text-sm font-vagrounded">
                Drag & drop files or{" "}
                <span className="underline font-bold">browse</span>
              </span>
            </>
          )}

          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
        </label>

        {uploadedFiles.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between w-full p-3 border border-(--black-lighter) rounded-lg bg-(--white)"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FaFile className="text-lg flex-shrink-0" />
              <span className="flex flex-col">
                <span className="text-sm font-vagrounded truncate">
                  {f.file.name}
                </span>
                <span className="text-xs font-vagrounded">
                  {(f.fileSize / 1024 / 1024).toFixed(2)} MB{" "}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-200 rounded overflow-hidden">
                <div
                  className="bg-(--black-lighter) h-full"
                  style={{ width: `${f.progress}%` }}
                />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile(f.id);
                }}
                className="ml-2 flex-shrink-0 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUploader;
