"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import Loading from "@/components/Loading";
import Checkout from "@/components/Checkout";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectProduct, setSelectProduct] = useState(null);

  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await axios.get("/api/cart", {
          withCredentials: true,
        });
        setData(response.data.carts || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    handleData();
  }, []);

  const removeCart = async (id) => {
    try {
      await axios.delete(`/api/cart?id=${id}`, {
        withCredentials: true,
      });

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = data.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="flex min-h-screen bg-black text-white mb-10">

      <DashboardNav />

      <div className="flex-1 md:ml-72 p-6 md:p-10 pt-20 bg-linear-to-b from-black via-green-950/10 to-black md:mt-20">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            🛒 My Cart
          </h1>
          <p className="text-gray-400 mt-1">
            Review your selected fresh products
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-green-950/40 border border-green-500/20 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Items</p>
            <h2 className="text-3xl font-bold text-green-300 mt-2">
              {totalItems}
            </h2>
          </div>

          <div className="bg-green-950/40 border border-green-500/20 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Price</p>
            <h2 className="text-3xl font-bold text-green-300 mt-2">
              Rs {totalPrice}
            </h2>
          </div>

          <div className="bg-green-950/40 border border-green-500/20 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Status</p>
            <h2 className="text-2xl font-bold text-yellow-300 mt-2">
              {data.length > 0 ? "Ready to checkout" : "Cart empty"}
            </h2>
          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <Loading />
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Your cart is empty 🌱</p>
            <Link href="/product">
              <button className="mt-4 px-6 py-2 bg-green-500 text-black rounded-xl hover:bg-green-400 transition">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6  mx-auto">

            {data.map((item) => (
              <div
                key={item._id}
                className="
                  group flex flex-col w-fit md:flex-row gap-5
                  bg-linear-to-br from-green-950/40 via-black to-green-950/10
                  border border-green-500/20
                  rounded-2xl p-5
                  hover:border-green-400/40
                  hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]
                  transition-all duration-300
                "
              >

                {/* IMAGE */}
                <div className="w-full md:w-44 h-44 overflow-hidden rounded-xl">
                  <img
                    src={item.product.image?.[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between">

                  <div>

                    <h2 className="text-xl font-semibold text-green-300">
                      {item.product.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Fresh product directly from farmer 🌱
                    </p>

                    <div className="mt-3 space-y-1 text-sm">

                      <p>
                        Quantity:{" "}
                        <span className="text-white font-medium">
                          {item.quantity}
                        </span>
                      </p>

                      <p>
                        Price:{" "}
                        <span className="text-green-300">
                          Rs {item.product.price}
                        </span>
                      </p>

                      <p className="font-bold text-yellow-300">
                        Total: Rs {item.quantity * item.product.price}
                      </p>

                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-5">

                    <Link href={`/product/${item.product._id}`}>
                      <button className="px-4 py-2 bg-green-500 text-black rounded-xl hover:bg-green-400 transition">
                        View
                      </button>
                    </Link>

                    <button
                      onClick={() => removeCart(item._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => setSelectProduct(item._id)}
                      className="flex-1 text-xs py-2 rounded-lg bg-green-600 hover:bg-green-500 text-black font-semibold"
                    >
                      Buy
                    </button>
                  </div>
                </div>
                {/* CHECKOUT MODAL */}
                {selectProduct === item._id && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <Checkout
                      productId={selectProduct?.productId}
                      quantity={selectProduct?.quantity}
                      cartId={selectProduct?.cartId}
                      onClose={() => setSelectProduct(null)}
                     
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;