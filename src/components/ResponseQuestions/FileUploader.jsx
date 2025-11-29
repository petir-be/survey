import React, { useRef, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";

function FileUploader({ question, onChange, value = [] }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    setUploadedFiles(value);
  }, [value]);

  const uploadFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      const id = crypto.randomUUID();

      let fileData = {
        id,
        name: file.name,
        size: file.size,
        progress: 0,
        base64: null,
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);

          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: percentage } : f))
          );
        }
      };

      reader.onloadend = () => {
        fileData = {
          ...fileData,
          base64: reader.result,
          progress: 100,
        };

        resolve(fileData);
      };

      reader.readAsDataURL(file);

      // Add initial entry
      setUploadedFiles((prev) => [...prev, fileData]);
    });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const uploaded = [];
    for (const file of files) {
      const data = await uploadFile(file);
      uploaded.push(data);
    }

    const updated = [...uploadedFiles, ...uploaded];
    setUploadedFiles(updated);
    onChange(updated);
  };

  const handleRemoveFile = (id) => {
    const updated = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updated);
    onChange(updated);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    const uploaded = [];

    for (const file of files) {
      const data = await uploadFile(file);
      uploaded.push(data);
    }

    const updated = [...uploadedFiles, ...uploaded];
    setUploadedFiles(updated);
    onChange(updated);
  };

  return (
    <div className="my-6">
      <p className="text-lg mb-3">{question.question}</p>

      <div
        className="flex flex-col gap-3 border-2 border-dashed border-(--black-lighter) rounded-lg cursor-pointer bg-(--dirty-white) p-4 transition-all duration-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor={`file-upload-${question.id}`}
          className="flex flex-col items-center justify-center w-full"
        >
          <FaFile className="text-2xl mb-2" />
          <span className="text-sm font-vagrounded">
            Drag & drop files or{" "}
            <span className="underline font-bold">browse</span>
          </span>

          <input
            id={`file-upload-${question.id}`}
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
            <div className="flex items-center gap-2 flex-1 min-w-0 mt-2">
              <FaFile className="text-lg flex-shrink-0" />
              <span className="flex flex-col">
                <span className="text-sm font-vagrounded truncate">
                  {f.name}
                </span>
                <span className="text-xs font-vagrounded">
                  {(f.size / 1024 / 1024).toFixed(2)} MB{" "}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-gray-200 rounded overflow-hidden">
                <div
                  className="bg-(--black-lighter) h-full transition-all"
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
