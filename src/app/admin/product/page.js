"use client";

import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";

const Page = () => {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState("");

  // FETCH PRODUCTS
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `/api/product?status=approved&search=${search}&category=${category}&organic=${organic}`
      );
      setProduct(res.data.product);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, category, organic]);

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/product?id=${id}`);
      setProduct((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForAdmin />

      <div className="flex-1 p-8 bg-gradient-to-br from-black via-gray-950 to-green-950">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-400">
              Approved Products
            </h1>
            <p className="text-gray-400">
              Manage marketplace products
            </p>
          </div>

          <div className="text-green-400 font-bold">
            Total: {product.length}
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-8">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search product..."
            className="p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* CATEGORY */}
          <select
            className="p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Category</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="grains">Grains</option>
          </select>

          {/* ORGANIC FILTER */}
          <select
            className="p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => setOrganic(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Organic</option>
            <option value="false">Non-Organic</option>
          </select>

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {product.map((item) => (
            <div
              key={item._id}
              className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden"
            >

              <img
                src={item.image?.[0]?.url}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">

                <h1 className="text-xl font-bold">{item.name}</h1>

                <p className="text-gray-400 text-sm">
                  {item.location}
                </p>

                <div className="flex justify-between mt-2">
                  <span className="text-green-400 font-bold">
                    Rs {item.price}
                  </span>

                  <span className="text-gray-400 text-sm">
                    {item.category}
                  </span>
                </div>

                {/* ACTIONS */}
                <button
                  onClick={() => deleteProduct(item._id)}
                  className="mt-5 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-bold"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Page;