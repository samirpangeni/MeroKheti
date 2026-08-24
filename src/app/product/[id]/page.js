"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import use from "react";
import Review from "@/components/Review";
import ShowReview from "@/components/ShowReview";
import AddToCart from "@/components/AddToCart";
import Checkout from "@/components/Checkout"
import Loading from "@/components/Loading"
import Report from "@/components/Report";
import { useRouter } from "next/navigation";
const Page = ({ params }) => {
  const [openReport, setOpenReport] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);

  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [item, setItem] = useState(null);
  const router = useRouter();
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
    <div className="relative min-h-screen bg-linear-to-br from-background via-card to-background text-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-16 sm:mt-1">
        <button
          onClick={() => router.back()}
          className="fixed right-6 top-15 z-50 flex md:h-15 h-10 w-10 md:w-15 text-2xl p-2 items-center justify-center rounded-full border-input-border text-foreground shadow-md transition hover:bg-red-400 dark:hover:bg-secondary bg-input"
        >
          ✕
        </button>
        {!item ? (
         <Loading />
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* LEFT - IMAGE */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
              <img
                src={item?.image?.[0]?.url}
                alt={item?.name}
                className="w-full h-100 object-cover"
              />
            </div>

            {/* RIGHT - DETAILS */}
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl font-bold">{item?.name}</h1>

              <p className="text-muted">{item?.description}</p>
              <p className="text-primary">
                Farmer Name:
                <span className="text-muted ml-1">
                  {item.userId?.firstName} {item.userId?.lastName}
                </span>
              </p>
              <div className="text-2xl font-semibold text-primary">
                ₹ {item?.price}
              </div>

              {/* INFO BOX */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-card p-3 rounded-xl border border-border">
                  <p className="text-muted">Quantity</p>
                  <p>
                    {item?.quantity} {item?.unit}
                  </p>
                </div>

                <div className="bg-card p-3 rounded-xl border border-border">
                  <p className="text-muted">Category</p>
                  <p>{item?.category}</p>
                </div>

                <div className="bg-card p-3 rounded-xl border border-border">
                  <p className="text-muted">Location</p>
                  <p>{item?.location}</p>
                </div>

                <div className="bg-card p-3 rounded-xl border border-border">
                  <p className="text-muted">Organic</p>
                  <p>{item?.organic ? "Yes 🌱" : "No"}</p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-4">
                <button className=" p-2 bg-primary text-button-foreground rounded-lg border-0 w-1/2 hover:bg-primary-hover focus:bg-primary-hover"
                  onClick={() => setSelectProduct(item._id)}
                > Buy Now </button>
                {selectProduct === item._id && (
                  <div className='fixed inset-0 bg-card backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-3'>
                    <Checkout productId={selectProduct} onClose={() => setSelectProduct(null)} />
                  </div>)}
                <AddToCart product={item} />
              </div>
            </div>
            <div className="mt-10 w-full">
              <Review productId={id} />
            </div>
            <div>
              <ShowReview productId={id} />
            </div>
            <button onClick={() => setOpenReport(true)} className="fixed bottom-15 right-6 z-40 rounded-xl bg-red-600 px-4 py-2 font-medium text-white shadow-lg transition hover:bg-red-700 active:scale-95 dark:bg-red-500 dark:hover:bg-red-600">Report</button>

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
