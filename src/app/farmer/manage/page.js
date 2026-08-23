"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import DeleteModal from "@/components/DeleteModels";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectionId, setSelectionId] = useState(null);
  const [open, setOpen] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/farmer/product");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = (id) => {
    setSelectionId(id);
    setOpen(true)
  }
  const confirmDelect = async () => {
    try {
      await axios.delete(`/api/product?id=${selectionId}`);
      toast.success("Product deleted");
      fetchProducts();
      setOpen(false)
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalProducts = products.length;
  const approvedProducts = products.filter(
    (p) => p.status === "approved",
  ).length;

  const totalStock = products.reduce((sum, p) => sum + Number(p.quantity), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <SlideBarForFarmer />

      <div className="md:pl-70 p-6 md:pt-20">
        {/* HEADER */}
        <div className="flex justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Product Dashboard
            </h1>
            <p className="text-card/10 mt-2">
              Manage all your farm products from one place.
            </p>
          </div>

          <Link
            href="/addProduct"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover transition font-semibold">
            + Add Product
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition hover:shadow-md">
            <p className="text-muted text-sm">
              Total Products
            </p>

            <h2 className="text-3xl font-bold text-primary mt-2">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition hover:shadow-md">
            <p className="text-muted text-sm">
              Approved Products
            </p>

            <h2 className="text-3xl font-bold text-primary mt-2">
              {approvedProducts}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition hover:shadow-md">
            <p className="text-muted text-sm">
              Total Stock
            </p>

            <h2 className="text-3xl font-bold text-primary mt-2">
              {totalStock}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-full md:w-112.5 bg-card border border-border rounded-xl px-4 py-3 outline-none focus:border-green-500" />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 bg-card rounded-2xl p-10 text-center border border-zinc-800">
            <h2 className="text-xl text-zinc-400">No products found</h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {filtered.map((p) => (
              <div
                key={p._id}
                className=" bg-card border border-zinc-800 rounded-3xl overflow-hidden hover:border-green-500 transition-all duration-300">
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={p.image?.[0]?.url}
                    alt={p.name}
                    className="w-full h-56 object-cover"
                  />

                  {/* STATUS */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${p.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                      {p.status}
                    </span>
                  </div>

                  {/* ORGANIC */}
                  {p.organic && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-foreground px-3 py-1 rounded-full text-xs font-bold">
                        Organic
                      </span>
                    </div>
                  )}
                </div>

                {/* BODY */}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-card-foreground">
                        {p.name}
                      </h2>

                      <p className="text-sm text-muted">
                        {p.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted">
                        Price
                      </p>

                      <h3 className="text-lg font-bold text-primary">
                        Rs {p.price}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mt-4 line-clamp-2">
                    {p.description}
                  </p>

                  {/* INFO */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-card rounded-xl p-3">
                      <p className="text-muted text-xs">Stock</p>

                      <p className="font-semibold">
                        {p.quantity} {p.unit}
                      </p>
                    </div>

                    <div className="bg-card rounded-xl p-3">
                      <p className="text-muted text-xs">Location</p>

                      <p className="font-semibold truncate">{p.location}</p>
                    </div>
                  </div>

                  {/* STOCK BAR */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted">Stock Level</span>

                      <span className="text-primary">{p.quantity}</span>
                    </div>

                    <div className="h-2 bg-card rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.min((p.quantity / 100) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* FARMER */}
                  <div className="mt-5 pt-4 border-t border-card">
                    <p className="text-zinc-500 text-xs">Farmer</p>

                    <p className="text-sm font-medium">
                      {p.userId?.firstName} {p.userId?.lastName}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-6">
                    <Link
                      href={`/farmer/manage/${p._id}`}
                      className="flex-1 text-center py-3 rounded-xl bg-primary hover:bg-primary-hover font-medium">
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="flex-1 rounded-xl border border-red-200 bg-red-50 py-3 font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50">
                      Delete
                    </button>
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
        onConfirm={confirmDelect}
        type="Delete"
        confirmText='Delete'
        message='This action cannot be undone. Are you sure you want to delete product' />
    </div>
  );
};

export default Page;
