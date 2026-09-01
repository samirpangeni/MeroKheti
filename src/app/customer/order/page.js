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
        setLoading(true);

        const res = await axios.get("/api/order", {
          withCredentials: true,
        });

        console.log("ORDERS RESPONSE:", res.data);

        setOrders(res.data.order || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        console.error("SERVER ERROR:", err.response?.data);

        toast.error(
          err.response?.data?.message ||
          "Failed to load orders"
        );

        setOrders([]);
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

      <div
        className="
          flex-1 md:ml-72 p-6 md:p-10
          bg-linear-to-b from-background via-primary/20 to-background
          md:mt-20
        "
      >
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-muted">
            My Orders
          </h1>

          <p className="text-muted text-sm mt-1">
            Track your purchases, payments, and delivery status
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="p-6 rounded-xl border border-border bg-border/10 text-muted">
            No orders found.
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 p-2">
            {orders.map((order) => {
              const item = order.product?.[0];
              const product = item?.productId;

              return (
                <div
                  key={order._id}
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    grid md:grid-cols-2
                    bg-linear-to-b from-primary/30 to-secondary
                    border border-border
                    shadow-[0_0_30px_rgba(0,255,100,0.06)]
                    hover:scale-[1.02]
                    transition duration-300
                  `}
                >
                  {/* REPORT BUTTON */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="
                        p-2
                        dark:bg-red-400
                        bg-red-700
                        rounded-xl
                        text-foreground
                      "
                    >
                      Report Order
                    </button>
                  </div>

                  {/* PRODUCT IMAGE */}
                  <div className="h-52 w-full overflow-hidden">
                    <img
                      src={
                        product?.image?.[0]?.url ||
                        "/placeholder.jpg"
                      }
                      alt={product?.name || "Product"}
                      className="
                        w-full h-full
                        object-cover
                        p-2
                        rounded-2xl
                      "
                    />
                  </div>

                  {/* ORDER CONTENT */}
                  <div className="p-5">
                    {/* PRODUCT INFORMATION */}
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

                    {/* ORDER STATUS */}
                    <div className="mt-3">
                      <span
                        className={`
                          inline-block
                          px-3 py-1
                          rounded-full
                          text-xs
                          border
                          ${order.orderStatus === "delivered"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : order.orderStatus === "cancelled"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        `}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* ORDER DETAILS */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">
                          Quantity
                        </span>

                        <span>{item?.quantity}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted">
                          Price
                        </span>

                        <span>Rs {item?.price}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted">
                          Total
                        </span>

                        <span className="text-primary font-semibold">
                          Rs {order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* FARMER INFORMATION */}
                    <div className="mt-5 p-3 rounded-xl bg-card border border-border">
                      <h3 className="text-primary font-medium mb-2">
                        Farmer Information
                      </h3>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted">
                            Name:
                          </span>{" "}
                          {order?.userId?.firstName || "N/A"}{" "}
                          {order?.userId?.lastName || ""}
                        </p>

                        <p>
                          <span className="text-muted">
                            Phone:
                          </span>{" "}
                          {order?.userId?.mobile || "N/A"}
                        </p>

                        <p>
                          <span className="text-muted">
                            Address:
                          </span>{" "}
                          {product?.location || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* CUSTOMER DELIVERY LOCATION */}
                    <div className="mt-5 p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">📍</span>

                        <div>
                          <h3 className="text-primary font-medium">
                            Delivery Location
                          </h3>

                          <p className="text-xs text-muted">
                            Your selected delivery address
                          </p>
                        </div>
                      </div>

                      {/* MANUAL ADDRESS */}
                      {order.location?.address ? (
                        <div className="bg-background rounded-xl p-3 border border-border">
                          <p className="text-xs text-muted mb-1">
                            Delivery Address
                          </p>

                          <p className="text-sm text-foreground leading-relaxed">
                            {order.location.address}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted">
                          No manual address provided.
                        </p>
                      )}

                      {/* GPS COORDINATES */}
                      {order.location?.lat &&
                        order.location?.lng && (
                          <div className="mt-3 bg-background rounded-xl p-3 border border-border">
                            <p className="text-xs text-muted mb-1">
                              GPS Location
                            </p>

                            <p className="text-xs text-foreground">
                              Latitude:{" "}
                              {Number(
                                order.location.lat
                              ).toFixed(6)}
                            </p>

                            <p className="text-xs text-foreground mt-1">
                              Longitude:{" "}
                              {Number(
                                order.location.lng
                              ).toFixed(6)}
                            </p>
                          </div>
                        )}
                    </div>

                    {/* PAYMENT DETAILS */}
                    <div className="mt-5">
                      <h3 className="text-primary font-medium mb-2">
                        Payment Information
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-3 py-1 rounded-full border bg-primary/10 text-primary border-border">
                          {order.paymentMethod}
                        </span>

                        <span
                          className={`
                            text-xs px-3 py-1
                            rounded-full border
                            ${getPaymentColor(
                            order.paymentStatus
                          )}
                          `}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      <p className="text-xs text-muted mt-3 break-all">
                        TXN ID:{" "}
                        {order.transaction_uuid || "N/A"}
                      </p>
                    </div>

                    {/* MESSAGE */}
                    {order.message && (
                      <div className="mt-5">
                        <p className="text-primary">
                          Message:
                        </p>

                        <p className="text-sm text-muted mt-1">
                          {order.message}
                        </p>
                      </div>
                    )}

                    {/* ORDER DATES */}
                    <div className="mt-5 pt-4 border-t border-border">
                      <div className="space-y-1 text-xs text-muted">
                        <p>
                          Ordered On:{" "}
                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </p>

                        {order.updatedAt && (
                          <p>
                            Last Updated:{" "}
                            {new Date(
                              order.updatedAt
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* GET PRODUCT */}
                    {order.orderStatus !== "delivered" && (
                      <button
                        className="
                          w-full mt-5 py-3 rounded-xl
                          bg-primary/10
                          hover:bg-primary-hover
                          border border-border
                          text-primary
                          transition
                        "
                        onClick={() =>
                          updateStatus(order._id)
                        }
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

        {/* CONFIRM DELIVERY MODAL */}
        <DeleteModal
          isOpen={open}
          onClose={() => SetOpen(false)}
          onConfirm={confirmReceived}
          type="Confirm Delivery"
          message="
            Please confirm that you have successfully received
            your product. Once confirmed, this action cannot be
            undone and the order will be marked as Delivered.
          "
          confirmText="I Received It"
        />

        {/* REPORT ORDER */}
        <ReportOrder
          isReportOrder={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          reason={reason}
          setReason={SetReason}
          productId={
            selectedOrder?.product?.[0]?.productId?._id
          }
          orderId={selectedOrder?._id}
          userId={selectedOrder?.userId?._id}
        />
      </div>
    </div>
  );
};

export default Page;

