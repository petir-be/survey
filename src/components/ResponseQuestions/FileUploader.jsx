import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";
import axios from "axios";


const UPLOAD_URL = `${
  import.meta.env.VITE_BACKEND
}/api/Response/responses/media`;

function FileUploader({ question, onChange, value = [] }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Sync with parent state and hydrate data
  useEffect(() => {
    if (Array.isArray(value)) {
      const formattedFiles = value.map((f) => ({
        ...f,
        id: f.mediaId || crypto.randomUUID(),
        status: "completed", 
        progress: 100,
      }));
      setUploadedFiles(formattedFiles);
    } else {
      setUploadedFiles([]);
    }
  }, [value]);

  const isImage = (file) => {
    if (file.fileType && file.fileType.startsWith("image/")) return true;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
  };

  const uploadFileToServer = (file) =>
    new Promise(async (resolve, reject) => {
      const tempId = crypto.randomUUID();

      let fileData = {
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.round((loaded * 100) / total);

            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === tempId ? { ...f, progress: percentage } : f
              )
            );
          },
        });

        const fullMediaUrl = `${import.meta.env.VITE_BACKEND}${
          response.data.url
        }`;

        const serverData = {
          ...fileData,
          progress: 100,
          status: "completed",
          mediaId: response.data.id,
          mediaUrl: fullMediaUrl,
        };

        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === tempId ? serverData : f))
        );

        resolve(serverData);
      } catch (error) {
        console.error("File upload failed:", error);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === tempId ? { ...f, status: "failed" } : f))
        );
        reject(error);
      }
    });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = null;

    const uploadedPromises = files.map((file) => uploadFileToServer(file));
    await Promise.allSettled(uploadedPromises);

    setUploadedFiles((prev) => {
      const validFiles = prev.filter(
        (f) => f.mediaId && f.status === "completed"
      );
      const answerPayload = validFiles.map((f) => ({
        mediaId: f.mediaId,
        name: f.name,
        size: f.size,
        mediaUrl: f.mediaUrl,
        fileType: f.fileType,
      }));
      onChange(answerPayload);
      return prev;
    });
  };

  const handleRemoveFile = async (id, mediaId) => {
    if (mediaId) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_BACKEND
          }/api/Response/responses/media/${mediaId}`,
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.warn("Could not delete file from server.", error);
      }
    }

    setUploadedFiles((prev) => {
      const updatedLocalFiles = prev.filter((f) => f.id !== id);
      const updatedSubmittedAnswers = updatedLocalFiles
        .filter((f) => f.mediaId)
        .map((f) => ({
          mediaId: f.mediaId,
          name: f.name,
          size: f.size,
          mediaUrl: f.mediaUrl,
          fileType: f.fileType,
        }));
      onChange(updatedSubmittedAnswers);
      return updatedLocalFiles;
    });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const uploadedPromises = files.map((file) => uploadFileToServer(file));
    await Promise.allSettled(uploadedPromises);
    setUploadedFiles((prev) => {
      const validFiles = prev.filter(
        (f) => f.mediaId && f.status === "completed"
      );
      const answerPayload = validFiles.map((f) => ({
        mediaId: f.mediaId,
        name: f.name,
        size: f.size,
        mediaUrl: f.mediaUrl,
        fileType: f.fileType,
      }));
      onChange(answerPayload);
      return prev;
    });
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
            <div className="flex items-center gap-3 flex-1 min-w-0 mt-2">
              {/* Preview Image or Icon */}
              {f.status === "completed" && f.mediaUrl && isImage(f) ? (
                <img
                  src={f.mediaUrl}
                  alt={f.name}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0 border border-gray-200"
                />
              ) : (
                <FaFile className="text-xl text-gray-500 flex-shrink-0" />
              )}

              <span className="flex flex-col min-w-0 w-full pr-4">
                <span className="text-sm font-vagrounded truncate">
                  {f.name}
                </span>

                <div className="flex items-center gap-3 text-xs font-vagrounded text-gray-500 h-5">
         
                  <span className="whitespace-nowrap">
                    {(f.size / 1024 / 1024).toFixed(2)} MB
                  </span>

          
                  {f.status === "uploading" ? (
           
                    <div className="flex-1 max-w-[120px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  ) : (
               
                    <>
                      {f.status === "failed" && (
                        <span className="text-red-500 font-semibold">
                          (Failed)
                        </span>
                      )}
                    </>
                  )}
                </div>
              </span>
            </div>

            <div className="flex items-center gap-2">


              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile(f.id, f.mediaId);
                }}
                className="ml-2 shrink-0 hover:bg-gray-100 rounded-full p-2 transition-colors text-gray-500 hover:text-red-500"
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
