"use client";

import { useEffect, useState } from "react";

export default function BigImage({
  images = [],
  initialIndex = 0,
  alt = "Product image",
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(initialIndex, Math.max(images.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex(
      Math.min(initialIndex, Math.max(images.length - 1, 0))
    );
  }, [initialIndex, images.length]);
  // Close with ESC + arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [images.length, onClose]);

  if (!images?.length) return null;

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/90 p-4
      "
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="
          absolute right-5 top-5 z-20
          flex h-10 w-10
          items-center justify-center
          rounded-full
          bg-white/10
          text-2xl text-white
          backdrop-blur-md
          transition
          hover:bg-white/20
        "
        aria-label="Close image"
      >
        ✕
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            previousImage();
          }}
          className="
            absolute left-4 md:left-8 z-20
            flex h-12 w-12
            items-center justify-center
            rounded-full
            bg-white/10
            text-3xl text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
          "
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="
          max-h-[92vh]
          max-w-[85vw]
          rounded-lg
          object-contain
          select-none
        "
      />

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="
            absolute right-4 md:right-8 z-20
            flex h-12 w-12
            items-center justify-center
            rounded-full
            bg-white/10
            text-3xl text-white
            backdrop-blur-md
            transition
            hover:bg-white/20
          "
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div
          className="
            absolute bottom-6
            left-1/2
            -translate-x-1/2
            rounded-full
            bg-black/60
            px-4 py-2
            text-sm text-white
            backdrop-blur-md
          "
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

