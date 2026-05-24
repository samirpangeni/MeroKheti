"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from 'next/link'

const Page = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleData = async () => {
      try {
        let url = "/api/review/my";

        if (productId) {
          url += `?productId=${productId}`;
        }

        const response = await axios.get(url, {
          withCredentials: true,
        });

        setReview(
          Array.isArray(response.data.review)
            ? response.data.review
            : response.data.review
              ? [response.data.review]
              : [],
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    handleData();
  }, [productId]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <DashboardNav />

      <div className="flex-1 p-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-400">My Reviews</h1>
          <p className="text-gray-400 mt-1">
            Manage and track all your product reviews
          </p>
        </div>

        {/* GRID */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : review.length === 0 ? (
          <div className="text-gray-400">No reviews found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {review.map((r) => (
              <div
                key={r._id}
                className="group relative bg-white/5 backdrop-blur-md 
                         border border-green-500/10 
                         rounded-2xl p-6 
                         hover:border-green-500/40 
                         hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] 
                         transition-all duration-300"
              >
                {/* PRODUCT HEADER */}
                <div className="mb-4">
                  <p className="text-xs text-green-400 uppercase tracking-widest">
                    Product
                  </p>
                  <h2 className="text-lg font-semibold text-white group-hover:text-green-300 transition">
                    {r.productId?.name}
                  </h2>
                </div>

                {/* RATING VISUAL */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {"⭐".repeat(Math.round(r.rating))}
                  </div>
                  <span className="text-sm text-gray-300">{r.rating}/5</span>
                </div>

                {/* REVIEW TEXT */}
                <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {r.review}
                  </p>
                </div>

                {/* DATE */}
                <div className="mt-4 text-xs text-gray-500 flex justify-between">
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  <Link href={`/product/${r.productId?._id}`}>
                    <button className="p-2 bg-green-400 rounded-lg border-0 text-black">
                      {" "}
                      View Details{" "}
                    </button>
                  </Link>
                </div>
                <span className="text-green-400 opacity-0 group-hover:opacity-100 transition p-2">
                  Review ID: {r._id.slice(-4)}
                </span>

                {/* GREEN GLOW EFFECT */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-green-500/5 blur-2xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
