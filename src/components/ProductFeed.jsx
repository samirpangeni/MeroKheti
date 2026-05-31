"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductFeed({ products, setProducts, search }) {

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [category, setCategory] = useState("");
  const [hasMore, setHasMore] = useState(true);

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
  }, [category]);

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
    <section className="max-w-6xl mx-auto px-6 pb-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">
          🌱 Fresh Marketplace
        </h2>

        {/* FILTER */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-white outline-none"
        >
          {["", "vegetables", "fruits", "grains", "dairy", "meat"].map((cat) => (
            <option key={cat} value={cat} className="text-black">
              {cat === "" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {/* SKELETON LOADING */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl animate-pulse"
            >
              <div className="h-40 bg-white/10"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/10 w-2/3 rounded"></div>
                <div className="h-3 bg-white/10 w-full rounded"></div>
                <div className="h-3 bg-white/10 w-1/2 rounded"></div>
              </div>
            </div>
          ))}

        {/* PRODUCTS */}
        {!loading &&
          products.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition"
            >
              {/* IMAGE */}
              <img
                src={item.image?.[0]?.url}
                className="h-40 w-full object-cover"
                alt={item.name}
              />

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-green-400 font-semibold">
                    NPR {item.price}
                  </span>
                  <span className="text-gray-400">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  📍 {item.location}
                </p>

                {item.organic && (
                  <span className="text-xs text-green-400 mt-2 inline-block">
                    🌱 Organic
                  </span>
                )}
              </div>
              <div className= "flex justify-between p-4">
                <Link href={`/product/${item._id}`}>
                  <button className=" p-1 bg-gray-400 rounded-lg border-0"> View Details </button>
                </Link>
                <button className=" p-1 bg-green-500 text-white rounded-lg border-0"> Buy Now </button>
              </div>
            </div>
          ))}
      </div>

      {/* INFINITE SCROLL TRIGGER */}
      <div ref={observerRef} className="h-10 flex justify-center mt-10">
        {loadingMore && (
          <p className="text-gray-400">Loading more products...</p>
        )}

        {!hasMore && !loading && (
          <p className="text-gray-500">No more products</p>
        )}
      </div>
    </section>
  );
}