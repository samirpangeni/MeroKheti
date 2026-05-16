"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await axios.get("/api/cart");
        setData(response.data.carts);
      } catch (err) {
        console.log(err);
      }
    };
    handleData();
  }, []);

  const removeCart = async (id) => {
    try {
      const res = await axios.delete(`/api/cart?id=${id}`);

      alert(res.data.message);

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <div>
        <DashboardNav />
      </div>
      <div className="min-h-screen bg-black text-white px-6 py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-center">🛒 My Cart</h1>

        {/* Empty State */}
        {data.length === 0 && (
          <p className="text-center text-gray-400">Your cart is empty</p>
        )}

        {/* Cart Items */}
        <div className="grid gap-6 max-w-5xl mx-auto">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-5 hover:bg-white/10 transition"
            >
              {/* IMAGE */}
              <img
                src={item.product.image?.[0]?.url}
                alt={item.product.name}
                className="w-full md:w-40 h-40 object-cover rounded-xl"
              />

              {/* DETAILS */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{item.product.name}</h2>

                <p className="text-gray-400 text-sm">
                  Fresh product directly from farmer 🌱
                </p>

                <p className="text-gray-300">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </p>

                <p className="text-green-400 font-semibold">
                  Price: NRP {item.product.price}
                </p>

                <p className="text-yellow-300 font-bold">
                  Total: NRP {item.quantity * item.product.price}
                </p>

                {/* BUTTON */}
                <div className="flex justify-between">
                  <Link href={`/product/${item.product._id}`}>
                    <button className="mt-2 w-fit px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition">
                      View Product
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className=" bg-red-500 rounded-lg transition w-fit mt-2 px-4 py-2 hover:bg-red-600"
                    onClick={() => {
                      removeCart(item._id);
                    }}
                  >
                    Remove
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
