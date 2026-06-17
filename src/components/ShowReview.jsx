"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const ShowReview = ({ productId }) => {
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;

        const getReview = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `/api/review?productId=${productId}`
                );

                setReview(response.data.review || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        getReview();
    }, [productId]);

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
                Customer Reviews
            </h2>

            {loading ? (
               <Loading />
            ) : review.length === 0 ? (
                <p className="text-gray-400">
                    No reviews yet
                </p>
            ) : (
                <div className="space-y-4">
                    {review.map((r) => (
                        <div
                            key={r._id}
                            className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg"
                        >
                            {/* USER */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-green-400 font-semibold text-lg">
                                        {r.userId
                                            ? `${r.userId.firstName} ${r.userId.lastName}`
                                            : "Anonymous"}
                                    </p>

                                </div>

                                {/* RATING */}
                                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-xl text-sm">
                                    ⭐ {r.rating}/5
                                </div>
                            </div>

                            {/* REVIEW */}
                            <p className="text-gray-300 leading-relaxed">
                                {r.review}
                            </p>
                        </div>
                    ))}
                    
                </div>
            )}
        </div>
    );
};

export default ShowReview;