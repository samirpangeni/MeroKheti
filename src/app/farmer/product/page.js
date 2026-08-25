"use client";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteModels from "@/components/DeleteModels"
import Link from "next/link";
const Page = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [openDelete, setOpenDelete] = useState(false)
  const [selectionId, setSelectionId] = useState(null)
  const [imageIndexes, setImageIndexes] = useState({});
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
      const res = await axios.get(
        `/api/farmer/product?status=approved&search=${search}&category=${category}` || [],
      );
      setProduct(res.data.products);
    };
    getData();
  }, [search, category]);
  const deleteProduct = async (id) => {
    setSelectionId(id);
    setOpenDelete(true)
  };
  const confirmDelete = async () => {
    const res = await axios.delete(`/api/farmer?id=${selectionId}`);
    setProduct((prev) => prev.filter((item) => item._id !== selectionId));
    toast.success("you delete the product")
    setOpenDelete(false)
  }

  return (
    <div className="flex min-h-screen bg-background mb-10">
      <SlideBarForFarmer />

      <div className="flex-1 p-2 md:pl-70 md: pt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Manage Products
            </h1>
            <p className="text-muted mt-2">
              Manage and update your farm products
            </p>
          </div>

          <Link href="/addProduct">
            <button className="bg-button hover:bg-primary-hover text-foreground px-6 py-3 rounded-xl font-semibold transition">
              + Add Product
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-muted">Total Products</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              {product?.length}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-muted">Categories</p>
            <h2 className="text-3xl font-bold text-primary mt-2">
              {new Set(product?.map((p) => p.category)).size}
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-muted">Approved Products</p>
            <h2 className="text-3xl font-bold primary mt-2">
              {product?.length}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 gap-2 justify-between">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px] md:items-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-foreground placeholder:text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {[
                "All categories",
                "vegetables",
                "fruits",
                "grains & cereals",
                "pulses & legumes",
                "seeds & nuts",
                "dairy & eggs",
                "meat & poultry",
                "herbs & spices",
                "organic products",
                "other",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {Array.isArray(product) && product.length > 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {product.map((item) => (
              <div key={item._id}
                className="bg-card border border-border rounded-3xl overflow-hidden hover:border-border-500 transition duration-300 hover:shadow-lg hover:shadow-border/30"
              >
                <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border">
                  <img
                    src={
                      item?.image?.[imageIndexes[item._id] || 0]?.url
                    }
                    alt={item?.name || "Product"}
                    className="h-full w-full object-cover transition-opacity duration-500"
                  />

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

                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-foreground">
                      {item.name}
                    </h2>

                    <span className="bg-primary text-foreground text-xs px-3 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-primary text-2xl font-bold mt-3">
                    Rs. {item.price}
                  </p>

                  <div className="mt-4 space-y-2 text-muted">
                    <p>
                      Category:
                      <span className="text-foreground ml-2">{item.category}</span>
                    </p>
                    <p>
                      Quantity:
                      <span className="text-foreground ml-2">{item.quantity}</span>
                    </p>
                  </div>

                  <p className="text-muted mt-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        router.push(`/farmer/manage/${item._id}`);
                      }}
                      className="flex-1 bg-primary hover:bg-primary-hover text-foreground py-2 rounded-2xl"
                    >
                      Edit
                    </button>

                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-foreground py-2 rounded-xl font-medium transition"
                      onClick={() => { deleteProduct(item._id) }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-border-900 rounded-2xl p-10 text-center">
            <h2 className="text-xl text-gray-400">No products found</h2>
          </div>
        )}
      </div >
      <div>
        <DeleteModels
          isOpen={openDelete}
          onClose={() => { setOpenDelete(false) }}
          onConfirm={confirmDelete}
          type="Delete"
          confirmText='Delete'
          message="This action cannot be undone. Are you sure you want to delete product" />
      </div>
    </div >
  );
};
export default Page;
