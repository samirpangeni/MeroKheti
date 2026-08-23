"use client";

import React, { useState, useEffect } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import Link from "next/link"
import Loading from "@/components/Loading";
import DeleteModal from "@/components/DeleteModels";
const Page = () => {
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [selectionId, setSelectionId] = useState(null)
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/admin");
        setReports(res.data.report);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    };

    getData();
  }, []);
  const deleteReport = async (id) => {
    setSelectionId(id)
    setOpen(true)
  }
  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`/api/admin?id=${selectionId}`)
      setReports((prev) => prev.filter((item) => item._id !== selectionId))
      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }
  // Filter Reports
  const filteredReports =
    selectedType === "All"
      ? reports
      : reports.filter((item) => item.reportType === selectedType);
  if (loading) {
    return <Loading />
  }
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <SlideBarForAdmin />

      {/* Main Content */}
      <div className="flex-1 p-8 pl-70 bg-linear-to-br from-background via-card to-secondary">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-green-400">
            Reports Dashboard
          </h1>

          <p className="text-muted mt-2">
            Manage all reported products and users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Total Reports */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-lg">
            <p className="text-muted text-sm">Total Reports</p>

            <h1 className="text-4xl font-bold text-primary mt-2">
              {reports.length}
            </h1>
          </div>

          {/* Fraud */}
          <div className="bg-card border border-red-900 rounded-3xl p-6 shadow-lg">
            <p className="text-muted text-sm">Fraud Reports</p>

            <h1 className="text-4xl font-bold text-red-400 mt-2">
              {reports.filter((r) => r.reportType === "Fraud").length}
            </h1>
          </div>

          {/* Spam */}
          <div className="bg-card border border-yellow-900 rounded-3xl p-6 shadow-lg">
            <p className="text-muted text-sm">Spam Reports</p>

            <h1 className="text-4xl font-bold text-yellow-400 mt-2">
              {reports.filter((r) => r.reportType === "Spam").length}
            </h1>
          </div>

          {/* Pending */}
          <div className="bg-card border border-blue-900 rounded-3xl p-6 shadow-lg">
            <p className="text-muted text-sm">Pending Reports</p>

            <h1 className="text-4xl font-bold text-blue-400 mt-2">
              {reports.length}
            </h1>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-10 text-foreground">
          <button
            onClick={() => setSelectedType("All")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${selectedType === "All"
              ? "bg-primary border-border"
              : "bg-card border-border"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedType("Fraud")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${selectedType === "Fraud"
              ? "bg-red-400 dark:bg-red-600 dark:border-red-600 border-red-400"
              : "bg-card border-[#3b1d1d]"
              }`}
          >
            Fraud
          </button>

          <button
            onClick={() => setSelectedType("Spam")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${selectedType === "Spam"
              ? "bg-yellow-400 border-yellow-400 dark:border-yellow-600 dark:bg-yellow-600 "
              : "bg-card border-[#ada821]"
              }`}
          >
            Spam
          </button>

          <button
            onClick={() => setSelectedType("Fake Product")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${selectedType === "Fake Product"
              ? "bg-purple-400 dark:border-purple-600 border-purple-400 dark:bg-purple-600"
              : "bg-card border-[#2d1d3b]"
              }`}
          >
            Fake Product
          </button>

          <button
            onClick={() => setSelectedType("Wrong Information")}
            className={`px-5 py-2 rounded-2xl border duration-300 ${selectedType === "Wrong Information"
              ? "bg-blue-400 dark:bg-blue-400  border-blue-400 dark:border-blue-600"
              : "bg-card border-[#2c24a1]"
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
              className="bg-card border border-border rounded-3xl p-6 shadow-xl hover:border-primary-hover duration-300"
            >
              {/* Top */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  {/* Product Name */}
                  <h1 className="text-2xl font-bold text-primary">
                    {item.productId?.name}
                  </h1>

                  {/* Details */}
                  <div className="mt-4 flex flex-col gap-2">
                    {/* Report Type */}
                    <p className="tect-muted">
                      <span className="text-primary font-semibold">
                        Report Type:
                      </span>{" "}
                      {item.reportType}
                    </p>

                    {/* Report By */}
                    <p className="tect-muted">
                      <span className="text-primary font-semibold">
                        Report By:
                      </span>{" "}
                      {item.userId?.firstName} {item.userId?.lastName}
                    </p>

                    {/* Seller */}
                    <p className="tect-muted">
                      <span className="text-primary font-semibold">
                        Seller:
                      </span>{" "}
                      {item.productId?.userId?.firstName}{" "}
                      {item.productId?.userId?.lastName}
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <span className="bg-card border border-border text-primary px-5 py-2 rounded-full text-sm font-semibold h-fit">
                  {item.reportType}
                </span>
              </div>

              {/* Report Message */}
              <div className="mt-6 bg-card border border-secondary rounded-2xl p-5">
                <h1 className="text-primary font-semibold mb-3">
                  Report Message
                </h1>

                <p className="tect-muted leading-7">{item.report}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href={`/product/${item.productId?._id}`}>
                  <button className=" p-2 bg-primary rounded-lg border-0"> View Details </button>
                </Link>

                <button onClick={() => { deleteReport(item._id) }} className="p-2 rounded-2xl bg-red-400 dark:bg-red-600 hover:dark:bg-red-600 hover:bg-red-400 duration-300 font-semibold">
                  Delete Product
                </button>

                <button className="p-2 rounded-2xl bg-muted border border-border hover:bg-card duration-300 font-semibold">
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DeleteModal
        isOpen={open}
        onClose={() => { setOpen(false) }}
        onConfirm={confirmDelete}
        type='Delete'
        message='This action cannot be undone. Are you sure you want to delete report'
        confirmText='Delete' />
    </div>
  );
};

export default Page;
