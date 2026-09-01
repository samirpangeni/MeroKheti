"use client";

import Loading from "@/components/Loading";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import DeleteModels from "@/components/DeleteModels"
import RejectProduct from "@/components/RejectProudct"
import BigImage from "@/components/BigImage";
const Page = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false)
  const [selectionId, setSelection] = useState(null)
  const [rejectOpen, setRejectOpen] = useState(false);
  const [open, setOpen] = useState(false)
  const [actionType, setActionType] = useState("");
  const [reason, SetReason] = useState("");
  const [imageIndexes, setImageIndexes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!product?.length) return;

    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };

        product.forEach((item) => {
          if (item?.image?.length > 1) {
            const currentIndex = prev[item._id] || 0;

            updated[item._id] =
              (currentIndex + 1) % item.image.length;
          }
        });

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [product]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          "/api/admin?status=pending,rejected"
        );
        setProduct(res.data.product);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    };

    getData();
  }, []);
  const handleConfirm = async () => {
    try {
      if (actionType === "approve") {
        await axios.put("/api/admin", {
          selectionId,
          status: "approved",
        });

        setProduct((prev) =>
          prev.filter((item) => item._id !== selectionId)
        );

        toast.success("Product approved successfully");
      }

      setOpen(false);
      setSelection(null);
      setActionType("");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleReject = async () => {
    try {
      if (!reason.trim()) {
        toast.error("Please provide a rejection reason");
        return;
      }

      await axios.put("/api/admin", {
        selectionId,
        status: "rejected",
        reason: reason.trim(),
      });

      setProduct((prev) =>
        prev.map((item) =>
          item._id === selectionId
            ? {
              ...item,
              status: "rejected",
              rejectedAt: new Date(),
              rejectionReason: reason.trim(),
            }
            : item
        )
      );

      setRejectOpen(false);
      setSelection(null);
      SetReason("");

      toast.success(
        "Product rejected. It will be deleted after 24 hours."
      );
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const openModal = (id, action) => {
    setSelection(id);

    if (action === "reject") {
      SetReason("");
      setRejectOpen(true);
      return;
    }

    setActionType(action);
    setOpen(true);
  };
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SlideBarForAdmin />

      <div className="flex-1 p-8 bg-linear-to-br from-background via-card to-secondary pl-70">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Product Approval Panel
            </h1>
            <p className="text-muted mt-2">
              Approve or reject farmer products
            </p>
          </div>

          <div className="bg-border border border-primary px-5 py-3 rounded-2xl">
            <h1 className="text-primary font-bold">
              Total Pending: {product.length}
            </h1>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <Loading />
        ) : product.length === 0 ? (
          <p className="text-muted flex items-center justify-center m-50">
            No product yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {product.map((item) => (
              <div
                key={item._id}
                className="bg-card border border-muted rounded-3xl overflow-hidden hover:border-primary-hover transition"
              >
                {/* MAIN IMAGE */}
                <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border">
                  <img
                    src={
                      item?.image?.[imageIndexes[item._id] || 0]?.url
                    }
                    alt={item?.name || "Product"}
                    onClick={() => {
                      const index = imageIndexes[item._id] || 0;
                      setSelectedImage({
                        productId: item._id,
                        index: index,
                      });
                    }}
                    className="h-full w-full object-cover transition-opacity duration-500"
                  />

                  {selectedImage?.productId === item._id && (
                    <BigImage
                      images={item?.image?.map((img) => img.url) || []}
                      initialIndex={selectedImage.index}
                      alt={item?.name || "Product"}
                      onClose={() => setSelectedImage(null)}
                    />
                  )}

                  {/* Image indicators */}
                  {item.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setImageIndexes((prev) => ({
                          ...prev,
                          [item._id]: index,
                        }))
                      }
                      className={`h-2 rounded-full transition-all ${(imageIndexes[item._id] || 0) === index
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50"
                        }`}
                    />
                  ))}
                </div>

                {/* THUMBNAILS */}
                <div className="flex gap-2 p-2">
                  {item.image?.slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ))}
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  {/* PRODUCT NAME */}
                  <h1 className="text-xl font-bold">{item.name}</h1>

                  {/* FARMER INFO */}
                  <p className="text-muted text-sm">
                    👤 {item.userId?.firstName}
                  </p>
                  <p className="text-muted text-xs">
                    📧 {item.userId?.email || "No email"}
                  </p>

                  {/* PRICE */}
                  <div className="flex justify-between mt-2">
                    <span className="text-primary font-bold">
                      Rs {item.price}
                    </span>
                    <span className="text-muted text-sm">{item.category}</span>
                  </div>

                  <div className="text-sm text-muted mt-3 space-y-1">
                    <p>📍 {item.location}</p>
                    <p> 📦 {item.quantity} {item.unit} </p>
                    <p>
                      🌾 Harvest:{new Date(item.harvestDate).toLocaleDateString()}</p>
                    <p>
                      ⏳ Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* BADGES */}
                  <div className="flex gap-2 mt-3">
                    {item.organic && (
                      <span className="bg-primary text-background px-2 py-1 text-xs rounded">
                        Organic
                      </span>
                    )}
                    <span
                      className={`text-background px-2 py-1 text-xs rounded ${item.status === "rejected"
                        ? "bg-red-500 dark:bg-red-600"
                        : "bg-yellow-400 dark:bg-yellow-600"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {/* DESCRIPTION */}
                  <p className="text-muted text-sm mt-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => openModal(item._id, "approve")}
                      className="flex-1 bg-primary hover:bg-primary-hover text-background font-bold py-2 rounded-xl"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => openModal(item._id, "reject")}
                      disabled={item.status === "rejected"}
                      className={`flex-1 py-2 rounded-lg font-medium transition ${item.status === "rejected"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-red-400 dark:bg-red-600 hover:bg-red-600 hover:dark:bg-red-400"
                        }`}
                    >
                      {item.status === "rejected" ? "Rejected" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <DeleteModels
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setSelection(null);
            setActionType("");
          }}
          onConfirm={handleConfirm}
          type="Approve Product"
          message="Are you sure you want to approve this product?"
          confirmText="Approve"
        />

        {/* Reject Modal */}
        <RejectProduct
          isOpen={rejectOpen}
          onClose={() => {
            setRejectOpen(false);
            setSelection(null);
            SetReason("");
          }}
          reason={reason}
          SetReason={SetReason}
          productId={selectionId}
          onConfirm={handleReject}
        />
      </div>
    </div>
  );
};

export default Page;
