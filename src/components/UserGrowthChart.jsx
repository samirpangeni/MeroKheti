"use client";

import React from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Line,
  LineChart,
  PieChart,
  Pie,
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
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            User Analytics
          </h1>

          <p className="text-sm text-muted mt-1">
            Customer & Farmer Overview
          </p>
        </div>

        <div className="w-full h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userData}
              margin={{
                top: 10,
                right: 20,
                left: -10,
                bottom: 0,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
              />

              <XAxis
                dataKey="month"
                stroke="var(--muted)"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="var(--muted)"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                }}
              />

              <Legend />

              {/* CUSTOMER */}
              <Line
                type="monotone"
                dataKey="Customer"
                name="Customers"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#22c55e",
                }}
                activeDot={{
                  r: 7,
                }}
              />

              {/* FARMER */}
              <Line
                type="monotone"
                dataKey="Farmer"
                name="Farmers"
                stroke="#86efac"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#86efac",
                }}
                activeDot={{
                  r: 7,
                }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================ PRODUCT PIE CHART ================= */}
      <div div className="bg-background border border-border rounded-3xl p-6 shadow-2xl" >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            Product Status
          </h1>
          <p className="text-muted">
            Approved, Pending & Rejected Products
          </p>
        </div>

        <div className="w-full h-100">
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
    </div >
  );
};

export default UserGrowthChart;