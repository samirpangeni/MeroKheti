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
      <div className="min-h-screen bg-backgournd flex items-center justify-center text-red-500">
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
      accent: "text-primary",
      iconBg: "bg-secondary",
    },
    {
      title: "Approved Products",
      value: data.approvedProducts,
      accent: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending Products",
      value: data.pendingProducts,
      accent: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Rejected Products",
      value: data.rejectedProducts,
      accent: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Total Reviews",
      value: data.totalReviews,
      accent: "text-primary",
      iconBg: "bg-secondary",
    },
    {
      title: "Average Rating",
      value: data.averageRating,
      accent: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Total Sold",
      value: data.totalSold,
      accent: "text-primary",
      iconBg: "bg-secondary",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SlideBarForFarmer />

      <div className="w-full md:pl-72 p-6 md:mt-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary">
            Farmer Dashboard
          </h1>

          <p className="text-secondary mt-2">
            Welcome back! Here's an overview of your business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 mb-10 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className=" rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              {/* TITLE */}
              <p className="text-sm font-medium uppercase tracking-widest text-muted">
                {item.title}
              </p>

              {/* VALUE */}
              <h2
                className={`mt-3 text-4xl font-bold ${item.accent}`}
              >
                {item.value || 0}
              </h2>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div
            className="bg-background border border-border rounded-3xl p-6 backdrop-blur-lg shadow-xl shadow-green-950/30">
            <h2 className="text-xl font-semibold text-primary mb-6">
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
            className="bg-background border-border rounded-3xl p-6 backdrop-blur-lg shadow-xl shadow-green-950/30">
            <h2 className="text-xl font-semibold text-primary mb-6">
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
                    backgroundColor: "background",
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