"use client";

import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Success = () => {
  const searchParams = useSearchParams();
  const dataQuery = searchParams.get("data");
  const pidx = searchParams.get("pidx");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);

        // ESEWA
        if (dataQuery) {
          const data = JSON.parse(atob(dataQuery));

          const res = await axios.post(
            "/api/payment/esewa/verify",
            {
              total_amount: data.total_amount,
              transaction_uuid: data.transaction_uuid,
              product_code: data.product_code,
            }
          );

          if (res.data.success) {
            setTransaction(res.data.order);
          } else {
            router.push("/failed");
          }
        }

        // KHALTI
        else if (pidx) {
          const res = await axios.post(
            "/api/payment/khalti/verify",
            { pidx }
          );

          const data = res.data?.data;

          if (data?.status === "Completed") {
            setTransaction(res.data.order);
          } else {
            router.push("/failed");
          }
        } else {
          router.push("/failed");
        }
      } catch (err) {
        console.log(err);
        router.push("/failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [dataQuery, pidx]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4">Verifying payment...</p>
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-4xl">✔</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-green-600 mt-6">
          Payment Successful
        </h2>

        <div className="mt-8 bg-gray-50 rounded-2xl p-5 border space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="font-semibold text-gray-800">
              {transaction?.transaction_uuid}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-semibold text-gray-800">
              {transaction?.totalAmount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="font-semibold text-green-600">
              {transaction?.orderStatus}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Success;