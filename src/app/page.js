"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Product from "@/components/product";
import ProductFeed from "@/components/ProductFeed";
import Feature from "@/components/Feature";
import Hero from "@/components/Hero";



const Page = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/user", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log(err.response?.data);
      }
    }
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen  w-full">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section>
        <Hero
          search={search}
          setSearch={setSearch}
          products={products}
          setProducts={setProducts}
          setSearchInput={setSearchInput}
          searchInput={searchInput}
        />
      </section>

      {/* FEATURE STRIP (clean Airbnb-like minimal cards) */}
      <section className="m-5">
        <Feature />
      </section>

      {/* PRODUCT FEED */}
      <section className="mr-10 pr-5 px-2 pb-15 mt-3 ml-2 w-full">
        <div className="flex items-center justify-between mb-6 mt-15 ml-5 gap-4 w-full ">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          <p className="text-xs text-gray-500 mr-5">
            Based on freshness & availability
          </p>
        </div>

        <ProductFeed
          search={search}
          products={products}
          setProducts={setProducts}
          setSearchInput={setSearchInput}
          searchInput={searchInput}
        />

      </section>

      {/* FLOATING BUTTON */}
      <div className="fixed md:right-0 bottom-5 right-[20]">
        <div className="p-4   transition pb-10 bg-transparent">
          {user?.role == "farmer" && (
            <Product />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
