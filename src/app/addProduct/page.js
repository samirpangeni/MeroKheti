"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Image from "../../components/Image";
import DateSection from "../../components/Date";
import Location from "../../components/Location";
import PriceInput from "../../components/PriceInput";
import BasicInfo from "../../components/BasicInfo";
import Description from "../../components/Description";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

const Page = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState(false);
  const [location, setLocation] = useState("");
  const [farmerLocation, setFarmerLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    name.trim() &&
    category &&
    price &&
    quantity &&
    unit &&
    description.trim() &&
    location.trim() &&
    files.length >= 2;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("expiryDate", expiryDate);
      formData.append("harvestDate", harvestDate);
      formData.append("quantity", quantity);
      formData.append("unit", unit);
      formData.append("category", category);
      formData.append("organic", organic.toString());
      formData.append("location", location);
      formData.append("latitude", farmerLocation.lat)
      formData.append("longitude", farmerLocation.lng)

      files.forEach((file) => {
        formData.append("files", file);
      });
      await axios.post("/api/product", formData);
      toast.success(" Product added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setExpiryDate("");
      setHarvestDate("");
      setQuantity("");
      setUnit("");
      setCategory("");
      setOrganic(false);
      setLocation("");
      setFiles([]);
    } catch (err) {
      console.log(err)
      toast.error(
        err.response?.data?.message || "❌ Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const getLocation = () => {
      if (!navigation.getLocation) {
        alert("Geolocation is not support")
        return;
      }
      navigation.getLocation.getCurrentPosition(
        (postion) => {
          setFarmerLocation({
            lat: postion.coords.latitude,
            lng: postion.coords.longitude,
          });
        },
        (error) => {
          console.log(error)
        }
      )
    }
    getLocation();
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-[#06140d] to-[#0b1f14] text-white relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-125 h-125 bg-green-700/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-100 h-100 bg-emerald-700/10 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 border border-green-500/20 text-green-300 text-sm backdrop-blur-sm">
            🌾 Fresh Farm Product
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-5 bg-linear-to-r from-green-300 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            Add Your Product
          </h1>

          <p className="text-gray-300 mt-3 text-lg max-w-2xl">
            Sell fresh vegetables, fruits and grains directly to customers
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-linear-to-b from-[#101010] to-[#0c1a12] border border-green-500/15 shadow-2xl shadow-green-950/40 rounded-3xl p-6 md:p-10 space-y-8 backdrop-blur-xl"
        >

          <BasicInfo
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
          />

          <Image files={files} setFiles={setFiles} />

          <PriceInput
            price={price}
            setPrice={setPrice}
            quantity={quantity}
            setQuantity={setQuantity}
            unit={unit}
            setUnit={setUnit}
          />

          <Location
            location={location}
            setLocation={setLocation}
          />

          <DateSection
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            harvestDate={harvestDate}
            setHarvestDate={setHarvestDate}
          />

          <Description
            description={description}
            setDescription={setDescription}
            organic={organic}
            setOrganic={setOrganic}
          />

          {/* Submit */}
          <div className="pt-6 border-t border-green-900/30">
            <Button
              isSubmitting={isSubmitting}
              isValid={isValid}
            />

            <div className="mt-5 bg-linear-to-r from-green-900/20 to-emerald-900/10 border border-green-500/20 rounded-2xl p-4">
              <p className="text-sm text-green-300">
                💡 Tip: High-quality photos + clear pricing increase sales.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Page;