"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/farmer");
      setOrders(res.data.order || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put("/api/farmer/orders/status", {
        orderId: id,
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? { ...order, orderStatus: status }
            : order
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-400 text-xl">
        Loading Orders...
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "delivered"
  ).length;

  return (
    <div>
      <SlideBarForFarmer />

      <div className="min-h-screen bg-black text-white md:pl-72 p-6">
        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Farmer Order Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
            <p className="text-gray-400">Total Orders</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {orders.length}
            </h2>
          </div>

          <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
            <p className="text-gray-400">Pending Orders</p>
            <h2 className="text-3xl font-bold text-yellow-400 mt-2">
              {pendingOrders}
            </h2>
          </div>

          <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
            <p className="text-gray-400">Delivered</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {deliveredOrders}
            </h2>
          </div>

          <div className="bg-green-950 border border-green-800 rounded-2xl p-5">
            <p className="text-gray-400">Revenue</p>
            <h2 className="text-3xl font-bold text-green-400 mt-2">
              NPR {totalRevenue}
            </h2>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-gray-400">
              No Orders Found
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-950 border border-green-900 rounded-3xl overflow-hidden shadow-lg"
              >
                {/* Header */}
                <div className="bg-green-950 border-b border-green-900 p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-green-400">
                        {order.userId?.name || "Customer"}
                      </h2>

                      <p className="text-gray-400">
                        {order.userId?.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="text-green-300 text-xs break-all">
                        {order._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {order.product?.map((item) => (
                    <div
                      key={item._id}
                      className="bg-zinc-900 rounded-2xl p-4 mb-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            item.productId?.image?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={item.productId?.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-green-300">
                            {item.productId?.name}
                          </h3>

                          <p className="text-gray-400 mt-2">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-gray-400">
                            Price: NPR {item.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Info Cards */}
                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">
                        Total Amount
                      </p>

                      <h3 className="text-2xl font-bold text-green-400">
                        NPR {order.totalAmount}
                      </h3>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">
                        Payment Method
                      </p>

                      <h3 className="capitalize">
                        {order.paymentMethod}
                      </h3>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">
                        Payment Status
                      </p>

                      <h3
                        className={
                          order.paymentStatus === "paid"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {order.paymentStatus}
                      </h3>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">
                        Ordered On
                      </p>

                      <h3>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </h3>
                    </div>
                  </div>

                  {/* Transaction */}
                  <div className="mt-4 bg-zinc-900 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">
                      Transaction ID
                    </p>

                    <p className="text-green-300 break-all">
                      {order.transactionId ||
                        order.transaction_uuid ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="mt-5">
                    <p className="text-text-400"> Message: <span className="text-sm text-green-300">{order.message}</span> </p>
                  </div>

                  {/* Status Update */}
                  <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Order Status
                      </p>

                      <p className="text-green-400 font-semibold capitalize">
                        {order.orderStatus}
                      </p>
                    </div>

                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="bg-green-900 border border-green-700 rounded-xl px-4 py-2 outline-none"
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;