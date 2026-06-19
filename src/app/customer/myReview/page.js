"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import Link from "next/link";
import Loading from "@/components/Loading";

const Page = () => {
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await axios.get("/api/review/my", {
          withCredentials: true,
        });

        setReview(
          Array.isArray(response.data.review)
            ? response.data.review
            : response.data.review
              ? [response.data.review]
              : []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    handleData();
  }, []);

  const avgRating =
    review.length > 0
      ? (
        review.reduce((sum, r) => sum + (r.rating || 0), 0) /
        review.length
      ).toFixed(1)
      : 0;

  return (
    <div className="flex min-h-screen bg-black text-white mb-10">
      <DashboardNav />

      <div className="flex-1 md:ml-72 p-6 md:p-10 pt-20 bg-linear-to-b from-black via-green-950/10 to-black md:mt-20">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-400">
            My Reviews
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and track all your product reviews
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-green-950/40 border border-green-500/20 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Reviews</p>
            <h2 className="text-4xl font-bold text-green-300 mt-2">
              {review.length}
            </h2>
          </div>

          <div className="bg-green-950/40 border border-green-500/20 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Average Rating</p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {avgRating}
            </h2>
          </div>

          <div className="bg-green-950/40 border border-green-500/20 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Best Rating</p>
            <h2 className="text-4xl font-bold text-green-300 mt-2">
              5 ⭐
            </h2>
          </div>

        </div>

        {/* CONTENT */}
        {loading ? (
          <Loading />
        ) : review.length === 0 ? (
          <div className="text-gray-400">No reviews found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {review.map((r) => (
              <div
                key={r._id}
                className="group relative overflow-hidden bg-linear-to-br from-green-950/50 via-black to-green-950/20 border border-green-500/20 rounded-3xl p-6 hover:border-green-400/40 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,197,94,0.18)] transition-all duration-500"
              >
                {/* glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-green-500/5 blur-3xl transition" />

                <div className="relative z-10">

                  {/* Product */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-[3px] text-green-500">
                        Product Review
                      </p>
                      <h2 className="text-xl font-bold text-white mt-2">
                        {r.productId?.name}
                      </h2>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs">
                      #{r._id.slice(-4)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mt-5">
                    <div className="text-yellow-400 text-lg">
                      {"⭐".repeat(Math.round(r.rating || 0))}
                    </div>
                    <span className="text-gray-300 font-medium">
                      {r.rating}/5
                    </span>
                  </div>

                  {/* Review text */}
                  <div className="mt-5 bg-black/40 border border-green-500/10 rounded-2xl p-4">
                    <p className="text-gray-300 leading-relaxed">
                      {r.review}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-500">
                        Reviewed On
                      </p>
                      <p className="text-sm text-gray-300">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Link href={`/product/${r.productId?._id}`}>
                      <button className="px-4 py-2 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition">
                        View Product
                      </button>
                    </Link>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Page;