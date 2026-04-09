import React, { useRef, useEffect, useState } from "react";
import { IoDuplicate, IoClose } from "react-icons/io5";
import { FaFile, FaUpload } from "react-icons/fa6";
import { motion } from "framer-motion";

function FileUploader({ question, onUpdate, onDuplicate }) {
  const textareaRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");

  // Standard Form Builder States
  const [showAddOption, setShowAddOption] = useState(false);
  const [required, setRequired] = useState(question.required || false);

  // 👇 Added File Size Limit (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  function toggleRequired() {
    setRequired((prev) => !prev);
    onUpdate(question.id, { required: !required });
  }

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

  useEffect(() => {
    onUpdate(question.id, { required: required });
  }, []);

  // Centralized file processing to handle both Drop and Click uploads
  const processFiles = (files) => {
    setError("");
    const validFiles = [];
    let hasOversized = false;

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        hasOversized = true;
      } else {
        validFiles.push({
          file,
          progress: 0,
          fileSize: file.size,
          id: crypto.randomUUID(),
        });
      }
    });

    if (hasOversized) {
      setError("One or more files exceeded the 10MB limit and were skipped.");
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      simulateUploadProgress(validFiles);
    }
  };

  const handleFileUpload = (e) => {
    processFiles(Array.from(e.target.files));
    // Reset input so the same file can be uploaded again if removed
    e.target.value = null;
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Fake upload simulation
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
    <div
      className="form-element-container group flex flex-col gap-2"
      tabIndex={0}
      onFocus={() => setShowAddOption(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setShowAddOption(false);
        }
      }}
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={question.question || "Upload your file"}
            onChange={(e) => {
              onUpdate(question.id, { question: e.target.value });
              adjustHeight();
            }}
            className="w-full font-vagrounded font-bold text-xl bg-transparent text-white placeholder:text-zinc-600 focus:outline-none resize-none overflow-hidden"
            placeholder="File Upload Question"
            rows={1}
          />
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-2 text-zinc-500 hover:text-emerald-500 transition-all opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <IoDuplicate size={20} />
          </button>
        </div>
      </div>

      {/* DROPZONE AREA */}
      <div
        className="flex flex-col gap-3 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-xl cursor-pointer bg-zinc-800/30 hover:bg-zinc-800/50 transition-all duration-200 p-8 mt-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor={`file-upload-${question.id}`}
          className="flex flex-col items-center justify-center w-full cursor-pointer text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <FaUpload className="text-3xl mb-3" />
          <span className="text-sm font-vagrounded text-center">
            Drag & drop files or{" "}
            <span className="underline font-bold text-emerald-500">browse</span>
          </span>
          <span className="text-xs text-zinc-500 mt-1">Max file size: 10MB</span>

          <input
            id={`file-upload-${question.id}`}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <p className="text-red-400 text-sm font-vagrounded mt-1">{error}</p>
      )}

      {/* UPLOADED FILES LIST */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {uploadedFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between w-full p-3 border border-zinc-700/80 rounded-lg bg-zinc-800/80 shadow-sm"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-zinc-700/50 rounded-md text-emerald-500 flex-shrink-0">
                  <FaFile className="text-lg" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm text-zinc-200 font-vagrounded truncate">
                    {f.file.name}
                  </span>
                  <span className="text-xs text-zinc-500 font-vagrounded">
                    {(f.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="h-1.5 w-24 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-200 ease-out"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFile(f.id);
                  }}
                  className="flex-shrink-0 text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 rounded-full p-1.5 transition-colors"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      {showAddOption && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end items-center pt-4 mt-2 border-t border-zinc-800/50"
        >
          <div className="font-vagrounded flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Required
            </span>
            <button
              onClick={toggleRequired}
              className={`w-9 h-5 flex items-center rounded-full px-1 transition-all duration-300 ${required
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-zinc-800"
                }`}
            >
              <motion.div
                layout
                className="w-3 h-3 bg-white rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ marginLeft: required ? "auto" : "0" }}
              />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default FileUploader;