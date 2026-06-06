"use client";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const dataQuery = searchParams.get("data");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (dataQuery) {
        try {
          setLoading(true);
          const data = JSON.parse(atob(dataQuery));
          const res = await axios.post(
            "/api/payment/esewa/verify",
            {
              total_amount: data.total_amount,
              transaction_uuid: data.transaction_uuid,
              product_code: data.product_code,
            },
            {
              headers: { "Content-Type": "application/json" },
            },
          );
          const { success, result } = await res.data;
          
          console.log("hello",res.data);
          console.log("hello2",success);
          if (success) {
            setTransaction(result);
          } else {
            alert("payment not verified");
            router.push("/failed");
          }
        } catch (err) {
          console.log(err);
          router.push("/failed");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [dataQuery]);
  //   if (loading || !transaction) {
  //     return <div>loading.....</div>;
  //   }
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
        <div className="mt-8 bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-semibold text-gray-800">
              {transaction?.transaction_uuid}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-gray-800">
              {transaction?.total_amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-gray-800">
              {transaction?.status}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="mt-8 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
export default Page;
