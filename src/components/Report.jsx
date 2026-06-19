"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const Report = ({ productId, setOpenReport }) => {

  const [reportText, setReportText] = useState("");
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [reportType, setReportType] = useState("");

  useEffect(() => {

    const getData = async () => {
      try {
        // product data
        const pRes = await axios.get(
          `/api/product/${productId}`
        );
        setProduct(pRes.data.product);

        // logged in user
        const uRes = await axios.get("/api/user");
        setUser(uRes.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    if (productId) {
      getData();
    }
  }, [productId]);

  async function handelData(e) {
    e.preventDefault();
    try {
      await axios.post("/api/report", {
        productId,
        report: reportText,
        reportType
      });
      setReportText("");
      toast.success("report submit successfully")
      setOpenReport(false);
    } catch (err) {
      console.log(err);
      toast.error("failed to submit report")
    }
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <form
        onSubmit={handelData}
        className="w-[90%] md:w-125 bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in duration-300"
      >

        {/* Header */}
        <div className="flex items-center justify-between">

          <h1 className="text-2xl font-bold text-gray-800">
            Report Product
          </h1>

          <button
            type="button"
            onClick={() => setOpenReport(false)}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        {/* Product */}
        <div className="flex flex-col gap-2">

          <label className="font-semibold text-gray-700">
            Product Name
          </label>

          <input
            type="text"
            value={product?.name || ""}
            readOnly
            className="border border-gray-300 rounded-xl p-3 bg-gray-100 outline-none text-black"
          />

        </div>

        {/* User */}
        <div className="flex flex-col gap-2">

          <label className="font-semibold text-gray-700">
            Your Name
          </label>

          <input
            type="text"
            value={`${user?.firstName || ""} ${user?.lastName || ""}`}
            readOnly
            className="border border-gray-300 rounded-xl p-3 bg-gray-100 outline-none text-black"
          />

        </div>
        <div className="flex flex-col gap-2">

          <label className=" text-black">
            Report type
          </label>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border p-3 rounded-xl outline-none text-black"
          >
            <option value="">Select Type</option>
            <option value="Fake Product">
              Fake Product
            </option>
            <option value="Spam">
              Spam
            </option>
            <option value="Fraud">
              Scam / Fraud
            </option>
            <option value="Wrong Information">
              Wrong Information
            </option>
            <option value="Offensive Content">
              Offensive Content
            </option>
            <option value="Duplicate Product">
              Duplicate Product
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>


        {/* Report */}
        <div className="flex flex-col gap-2">

          <label className="font-semibold text-gray-700">
            Report Details
          </label>

          <textarea
            rows={5}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe the issue with this product..."
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-red-400 resize-none text-black"
          />

        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">

          <button
            type="button"
            onClick={() => setOpenReport(false)}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Submit Report
          </button>

        </div>

      </form>

    </div>
  );
};

export default Report;