"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductFeed from "@/components/ProductFeed";
import Search from "@/components/Search";
import { FiShoppingBag } from "react-icons/fi";

const Page = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900 text-white">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">

        {/* BACKGROUND BLUR */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">

          {/* TITLE */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiShoppingBag className="text-4xl text-green-400" />
              <h1 className="text-5xl font-bold">
                Explore Products
              </h1>
            </div>

            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Discover fresh organic products directly from farmers and local sellers.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-3xl mx-auto relative">
            <Search
              search={search}
              setSearch={setSearch}
              products={products}
              setProducts={setProducts}
            />
          </div>

          {/* STATS */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">

            <div className="bg-white/5 border border-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-400">
                500+
              </h3>
              <p className="text-sm text-gray-400">
                Products
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-400">
                120+
              </h3>
              <p className="text-sm text-gray-400">
                Farmers
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-400">
                100%
              </h3>
              <p className="text-sm text-gray-400">
                Fresh Items
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              All Products
            </h2>

            <p className="text-gray-400 mt-1">
              Browse all available marketplace products
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl text-sm text-green-400">
            {products.length} Products Found
          </div>
        </div>

        {/* PRODUCT FEED */}
        <ProductFeed
          search={search}
          products={products}
          setProducts={setProducts}
        />
      </section>
    </div>
  );
};

export default Page;