"use client";
import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import Loading from "@/components/Loading";

const Page = () => {
  const [admin, setAdmin] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState("");

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true)
        const res = await axios.get("/api/admin/product")
        setProduct(res.data.products);
        console.log(res.data.products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, [])

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/admin?id=${id}`);

      setProduct((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="flex min-h-screen bg-black text-white">
      <SlideBarForAdmin />

      <div className="flex-1 p-8 pl-70 bg-linear-to-br from-black via-gray-950 to-green-950">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-400">
              Approved Products
            </h1>
            <p className="text-gray-400">Manage marketplace products</p>
          </div>
          <div className="text-green-400 font-bold">
            Total: {product.length}
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search product..."
            className="p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Category</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="grains">Grains</option>
          </select>

          <select
            className="p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => setOrganic(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Organic</option>
            <option value="false">Non-Organic</option>
          </select>
        </div>

        {/* PRODUCTS */}
        {loading ? <Loading /> :
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {product.map((item) => {

              return (
                <div
                  key={item._id}
                  className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500 transition"
                >
                  {/* IMAGE */}
                  <img
                    src={item.image?.[0]?.url}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5">
                    {/* NAME */}
                    <h1 className="text-xl font-bold">{item.name}</h1>

                    {/* LOCATION */}
                    <p className="text-gray-400 text-sm">{item.location}</p>

                    {/* PRICE + CATEGORY */}
                    <div className="flex justify-between mt-2">
                      <span className="text-green-400 font-bold">
                        Rs {item.price}
                      </span>

                      <span className="text-gray-400 text-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* ⭐ REVIEWS + 🚨 REPORTS */}
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-yellow-400">⭐{item.averageRating}</span>

                      <span className="text-gray-400">
                        Reviews: {item.totalReview}
                      </span>

                      <span className="text-red-400">Reports: {item.totalReport}</span>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="mt-5 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
};

export default Page;
