"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import Loading from "@/components/Loading";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin");

      setOrders(res.data.order || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put("/api/admin/order/status", {
        orderId,
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: status }
            : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const buyer =
      `${order.userId?.firstName || ""} ${
        order.userId?.lastName || ""
      }`.toLowerCase();

    const product =
      order.product?.[0]?.productId?.name?.toLowerCase() || "";

    const matchesSearch =
      buyer.includes(search.toLowerCase()) ||
      product.includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === ""
        ? true
        : order.orderStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const completed = orders.filter(
    (o) => o.orderStatus === "completed"
  ).length;

  const pending = orders.filter(
    (o) => o.orderStatus === "pending"
  ).length;

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SlideBarForAdmin />

      <div className="flex-1 p-6 md:pl-70 bg-linear-to-br from-background via-card to-secondary ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Order Management
          </h1>
          <p className="text-muted">
            Manage all marketplace orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5 border border-muted">
            <p className="text-muted">Total Orders</p>
            <h2 className="text-3xl font-bold">
              {orders.length}
            </h2>
          </div>

          <div className="bg-card rounded-xl p-5 border border-muted">
            <p className="text-muted">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              {pending}
            </h2>
          </div>

          <div className="bg-card rounded-xl p-5 border border-muted">
            <p className="text-muted">Completed</p>
            <h2 className="text-3xl font-bold text-primary">
              {completed}
            </h2>
          </div>

          <div className="bg-card rounded-xl p-5 border border-muted">
            <p className="text-muted">Revenue</p>
            <h2 className="text-3xl font-bold text-blue-400">
              Rs {totalRevenue}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search buyer, product..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 p-3 bg-card rounded-xl border border-muted"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="p-3 bg-card rounded-xl border border-muted"
          >
            <option value="">All Status</option>
            <option value="pending">
              Pending
            </option>
            <option value="processing">
              Processing
            </option>
            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        {/* Orders */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const item = order.product?.[0];
            const product = item?.productId;
            const buyer = order.userId;
            const seller = product?.userId;

            return (
              <div
                key={order._id}
                className="bg-card border border-muted rounded-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-muted">
                  <div className="flex justify-between">
                    <h2 className="font-bold text-primary">
                      #{order._id.slice(-8)}
                    </h2>

                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="bg-background border border-gray-700 rounded px-3 py-1"
                    >
                      <option value="pending">
                        Pending
                      </option>
                      <option value="processing">
                        Processing
                      </option>
                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="p-5">
                  <div className="flex gap-4">
                    <img
                      src={
                        product?.image?.[0]?.url
                      }
                      alt=""
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div>
                      <h3 className="font-bold text-lg">
                        {product?.name}
                      </h3>

                      <p className="text-muted">
                        Qty: {item?.quantity}
                      </p>

                      <p className="text-primary font-bold">
                        Rs {item?.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid md:grid-cols-2 gap-4">
                    <div className="bg-background/40 rounded-xl p-4">
                      <h3 className="text-blue-400 mb-2">
                        Buyer
                      </h3>

                      <p>
                        {buyer?.firstName}{" "}
                        {buyer?.lastName}
                      </p>

                      <p className="text-sm text-muted">
                        {buyer?.email}
                      </p>

                      <p className="text-sm text-muted">
                        {buyer?.mobile}
                      </p>
                    </div>

                    <div className="bg-background/40 rounded-xl p-4">
                      <h3 className="text-primary mb-2">
                        Seller
                      </h3>

                      <p>
                        {seller?.firstName}{" "}
                        {seller?.lastName}
                      </p>

                      <p className="text-sm text-muted">
                        {seller?.email}
                      </p>

                      <p className="text-sm text-muted">
                        {seller?.mobile}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 bg-background/40 p-4 rounded-xl">
                    <p>
                      Transaction:
                    </p>

                    <p className="text-xs text-muted break-all">
                      {order.transaction_uuid}
                    </p>
                  </div>

                  <div className="mt-4 bg-linear-to-r from-blue-900/20 to-green-900/20 p-4 rounded-xl border border-muted">
                    <p className="text-center">
                      👤{" "}
                      {buyer?.firstName} →
                      🌾{" "}
                      {seller?.firstName}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="text-muted text-sm">
                        Payment
                      </p>
                      <p>
                        {order.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted text-sm">
                        Status
                      </p>
                      <p className="text-primary">
                        {order.paymentStatus}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted text-sm">
                        Total
                      </p>
                      <p className="font-bold text-primary">
                        Rs {order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;