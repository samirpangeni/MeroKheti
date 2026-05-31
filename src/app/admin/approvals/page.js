"use client";

import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/product?status=pending");
        setProduct(res.data.product);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  // APPROVE / REJECT FUNCTION
  const updateStatus = async (id, status) => {
    try {
      await axios.put("/api/admin", { id, status });

      // remove from UI after action
      setProduct((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const deleteProduct = async (id, status) => {
    try {
      await axios.delete(`api/product?id=${id}`);
      setProduct((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForAdmin />

      <div className="flex-1 p-8 bg-linear-to-br from-black via-gray-950 to-green-950 pl-70">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-green-400">
              Product Approval Panel
            </h1>
            <p className="text-gray-400 mt-2">
              Approve or reject farmer products
            </p>
          </div>

          <div className="bg-green-500/20 border border-green-500 px-5 py-3 rounded-2xl">
            <h1 className="text-green-400 font-bold">
              Total Pending: {product.length}
            </h1>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {product.map((item) => (
            <div
              key={item._id}
              className="bg-[#111] border border-gray-800 rounded-3xl overflow-hidden hover:border-green-500 transition"
            >
              {/* MAIN IMAGE */}
              <img
                src={item.image?.[0]?.url}
                className="w-full h-52 object-cover"
              />

              {/* THUMBNAILS */}
              <div className="flex gap-2 p-2">
                {item.image?.slice(0, 2).map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </div>

              {/* CONTENT */}
              <div className="p-5">
                {/* PRODUCT NAME */}
                <h1 className="text-xl font-bold">{item.name}</h1>

                {/* FARMER INFO */}
                <p className="text-gray-400 text-sm">
                  👤 {item.userId?.firstName}
                </p>

                <p className="text-gray-500 text-xs">
                  📧 {item.userId?.email || "No email"}
                </p>

                {/* PRICE */}
                <div className="flex justify-between mt-2">
                  <span className="text-green-400 font-bold">
                    Rs {item.price}
                  </span>

                  <span className="text-gray-400 text-sm">{item.category}</span>
                </div>

                {/* PRODUCT INFO */}
                <div className="text-sm text-gray-400 mt-3 space-y-1">
                  <p>📍 {item.location}</p>

                  <p>
                    📦 {item.quantity} {item.unit}
                  </p>

                  <p>
                    🌾 Harvest:{" "}
                    {new Date(item.harvestDate).toLocaleDateString()}
                  </p>

                  <p>
                    ⏳ Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                </div>

                {/* BADGES */}
                <div className="flex gap-2 mt-3">
                  {item.organic && (
                    <span className="bg-green-500 text-black px-2 py-1 text-xs rounded">
                      Organic
                    </span>
                  )}

                  <span className="bg-yellow-500 text-black px-2 py-1 text-xs rounded">
                    Pending
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                  {item.description}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => updateStatus(item._id, "approved")}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => deleteProduct(item._id, "rejected")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
