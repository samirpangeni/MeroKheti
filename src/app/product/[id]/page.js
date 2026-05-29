"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import use from "react";
import Review from "@/components/Review";
import ShowReview from "@/components/ShowReview";
import AddToCart from "@/components/AddToCart";
import Report from "@/components/Report";
const Page = ({ params }) => {
  const [openReport, setOpenReport] = useState(false);

  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id) return;

    const getProductDetails = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        setItem(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    getProductDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 text-white">
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-6 py-16 sm:mt-1">
        {!item ? (
          <div className="text-center text-gray-400">Loading product...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* LEFT - IMAGE */}
            <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={item?.image?.[0]?.url}
                alt={item?.name}
                className="w-full h-100 object-cover"
              />
            </div>

            {/* RIGHT - DETAILS */}
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl font-bold">{item?.name}</h1>

              <p className="text-gray-400">{item?.description}</p>
              <p className="text-green-400">
                Farmer Name:
                <span className="text-gray-400 ml-1">
                  {item.userId.firstName} {item.userId.lastName}
                </span>
              </p>
              <div className="text-2xl font-semibold text-green-400">
                ₹ {item?.price}
              </div>

              {/* INFO BOX */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-gray-400">Quantity</p>
                  <p>
                    {item?.quantity} {item?.unit}
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-gray-400">Category</p>
                  <p>{item?.category}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-gray-400">Location</p>
                  <p>{item?.location}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-gray-400">Organic</p>
                  <p>{item?.organic ? "Yes 🌱" : "No"}</p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-4">
                <button className="flex-1 bg-green-500 hover:bg-green-600 transition py-3 rounded-xl font-medium">
                  Buy Now
                </button>

                <AddToCart product={item} />
              </div>
            </div>
            <div className="mt-10 w-full">
              <Review productId={id} />
            </div>
            <div>
              <ShowReview productId={id} />
            </div>
            <button onClick={() => setOpenReport(true)} className="absolute top-10 right-10 bg-red-900 p-2 rounded-lg">Report</button>

            {openReport && (
              <Report productId={id} setOpenReport={setOpenReport} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
