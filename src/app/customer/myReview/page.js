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
        console.log(response.data.review)
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
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-sm text-muted">
              You haven't written any reviews yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {review.map((r) => (
              <div
                key={r._id}
                item={r}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-primary">
                      Product Review
                    </p>

                    <h2 className="truncate text-lg font-semibold text-foreground">
                      {r.productId?.name || "Product"}
                    </h2>
                  </div>

                  <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs text-muted border border-border">
                    #{r._id.slice(-4)}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex gap-0.5 text-sm">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={
                          index < Math.round(r.rating || 0)
                            ? "text-yellow-400"
                            : "text-muted/30"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span className="text-sm font-medium text-foreground">
                    {r.rating}/5
                  </span>
                </div>

                {/* Review */}
                <div className="mt-4 flex-1 rounded-xl border border-border bg-background/50 p-4">
                  <p className="line-clamp-4 text-sm leading-6 text-muted">
                    "{r.review}"
                  </p>
                </div>

                {/* Date */}
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    Reviewed on
                  </p>

                  <p className="mt-1 text-xs text-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  <Link
                    href={`/product/${r.productId?._id}`}
                    className="flex-1"
                  >
                    <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-background transition hover:bg-primary-hover">
                      View Product
                    </button>
                  </Link>

                  <button
                    onClick={() => deleteReview(r._id)}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    Delete
                  </button>
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