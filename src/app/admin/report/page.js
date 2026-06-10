"use client";

import React, { useState, useEffect } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import Link from "next/link"
import Loading from "@/components/Loading";
const Page = () => {
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/admin");
        setReports(res.data.report);
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false)
      }
    };

    getData();
  }, []);

  // Filter Reports
  const filteredReports =
    selectedType === "All"
      ? reports
      : reports.filter((item) => item.reportType === selectedType);
if(loading){
  return <Loading />
}
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <SlideBarForAdmin />

      {/* Main Content */}
      <div className="flex-1 p-8 pl-70 bg-gradient-to-br from-black via-[#07130b] to-[#0d1f14]">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-green-400">
            Reports Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Manage all reported products and users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Total Reports */}
          <div className="bg-[#101010] border border-green-900 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Total Reports</p>

            <h1 className="text-4xl font-bold text-green-400 mt-2">
              {reports.length}
            </h1>
          </div>

          {/* Fraud */}
          <div className="bg-[#101010] border border-red-900 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Fraud Reports</p>

            <h1 className="text-4xl font-bold text-red-400 mt-2">
              {reports.filter((r) => r.reportType === "Fraud").length}
            </h1>
          </div>

          {/* Spam */}
          <div className="bg-[#101010] border border-yellow-900 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Spam Reports</p>

            <h1 className="text-4xl font-bold text-yellow-400 mt-2">
              {reports.filter((r) => r.reportType === "Spam").length}
            </h1>
          </div>

          {/* Pending */}
          <div className="bg-[#101010] border border-blue-900 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm">Pending Reports</p>

            <h1 className="text-4xl font-bold text-blue-400 mt-2">
              {reports.length}
            </h1>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => setSelectedType("All")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${
              selectedType === "All"
                ? "bg-green-600 border-green-500"
                : "bg-[#101010] border-[#1d3b28]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedType("Fraud")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${
              selectedType === "Fraud"
                ? "bg-red-600 border-red-500"
                : "bg-[#101010] border-[#3b1d1d]"
            }`}
          >
            Fraud
          </button>

          <button
            onClick={() => setSelectedType("Spam")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${
              selectedType === "Spam"
                ? "bg-yellow-600 border-yellow-500"
                : "bg-[#101010] border-[#3b381d]"
            }`}
          >
            Spam
          </button>

          <button
            onClick={() => setSelectedType("Fake Product")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${
              selectedType === "Fake Product"
                ? "bg-purple-600 border-purple-500"
                : "bg-[#101010] border-[#2d1d3b]"
            }`}
          >
            Fake Product
          </button>

          <button
            onClick={() => setSelectedType("Wrong Information")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${
              selectedType === "Wrong Information"
                ? "bg-blue-600 border-blue-500"
                : "bg-[#101010] border-[#1d2a3b]"
            }`}
          >
            Wrong Information
          </button>
        </div>

        {/* Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((item) => (
            <div
              key={item._id}
              className="bg-[#0f0f0f] border border-[#1d3b28] rounded-3xl p-6 shadow-xl hover:border-green-500 duration-300"
            >
              {/* Top */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  {/* Product Name */}
                  <h1 className="text-2xl font-bold text-green-400">
                    {item.productId?.name}
                  </h1>

                  {/* Details */}
                  <div className="mt-4 flex flex-col gap-2">
                    {/* Report Type */}
                    <p className="text-gray-300">
                      <span className="text-green-500 font-semibold">
                        Report Type:
                      </span>{" "}
                      {item.reportType}
                    </p>

                    {/* Report By */}
                    <p className="text-gray-300">
                      <span className="text-green-500 font-semibold">
                        Report By:
                      </span>{" "}
                      {item.userId?.firstName} {item.userId?.lastName}
                    </p>

                    {/* Seller */}
                    <p className="text-gray-300">
                      <span className="text-green-500 font-semibold">
                        Seller:
                      </span>{" "}
                      {item.productId?.userId?.firstName}{" "}
                      {item.productId?.userId?.lastName}
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <span className="bg-green-900/40 border border-green-700 text-green-300 px-5 py-2 rounded-full text-sm font-semibold h-fit">
                  {item.reportType}
                </span>
              </div>

              {/* Report Message */}
              <div className="mt-6 bg-[#151515] border border-[#1e1e1e] rounded-2xl p-5">
                <h1 className="text-green-400 font-semibold mb-3">
                  Report Message
                </h1>

                <p className="text-gray-300 leading-7">{item.report}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
               <Link href={`/product/${item.productId?._id}`}>
                  <button className=" p-2 bg-green-400 rounded-lg border-0"> View Details </button>
                </Link>

                <button className="p-2 rounded-2xl bg-red-600 hover:bg-red-700 duration-300 font-semibold">
                  Delete Product
                </button>

                <button className="p-2 rounded-2xl bg-gray-800 border border-green-700 hover:bg-[#1c1c1c] duration-300 font-semibold">
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
