"use client";

import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import BigImage from "@/components/BigImage";

import axios from "axios";
import Loading from "@/components/Loading";
import DeleteModal from "@/components/DeleteModels";
import RejectProduct from "@/components/RejectProudct"

const Page = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState("");
  const [selectionId, setSelectionId] = useState(null)
  const [reason, SetReason] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false)
  const [imageIndexes, setImageIndexes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/product?status=approved");
        setProduct(res.data.products || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = async (id) => {
    setSelectionId(id)
    setRejectOpen(true)
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
      setSelectionId(null);
      SetReason("");

      toast.success(
        "Product rejected. It will be deleted after 24 hours."
      );
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const filteredProducts = product?.filter((item) => {
    const matchSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category
      ? item.category?.toLowerCase() === category.toLowerCase()
      : true;

    const matchOrganic =
      organic === ""
        ? true
        : item.organic.toString() === organic;

    return matchSearch && matchCategory && matchOrganic;
  });
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
  return (
    <div className="flex min-h-screen bg-background text-white">
      <SlideBarForAdmin />

      <div className="flex-1 p-8 pl-70 bg-linear-to-br from-background via-card to-secondary">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Approved Products
            </h1>
            <p className="text-muted">
              Manage marketplace products
            </p>
          </div>

          <div className="bg-card border border-border px-4 py-2 rounded-xl">
            <span className="text-primary font-bold">
              Total Products: {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search product or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-xl bg-card border text-foreground border-muted focus:border-primary outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-card border border-muted text-foreground"
          >
            <option value="">All Category</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="grains">Grains</option>
          </select>

          <select
            value={organic}
            onChange={(e) => setOrganic(e.target.value)}
            className="p-3 rounded-xl bg-card border border-muted text-foreground"
          >
            <option value="">All Products</option>
            <option value="true">Organic</option>
            <option value="false">Non-Organic</option>
          </select>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="bg-card border border-muted rounded-2xl overflow-hidden hover:border-primary-hover hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
              >
                {/* IMAGE */}
                <div className="relative">
                  <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border">
                    <img
                      src={
                        item?.image?.[imageIndexes[item._id] || 0]?.url
                      }
                      alt={item?.name || "Product"}
                      onClick={() =>
                        setSelectedImage(
                          item?.image?.[imageIndexes[item._id] || 0]?.url
                        )
                      }
                      className="h-full w-full object-cover transition-opacity duration-500"
                    />
                    {selectedImage && (
                      <BigImage
                        image={selectedImage}
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

                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${item.organic
                      ? "bg-primary dark:bg-green-400"
                      : "bg-orange-600 dark:bg-orange-400"
                      }`}
                  >
                    {item.organic ? "Organic" : "Non Organic"}
                  </span>
                </div>

                <div className="p-5">
                  {/* NAME */}
                  <h2 className="text-2xl text-muted font-bold mb-1">
                    {item.name}
                  </h2>

                  <p className="text-muted text-sm">
                    📍 {item.location}
                  </p>

                  {/* PRICE */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-primary text-xl font-bold">
                      Rs {item.price}
                    </span>

                    <span className="px-3 py-1 bg-card rounded-full text-xs capitalize">
                      {item.category}
                    </span>
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-card rounded-lg p-2 text-center">
                      <p className="text-yellow-400 dark:text-yellow-600 font-bold">
                        ⭐ {item.averageRating || 0}
                      </p>
                      <p className="text-xs text-muted">
                        Rating
                      </p>
                    </div>

                    <div className="bg-card rounded-lg p-2 text-center">
                      <p className="text-blue-400 dark:text-blue-600 font-bold">
                        {item.totalReview || 0}
                      </p>
                      <p className="text-xs text-muted">
                        Reviews
                      </p>
                    </div>

                    <div className="bg-card rounded-lg p-2 text-center">
                      <p className="text-red-400 dark:text-red-600 font-bold">
                        {item.totalReport || 0}
                      </p>
                      <p className="text-xs text-muted">
                        Reports
                      </p>
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="mt-4 border-t border-card pt-4 space-y-2 text-sm">
                    <p>
                      <span className="text-muted">
                        Quantity:
                      </span>{" "}
                      {item.quantity} {item.unit}
                    </p>

                    <p>
                      <span className="text-muted">
                        Status:
                      </span>{" "}
                      <span className="text-primary capitalize">
                        {item.status}
                      </span>
                    </p>

                    <p>
                      <span className="text-muted">
                        Harvest:
                      </span>{" "}
                      {new Date(
                        item.harvestDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="text-muted">
                        Expiry:
                      </span>{" "}
                      {new Date(
                        item.expiryDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="text-muted">
                        Created:
                      </span>{" "}
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* FARMER */}
                  <div className="mt-4 border-t border-card pt-4">
                    <h3 className="text-primary font-semibold mb-2">
                      Farmer Information
                    </h3>

                    <p className="text-sm">
                      👨‍🌾 {item.userId?.firstName}{" "}
                      {item.userId?.lastName}
                    </p>

                    <p className="text-xs text-muted mt-1 break-all">
                      ID: {item.userId?._id}
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-4 border-t border-card pt-4">
                    <h3 className="text-primary font-semibold mb-2">
                      Description
                    </h3>

                    <p className="text-sm text-muted line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex gap-3">
                    <button className="flex-1 bg-primary hover:bg-primary-hover py-2 rounded-lg font-medium transition">
                      View Details
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

        {!loading && filteredProducts.length === 0 && (
          <div className="flex justify-center items-center h-60">
            <h1 className="text-muted text-xl">
              No Products Found
            </h1>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <RejectProduct
        isOpen={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectionId(null);
          SetReason("");
        }}
        reason={reason}
        SetReason={SetReason}
        productId={selectionId}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default Page;