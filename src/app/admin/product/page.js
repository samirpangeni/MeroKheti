"use client";

import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import Loading from "@/components/Loading";

const Page = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/api/admin/product");
        setProduct(res.data.products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/admin?id=${id}`);

      setProduct((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = product.filter((item) => {
    const matchSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category
      ? item.category?.toLowerCase() === category.toLowerCase()
      : true;

    const matchOrganic =
      organic === ""
        ? true
        : item.organic.toString() === organic;

    return matchSearch && matchCategory && matchOrganic;
  });

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForAdmin />

      <div className="flex-1 p-8 pl-70 bg-gradient-to-br from-black via-gray-950 to-green-950">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-400">
              Approved Products
            </h1>
            <p className="text-gray-400">
              Manage marketplace products
            </p>
          </div>

          <div className="bg-green-900/30 border border-green-500 px-4 py-2 rounded-xl">
            <span className="text-green-400 font-bold">
              Total Products: {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search product or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-green-500 outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-gray-900 border border-gray-700"
          >
            <option value="">All Category</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="grains">Grains</option>
          </select>

          <select
            value={organic}
            onChange={(e) => setOrganic(e.target.value)}
            className="p-3 rounded-xl bg-gray-900 border border-gray-700"
          >
            <option value="">All Products</option>
            <option value="true">Organic</option>
            <option value="false">Non-Organic</option>
          </select>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.image?.[0]?.url}
                    alt={item.name}
                    className="w-full h-56 object-cover"
                  />

                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      item.organic
                        ? "bg-green-600"
                        : "bg-orange-600"
                    }`}
                  >
                    {item.organic ? "Organic" : "Non Organic"}
                  </span>
                </div>

                <div className="p-5">
                  {/* NAME */}
                  <h2 className="text-2xl font-bold mb-1">
                    {item.name}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    📍 {item.location}
                  </p>

                  {/* PRICE */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-400 text-xl font-bold">
                      Rs {item.price}
                    </span>

                    <span className="px-3 py-1 bg-gray-800 rounded-full text-xs capitalize">
                      {item.category}
                    </span>
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-gray-900 rounded-lg p-2 text-center">
                      <p className="text-yellow-400 font-bold">
                        ⭐ {item.averageRating || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rating
                      </p>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-2 text-center">
                      <p className="text-blue-400 font-bold">
                        {item.totalReview || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reviews
                      </p>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-2 text-center">
                      <p className="text-red-400 font-bold">
                        {item.totalReport || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reports
                      </p>
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="mt-4 border-t border-gray-800 pt-4 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">
                        Quantity:
                      </span>{" "}
                      {item.quantity} {item.unit}
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Status:
                      </span>{" "}
                      <span className="text-green-400 capitalize">
                        {item.status}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Harvest:
                      </span>{" "}
                      {new Date(
                        item.harvestDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Expiry:
                      </span>{" "}
                      {new Date(
                        item.expiryDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="text-gray-500">
                        Created:
                      </span>{" "}
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* FARMER */}
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <h3 className="text-green-400 font-semibold mb-2">
                      Farmer Information
                    </h3>

                    <p className="text-sm">
                      👨‍🌾 {item.userId?.firstName}{" "}
                      {item.userId?.lastName}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 break-all">
                      ID: {item.userId?._id}
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <h3 className="text-green-400 font-semibold mb-2">
                      Description
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex gap-3">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium transition">
                      View Details
                    </button>

                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="flex justify-center items-center h-60">
            <h1 className="text-gray-500 text-xl">
              No Products Found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;