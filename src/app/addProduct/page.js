"use client";
import axios from "axios";
import Image from "../../components/Image";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateSection from "../../components/Date";
import Location from "../../components/Location";
import PriceInput from "../../components/PriceInput";
import BasicInfo from "../../components/BasicInfo";
import Description from "../../components/Description";
import Indicator from "../../components/Indicator";
import Navbar from "@/components/Navbar"
import { FiPackage, FiGrid, FiX, FiCheckCircle } from "react-icons/fi";

import { FaLeaf } from "react-icons/fa";
import Button from "@/components/Button";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      formData.append("organic", organic.toString()); // Convert boolean to string
      formData.append("location", location);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post("/api/product", formData);

      toast.success("✅ Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // reset form
      setName("");
      setPrice("");
      setExpiryDate("");
      setHarvestDate("");
      setDescription("");
      setQuantity("");
      setUnit("");
      setCategory("");
      setOrganic(false);
      setLocation("");
      setFiles([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to add product", {
        position: "top-right",
        autoClose: 4000,
      });
      console.log(err.response?.data?.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // validation with friendly messages
  const getValidationMessage = () => {
    if (!name.trim()) return "✨ Give your product a name";
    if (!category) return "🏷️ Select a category for your product";
    if (!price) return "💰 Set a price for your product";
    if (!quantity) return "📦 How many items in stock?";
    if (!unit) return "⚖️ Choose a unit (kg, liter, etc.)";
    if (!description.trim()) return "📝 Describe your product";
    if (!location.trim()) return "📍 Where is this product from?";
    if (files.length < 2)
      return "🖼️ Add at least 2 product photos (better presentation!)";
    return "✓ Ready to list your product!";
  };

  const isValid =
    name.trim() &&
    category &&
    price &&
    quantity &&
    unit &&
    description.trim() &&
    location.trim() &&
    files.length >= 2;

  // Format price display

  // Calculate completion percentage
  const completionPercentage = Object.values({
    name: name.trim() ? 11 : 0,
    category: category ? 11 : 0,
    price: price ? 11 : 0,
    quantity: quantity ? 11 : 0,
    unit: unit ? 11 : 0,
    description: description.trim() ? 11 : 0,
    location: location.trim() ? 11 : 0,
    files: files.length >= 2 ? 12 : 0,
    expiryDate: expiryDate ? 11 : 0,
    harvestDate: harvestDate ? 11 : 0,
    organic: organic ? 11 : 0,
  }).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm">
            🌾 Fresh Farm Product
          </div>

          <h1 className="text-4xl font-bold mt-4">Add Your Product</h1>

          <p className="text-gray-400 mt-2 text-lg">
            Sell fresh vegetables, fruits and grains directly to customers
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8"
        >
          {/* Product Name */}
          <BasicInfo
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
          />

          {/* Images */}
          <Image files={files} setFiles={setFiles} />

          {/* Price */}
          <PriceInput
            unit={unit}
            setUnit={setUnit}
            price={price}
            setPrice={setPrice}
            quantity={quantity}
            setQuantity={setQuantity}
          />

          {/* Location */}
          <Location location={location} setLocation={setLocation} />

          {/* Dates */}
          <DateSection
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            harvestDate={harvestDate}
            setHarvestDate={setHarvestDate}
          />

          {/* Description */}
          <Description
            description={description}
            setDescription={setDescription}
            organic={organic}
            setOrganic={setOrganic}
          />

          {/* Bottom Submit Area */}
          <div className="border-t border-white/10 pt-6">
            {/* Progress */}
            <div className="mb-6">
              <Indicator
                isValid={isValid}
                getValidationMessage={getValidationMessage}
                completionPercentage={completionPercentage}
              />
            </div>

            {/* Submit */}
            <Button
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              isValid={isValid}
            />

            {/* Farmer Helper */}
            <div className="mt-5 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              <p className="text-sm text-green-300">
                💡 Products with clear photos and accurate prices sell faster.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
