"use client";
import React, { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import axios from "axios";
import Loading from "@/components/Loading";
const Page = () => {
    const [order, setOrder] = useState([]);
    const [review, setReview] = useState([]);
    const [activite, setActivite] = useState([]);
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            try {
                const [oRes, pRes, hRes, rRes] = await Promise.all([
                    axios.get("/api/order"),
                    axios.get("/api/review"),
                    axios.get("/api/customer"),
                    axios.get("/api/report"),
                ]);
                setActivite(hRes.data.activity)
                setReport(rRes.data.reports)
                setOrder(oRes.data.order)
                setReview(pRes.data.review)
                console.log("hello", hRes.data.activity)
            } catch (err) {
                console.log(err)
            }
        }
        getData();
    }, [])
    const totalSpent = order.reduce(
        (sum, item) => sum + (item.totalAmount || 0),
        0
    );
    return (
        <div className="flex min-h-screen bg-black text-white">
            <DashboardNav />

            <div className="flex-1 md:ml-72 p-6 md:pt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-300">
                        History
                    </h1>
                    <p className="text-gray-400 mt-2">
                        View your activity and account statistics.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-green-950/20 border border-green-500/20 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Total Orders
                        </p>
                        <h2 className="text-3xl font-bold text-green-300 mt-2">
                            {order.length}
                        </h2>
                    </div>
                    <div className="bg-green-950/20 border border-green-500/20 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Total Spent
                        </p>
                        <h2 className="text-3xl font-bold text-green-300 mt-2">
                            Rs: {totalSpent}
                        </h2>
                    </div>
                    <div className="bg-green-950/20 border border-green-500/20 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Total Report
                        </p>
                        <h2 className="text-3xl font-bold text-green-300 mt-2">
                            {report.length}
                        </h2>
                    </div>
                    <div className="bg-green-950/20 border border-green-500/20 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Reviews Written
                        </p>
                        <h2 className="text-3xl font-bold text-green-300 mt-2">
                            {review.length}
                        </h2>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-green-950/10 border border-green-500/20 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-green-300 mb-6">
                        Recent Activity
                    </h2>

                    {loading ? (<Loading />) : activite.length === 0 ? (<div className="text-gray-400"> No acitivity found </div>) : (
                        <div className="space-y-4">
                            {activite.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 border-b border-gray-200"
                                >
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-3 h-3 rounded-full bg-green-400 mt-1 shrink-0"></div>

                                        <p className="text-sm md:text-base break-words">
                                            {item.message}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                                            {item.type}
                                        </span>

                                        <span>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;