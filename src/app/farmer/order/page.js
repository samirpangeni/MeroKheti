"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModels";
import ReportOrder from "@/components/ReportOrder";
import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("@/components/DeliveryMapClient"), {
  ssr: false,
});
const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectionId, setSelectionId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, SetReason] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/farmer/product");
      setOrders(res.data.order || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updataStatus = async (id) => {
    setSelectionId(id);
    setOpen(true);
  };
  const confirmUpdate = async () => {
    try {
      const res = await axios.put("/api/order/cash", {
        orderId,
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      if (res.data.deleted) {
        toast.success("Order completed and removed!");
      } else {
        toast.success(
          "Cash received! Waiting for customer confirmation."
        );
      }

      // Remove from farmer's UI if deleted
      if (res.data.deleted) {
        setOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
      }

    } catch (err) {
      console.error("CASH ERROR:", err);

      toast.error(
        err.response?.data?.message ||
        "Failed to confirm cash"
      );
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary text-xl">
        Loading Orders...
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0,
  );

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "pending",
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "delivered",
  ).length;

  return (
    <div>
      <SlideBarForFarmer />

      <div className="min-h-screen bg-background text-foreground md:pl-72 p-6">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Farmer Order Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="text-secondary-foreground border border-border rounded-2xl p-5">
            <p className="text-muted">Total Orders</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              {orders.length}
            </h2>
          </div>

          <div className="text-secondary-foreground border border-border rounded-2xl p-5">
            <p className="text-muted">Pending Orders</p>
            <h2 className="text-3xl font-bold text-yellow-400 mt-2">
              {pendingOrders}
            </h2>
          </div>

          <div className="text-secondary-foreground border border-border rounded-2xl p-5">
            <p className="text-muted">Delivered</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              {deliveredOrders}
            </h2>
          </div>

          <div className="text-secondary-foreground border border-border rounded-2xl p-5">
            <p className="text-muted">Revenue</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              NPR {totalRevenue}
            </h2>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-6 grid md:grid-cols-2 gap-3">
          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted">
              No Orders Found
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg"
              >
                <div className="absolute m-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 bg-red-700 rounded-xl text-foreground"
                  >
                    Report Order
                  </button>
                </div>
                {/* Header */}
                <div className="bg-linear-to-r from-background via-card to-secondary border-b border-border p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Customer Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl">
                        👤
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {order.userId?.name || "Customer"}
                        </h2>

                        <p className="text-primary text-sm">
                          {order.userId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex flex-col items-start md:items-end">
                      <span className="px-3 py-1 rounded-full bg-border text-primary text-xs font-medium border border-green-500/30">
                        {order.orderStatus}
                      </span>

                      <p className="text-xs text-muted mt-2">Order ID</p>

                      <p className="text-primary text-xs break-all max-w-55">
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
                      className="bg-card rounded-2xl p-4 border border-border"
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
                          <h3 className="text-xl font-semibold text-primary">
                            {item.productId?.name}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-3 text-sm">
                            <span className="bg-card px-3 py-1 rounded-full">
                              Qty: {item.quantity}
                            </span>

                            <span className="bg-card px-3 py-1 rounded-full">
                              NPR {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card rounded-2xl p-4">
                      <p className="text-xs text-muted">Total Amount</p>

                      <h3 className="text-2xl font-bold text-primary mt-2">
                        NPR {order.totalAmount}
                      </h3>
                    </div>

                    <div className="bg-card rounded-2xl p-4">
                      <p className="text-xs text-muted">Payment Method</p>

                      <h3 className="capitalize mt-2">{order.paymentMethod}</h3>
                    </div>

                    <div className="bg-card rounded-2xl p-4">
                      <p className="text-xs text-muted">Payment Status</p>

                      <h3
                        className={`mt-2 font-semibold ${order.paymentStatus === "paid"
                          ? "text-primary"
                          : "text-yellow-400"
                          }`}
                      >
                        {order.paymentStatus}
                      </h3>
                    </div>

                    <div className="bg-card rounded-2xl p-4">
                      <p className="text-xs text-muted">Ordered On</p>

                      <h3 className="mt-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </h3>
                    </div>
                  </div>

                  {/* Message */}
                  {order.message && (
                    <div className="bg-card rounded-2xl p-4">
                      <p className="text-sm text-muted mb-2">
                        Customer Message
                      </p>

                      <p className="text-primary">{order.message}</p>
                    </div>
                  )}

                  {/* Transaction */}
                  <div className="bg-card rounded-2xl p-4">
                    <p className="text-sm text-muted">Transaction ID</p>

                    <p className="text-primary break-all mt-1">
                      {order.transactionId || order.transaction_uuid || "N/A"}
                    </p>
                  </div>

                  {/* Cash Payment Confirmation */}
                  {order.paymentMethod === "Cash" &&
                    order.paymentStatus === "pending" && (
                      <button
                        className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover font-medium transition"
                        onClick={() => updataStatus(order._id)}
                      >
                        ✓ Confirm Customer Payment
                      </button>
                    )}
                  {/* Delivery Route */}
                  {order.location && (
                    <div className="bg-card rounded-2xl p-4 border border-border">
                      {/* Delivery Address */}
                      {order.location.address && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📍</span>
                            <div>
                              <h3 className="font-semibold text-primary"> Delivery Address </h3>
                              <p className="text-xs text-muted"> Customer's delivery location </p>
                            </div>
                          </div>
                          <div className="bg-background rounded-xl p-4 border border-border">
                            <p className="text-sm text-foreground leading-relaxed"> {order.location.address} </p>
                          </div> </div>)}
                      {/* GPS Location */} {order.location.lat && order.location.lng && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🛰️</span>
                            <h3 className="font-semibold text-primary"> GPS Location </h3>
                          </div>
                          <div className="bg-background rounded-xl p-4 border border-border">
                            <p className="text-xs text-muted"> Latitude </p>
                            <p className="text-sm text-foreground mb-2"> {Number(order.location.lat).toFixed(6)} </p>
                            <p className="text-xs text-muted"> Longitude </p>
                            <p className="text-sm text-foreground">
                              {Number(order.location.lng).toFixed(6)} </p>
                          </div>
                        </div>)}
                      {/* Delivery Route */}
                      {order.product?.[0]?.productId?.farmerLocation && order.location.lat && order.location.lng && (
                        <div className="border-t border-border pt-5">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="font-semibold text-primary"> 🚚 Delivery Route </h3>
                              <p className="text-sm text-muted"> Farmer → Customer </p>
                            </div>
                            <button
                              onClick={() => {
                                const farmer = order.product[0].productId.farmerLocation;
                                const customer = order.location; window.open(`https://www.google.com/maps/dir/${farmer.lat},${farmer.lng}/${customer.lat},${customer.lng}`, "_blank");
                              }}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition" > Open Maps </button>
                          </div>
                          <div className="overflow-hidden rounded-xl">
                            {/* <DeliveryMap
                              orderId={order._id}
                              farmerLocation={
                                order.product[0].productId.farmerLocation
                              }
                              customerLocation={order.location}
                            /> */}
                          </div>
                        </div>)}
                      {/* Address Only Notice */}
                      {order.location.address && (!order.location.lat || !order.location.lng) && (
                        <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-sm text-yellow-400"> ⚠️ Customer provided a manual address. GPS coordinates are not available, so the delivery map cannot be displayed. </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={confirmUpdate}
        type="Update"
        message="Confirm that you have received payment from the customer. Once confirmed, the payment status will be updated to Paid."
        confirmText="Confirm Payment"
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
