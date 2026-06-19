"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Checkout from "./Checkout";
export default function ProductFeed({ products, setProducts, search }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectProduct, setSelectProduct] = useState(null);
  const observerRef = useRef(null);
  const LIMIT = 6;

  // FETCH DATA
  const fetchProducts = async (pageNumber, selectedCategory) => {
    try {
      const res = await axios.get(
        `/api/product?status=approved&page=${pageNumber}&limit=${LIMIT}&category=${selectedCategory}&search=${search}`
      );
      const newProducts = res.data.product || [];
      if (pageNumber === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }
      setHasMore(newProducts.length === LIMIT);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // INITIAL + FILTER CHANGE
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchProducts(1, category);
  }, [category, search]);

  // INFINITE SCROLL
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        setLoadingMore(true);
        fetchProducts(nextPage, category);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  return (
    <section className="w-full mx-auto pb-24 bg-linear-to-b from-black via-[#050a08] to-black text-white h-60">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <h2 className="text-3xl font-bold tracking-wide">
          🌱 Fresh Marketplace
          <span className="block text-sm text-green-400 font-normal mt-1">
            Direct from local farmers
          </span>
        </h2>

        {/* FILTER */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-black/60 border border-green-800/40 px-4 py-2 rounded-xl 
                 text-green-200 outline-none focus:border-green-500 transition"
        >
          {["", "vegetables", "fruits", "grains", "dairy", "meat"].map((cat) => (
            <option key={cat} value={cat} className="text-black">
              {cat === "" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* SKELETON */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-green-900/20 bg-black/60 animate-pulse overflow-hidden"
            >
              <div className="h-44 bg-green-950/20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-green-900/20 w-2/3 rounded"></div>
                <div className="h-3 bg-green-900/10 w-full rounded"></div>
                <div className="h-3 bg-green-900/10 w-1/2 rounded"></div>
              </div>
            </div>
          ))}

        {/* PRODUCTS */}
        {!loading &&
          products.map((item) => (
            <div
              key={item._id}
              className="group relative rounded-2xl overflow-hidden 
                     bg-linear-to-b from-black via-[#06110d] to-black
                     border border-green-900/30 hover:border-green-500/50
                     transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image?.[0]?.url}
                  alt={item.name}
                  className="h-full w-full object-cover 
                         group-hover:scale-110 transition duration-500"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

                {/* badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.organic && (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/40 rounded-full">
                      🌱 Organic
                    </span>
                  )}
                  <span className="text-xs px-2 py-1 bg-black/60 border border-green-800/40 rounded-full text-green-200">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h3 className="text-lg font-semibold text-green-100">
                  {item.name}
                </h3>

                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {item.description}
                </p>

                {/* INFO ROW */}
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-green-400 font-semibold text-base">
                    NPR {item.price}
                  </span>

                  <span className="text-gray-400 bg-black/40 px-2 py-1 rounded-lg border border-green-900/20">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                {/* LOCATION */}
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  📍 <span>{item.location}</span>
                </p>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-5">

                  <Link href={`/product/${item._id}`} className="flex-1">
                    <button className="w-full py-2 rounded-xl border border-green-700/40 
                                   hover:bg-green-900/20 transition text-sm">
                      View Details
                    </button>
                  </Link>

                  <button
                    onClick={() => setSelectProduct(item._id)}
                    className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 
                           text-black font-semibold transition text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* CHECKOUT MODAL */}
              {selectProduct === item._id && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-4">
                  <Checkout
                    productId={selectProduct}
                    onClose={() => setSelectProduct(null)}
                  />
                </div>
              )}
            </div>
          ))}
      </div>

      {/* INFINITE SCROLL */}
      <div ref={observerRef} className="h-16 flex justify-center mt-12">
        {loadingMore && (
          <p className="text-green-400 animate-pulse">
            Loading more fresh products...
          </p>
        )}

        {!hasMore && !loading && (
          <p className="text-gray-500">
            You’ve reached the end 🌿
          </p>
        )}
      </div>
    </section>
  );
}