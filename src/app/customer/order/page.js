"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNav from "@/components/DashboardNav";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import ReportOrder from "@/components/ReportOrder";
import DeleteModal from "@/components/DeleteModels";
const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, SetReason] = useState("");
  const [open, SetOpen] = useState(false);
  const [selectionId, setSelectionId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  const updateStatus = async (id) => {
    setSelectionId(id);
    SetOpen(true);
  };
  const confirmReceived = async () => {
    try {
      await axios.put(`/api/OrderReport`, {
        selectionId,
      });
      toast.success("product update successfully");
      SetOpen(false)
    } catch (err) {
      console.log(err);
      toast.error("Failed to update product");
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
      <DashboardNav />

      <div className="flex-1 md:ml-72 p-6 md:p-10 bg-linear-to-b from-black via-green-950/20 to-black md:mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-300">My Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your purchases, payments, and delivery status
          </p>
        </div>

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
                   border border-green-500/20 ${order.orderStatus === "pending" ? "border-red-500 text-red-400" : "bg-green-500/20"}
                   shadow-[0_0_30px_rgba(0,255,100,0.06)]
                   hover:scale-[1.02] transition duration-300`}
                >
                  <div className="absolute m-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-red-700 rounded-xl text-white"
                    >
                      Report Order
                    </button>
                  </div>
                  <div className="h-52 w-full overflow-hidden">
                    <img
                      src={product?.image?.[0]?.url || "/placeholder.jpg"}
                      alt={product?.name}
                      className="w-full h-full object-cover p-2 rounded-2xl"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-green-300">
                          {product?.name}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                          Order #{order._id.slice(-6)}
                        </p>
                      </div>
                    </div>

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
                          {order?.userId?.firstName || "N/A"}{" "}
                          {order?.userId?.lastName || "N/A"}
                        </p>

                        <p>
                          <span className="text-gray-400">Phone:</span>{" "}
                          {order?.userId?.mobile || "N/A"}
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
                            order.paymentStatus,
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
                      <p className="text-green-300">
                        Message:
                        <span className="text-sm text-gray-500">
                          {order.message}
                        </span>{" "}
                      </p>
                    </div>
                    {/* Order Dates */}
                    <div className="mt-5 pt-4 border-t border-green-500/10">
                      <div className="space-y-1 text-xs text-gray-400">
                        <p>
                          Ordered On:
                          {new Date(order.createdAt).toLocaleString()}
                        </p>

                        {order.updatedAt && (
                          <p>
                            Last Updated:
                            {new Date(order.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {order.orderStatus !== "delivered" && (
                      <button
                        className="w-full mt-5 py-3 rounded-xl
                       bg-green-500/10 hover:bg-green-500/20
                        border border-green-500/20
                       text-green-300 transition"
                        onClick={() => updateStatus(order._id)}
                      >
                        Get Product
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={open}
        onClose={() => SetOpen(false)}
        onConfirm={confirmReceived}
        type="Confirm Delivery"
        message="Please confirm that you have successfully received your product. Once confirmed, this action cannot be undone and the order will be marked as Delivered."
        confirmText="I Received It"
      />

      <ReportOrder
        isReportOrder={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        reason={reason}
        setReason={SetReason}
        productId={selectedOrder?.product?.[0]?.productId?._id}
        orderId={selectedOrder?._id}
        userId={selectedOrder?.userId?._id}
      />
    </div>
  );
};

export default Page;
