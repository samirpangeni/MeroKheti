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
        console.log(response.data.carts.productId.price)
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
    (sum, item) => sum + item.quantity * item.productId.price,
    0
  );

  return (
    <div className="flex min-h-screen bg-backgroundtext-foreground mb-10">
      <DashboardNav />
      <div className="flex-1 md:ml-72 p-6 md:p-10 pt-20 bg-linear-to-b from-background via-primary/10 to-background md:mt-20">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            🛒 My Cart
          </h1>
          <p className="text-muted mt-1">
            Review your selected fresh products
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted text-sm">Total Items</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              {totalItems}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted text-sm">Total Price</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              Rs {totalPrice}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted text-sm">Status</p>
            <h2 className="text-2xl font-bold dark:text-yellow-600 text-yellow-300 mt-2">
              {data.length > 0 ? "Ready to checkout" : "Cart empty"}
            </h2>
          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <Loading />
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-muted grid grid-cols-3">
            <p className="text-lg">Your cart is empty 🌱</p>
            <Link href="/product">
              <button className="mt-4 px-6 py-2 bg-primary text-background rounded-xl hover:bg-primary-hover transition">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6  mx-auto">

            {data.map((item) => (
              <div
                key={item._id}
                className=" group flex flex-col md:flex-row gap-5 bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:border-primary hover:shadow-lg">

                {/* IMAGE */}
                <div className="w-full md:w-44 h-44 overflow-hidden rounded-xl bg-muted-background shrink-0">
                  <img
                    src={item.productId?.image?.[0]?.url}
                    alt={item.productId?.name || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                </div>
                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* PRODUCT NAME */}
                    <h2 className="text-xl font-semibold text-primary">
                      {item.productId?.name}
                    </h2>
                    <p className="text-muted text-sm mt-1">
                      Fresh product directly from farmer 🌱
                    </p>

                    {/* PRODUCT INFORMATION */}
                    <div className="mt-4 space-y-2 text-sm">
                      <p className="text-muted">
                        Quantity:
                        <span className="ml-2 font-medium text-foreground">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="text-muted">
                        Price:
                        <span className="ml-2 font-semibold text-primary">
                          Rs {item.productId?.price}
                        </span>
                      </p>

                      <p className="text-muted">
                        Location:
                        <span className="ml-2 text-foreground">
                          {item.productId?.location}
                        </span>
                      </p>

                      {/* TOTAL */}
                      <p className="pt-1 font-bold text-yellow-600 dark:text-yellow-300">
                        Total: Rs{" "}
                        {item.quantity * item.productId?.price}
                      </p>
                    </div>
                  </div>
                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {/* VIEW */}
                    <Link
                      href={`/product/${item.productId?._id}`}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium transition hover:bg-primary-hover">
                      View
                    </Link>
                    {/* REMOVE */}
                    <button
                      onClick={() => removeCart(item._id)}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium transition hover:bg-red-700">
                      Remove
                    </button>


                    {/* BUY */}
                    <button
                      onClick={() => setSelectProduct(item)}
                      className="px-5 py-2 rounded-xl bg-button text-button-foreground font-semibold transition hover:bg-primary-hover">
                      Buy Now
                    </button>
                  </div>
                </div>
                {/* CHECKOUT MODAL */}
                {selectProduct && (
                  <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <Checkout
                      productId={selectProduct.productId?._id}
                      quantity={selectProduct.quantity}
                      cartId={selectProduct._id}
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