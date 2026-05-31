"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      setProducts(res.data.product || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      await axios.delete(`/api/product?id=${id}`);
      toast.success("Deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Toaster />
      <SlideBarForFarmer />

      <div className="flex-1 p-6 space-y-6 pl-70">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-green-400">
              Product Dashboard
            </h1>
            <p className="text-zinc-500 mt-1">
              Manage your farm products like a pro
            </p>
          </div>

          <Link
            href="/farmer/add"
            className="bg-green-600 hover:bg-green-500 transition px-5 py-3 rounded-xl font-semibold shadow-lg shadow-green-900/40"
          >
            + Add Product
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full md:w-96 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl focus:border-green-500 outline-none"
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <h2 className="text-xl text-zinc-400">No products found</h2>
          </div>
        ) : (
          /* GRID CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:scale-[1.02] transition duration-300 shadow-lg shadow-green-900/10"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={p.image?.[0]?.url}
                    className="w-full h-48 object-cover"
                  />

                  {/* STATUS BADGE */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        p.status === "approved"
                          ? "bg-green-900 text-green-400"
                          : p.status === "pending"
                            ? "bg-yellow-900 text-yellow-400"
                            : "bg-red-900 text-red-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-bold text-white">{p.name}</h2>

                  <p className="text-zinc-400 text-sm">{p.category}</p>

                  <div className="flex justify-between text-sm mt-2">
                    <div>
                      <p className="text-zinc-500">Price</p>
                      <p className="text-green-400 font-semibold">
                        Rs {p.price}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Quantity</p>
                      <p className="text-white">
                        {p.quantity} {p.unit}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/farmer/manage/${p._id}`}
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
