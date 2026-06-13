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
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`/api/product?id=${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalProducts = products.length;
  const approvedProducts = products.filter(
    (p) => p.status === "approved",
  ).length;

  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      <SlideBarForFarmer />

      <div className="md:pl-70 p-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-green-400">
              Product Dashboard
            </h1>
            <p className="text-zinc-400 mt-2">
              Manage all your farm products from one place.
            </p>
          </div>

          <Link
            href="/addProduct"
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold">
            + Add Product
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mt-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">Total Products</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">Approved Products</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {approvedProducts}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">Total Stock</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {totalStock}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-full md:w-112.5 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-green-500"/>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 bg-zinc-900 rounded-2xl p-10 text-center border border-zinc-800">
            <h2 className="text-xl text-zinc-400">No products found</h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {filtered.map((p) => (
              <div
                key={p._id}
                className=" bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-green-500 transition-all duration-300">
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={p.image?.[0]?.url}
                    alt={p.name}
                    className="w-full h-56 object-cover"
                  />

                  {/* STATUS */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          p.status === "approved"
                            ? "bg-green-900 text-green-400"
                            : p.status === "pending"
                              ? "bg-yellow-900 text-yellow-400"
                              : "bg-red-900 text-red-400"
                        }
                      `}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* ORGANIC */}
                  {p.organic && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                        Organic
                      </span>
                    </div>
                  )}
                </div>

                {/* BODY */}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{p.name}</h2>

                      <p className="text-zinc-500 text-sm">{p.category}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-zinc-500 text-xs">Price</p>

                      <h3 className="text-green-400 font-bold text-lg">
                        Rs {p.price}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mt-4 line-clamp-2">
                    {p.description}
                  </p>

                  {/* INFO */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-zinc-800 rounded-xl p-3">
                      <p className="text-zinc-500 text-xs">Stock</p>

                      <p className="font-semibold">
                        {p.quantity} {p.unit}
                      </p>
                    </div>

                    <div className="bg-zinc-800 rounded-xl p-3">
                      <p className="text-zinc-500 text-xs">Location</p>

                      <p className="font-semibold truncate">{p.location}</p>
                    </div>
                  </div>

                  {/* STOCK BAR */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-zinc-500">Stock Level</span>

                      <span className="text-green-400">{p.quantity}</span>
                    </div>

                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${Math.min((p.quantity / 100) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* FARMER */}
                  <div className="mt-5 pt-4 border-t border-zinc-800">
                    <p className="text-zinc-500 text-xs">Farmer</p>

                    <p className="text-sm font-medium">
                      {p.userId?.firstName} {p.userId?.lastName}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-6">
                    <Link
                      href={`/farmer/manage/${p._id}`}
                      className="flex-1 text-center py-3 rounded-xl bg-green-600 hover:bg-green-500 font-medium">
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-medium">
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
