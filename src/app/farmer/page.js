"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import Navbar from "@/components/Navbar";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/farmer");
      setData(res.data.dashboard);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-black text-red-400 items-center justify-center">
        Failed to load dashboard
      </div>
    );
  }

  // 📊 PIE DATA
  const pieData = [
    { name: "Approved", value: data.approvedProducts },
    { name: "Pending", value: data.pendingProducts },
    { name: "Rejected", value: data.rejectedProducts },
  ];

  // 📈 BAR DATA
  const barData = [
    { name: "Products", value: data.totalProducts },
    { name: "Reviews", value: data.totalReviews },
    { name: "Rating", value: data.averageRating },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForFarmer />

      <div className="flex-1 flex flex-col py-10">
      
        <div className="p-6 space-y-6 md:pl-70 p-2">

          {/* 🔥 KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

            <Card title="Total Products" value={data.totalProducts} />
            <Card title="Approved" value={data.approvedProducts} />
            <Card title="Pending" value={data.pendingProducts} />
            <Card title="Rejected" value={data.rejectedProducts} />
            <Card title="Reviews" value={data.totalReviews} />
            <Card title="Rating" value={`${data.averageRating} ⭐`} />

          </div>

          {/* 📊 CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* PIE CHART */}
            <div className="bg-black border border-green-900/40 rounded-2xl p-5 shadow-lg shadow-green-900/10">
              <h2 className="text-green-400 font-semibold mb-4">
                Product Status
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#16a34a" />
                    <Cell fill="#064e3b" />
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #14532d",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BAR CHART */}
            <div className="bg-black border border-green-900/40 rounded-2xl p-5 shadow-lg shadow-green-900/10">
              <h2 className="text-green-400 font-semibold mb-4">
                Overview Analytics
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#22c55e" />
                  <YAxis stroke="#22c55e" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #14532d",
                      color: "#fff",
                    }}
                  />

                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔥 KPI CARD COMPONENT */
const Card = ({ title, value }) => {
  return (
    <div className="bg-zinc-900 border border-green-900/30 p-4 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-xl font-bold text-green-400">{value}</h3>
    </div>
  );
};

export default Page;