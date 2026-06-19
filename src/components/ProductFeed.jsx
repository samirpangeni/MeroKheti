"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Checkout from "./Checkout";

export default function ProductFeed({ products, setProducts, search }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectProduct, setSelectProduct] = useState(null);

  const observerRef = useRef(null);
  const LIMIT = 6;

  const fetchProducts = async (pageNumber, selectedCategory) => {
    try {
      const res = await axios.get(
        `/api/product?status=approved&page=${pageNumber}&limit=${LIMIT}&category=${selectedCategory}&search=${search}`
      );

      const newProducts = res.data.product || [];

      setProducts((prev) =>
        pageNumber === 1 ? newProducts : [...prev, ...newProducts]
      );

      setHasMore(newProducts.length === LIMIT);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchProducts(1, category);
  }, [category, search]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const next = page + 1;
        setPage(next);
        setLoadingMore(true);
        fetchProducts(next, category);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  return (
    <section className="min-h-screen bg-black text-white px-5 md:px-12 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400">
            Fresh Marketplace 🌿
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Direct from local farmers
          </p>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#0b0f0c] border border-green-900/40 px-4 py-2 rounded-lg text-green-200"
        >
          {["", "vegetables", "fruits", "grains", "dairy", "meat"].map((cat) => (
            <option key={cat} value={cat} className="text-black">
              {cat === "" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {/* LOADING */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-90 rounded-xl bg-[#0b0f0c] animate-pulse border border-green-900/20"
            />
          ))}

        {/* PRODUCTS */}
        {!loading &&
          products.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              selectProduct={selectProduct}
              setSelectProduct={setSelectProduct}
            />
          ))}
      </div>

      {/* INFINITE SCROLL */}
      <div ref={observerRef} className="h-20 flex items-center justify-center mt-10">
        {loadingMore && (
          <p className="text-green-400 animate-pulse">Loading more...</p>
        )}

        {!hasMore && !loading && (
          <p className="text-gray-600 pb-6">No more products 🌿</p>
        )}
      </div>
    </section>
  );
}

/* =======================
   PRODUCT CARD COMPONENT
======================= */

function ProductCard({ item, selectProduct, setSelectProduct }) {
  const [index, setIndex] = useState(0);

  // AUTO SLIDER
  useEffect(() => {
    if (!item.image?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % item.image.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [item.image]);

  return (
    <div className="group bg-[#0b0f0c] border border-green-900/20 rounded-xl overflow-hidden w-90
                    hover:border-green-500/40 transition shadow-sm hover:shadow-[0_0_25px_rgba(34,197,94,0.08)]">

      {/* IMAGE SLIDER */}
      <div className="relative h-52 overflow-hidden">

        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {item.image?.map((img) => (
            <img
              key={img._id}
              src={img.url}
              className="w-full h-52 object-cover shrink-0"
            />
          ))}
        </div>

        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

        {/* dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {item.image?.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-green-400" : "bg-gray-600"
                }`}
            />
          ))}
        </div>

        {/* badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex gap-2 items-center">
            {item.organic && (
              <span className="text-[10px] px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
                Organic
              </span>
            )}

            <span className="text-[10px] px-2 py-1 bg-black/60 text-green-200 rounded-full border border-green-900/40">
              {item.category}
            </span>
          </div>

          {/* RIGHT SIDE */}
          <span className="text-[12px] px-2 py-1 bg-green-500 text-white rounded-full border border-green-900/40">
            {item.userId?.firstName} {item.userId?.lastName}
          </span>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">

        <h3 className="text-green-100 font-semibold truncate">
          {item.name}
        </h3>

        <p className="text-gray-500 text-xs line-clamp-2">
          {item.description}
        </p>

        {/* PRICE + QTY */}
        <div className="flex justify-between items-center">
          <span className="text-green-400 font-bold">
            NPR {item.price}
          </span>

          <span className="text-xs text-gray-400">
            {item.quantity} {item.unit}
          </span>
        </div>

        <p className="text-[11px] text-gray-600">
          📍 {item.location}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2">
          <Link href={`/product/${item._id}`} className="flex-1">
            <button className="w-full text-xs py-2 rounded-lg border border-green-800/40 hover:bg-green-900/20">
              View
            </button>
          </Link>

          <button
            onClick={() => setSelectProduct(item._id)}
            className="flex-1 text-xs py-2 rounded-lg bg-green-600 hover:bg-green-500 text-black font-semibold"
          >
            Buy
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {selectProduct === item._id && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Checkout
            productId={selectProduct}
            onClose={() => setSelectProduct(null)}
          />
        </div>
      )}
    </div>
  );
}