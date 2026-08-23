"use client";

import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import Link from "next/link";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModels";

const Page = () => {
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false)
  const [selectionId, setSelectionId] = useState(null)
  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await axios.get("/api/customer", {
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
  const deleteReview = (id) => {
    setSelectionId(id);
    setOpen(true)
  }
  const confrimDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/review?id=${selectionId}`);
       setReview((prev) => prev.filter((u) => u._id !== selectionId));
      toast.success("Review delete successfully")
      setOpen(false)
    } catch (err) {
      console.log(err)
      toast.error("failed to delete review try later")
    }
  }
  const avgRating =
    review.length > 0
      ? (
        review.reduce((sum, r) => sum + (r.rating || 0), 0) /
        review.length
      ).toFixed(1)
      : 0;

  return (
    <div className="flex min-h-screen bg-background text-foreground mb-10">
      <DashboardNav />

      <div className="flex-1 md:ml-72 p-6 md:p-10 pt-20 bg-linear-to-b from-background via-primary/10 to-background md:mt-20">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-primary">
            My Reviews
          </h1>
          <p className="text-muted mt-1">
            Manage and track all your product reviews
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted text-sm">Total Reviews</p>
            <h2 className="text-4xl font-bold text-primary mt-2">
              {review.length}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted text-sm">Average Rating</p>
            <h2 className="text-4xl font-boldtext-yellow-600 dark:text-yellow-400 mt-2">
              {avgRating}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted text-sm">Best Rating</p>
            <h2 className="text-4xl font-bold text-primary mt-2">
              5 ⭐
            </h2>
          </div>

        </div>

        {/* CONTENT */}
        {loading ? (
          <Loading />
        ) : review.length === 0 ? (
          <div className="text-muted flex items-center justify-center mt-20 text-xl">No reviews found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {review.map((r) => (
              <div
                key={r._id}
                className="group relative overflow-hidden bg-linear-to-br from-primary/50 via-backgroound to-primary/20 border border-border rounded-3xl p-6 hover:border-green-400/40 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,197,94,0.18)] transition-all duration-500"
              >
                {/* glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-card blur-3xl transition" />
                <div className="relative z-10">
                  {/* Product */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-[3px] text-primary">
                        Product Review
                      </p>
                      <h2 className="text-xl font-bold text-foreground mt-2">
                        {r.productId?.name}
                      </h2>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-border text-primary text-xs">
                      #{r._id.slice(-4)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mt-5">
                    <div className="text-yellow-400 text-lg">
                      {"⭐".repeat(Math.round(r.rating || 0))}
                    </div>
                    <span className="text-muted font-medium">
                      {r.rating}/5
                    </span>
                  </div>

                  {/* Review text */}
                  <div className="mt-5 bg-background/40 border border-borderrounded-2xl p-4">
                    <p className="text-muted leading-relaxed">
                      {r.review}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted">
                        Reviewed On
                      </p>
                      <p className="text-sm text-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReview(r._id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-400 
             bg-red-500/10 border border-red-500/20 
             rounded-lg hover:bg-red-500/20 
             hover:text-red-300 transition-all duration-200"
                    >
                      Delete
                    </button>
                    <Link href={`/product/${r.productId?._id}`}>
                      <button className="px-4 py-2 rounded-xl bg-primary text-background font-semibold hover:bg-primary-hover transition">
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
      <DeleteModal
        isOpen={open}
        onClose={() => { setOpen(false) }}
        onConfirm={confrimDelete}
        type="Delete"
        message='This action cannot be undone. Are you sure you want to delete review'
        confirmText='Delete' />
    </div>
  );
};

export default Page;