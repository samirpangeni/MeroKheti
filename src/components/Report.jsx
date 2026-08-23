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

    <div className="fixed inset-0  flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <form
        onSubmit={handelData}
        className="w-[90%] md:w-125 bg-background rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in duration-300"
      >

        {/* Header */}
        <div className="flex items-center justify-between">

          <h1 className="text-2xl font-bold text-muted">
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

          <label className="font-semibold text-card-foreground">
            Product Name
          </label>

          <input
            type="text"
            value={product?.name || ""}
            readOnly
            className="w-full rounded-xl border border-input-border bg-muted-background p-3 text-foreground outline-none" />

        </div>

        {/* User */}
        <div className="flex flex-col gap-2">

          <label className="font-semibold text-foreground">
            Your Name
          </label>

          <input
            type="text"
            value={`${user?.firstName || ""} ${user?.lastName || ""}`}
            readOnly
            className="border border-input-border rounded-xl p-3 bg-muted-background outline-none text-foreground"
          />

        </div>
        <div className="flex flex-col gap-2">

          <label className=" text-card-foreground">
            Report type
          </label>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border p-3 rounded-xl outline-none text-foreground"
          >
            <option value="">Select Type</option>
            {["Fake Product", "Spam", "Scam / Fraud", "Wrong Information", "Offensice Content", "Duplicate Product", "other"].map((item, idx) => (
              <option key={idx} value={item} className="text-foreground bg-background focus:bg-background">{item}</option>
            ))}
          </select>
        </div>


        {/* Report */}
        <div className="flex flex-col gap-2">

          <label className="font-semibold text-card-foreground" >
            Report Details
          </label>

          <textarea
            rows={5}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe the issue with this product..."
            className="border border-gray-300 rounded-xl p-3 outline-none focus:border-red-400 resize-none text-foreground"
          />

        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">

          <button
            type="button"
            onClick={() => setOpenReport(false)}
            className=" rounded-xl border border-border bg-card px-5 py-2 font-medium text-muted transition hover:bg-muted-background hover:text-foreground">
            Cancel
          </button>

          {/* SUBMIT */}
          <button
            type="submit"
            className="rounded-xl bg-button px-5 py-2 font-semibold text-button-foreground transition hover:bg-primary-hover">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report;