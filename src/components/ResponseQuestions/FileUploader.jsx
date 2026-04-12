import React, { useEffect, useState } from "react";
import { IoClose, IoAlertCircle } from "react-icons/io5";
import { FaFile, FaUpload } from "react-icons/fa6";
import axios from "axios";

const UPLOAD_URL = `${import.meta.env.VITE_BACKEND}/api/Response/responses/media`;

function FileUploader({ question, onChange, value = [] }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Sync with parent state
  useEffect(() => {
    if (Array.isArray(value)) {
      const formattedFiles = value.map((f) => ({
        ...f,
        id: f.mediaId || crypto.randomUUID(),
        status: "completed",
        progress: 100,
      }));
      setUploadedFiles(formattedFiles);
    }
  }, [value]);

  const isImage = (file) => {
    if (file.fileType && file.fileType.startsWith("image/")) return true;
    const name = file.name || "";
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
  };

  const uploadFileToServer = async (file) => {
    const tempId = crypto.randomUUID();
    const fileData = {
      id: tempId,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
      mediaId: null,
      mediaUrl: null,
      fileType: file.type,
    };

    setUploadedFiles((prev) => [...prev, fileData]);

    const formData = new FormData();
    formData.append("File", file);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...f, progress: percentage } : f))
          );
        },
      });

      const serverData = {
        ...fileData,
        progress: 100,
        status: "completed",
        mediaId: response.data.id,
        mediaUrl: `${import.meta.env.VITE_BACKEND}${response.data.url}`,
      };

      setUploadedFiles((prev) => {
        const newState = prev.map((f) => (f.id === tempId ? serverData : f));
        // Push the completed upload to the parent immediately
        const validPayload = newState
          .filter(f => f.status === "completed")
          .map(({ mediaId, name, size, mediaUrl, fileType }) => ({
            mediaId, name, size, mediaUrl, fileType
          }));
        onChange(validPayload);
        return newState;
      });

      return serverData;
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: "failed" } : f))
      );
      throw error;
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = null; // Reset input
    for (const file of files) {
      await uploadFileToServer(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await uploadFileToServer(file);
    }
  };

  const handleRemoveFile = async (id, mediaId) => {
    if (mediaId) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND}/api/Response/responses/media/${mediaId}`, {
          withCredentials: true,
        });
      } catch (err) { console.warn(err); }
    }
    const updated = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updated);
    onChange(updated.filter(f => f.status === "completed").map(({ mediaId, name, size, mediaUrl, fileType }) => ({
      mediaId, name, size, mediaUrl, fileType
    })));
  };

  return (
    <div className="form-element-container group flex flex-col gap-2">
      {/* Header Styled per Reference */}
      <div className="flex justify-between items-start mb-2">
        <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white">
          {question.question || "Upload your file"}
          {question.required && <span className="text-emerald-500 ml-1">*</span>}
        </p>
      </div>

      {/* Dropzone Area Styled per Reference */}
      <div
        className="flex flex-col gap-3 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-xl cursor-pointer bg-zinc-800/30 hover:bg-zinc-800/50 transition-all p-8 mt-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center w-full cursor-pointer text-zinc-400 hover:text-emerald-400 transition-colors">
          <FaUpload className="text-3xl mb-3" />
          <span className="text-sm font-vagrounded text-center">
            Drag & drop files or <span className="underline font-bold text-emerald-500">browse</span>
          </span>
          <span className="text-xs text-zinc-500 mt-1">Max file size: 10MB</span>

          <input type="file" className="hidden" multiple onChange={handleFileUpload} />
        </label>
      </div>



      < div className="flex flex-col gap-2 mt-4">
        {uploadedFiles.map((f) => (
          <div key={f.id} className="flex items-center justify-between w-full p-3 border border-zinc-700/80 rounded-lg bg-zinc-800/80 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-1 bg-zinc-700/50 rounded-md text-emerald-500 w-10 h-10 flex items-center justify-center overflow-hidden">
                {f.status === "completed" && isImage(f) ? (
                  <img src={f.mediaUrl} className="w-full h-full object-cover rounded" alt="" />
                ) : (
                  <FaFile className="text-lg" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-zinc-200 font-vagrounded truncate">{f.name}</span>
                <span className="text-xs text-zinc-500 font-vagrounded">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {f.status === "uploading" && (
                <div className="h-1.5 w-20 bg-zinc-700 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${f.progress}%` }} />
                </div>
              )}
              <button onClick={() => handleRemoveFile(f.id, f.mediaId)} className="text-zinc-500 hover:text-red-400 p-1">
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