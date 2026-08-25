"use client";

import DeleteModal from "@/components/DeleteModels";
import SlideBarForFarmer from "@/components/SlideBarForFarmer";
import Loading from "@/components/Loading";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/product/${id}`);
        setProduct(res.data.product);
        console.log(res.data.product);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [id]);

  const handleData = async () => {
    try {
      await axios.put(`/api/product/${id}`, {
        status: product.status,
        harvestDate: harvestDate || product.harvestDate,
        expiryDate: expiryDate || product.expiryDate,
        name: name || product.name,
        quantity: quantity || product.quantity,
        description: description || product.description,
        price: price || product.price,
      });
      toast.success("Product Updated Successfully");
      router.push("/farmer/manage");
    } catch (err) {
      console.log(err);
      toast.error("Update Failed try again");
    }
  };
  const handelReapply = async () => {
    const res = await axios.post("/api/product")
  }
  const formatDate = (value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "-" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 9);
    return v;
  };


  if (!product) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center text-primary text-2xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SlideBarForFarmer />

      <div className="flex-1 md:pl-70 mt-10 p-10">
        <div className="max-w-4xl mx-auto bg-background border border-border rounded-3xl overflow-hidden shadow-xl">
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
            <h1 className="text-2xl font-bold text-primary mb-8">
              Edit Product
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="text-muted block mb-2 ">
                    Current Name:
                  </label>
                  <input
                    type="text"
                    value={product?.name}
                    readOnly
                    className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-muted block mb-2">
                    Change Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-col flex">
                  <label className="text-muted block mb-2">
                    {" "}
                    Current Price (Rs):
                  </label>
                  <input
                    type="number"
                    value={product?.price}
                    className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-muted block mb-2">
                    Change Price (Rs):
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="text-muted block mb-2">
                    Current Quantity:
                  </label>

                  <input
                    type="number"
                    value={product?.quantity}
                    readOnly
                    className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-muted block mb-2">Change Quantity</label>

                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-muted block mb-2">Category</label>

                <input
                  disabled
                  value={product.category}
                  className="w-full bg-card border border-border text-muted p-4 rounded-xl"
                />
              </div>
              {product?.status === "pending" || product?.status === "rejected" && (
                <div className="flex gap-4">
                  {/* Current Harvest Date */}
                  <div className="flex flex-1 flex-col">
                    <label className="mb-2 block text-muted">
                      Current Harvest Date:
                    </label>

                    <input
                      type="date"
                      value={product?.harvestDate?.split("T")[0] || ""}
                      readOnly
                      className="w-full rounded-xl border border-border bg-background p-4 text-foreground focus:outline-none"
                    />
                  </div>

                  {/* Change Harvest Date */}
                  <div className="flex flex-1 flex-col">
                    <label className="mb-2 block text-muted">
                      Change Harvest Date:
                    </label>

                    <input
                      type="text"
                      value={harvestDate ? harvestDate.split("T")[0] : ""}
                      onChange={(e) => setHarvestDate(formatDate(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {product?.status === "pending" || product?.status === "rejected" && (
                <div className="mt-4 flex gap-4">
                  {/* Current Expiry Date */}
                  <div className="flex flex-1 flex-col">
                    <label className="mb-2 block text-muted">
                      Current Expiry Date:
                    </label>

                    <input
                      type="date"
                      value={product?.expiryDate?.split("T")[0] || ""}
                      readOnly
                      className="w-full rounded-xl border border-border bg-background p-4 text-foreground focus:outline-none"
                    />
                  </div>

                  {/* Change Expiry Date */}
                  <div className="flex flex-1 flex-col">
                    <label className="mb-2 block text-muted">
                      Change Expiry Date:
                    </label>

                    <input
                      type="text"
                      value={expiryDate ? expiryDate.split("T")[0] : ""}
                      onChange={(e) => setExpiryDate(formatDate(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </div>


            <div className="mt-6">
              <label className="text-muted block mb-2">Description</label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-boder text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4 mt-8">
              {product.status === "appropver" && (
                <button

                  onClick={() => { setOpen(true) }}
                  className="flex-1 bg-primary hover:bg-primary-hover text-foreground py-4 rounded-xl font-bold text-lg transition"
                >
                  Save Changes
                </button>
              )}
              {product.status === "pending" && (
                <button
                  onClick={handelReapply}
                  className="flex-1 bg-primary hover:bg-primary-hover text-foreground py-4 rounded-xl font-bold text-lg transition">
                  Reapply
                </button>
              )}

              <button
                onClick={() => router.back()}
                className="flex-1 bg-muted hover:border-border hover:bg-secondary text-foreground py-4 rounded-xl font-bold text-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={open}
        onClose={() => { setOpen(false) }}
        onConfirm={handleData}
        type='Update Product'
        message='Are you sure you want to save these changes?'
        confirmText="Update" />
    </div>
  );
};

export default Page;
