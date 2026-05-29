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
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section>
        <Hero
          search={search}
          setSearch={setSearch}
          products={products}
          setProducts={setProducts}
        />
      </section>

      {/* FEATURE STRIP (clean Airbnb-like minimal cards) */}
      <section>
        <Feature />
      </section>

      {/* PRODUCT FEED */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          <p className="text-xs text-gray-500">
            Based on freshness & availability
          </p>
        </div>

        <ProductFeed
          search={search}
          products={products}
          setProducts={setProducts}
        />
       
      </section>

      {/* FLOATING BUTTON */}
      <div className="fixed right-6 bottom-3">
        <div className="p-4 rounded-2xl shadow-lg transition">
         {user?.role =="farmer"&&(
          <Product />
         )}
        </div>
      </div>
    </div>
  );
};

export default Page;
