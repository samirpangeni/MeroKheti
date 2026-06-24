"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNav from "@/components/DashboardNav";
import Loading from "@/components/Loading";
import Link from "next/link"
const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/order", {
          withCredentials: true,
        });
        setOrders(res.data.order || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ORDER STATUS STYLE
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // PAYMENT STATUS STYLE
  const getPaymentColor = (status) => {
    return status === "paid"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  return (
    <div className="flex min-h-screen bg-black text-white mb-10">
      {/* Sidebar */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 md:ml-72 p-6 md:p-10 bg-linear-to-b from-black via-green-950/20 to-black md:mt-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-300">
            My Orders
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your purchases, payments, and delivery status
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/10 text-gray-300">
            No orders found.
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2  p-2">
            {orders.map((order) => {
              const item = order.product?.[0];
              const product = item?.productId;

              return (
                <div
                  key={order._id}
                  className={`not-first:overflow-hidden rounded-2xl grid md:grid-cols-2
                   bg-linear-to-b from-green-950/30 to-black
                   border border-green-500/20 ${order.orderStatus === "pending" ? 'border-red-500 text-red-400' : 'bg-green-500/20'}
                   shadow-[0_0_30px_rgba(0,255,100,0.06)]
                   hover:scale-[1.02] transition duration-300`}
                >
                  {/* Product Image */}
                  <div className="h-52 w-full overflow-hidden">
                    <img
                      src={product?.image?.[0]?.url || "/placeholder.jpg"}
                      alt={product?.name}
                      className="w-full h-full object-cover p-2 rounded-2xl"
                    />
                  </div>

                  <div className="p-5">
                    {/* Order Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-green-300">
                          {product?.name}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                          Order #{order._id.slice(-6)}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantity</span>
                        <span>{item?.quantity}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span>Rs {item?.price}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Total</span>
                        <span className="text-green-300 font-semibold">
                          Rs {order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Farmer Information */}
                    <div className="mt-5 p-3 rounded-xl bg-green-950/20 border border-green-500/10">
                      <h3 className="text-green-300 font-medium mb-2">
                        Farmer Information
                      </h3>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-400">Name:</span>{" "}
                          {order.userId?.firstName || "N/A"} {order.userId?.lastName || "N/A"}
                        </p>

                        <p>
                          <span className="text-gray-400">Phone:</span>{" "}
                          {order.userId?.mobile || "N/A"}
                        </p>

                        <p>
                          <span className="text-gray-400">Address:</span>{" "}
                          {product?.location || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mt-5">
                      <h3 className="text-green-300 font-medium mb-2">
                        Payment Information
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-3 py-1 rounded-full border bg-green-500/10 text-green-300 border-green-500/20">
                          {order.paymentMethod}
                        </span>

                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${getPaymentColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        TXN ID: {order.transaction_uuid}
                      </p>
                    </div>
                    <div className="mt-5">
                      <p className="text-green-300"> Message: <span className="text-sm text-gray-500">{order.message}</span> </p>
                    </div>
                    {/* Order Dates */}
                    <div className="mt-5 pt-4 border-t border-green-500/10">
                      <div className="space-y-1 text-xs text-gray-400">
                        <p>
                          Ordered On:{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>

                        {order.updatedAt && (
                          <p>
                            Last Updated:{" "}
                            {new Date(order.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/product/${order._id}`}>
                      <button
                        className="w-full mt-5 py-3 rounded-xl
                       bg-green-500/10 hover:bg-green-500/20
                         border border-green-500/20
                        text-green-300 transition"
                      >
                        View Full Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;