import React from "react";
import { FaFile, FaDownload, FaEye } from "react-icons/fa6";
import toast from "react-hot-toast"; // Optional, for error feedback

const FileAnswerDisplay = ({ files }) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return <span className="text-gray-400 italic">No files uploaded</span>;
  }

  const isImage = (file) => {
    if (file.fileType && file.fileType.startsWith("image/")) return true;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
  };

  // ✅ NEW: Function to force download with correct filename
  const handleForceDownload = async (e, fileUrl, fileName) => {
    e.preventDefault(); // Stop default link behavior

    try {
      // 1. Fetch the file data
      const response = await fetch(fileUrl);

      if (!response.ok) throw new Error("Network response was not ok");

      // 2. Convert to Blob
      const blob = await response.blob();

      // 3. Create a temporary URL
      const url = window.URL.createObjectURL(blob);

      // 4. Create hidden link and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // <--- This forces the correct extension!
      document.body.appendChild(link);
      link.click();

      // 5. Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Opening in new tab instead.");
      // Fallback: Just open it in a new tab if fetch fails
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {files.map((file, index) => {
        const isImg = isImage(file);

        return (
          <div
            key={file.mediaId || index}
            className="relative group border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition-all duration-200 w-full max-w-[200px]"
          >
            {/* Preview Area */}
            <div className="h-28 w-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
              {isImg ? (
                <img
                  src={file.mediaUrl}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <FaFile className="text-4xl text-gray-400" />
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] gap-2">
                {/* View Button (Opens in new tab) */}
                <a
                  href={file.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-[var(--purple)] hover:text-white transition-colors"
                  title="View"
                >
                  <FaEye />
                </a>

                {/* Download Button (Forces correct name) */}
                <button
                  onClick={(e) =>
                    handleForceDownload(e, file.mediaUrl, file.name)
                  }
                  className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-[var(--purple)] hover:text-white transition-colors cursor-pointer"
                  title="Download"
                >
                  <FaDownload />
                </button>
              </div>
            </div>

            {/* Footer info */}
            <div className="p-3 bg-white border-t border-gray-100">
              <p
                className="text-xs font-bold text-gray-700 truncate"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-[10px] text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileAnswerDisplay;
