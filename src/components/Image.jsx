"use client";
import React, { useRef } from "react";
import { FiGrid, FiUploadCloud, FiX } from "react-icons/fi";

const Image = ({ files, setFiles }) => {
  const fileInputRef = useRef(null);

  const handleRemove = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <FiGrid className="text-green-400" />
        Product Photos
        <span className="text-red-400 text-xs">(min 2 photos)</span>
      </label>

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="
          relative
          w-full
          border-2
          border-dashed
          border-green-900/40
          bg-black/40
          hover:bg-black/60
          hover:border-green-500/50
          transition-all
          duration-300
          rounded-3xl
          p-6
          flex
          flex-col
          items-center
          justify-center
          gap-2
          cursor-pointer
        "
      >
        <FiUploadCloud className="text-green-500 text-3xl" />

        <p className="text-gray-300 font-medium">
          Upload product images
        </p>

        <p className="text-xs text-gray-500">
          Click to browse or drag & drop (JPG, PNG)
        </p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files);

            const remaining = 6 - files.length; // allow up to 6 images
            if (remaining <= 0) return;

            const allowed = selectedFiles.slice(0, remaining);
            setFiles((prev) => [...prev, ...allowed]);
          }}
        />
      </div>

      {/* Preview Section */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="
                relative
                group
                bg-black/40
                border
                border-green-900/30
                rounded-2xl
                overflow-hidden
              "
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-24 object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="
                  absolute
                  top-1
                  right-1
                  bg-red-500/90
                  hover:bg-red-600
                  text-white
                  p-1
                  rounded-full
                  opacity-0
                  group-hover:opacity-100
                  transition
                "
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status Messages */}
      <div className="text-sm">
        {files.length < 2 && (
          <p className="text-yellow-400">
            ⚡ Add at least 2 images for better visibility
          </p>
        )}

        {files.length >= 2 && (
          <p className="text-green-400">
            ✓ Great! {files.length} image
            {files.length > 1 ? "s" : ""} uploaded
          </p>
        )}
      </div>
    </div>
  );
};

export default Image;