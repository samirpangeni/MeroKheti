"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModels";
import dynamic from "next/dynamic";

const DeliveryMap = dynamic(
  () => import("@/components/DeliveryMap"),
  {
    ssr: false,
  }
);
const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectionId, setSelectionId] = useState(null);
  const [open, setOpen] = useState(false)
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

  const updataStatus = async (id) => {
    setSelectionId(id);
    setOpen(true)
  }
  const confirmUpdate = async () => {
    try {
      await axios.put(`/api/order`, {
        selectionId
      });

      toast.success("Payment confirmed");
    } catch (err) {
      console.log(err);
      toast.error("Failed to confirm payment");
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
                <div className="bg-linear-to-r from-green-950 via-green-900 to-emerald-950 border-b border-green-800 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Customer Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl">
                        👤
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {order.userId?.name || "Customer"}
                        </h2>

                        <p className="text-green-300 text-sm">
                          {order.userId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col items-start md:items-end">
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium border border-green-500/30">
                        {order.orderStatus}
                      </span>

                      <p className="text-xs text-gray-400 mt-2">
                        Order ID
                      </p>

                      <p className="text-green-300 text-xs break-all max-w-55">
                        {order._id}
                      </p>
                    </div>

                  </div>
                </div>
                {/* Body */}
                <div className="p-6 space-y-5">

                  {/* Product */}
                  {order.product?.map((item) => (
                    <div
                      key={item._id}
                      className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            item.productId?.image?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={item.productId?.name}
                          className="w-28 h-28 object-cover rounded-xl"
                        />

                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-green-400">
                            {item.productId?.name}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-3 text-sm">
                            <span className="bg-zinc-800 px-3 py-1 rounded-full">
                              Qty: {item.quantity}
                            </span>

                            <span className="bg-zinc-800 px-3 py-1 rounded-full">
                              NPR {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">
                        Total Amount
                      </p>

                      <h3 className="text-2xl font-bold text-green-400 mt-2">
                        NPR {order.totalAmount}
                      </h3>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">
                        Payment Method
                      </p>

                      <h3 className="capitalize mt-2">
                        {order.paymentMethod}
                      </h3>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">
                        Payment Status
                      </p>

                      <h3
                        className={`mt-2 font-semibold ${order.paymentStatus === "paid"
                          ? "text-green-400"
                          : "text-yellow-400"
                          }`}
                      >
                        {order.paymentStatus}
                      </h3>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">
                        Ordered On
                      </p>

                      <h3 className="mt-2">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </h3>
                    </div>

                  </div>

                  {/* Message */}
                  {order.message && (
                    <div className="bg-zinc-900 rounded-2xl p-4">
                      <p className="text-sm text-gray-400 mb-2">
                        Customer Message
                      </p>

                      <p className="text-green-300">
                        {order.message}
                      </p>
                    </div>
                  )}

                  {/* Transaction */}
                  <div className="bg-zinc-900 rounded-2xl p-4">
                    <p className="text-sm text-gray-400">
                      Transaction ID
                    </p>

                    <p className="text-green-300 break-all mt-1">
                      {order.transactionId ||
                        order.transaction_uuid ||
                        "N/A"}
                    </p>
                  </div>

                  {/* Cash Payment Confirmation */}
                  {order.paymentMethod === "Cash" &&
                    order.paymentStatus === "pending" && (
                      <button
                        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 font-medium transition"
                        onClick={() => updataStatus(order._id)}
                      >
                        ✓ Confirm Customer Payment
                      </button>
                    )}
                  {/* Delivery Route */}
                  {order.location &&
                    order.product?.[0]?.productId?.farmerLocation && (
                      <div className="bg-zinc-900 rounded-2xl p-4 border border-green-900">

                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-semibold text-green-400">
                              🚚 Delivery Route
                            </h3>

                            <p className="text-sm text-gray-400">
                              Farmer → Customer
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              const farmer =
                                order.product[0].productId
                                  .farmerLocation;

                              const customer =
                                order.location;

                              window.open(
                                `https://www.google.com/maps/dir/${farmer.lat},${farmer.lng}/${customer.lat},${customer.lng}`,
                                "_blank"
                              );
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition"
                          >
                            Open Maps
                          </button>
                        </div>

                        <div className="overflow-hidden rounded-xl">
                          <DeliveryMap
                            farmerLocation={
                              order.product[0].productId
                                .farmerLocation
                            }
                            customerLocation={
                              order.location
                            }
                          />
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div >
      <DeleteModal
        isOpen={open}
        onClose={() => { setOpen(false) }}
        onConfirm={confirmUpdate}
        type='Update'
        message="Confirm that you have received payment from the customer. Once confirmed, the payment status will be updated to Paid."
        confirmText='Confirm Payment'
      />
    </div >
  );
};

export default Page;