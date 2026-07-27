import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ReportOrder = ({
  isReportOrder,
  onClose,
  reason,
  setReason,
  productId,
  orderId,
  userId,
}) => {
  if (!isReportOrder) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/OrderReport", {
        userId,
        productId,
        orderId,
        reason,
      });

      setReason("");
      toast.success("Report submitted successfully");
      onClose(); 
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Report Order</h2>

              <p className="text-gray-400 text-sm">Tell us what went wrong.</p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {/* Reason */}

        <div className="mt-6">
          <label className="text-gray-300 text-sm">Reason</label>

          <textarea
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the problem with this order..."
            className="w-full mt-2 bg-black border border-gray-700 rounded-xl p-3 text-white resize-none outline-none focus:border-red-500"
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportOrder;
