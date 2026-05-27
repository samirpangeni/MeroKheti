"use client";

import React from "react";

import {
  ResponsiveContainer,

  // LINE CHART
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,

  // PIE CHART
  PieChart,
  Pie,
  Cell,
} from "recharts";

const UserGrowthChart = ({
  customer,
  farmer,
  approved,
  pending,
  reject,
}) => {

  // USER LINE CHART DATA
  const userData = [
    {
      month: "Users",
      Customer: customer,
      Farmer: farmer,
    },
  ];

  // PRODUCT PIE CHART DATA
  const productData = [
    {
      name: "Approved",
      value: approved,
    },
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "Rejected",
      value: reject,
    },
  ];

  // COLORS
  const COLORS = [
    "#22c55e",
    "#eab308",
    "#ef4444",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

      {/* ================= USER CHART ================= */}

      <div className="bg-black border border-green-900 rounded-3xl p-6 shadow-2xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-400">
            User Analytics
          </h1>

          <p className="text-gray-400">
            Customer & Farmer Overview
          </p>
        </div>

        <div className="w-full h-[400px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart
              data={userData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#14532d"
              />

              <XAxis
                dataKey="month"
                stroke="#4ade80"
              />

              <YAxis
                stroke="#4ade80"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #166534",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="Customer"
                stroke="#22c55e"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#22c55e",
                }}
              />

              <Line
                type="monotone"
                dataKey="Farmer"
                stroke="#86efac"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#86efac",
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= PRODUCT PIE CHART ================= */}

      <div className="bg-black border border-green-900 rounded-3xl p-6 shadow-2xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-400">
            Product Status
          </h1>

          <p className="text-gray-400">
            Approved, Pending & Rejected Products
          </p>
        </div>

        <div className="w-full h-[400px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                dataKey="value"
                label
              >

                {productData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />
                ))}

              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #166534",
                  borderRadius: "10px",
                  color: "#fff",
                }}
              />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default UserGrowthChart;