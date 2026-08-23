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
      <label className="flex items-center gap-2 text-sm font-medium text-muted">
        <FiGrid className="text-primary" />
        Product Photos
        <span className="text-red-600 dark:text-red-400 text-xs">(min 2 photos)</span>
      </label>

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current.click()}
        className="relative w-full border-2 border-dashed border-border bg-input hover:bg-background hover:border-primary-hover transition-all duration-300 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer">
        <FiUploadCloud className="text-primary text-3xl" />

        <p className="text-muted font-medium">
          Upload product images
        </p>

        <p className="text-xs text-muted">
          Click to browse or drag & drop (JPG, PNG)
        </p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files);

            const remaining = 6 - files.length; 
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
              className="relative group bg-background border border-border rounded-2xl overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-24 object-cover"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white opacity-0 transition hover:bg-red-700 group-hover:opacity-100 dark:bg-red-500 dark:hover:bg-red-600">
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status Messages */}
      <div className="text-sm">
        {files.length < 2 && (
          <p className=" text-yellow-600 dark:text-yellow-400">
            ⚡ Add at least 2 images for better visibility
          </p>
        )}

        {files.length >= 2 && (
          <p className="text-primary">
            ✓ Great! {files.length} image
            {files.length > 1 ? "s" : ""} uploaded
          </p>
        )}
      </div>
    </div>
  );
};

export default Image;