"use client";

import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const  Page=()=> {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataQuery = searchParams.get("data");
  const pidx = searchParams.get("pidx");

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);

        // ❗ SAFE CHECK FIRST
        if (!dataQuery && !pidx) {
          router.replace("/failed");
          return;
        }

        // ESEWA
        if (dataQuery) {
          let data;

          try {
            data = JSON.parse(atob(dataQuery));
          } catch (err) {
            router.replace("/failed");
            return;
          }

          const res = await axios.post("/api/payment/esewa/verify", {
            total_amount: data.total_amount,
            transaction_uuid: data.transaction_uuid,
            product_code: data.product_code,
          });

          if (res.data.success) {
            setTransaction(res.data.order);
          } else {
            router.replace("/failed");
          }
        }

        // KHALTI
        else if (pidx) {
          const res = await axios.post("/api/payment/khalti/verify", {
            pidx,
          });

          const data = res.data?.data;

          if (data?.status === "Completed") {
            setTransaction(res.data.order);
          } else {
            router.replace("/failed");
          }
        }
      } catch (err) {
        console.log(err);
        router.replace("/failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [dataQuery, pidx, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4">Verifying payment...</p>
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="mt-4">Transaction ID: {transaction.transaction_uuid}</p>
      </div>
    </div>
  );
}
export default Page