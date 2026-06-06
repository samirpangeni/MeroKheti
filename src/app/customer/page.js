"use client";
import DashboardNav from "@/components/DashboardNav";
import React, { useEffect, useState } from "react";
import ProductFeed from "@/components/ProductFeed";
import axios from "axios";

const page = () => {
  const [products, setProducts] = useState([]);
  const [review, setReview] = useState([]);
  const [user, setUser] = useState([]);
  const[search, setSearch] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);

        const review = await axios.get("api/review/my");
        setReview(
          Array.isArray(review.data.review)
            ? review.data.review
            : review.data.review
              ? [review.data.review]
              : [],
        );
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return (
    <div className="flex gap-2">
      <DashboardNav />
      <div className="w-full p-2 md:px-20 md:py-20">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
          <p className="mt-2 text-green-600 text-2xl">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-400 mt-2">
            Manage your orders and explore fresh products
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Orders</p>
            <h2 className="text-3xl font-bold mt-2">12</h2>
          </div>

          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Pending</p>
            <h2 className="text-3xl font-bold mt-2">2</h2>
          </div>

          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Wishlist</p>
            <h2 className="text-3xl font-bold mt-2">5</h2>
          </div>

          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Reviews</p>
            <h2 className="text-3xl font-bold mt-2">{review.length}</h2>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>

            <button className="text-green-400 text-sm">View All</button>
          </div>

          <div className="space-y-4">
            <div className="bg-black/20 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Fresh Tomato</h3>

                <p className="text-sm text-gray-400">Delivered on May 20</p>
              </div>

              <span className="text-green-400 text-sm">Delivered</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recommended Products</h2>
          </div>
          <ProductFeed products={products} setProducts={setProducts} search={search} setSearch={setSearch}/>
        </div>
      </div>
    </div>
  );
};

export default page;
