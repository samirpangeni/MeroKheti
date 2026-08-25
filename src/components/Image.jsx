"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiCamera, FiGrid, FiUploadCloud, FiX } from "react-icons/fi";

const Image = ({ files, setFiles }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Open camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOpen(true);
    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Unable to access camera. Please allow camera permission and use HTTPS."
      );
    }
  };

  // Close camera
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  // Capture image from video
  const capturePhoto = () => {
    if (!videoRef.current) return;

    if (files.length >= 6) {
      closeCamera();
      return;
    }

    const video = videoRef.current;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `product-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        );

        setFiles((prev) => {
          if (prev.length >= 6) return prev;
          return [...prev, file];
        });

        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // File picker
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const remaining = 6 - files.length;

    if (remaining <= 0) return;

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const allowed = imageFiles.slice(0, remaining);

    setFiles((prev) => [...prev, ...allowed]);

    e.target.value = "";
  };

  // Cleanup camera if component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-4">

      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-muted">
        <FiGrid className="text-primary" />

        <span>Product Photos</span>

        <span className="text-xs text-red-600 dark:text-red-400">
          (minimum 2 photos)
        </span>
      </label>

      {/* Camera */}
      {cameraOpen ? (
        <div className="relative overflow-hidden rounded-3xl bg-black">

          {/* Live camera */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-[400px] w-full object-cover"
          />

          {/* Camera controls */}
          <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-4">

            {/* Close */}
            <button
              type="button"
              onClick={closeCamera}
              className="
                flex h-12 w-12 items-center justify-center
                rounded-full bg-red-600 text-white
                shadow-lg
              "
            >
              <FiX size={22} />
            </button>

            {/* Capture */}
            <button
              type="button"
              onClick={capturePhoto}
              className="
                flex h-16 w-16 items-center justify-center
                rounded-full border-4 border-white
                bg-white/20
                shadow-xl
              "
            >
              <div className="h-12 w-12 rounded-full bg-white" />
            </button>

          </div>
        </div>
      ) : (
        <>
          {/* Upload box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="
              relative flex w-full cursor-pointer flex-col
              items-center justify-center gap-2
              rounded-3xl border-2 border-dashed
              border-border bg-input p-6
              transition-all duration-300
              hover:border-primary-hover
              hover:bg-background
              active:scale-[0.99]
            "
          >
            <FiUploadCloud className="text-3xl text-primary" />

            <p className="font-medium text-muted">
              Upload product images
            </p>

            <p className="text-center text-xs text-muted">
              Tap to browse photos
            </p>

            <p className="text-center text-xs text-muted">
              JPG, PNG or WebP • Maximum 6 images
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {/* Camera button */}
          <button
            type="button"
            onClick={openCamera}
            disabled={files.length >= 6}
            className="
              flex w-full items-center justify-center gap-2
              rounded-2xl bg-primary px-5 py-3
              font-medium text-white
              transition
              hover:bg-primary-hover
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FiCamera size={20} />
            Take Photo
          </button>
        </>
      )}

      {/* Preview */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="
                group relative overflow-hidden
                rounded-2xl border border-border
                bg-background
              "
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Product image ${index + 1}`}
                className="h-32 w-full object-cover"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="
                  absolute right-2 top-2
                  flex h-8 w-8 items-center justify-center
                  rounded-full bg-red-600
                  text-white shadow-lg
                  transition
                  hover:bg-red-700
                  active:scale-90
                "
              >
                <FiX size={16} />
              </button>

              {/* Number */}
              <div
                className="
                  absolute bottom-2 left-2
                  rounded-lg bg-black/60
                  px-2 py-1
                  text-xs font-medium text-white
                  backdrop-blur-sm
                "
              >
                {index + 1}
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Status */}
      <div className="text-sm">
        {files.length === 0 && (
          <p className="text-yellow-600 dark:text-yellow-400">
            ⚡ Please add at least 2 product images.
          </p>
        )}

        {files.length === 1 && (
          <p className="text-yellow-600 dark:text-yellow-400">
            ⚡ Add 1 more image.
          </p>
        )}

        {files.length >= 2 && (
          <p className="text-primary">
            ✓ {files.length} images selected
          </p>
        )}

        {files.length === 6 && (
          <p className="mt-1 text-xs text-muted">
            Maximum of 6 images reached.
          </p>
        )}
      </div>

    </div>
  );
};

export default Image;