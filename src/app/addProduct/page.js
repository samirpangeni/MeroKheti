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

      console.log(response.data);

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <ToastContainer theme="dark" />

      {/* Close Button */}
      <Link href="/">
        <button className="fixed top-6 right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300 z-50 group">
          <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-blue-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
            <FiPackage className="w-8 h-8" />
            Add New Product
          </h1>
          <p className="text-white/80 text-center mt-2 text-sm">
            Fill in the details below to list your agricultural product
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Progress indicator */}
          <Indicator isValid={isValid} getValidationMessage={getValidationMessage} completionPercentage={completionPercentage} />

          {/* Basic Information Section */}
          <div className="space-y-4">
            <BasicInfo
              name={name}
              setName={setName}
              category={category}
              setCategory={setCategory}
            />
          </div>

          {/* Images Section */}
          <div>
            <Image files={files} setFiles={setFiles} />
          </div>

          {/* Pricing & Stock Section */}
          <div className="space-y-4">
            <PriceInput
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <Location location={location} setLocation={setLocation} />
          </div>

          {/* Dates Section */}
          <div className="space-y-4">
            <DateSection
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              harvestDate={harvestDate}
              setHarvestDate={setHarvestDate}
            />
          </div>

          {/* Description & Organic Section */}
          <div className="space-y-4">
            <Description
              description={description}
              setDescription={setDescription}
              organic={organic}
              setOrganic={setOrganic}
            />
          </div>

          {/* Submit Button */}
          <Button
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            isValid={isValid}
          />

          {/* Required fields note */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/10">
            <p>
              <span className="text-red-400">*</span> Required fields
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
