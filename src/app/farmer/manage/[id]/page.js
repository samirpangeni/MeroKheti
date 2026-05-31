"use client";

import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [id]);

  const handleData = async () => {
    try {
      await axios.put(`/api/product/${id}`, {
        name,
        quantity,
        description,
        price,
      });

      alert("Product Updated Successfully");

      router.push("/farmer/manage");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-green-500 text-2xl">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <SlideBarForFarmer />

      <div className="flex-1 p-10">
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-green-900 rounded-3xl overflow-hidden shadow-xl">
          {/* Product Image */}
          <div className="h-72 overflow-hidden">
            <img
              src={product.image?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover p-2 rounded-3xl"
            />
          </div>

          {/* Form */}
          <div className="p-8">
            <h1 className="text-2xl font-bold text-green-500 mb-8">
              Edit Product
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="text-gray-300 block mb-2 ">
                    Current Name:
                  </label>
                  <input
                    type="text"
                    value={product?.name}
                    readOnly
                    className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-300 block mb-2">
                    Change Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-col flex">
                  <label className="text-gray-300 block mb-2">
                    {" "}
                    Current Price (Rs):
                  </label>
                  <input
                    type="number"
                    value={product?.price}
                    className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-300 block mb-2">
                    {" "}
                    Change Price (Rs):
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="text-gray-300 block mb-2">
                    Current Quantity:
                  </label>

                  <input
                    type="number"
                    value={product?.quantity}
                    readOnly
                    className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-300 block mb-2">Change Quantity</label>

                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-2">Category</label>

                <input
                  disabled
                  value={product.category}
                  className="w-full bg-zinc-800 border border-zinc-700 text-gray-400 p-4 rounded-xl"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-gray-300 block mb-2">Description</label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-green-800 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleData}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => router.back()}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-4 rounded-xl font-bold text-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
