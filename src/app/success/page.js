"use client";

export const dynamic = "force-dynamic";

import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataQuery = searchParams.get("data");
  const pidx = searchParams.get("pidx");

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!dataQuery && !pidx) {
          router.replace("/failed");
          return;
        }

        if (dataQuery) {
          const data = JSON.parse(atob(dataQuery));

          const res = await axios.post("/api/payment/esewa/verify", data);

          if (res.data.success) setTransaction(res.data.order);
          else router.replace("/failed");
        }

        if (pidx) {
          const res = await axios.post("/api/payment/khalti/verify", {
            pidx,
          });

          if (res.data?.data?.status === "Completed") {
            setTransaction(res.data.order);
          } else router.replace("/failed");
        }
      } catch (e) {
        router.replace("/failed");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [dataQuery, pidx]);

  if (loading) return <p>Loading...</p>;
  if (!transaction) return null;

  return <h1>Payment Success 🎉</h1>;
}