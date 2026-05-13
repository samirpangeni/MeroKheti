"use client";
import React, {useState} from 'react'
import Image from 'next/image'

const ProductCard = ({ item }) => {
  const [current, setCurrent] = useState(0);

  const images = item.image || [];

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}
      <div className="relative w-full h-56">

        {images[current]?.url && (
          <Image
            src={images[current].url}
            alt={item.name}
            fill
            className="object-cover"
          />
        )}

        {/* LEFT */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-1 rounded-full"
        >
          ←
        </button>

        {/* RIGHT */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-1 rounded-full"
        >
          →
        </button>

        {/* DOTS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">

        <h2 className="text-lg font-semibold">
          {item.name}
        </h2>

        <p className="text-gray-400 text-sm line-clamp-2">
          {item.description}
        </p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-green-400 font-bold text-lg">
            Rs {item.price}
          </span>

          <span className="text-xs text-gray-500">
            Exp:{" "}
            {item.expiryDate
              ? new Date(item.expiryDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          📍 {item.location}
        </p>

        {item.organic && (
          <span className="text-xs text-green-400">
            🌱 Organic
          </span>
        )}

        {/* BUTTONS */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded-xl text-sm">
            View Detail
          </button>

          <button className="flex-1 bg-green-600 hover:bg-green-500 p-2 rounded-xl text-sm font-semibold">
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard
