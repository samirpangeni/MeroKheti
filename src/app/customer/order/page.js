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
      const res = await axios.put("/api/order", {
        orderId: selectionId,
        action: "customer_received",
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      if (res.data.deleted) {
        toast.success("Order completed!");
      } else {
        toast.success(
          "Product received! Waiting for cash confirmation."
        );
      }

      // Remove from current UI
      setOrders((prev) =>
        prev.filter((order) => order._id !== selectionId)
      );

      SetOpen(false);
      setSelectionId(null);

    } catch (err) {
      console.error("RECEIVE PRODUCT ERROR:", err);

      toast.error(
        err.response?.data?.message ||
        "Failed to confirm product"
      );
    }
  };

  // PAYMENT STATUS STYLE
  const getPaymentColor = (status) => {
    return status === "paid"
      ? "bg-green-500/20 text-primary border-green-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground mb-10">
      <DashboardNav />

      <div className="flex-1 md:ml-72 p-6 md:p-10 bg-linear-to-b from-background via-primary/20 to-background md:mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-muted">My Orders</h1>
          <p className="text-muted text-sm mt-1">
            Track your purchases, payments, and delivery status
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="p-6 rounded-xl border border-border bg-border/10 text-muted">
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
                   bg-linear-to-b from-primary/30 to-secondary
                   border border-border ${order.orderStatus === "pending" ? "border-red-500 text-red-400" : "bg-primary/20"}
                   shadow-[0_0_30px_rgba(0,255,100,0.06)]
                   hover:scale-[1.02] transition duration-300`}
                >
                  <div className="absolute m-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 dark:bg-red-400 bg-red-700 rounded-xl text-foreground"
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
                        <h2 className="text-lg font-semibold text-primary">
                          {product?.name}
                        </h2>

                        <p className="text-xs text-muted mt-1">
                          Order #{order._id.slice(-6)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Quantity</span>
                        <span>{item?.quantity}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted">Price</span>
                        <span>Rs {item?.price}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted">Total</span>
                        <span className="text-primary font-semibold">
                          Rs {order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Farmer Information */}
                    <div className="mt-5 p-3 rounded-xl bg-card border border-border">
                      <h3 className="text-primary font-medium mb-2">
                        Farmer Information
                      </h3>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted">Name:</span>{" "}
                          {order?.userId?.firstName || "N/A"}{" "}
                          {order?.userId?.lastName || "N/A"}
                        </p>

                        <p>
                          <span className="text-muted">Phone:</span>{" "}
                          {order?.userId?.mobile || "N/A"}
                        </p>

                        <p>
                          <span className="text-muted">Address:</span>{" "}
                          {product?.location || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mt-5">
                      <h3 className="text-primary font-medium mb-2">
                        Payment Information
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-3 py-1 rounded-full border bg-primary/10 text-primary border-border">
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

                      <p className="text-xs text-muted mt-3">
                        TXN ID: {order.transaction_uuid}
                      </p>
                    </div>
                    <div className="mt-5">
                      <p className="text-primary">
                        Message:
                        <span className="text-sm text-muted">
                          {order.message}
                        </span>{" "}
                      </p>
                    </div>
                    {/* Order Dates */}
                    <div className="mt-5 pt-4 border-t border-border">
                      <div className="space-y-1 text-xs text-muted">
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
                       bg-primary/10 hover:bg-primary-hover
                        border border-border
                       text-primary transition"
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