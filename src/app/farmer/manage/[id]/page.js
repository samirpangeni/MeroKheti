"use client";

import DeleteModal from "@/components/DeleteModels";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import Loading from "@/components/Loading";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/product/${id}`);
        setProduct(res.data.product);
        console.log(res.data.product);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [id]);

  const handleData = async () => {
    try {
      await axios.put(`/api/product/${id}`, {
        status: product.status,
        harvestDate: harvestDate || product.harvestDate,
        expiryDate: expiryDate || product.expiryDate,
        name: name || product.name,
        quantity: quantity || product.quantity,
        description: description || product.description,
        price: price || product.price,
      });
      toast.success("Product Updated Successfully");
      router.push("/farmer/manage");
    } catch (err) {
      console.log(err);
      toast.error("Update Failed try again");
    }
  };
  const handelReapply = async () => {
    try {
      await axios.put(`/api/product/${product._id}`, {
        name,
        price,
        quantity,
        description,
        harvestDate,
        expiryDate,

        status: "pending",
        rejectedAt: null,
        rejectionReason: null,
      });

      toast.success("Product re-applied successfully!");
      router.push("/farmer/manage");
    } catch (err) {
      console.log(err);
      toast.error("Failed to reapply");
    }
  };
  const formatDate = (value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "-" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 9);
    return v;
  };

  useEffect(() => {
    if (!product?.image || product.image.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % product.image.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [product?.image]);
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center text-primary text-2xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SlideBarForFarmer />
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-background shadow-xl mt-10">
        <div className="grid md:grid-cols-2">
          <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border">

              <img
                src={product?.image?.[imageIndex]?.url}
                alt={product?.name || "Product"}
                className="h-full w-full object-cover transition-opacity duration-500"
              />

              {/* Image indicators */}
              {product?.image?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {product.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${imageIndex === index
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              )}

            </div>

            <div className="mt-5">
              <p className="text-sm text-muted">
                Product
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                {product?.name}
              </h2>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm text-muted">
                Status
              </p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product?.status === "rejected"
                  ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                  : product?.status === "approved"
                    ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                  }`}
              >
                {product?.status?.toUpperCase()}
              </span>
            </div>

            {product?.status === "rejected" && (
              <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950/30">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    REJECTED
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-red-700 dark:text-red-400">
                  Why was this product rejected?
                </h3>
                <div className="mt-3 rounded-xl bg-white p-4 dark:bg-red-950/40">
                  <p className="text-sm leading-6 text-red-600 dark:text-red-300">
                    {product?.rejectionReason ||
                      "No rejection reason was provided."}
                  </p>
                </div>
                <p className="mt-3 text-xs leading-5 text-red-600 dark:text-red-400">
                  Fix the issue mentioned above and reapply your product.
                </p>
              </div>
            )}

            {product?.status === "pending" && (
              <div className="mt-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-5 dark:border-yellow-800 dark:bg-yellow-950/30">
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                  Product Under Review
                </p>
                <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-300">
                  Your product is currently waiting for admin approval.
                </p>

              </div>
            )}

            {product?.status === "approved" && (
              <div className="mt-6 rounded-2xl border border-green-300 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950/30">
                <p className="font-semibold text-green-700 dark:text-green-400">
                  Product Approved
                </p>
                <p className="mt-2 text-sm text-green-600 dark:text-green-300">
                  Your product has been approved and is available on the marketplace.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-primary">
                Edit Product
              </h1>
              <p className="mt-1 text-sm text-muted">
                Update your product information below.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-muted">
                  Current Name
                </label>
                <input
                  type="text"
                  value={product?.name || ""}
                  readOnly
                  className="w-full rounded-xl border border-border bg-secondary/30 p-3.5 text-foreground outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">
                  Change Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3.5 text-foreground outline-none transition focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-muted">
                  Current Price (Rs)
                </label>
                <input
                  type="number"
                  value={product?.price || ""}
                  readOnly
                  className="w-full rounded-xl border border-border bg-secondary/30 p-3.5 text-foreground outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">
                  Change Price (Rs)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3.5 text-foreground outline-none transition focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-muted">
                  Current Quantity
                </label>
                <input
                  type="number"
                  value={product?.quantity || ""}
                  readOnly
                  className="w-full rounded-xl border border-border bg-secondary/30 p-3.5 text-foreground outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-muted">
                  Change Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3.5 text-foreground outline-none transition focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-muted">
                Category
              </label>

              <input
                type="text"
                disabled
                value={product?.category || ""}
                className="w-full rounded-xl border border-border bg-secondary/30 p-3.5 text-muted outline-none"
              />
            </div>

            {(product?.status === "pending" ||
              product?.status === "rejected") && (
                <>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-muted">
                        Current Harvest Date
                      </label>

                      <input
                        type="date"
                        value={
                          product?.harvestDate?.split("T")[0] || ""
                        }
                        readOnly
                        className="w-full rounded-xl border border-border bg-secondary/30 p-3.5 text-foreground outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-muted">
                        Change Harvest Date
                      </label>

                      <input
                        type="date"
                        value={
                          harvestDate
                            ? harvestDate.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setHarvestDate(
                            formatDate(e.target.value)
                          )
                        }
                        className="w-full rounded-xl border border-border bg-background p-3.5 text-foreground outline-none transition focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-muted">
                        Current Expiry Date
                      </label>
                      <input
                        type="date"
                        value={
                          product?.expiryDate?.split("T")[0] || ""
                        }
                        readOnly
                        className="w-full rounded-xl border border-border bg-secondary/30 p-3.5 text-foreground outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-muted">
                        Change Expiry Date
                      </label>
                      <input
                        type="date"
                        value={
                          expiryDate
                            ? expiryDate.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setExpiryDate(
                            formatDate(e.target.value)
                          )
                        }
                        className="w-full rounded-xl border border-border bg-background p-3.5 text-foreground outline-none transition focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}

            <div className="mt-5">
              <label className="mb-2 block text-sm text-muted">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full resize-none rounded-xl border border-border bg-background p-3.5 text-foreground outline-none transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mt-8  mb-10 flex gap-3">
              {product?.status === "approved" && (
                <button
                  onClick={() => setOpen(true)}
                  className="flex-1 rounded-xl bg-primary py-3.5 font-bold text-background transition hover:bg-primary-hover">
                  Save Changes
                </button>
              )}

              {product?.status === "pending" && (
                <button
                  onClick={handelReapply}
                  className="flex-1 rounded-xl bg-primary py-3.5 font-bold text-background transition hover:bg-primary-hover">
                  Reapply
                </button>
              )}

              {product?.status === "rejected" && (
                <button
                  onClick={handelReapply}
                  className="flex-1 rounded-xl bg-primary py-3.5 font-bold text-background transition hover:bg-primary-hover">
                  Reapply After Fixing
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="flex-1 rounded-xl bg-muted py-3.5 font-bold text-foreground transition hover:bg-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={open}
        onClose={() => { setOpen(false) }}
        onConfirm={handleData}
        type='Update Product'
        message='Are you sure you want to save these changes?'
        confirmText="Update" />
    </div>
  );
};

export default Page;
