"use client";
import DashboardNav from "@/components/DashboardNav";
import React, { useEffect, useState } from "react";
import ProductFeed from "@/components/ProductFeed";
import axios from "axios";
import Loading from "@/components/Loading";
import Link from "next/link"
const page = () => {
  const [products, setProducts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [review, setReview] = useState([]);
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);
  const [cart, setCart] = useState([]);
  const [pendingCount, setPendingCount] = useState([]);
  const [failedCount, setFailedCount] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/customer")
        const ures = await axios.get("/api/user")
        const pendingCount = res.data?.order?.filter(
          (o) => o.paymentStatus === "pending"
        ).length;
        const failedCount = res.data?.order?.filter(
          (o) => o.paymentStatus === "failed"
        ).length;
        setFailedCount(failedCount)
        setPendingCount(pendingCount)
        setActivity(res.data.activity)
        setOrder(res.data.order)
        setCart(res.data.cart)
        setUser(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    };
    getData();
  }, []);
  if (loading) {
    return <Loading />
  }
  return (
    <div className="flex gap-2 w-full h-screen">
      <DashboardNav />
      <div className="w-full p-2 md:px-20 md:pl-70 pt-20">
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
            <h2 className="text-3xl font-bold mt-2">{order.length}</h2>
          </div>

          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Pending</p>
            <h2 className="text-3xl font-bold mt-2">{pendingCount}</h2>
          </div>
          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">failed</p>
            <h2 className="text-3xl font-bold mt-2">{failedCount}</h2>
          </div>

          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Cart</p>
            <h2 className="text-3xl font-bold mt-2">{cart.length}</h2>
          </div>

          <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Reviews</p>
            <h2 className="text-3xl font-bold mt-2">{review.length}</h2>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-4 sm:p-6 mb-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Recent Orders
            </h2>

            <Link href="/customer/order">
              <button className="text-green-400 text-sm hover:underline">
                View All
              </button>
            </Link>
          </div>

          {/* Content */}
          {activity?.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-6">
              No Activity Yet
            </div>
          ) : (
            <div className="space-y-3">
              {activity?.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 
                     p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  {/* Left side */}
                  <div>
                    <h1 className="text-white font-medium">
                      {item.productId?.name}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      {item.productId?.userId.firstName}{" "}
                      {item.productId?.userId.lastName}
                    </p>
                  </div>

                  {/* Optional right side info (you can add status/price/date later) */}
                  <div className="text-xs text-gray-500 sm:text-right">
                    Order #{item._id.slice(-6)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Recommendations */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recommended Products</h2>
          </div>
          <ProductFeed products={products} setProducts={setProducts} search={search} setSearch={setSearch} />
        </div>
      </div>
    </div >
  );
};

export default page;
