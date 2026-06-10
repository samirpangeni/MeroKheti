"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
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
import Loading from "@/components/Loading";

const COLORS = ["#22c55e", "#16a34a", "#14532d"];

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/farmer");
        setData(res.data.dashboard);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  const pieData = [
    {
      name: "Approved",
      value: data.approvedProducts || 0,
    },
    {
      name: "Pending",
      value: data.pendingProducts || 0,
    },
    {
      name: "Rejected",
      value: data.rejectedProducts || 0,
    },
  ];

  const barData = [
    {
      name: "Products",
      value: data.totalProducts || 0,
    },
    {
      name: "Reviews",
      value: data.totalReviews || 0,
    },
    {
      name: "Rating",
      value: data.averageRating || 0,
    },
    {
      name: "Sold",
      value: data.totalSold || 0,
    },
  ];

  const stats = [
    {
      title: "Total Products",
      value: data.totalProducts,
      gradient: "from-green-700 to-green-900",
    },
    {
      title: "Approved Products",
      value: data.approvedProducts,
      gradient: "from-emerald-600 to-green-800",
    },
    {
      title: "Pending Products",
      value: data.pendingProducts,
      gradient: "from-yellow-600 to-yellow-900",
    },
    {
      title: "Rejected Products",
      value: data.rejectedProducts,
      gradient: "from-red-700 to-red-900",
    },
    {
      title: "Total Reviews",
      value: data.totalReviews,
      gradient: "from-lime-700 to-green-900",
    },
    {
      title: "Average Rating",
      value: data.averageRating,
      gradient: "from-green-500 to-green-800",
    },
    {
      title: "Total Sold",
      value: data.totalSold,
      gradient: "from-emerald-700 to-green-950",
    },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-black via-[#051407] to-black text-white">
      <SlideBarForFarmer />

      <div className="w-full md:pl-72 p-6 md:mt-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-green-400">
            Farmer Dashboard
          </h1>

          <p className="text-green-200/60 mt-2">
            Welcome back! Here's an overview of your business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`
                bg-linear-to-br ${item.gradient}
                rounded-2xl
                p-6
                border border-green-500/20
                shadow-lg shadow-green-950/30
                hover:scale-105
                hover:shadow-green-700/20
                transition-all duration-300
              `}
            >
              <p className="text-sm text-gray-200 uppercase tracking-widest">
                {item.title}
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {item.value || 0}
              </h2>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div
            className="
            bg-[#07150a]
            border border-green-500/20
            rounded-3xl
            p-6
            backdrop-blur-lg
            shadow-xl shadow-green-950/30
          "
          >
            <h2 className="text-xl font-semibold text-green-400 mb-6">
              Product Status
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #22c55e",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div
            className="
            bg-[#07150a]
            border border-green-500/20
            rounded-3xl
            p-6
            backdrop-blur-lg
            shadow-xl shadow-green-950/30
          "
          >
            <h2 className="text-xl font-semibold text-green-400 mb-6">
              Overview Analytics
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  stroke="#4ade80"
                />

                <YAxis stroke="#4ade80" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #22c55e",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  fill="#22c55e"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;