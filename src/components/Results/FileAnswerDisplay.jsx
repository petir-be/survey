import React from "react";
import { FaFile, FaDownload, FaEye } from "react-icons/fa6";

const FileAnswerDisplay = ({ files }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {files.map((file, index) => {
        // Determine if it's an image
        const isImage =
          file.fileType?.startsWith("image/") ||
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);

        return (
          <div
            key={file.mediaId || index}
            className="relative group border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition-all duration-200 w-full max-w-[200px]"
          >
            {/* Preview Area */}
            <div className="h-28 w-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
              {isImage ? (
                <img
                  src={file.mediaUrl}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <FaFile className="text-4xl text-gray-400" />
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <a
                  href={file.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-[var(--purple)] hover:text-white transition-colors flex items-center gap-2"
                >
                  {isImage ? (
                    <>
                      <FaEye /> View
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download
                    </>
                  )}
                </a>
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
