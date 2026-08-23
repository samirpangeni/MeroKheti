"use client";

import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import Loading from "@/components/Loading";
import DeleteModal from "@/components/DeleteModels";

const Page = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState("");
  const [selectionId, setSelectionId] = useState(null)
  const [open, setOpen] = useState(false)
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

  const deleteProduct = async (id) => {
    setSelectionId(id)
    setOpen(true)
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin?id=${selectionId}`);
      setProduct((prev) => prev.filter((item) => item._id !== selectionId));
      setOpen(false)
    } catch (err) {
      console.log(err);
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
                  <img
                    src={item.image?.[0]?.url}
                    alt={item.name}
                    className="w-full h-56 object-cover p-2 rounded-2xl"
                  />

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
                      onClick={() => deleteProduct(item._id)}
                      className="flex-1 bg-red-600 dark:bg-red-400 hover:bg-red-600 hover:dark:bg-red-400 py-2 rounded-lg font-medium transition"
                    >
                      Delete
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
      <DeleteModal
        isOpen={open}
        onClose={() => { setOpen(false) }}
        onConfirm={confirmDelete}
        type='Delete'
        message='This action cannot be undone. Are you sure you want to delete product'
        confirmText='Delete' />
    </div>
  );
};

export default Page;