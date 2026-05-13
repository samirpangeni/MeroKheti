// Image.jsx
"use client";
import React, { useRef } from "react";
import {
  FiGrid,
} from "react-icons/fi";

const Image = ({ files, setFiles }) => {
  const fileInputRef = useRef(null);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <FiGrid className="w-4 h-4" />
        Product Photos{" "}
        <span className="text-red-400">* (min 2 photos)</span>
      </label>
      <div
        className="border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 w-full p-4 cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        {" "}
        <p>Upload images</p>{" "}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files);
            const remaining = 2 - files.length;
            if (remaining <= 0) {
              alert("Only 2 images allowed");
              return;
            }
            const allowed = selectedFiles.slice(0, remaining);
            setFiles((prev) => [...prev, ...allowed]);
          }}
        />{" "}
        <p className="text-6xl">☁</p>{" "}
      </div>{" "}
      {/* PREVIEW */}{" "}
      <div className="flex gap-3 mt-3">
        {" "}
        {files.map((file, index) => (
          <div key={index} className="text-center">
            {" "}
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />{" "}
            <p className="text-xs">{file.name}</p>{" "}
            <button
              type="button"
              onClick={() => {
                const updated = files.filter((_, i) => i !== index);
                setFiles(updated);
              }}
              className="text-white bg-red-600 px-2 py-1 rounded mt-1"
            >
              {" "}
              Remove{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      <p className="mt-2 text-sm">Minimum 2 images required</p>{" "}
      {files.length < 2 && (
        <p className="text-xs text-yellow-400 mt-2">
          ⚡ Tip: Add 2-6 photos from different angles to help customers
          see your product clearly
        </p>
      )}
      {files.length >= 2 && (
        <p className="text-xs text-green-400 mt-2">
          ✓ Great! {files.length} photo{files.length > 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
};

export default Image;
