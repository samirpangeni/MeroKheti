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
    <section className="min-h-screen bg-backgournd text-foreground px-5 md:px-12 py-10 w-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Fresh Marketplace 🌿
          </h1>
          <p className="text-muted text-sm mt-1">
            Direct from local farmers
          </p>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-background border border-border text-foreground px-4 py-2 rounded-lg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20
  "
        >
          {[
            "All categories",
            "vegetables",
            "fruits",
            "grains & cereals",
            "pulses & legumes",
            "seeds & nuts",
            "dairy & eggs",
            "meat & poultry",
            "herbs & spices",
            "organic products",
            "other",
          ].map((cat) => (
            <option
              key={cat}
              value={cat}
              className="bg-card text-card-foreground"
            >
              {cat === "All categories" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full p-2">

        {/* LOADING */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-90 rounded-xl bg-background animate-pulse border border-primary w-full gap-2"
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
    <div
      className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">

        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {item.image?.map((img) => (
            <img
              key={img._id}
              src={img.url}
              alt={item.name}
              className="h-56 w-full shrink-0 object-cover transition-transform duration-500 group-hover:scale-105 p-2" />
          ))}
        </div>

        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-secondary to-transparent" />
        {/* BADGES */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          {/* LEFT */}
          <div className="flex flex-wrap gap-2">

            {item.organic && (
              <span
                className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-sm">
                🌱 Organic
              </span>
            )}

            <span
              className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
              {item.category}
            </span>

          </div>

          {/* FARMER */}
          <span
            className="max-w-30 truncate rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-sm">
            {item.userId?.firstName} {item.userId?.lastName}
          </span>

        </div>

        {/* SLIDER DOTS */}
        {item.image?.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {item.image.map((_, i) => (
              <span
                key={i}
                className={`
              h-1.5
              rounded-full
              transition-all
              ${i === index
                    ? "w-4 bg-foreground"
                    : "w-1.5 bg-card"
                  }
            `}
              />
            ))}
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="space-y-3 p-5">

        {/* PRODUCT NAME */}
        <div>
          <h3
            className="truncate text-lg font-semibold text-card-foreground"
          >
            {item.name}
          </h3>

          <p
            className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        </div>

        {/* PRICE + QUANTITY */}
        <div className="flex items-end justify-between">

          <div>
            <p className="text-xs text-muted">
              Price
            </p>

            <p className="text-xl font-bold text-primary">
              NPR {item.price}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted">
              Available
            </p>

            <p className="text-sm font-medium text-card-foreground">
              {item.quantity} {item.unit}
            </p>
          </div>

        </div>

        {/* LOCATION */}
        <div
          className="flex items-center gap-2 rounded-lg bg-muted-background px-3 py-2">
          <span className="text-sm">
            📍
          </span>

          <p className="truncate text-xs text-muted">
            {item.location}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-border" />

        {/* ACTIONS */}
        <div className="flex gap-2">

          <Link
            href={`/product/${item._id}`}
            className="flex-1"
          >
            <button
              className=" w-full rounded-lg border border-border bg-transparent py-2.5 text-sm font-medium text-card-foreground transition hover:bg-muted-background">
              View Details
            </button>
          </Link>

          <button
            onClick={() => setSelectProduct(item._id)}
            className=" flex-1 rounded-lg bg-button py-2.5 text-sm font-semibold text-button-foreground transition hover:opacity-90">
            Buy Now
          </button>

        </div>

      </div>

      {/* CHECKOUT MODAL */}
      {selectProduct === item._id && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <Checkout
            productId={selectProduct}
            onClose={() => setSelectProduct(null)}
          />
        </div>
      )}
    </div>
  );
}