"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductFeed from "@/components/ProductFeed";
import Search from "@/components/Search";
import { FiShoppingBag } from "react-icons/fi";

const Page = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
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
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
          </div>

          {/* STATS */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <div className="bg-card border border-border backdrop-blur-lg px-6 py-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary">
                500+
              </h3>
              <p className="text-sm text-muted">
                Products
              </p>
            </div>

            <div className="bg-card border border-border backdrop-blur-lg px-6 py-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary">
                120+
              </h3>
              <p className="text-sm text-muted">
                Farmers
              </p>
            </div>

            <div className="bg-card border border-border backdrop-blur-lg px-6 py-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary">
                100%
              </h3>
              <p className="text-sm text-muted">
                Fresh Items
              </p>
            </div>
            

          </div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="ml-5 mx-auto px-6 pb-24">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              All Products
            </h2>

            <p className="text-muted mt-1">
              Browse all available marketplace products
            </p>
          </div>

          <div className="bg-green-500/10 border border-primary px-4 py-2 rounded-xl text-sm text-primary">
            {products.length} Products Found
          </div>
        </div>

        {/* PRODUCT FEED */}
        <div className="w-full h-screen">
        <ProductFeed
          search={search}
          products={products}
          setProducts={setProducts}
        />
        </div>
      </section>
    </div>
  );
};

export default Page;