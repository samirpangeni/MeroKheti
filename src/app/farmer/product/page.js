"use client";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        `/api/product?status=approved&search=${search}&category=${category}`,
      );
      setProduct(res.data.product);
    };
    getData();
  }, [search, category]);

  return (
    <div className="flex min-h-screen bg-black">
      <SlideBarForFarmer />

      <div className="flex-1 p-8 pl-70">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-500">
              Manage Products
            </h1>
            <p className="text-gray-400 mt-2">
              Manage and update your farm products
            </p>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition">
            + Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-zinc-900 border border-green-900 rounded-2xl p-6">
            <p className="text-gray-400">Total Products</p>
            <h2 className="text-3xl font-bold text-green-500 mt-2">
              {product.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-green-900 rounded-2xl p-6">
            <p className="text-gray-400">Categories</p>
            <h2 className="text-3xl font-bold text-green-500 mt-2">
              {new Set(product.map((p) => p.category)).size}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-green-900 rounded-2xl p-6">
            <p className="text-gray-400">Approved Products</p>
            <h2 className="text-3xl font-bold text-green-500 mt-2">
              {product.length}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 border border-green-900 rounded-2xl p-5 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black border border-green-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black border border-green-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {["All Categories", "vegetable", "grain", "dairy", "fruits"].map(
                (item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {product.length === 0 ? (
          <div className="bg-zinc-900 border border-green-900 rounded-2xl p-10 text-center">
            <h2 className="text-xl text-gray-400">No products found</h2>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {product.map((item) => (
              <div
                key={item._id}
                className="bg-zinc-900 border border-green-900 rounded-3xl overflow-hidden hover:border-green-500 transition duration-300 hover:shadow-lg hover:shadow-green-900/30"
              >
                <img
                  src={item.image?.[0]?.url}
                  alt={item.name}
                  className="w-full h-56 object-cover p-2 rounded-3xl"
                />

                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-white">
                      {item.name}
                    </h2>

                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-green-500 text-2xl font-bold mt-3">
                    Rs. {item.price}
                  </p>

                  <div className="mt-4 space-y-2 text-gray-400">
                    <p>
                      Category:
                      <span className="text-white ml-2">{item.category}</span>
                    </p>
                    <p>
                      Quantity:
                      <span className="text-white ml-2">{item.quantity}</span>
                    </p>
                  </div>

                  <p className="text-gray-500 mt-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        router.push(`/farmer/manage/${item._id}`);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-2xl"
                    >
                      Edit
                    </button>

                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium transition">
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
